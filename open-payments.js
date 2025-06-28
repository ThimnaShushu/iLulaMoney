import dotenv from "dotenv";
import {
  createAuthenticatedClient,
  isPendingGrant,
} from "@interledger/open-payments";
import { randomUUID } from "crypto";

dotenv.config({ path: ".env" });

export async function getAuthenticatedClient() {
  let walletAddress = process.env.OPEN_PAYMENTS_CLIENT_ADDRESS;

  if (walletAddress && walletAddress.startsWith("$")) {
    walletAddress = walletAddress.replace("$", "https://");
  }

  const client = await createAuthenticatedClient({
    walletAddressUrl: walletAddress ?? "",
    privateKey: process.env.OPEN_PAYMENTS_SECRET_KEY_PATH ?? "",
    keyId: process.env.OPEN_PAYMENTS_KEY_ID ?? "",
  });

  return client;
}

export async function getWalletAddressInfo(
  client,
  walletAddress
) {
  if (walletAddress.startsWith("$"))
    walletAddress = walletAddress.replace("$", "https://");

  const walletAddressDetails = await client.walletAddress.get({
    url: walletAddress,
  });

  return { walletAddress, walletAddressDetails };
}

/**
 * The method requests a grant from the receivers auth server for creating an incoming payment grant
 * After receiving the grant the incoming payment resource is created
 *
 * @param {Object} client
 * @param {string} value - payment amount to be made
 * @param {Object} walletAddressDetails - wallet address details for the receiver
 * @returns {Promise<Object>}
 */
export async function createIncomingPayment(
  client,
  value,
  walletAddressDetails
) {
  console.log(">> Creating Incoming Payment Resource");
  console.log(walletAddressDetails);

  // Request IP grant
  const grant = await client.grant.request(
    {
      url: walletAddressDetails.authServer,
    },
    {
      access_token: {
        access: [
          {
            type: "incoming-payment",
            actions: ["read", "create", "complete"],
          },
        ],
      },
    }
  );

  if (isPendingGrant(grant)) {
    throw new Error("Expected non-interactive grant");
  }

  // create incoming payment
  const incomingPayment = await client.incomingPayment.create(
    {
      url: walletAddressDetails.resourceServer,
      accessToken: grant.access_token.value,
    },
    {
      walletAddress: walletAddressDetails.id,
      incomingAmount: {
        value: value,
        assetCode: walletAddressDetails.assetCode,
        assetScale: walletAddressDetails.assetScale,
      },
      expiresAt: new Date(Date.now() + 60_000 * 30).toISOString(),
    }
  );

  console.log("<< Resource created");
  console.log(incomingPayment);

  return incomingPayment;
}

/**
 * The method requests a grant to create a quote on the senders resource server
 * The quote is then created on the senders resource server
 *
 * @param {Object} client
 * @param {string} incomingPaymentUrl - identifier for the incoming payment the quote is being created for
 * @param {Object} walletAddressDetails - wallet address details for the sender
 * @returns {Promise<Object>}
 */
export async function createQuote(
  client,
  incomingPaymentUrl,
  walletAddressDetails
) {
  console.log(">> Creating quoute");
  console.log(walletAddressDetails);

  // Request Quote grant
  const grant = await client.grant.request(
    {
      url: walletAddressDetails.authServer,
    },
    {
      access_token: {
        access: [
          {
            type: "quote",
            actions: ["create", "read", "read-all"],
          },
        ],
      },
    }
  );

  if (isPendingGrant(grant)) {
    throw new Error("Expected non-interactive grant");
  }

  // create quote
  const quote = await client.quote.create(
    {
      url: walletAddressDetails.resourceServer,
      accessToken: grant.access_token.value,
    },
    {
      method: "ilp",
      walletAddress: walletAddressDetails.id,
      receiver: incomingPaymentUrl,
    }
  );

  console.log("<< Quote created");
  console.log(quote);

  return quote;
}

/**
 * This method creates a pending grant which must be authorized by the user
 * After it is authorized the continuation access token we receive can be used to get the actual OP creation grant
 * Tells the client to go ask sender for approval and details of where to come back to continue the process
 *
 * @param {Object} client
 * @param {Object} input - details from the quote
 * @param {Object} walletAddressDetails - wallet address details for the sender
 * @returns {Promise<Object>}
 */
export async function createOutgoingPaymentPendingGrant(
  client,
  input,
  walletAddressDetails
) {
  console.log(">> Getting link to authorize outgoing payment grant request");
  console.log(walletAddressDetails);

  const dateNow = new Date().toISOString();
  const debitAmount = input.debitAmount;
  const receiveAmount = input.receiveAmount;

  // Request OP grant
  const grant = await client.grant.request(
    {
      url: walletAddressDetails.authServer,
    },
    {
      access_token: {
        access: [
          {
            identifier: walletAddressDetails.id,
            type: "outgoing-payment",
            actions: ["list", "list-all", "read", "read-all", "create"],
            limits: {
              ...{
                debitAmount: debitAmount,
                receiveAmount: receiveAmount,
              },
              ...(input.type === "new_subscription"
                ? {
                    interval: `R${input.payments}/${dateNow}/${
                      input.duration ?? "PT10M"
                    }`,
                  }
                : {}),
            },
          },
        ],
      },
      interact: {
        start: ["redirect"],
        finish: {
          method: "redirect",
          uri: input.redirectUrl,
          nonce: randomUUID(),
        },
      },
    }
  );

  if (!isPendingGrant(grant)) {
    throw new Error("Expected interactive grant");
  }

  console.log("<< Link for authorization obtained");
  return grant;
}

/**
 * This method will now get the grant if the user has given permission
 * The grant is then used to create the outgoing payment
 *
 * @param {Object} client
 * @param {Object} input
 * @param {Object} walletAddressDetails
 * @returns {Promise<Object>}
 */
export async function createOutgoingPayment(
  client,
  input,
  walletAddressDetails
) {
  let walletAddress = input.senderWalletAddress;
  if (walletAddress.startsWith("$"))
    walletAddress = walletAddress.replace("$", "https://");

  console.log(">> Creating outgoing payment");
  console.log(input);

  // Get the grant since it was still pending
  const grant = await client.grant.continue(
    {
      accessToken: input.continueAccessToken,
      url: input.continueUri,
    },
    {
      interact_ref: input.interactRef,
    }
  );

  console.log("<< Outgoing payment grant");
  console.log(grant);

  const outgoingPayment = await client.outgoingPayment.create(
    {
      url: walletAddressDetails.resourceServer,
      accessToken: grant.access_token.value,
    },
    {
      walletAddress: walletAddress,
      quoteId: input.quoteId,
    }
  );

  console.log("<< Outgoing payment created");
  console.log(outgoingPayment);

  return outgoingPayment;
}

export async function processSubscriptionPayment(
  client,
  input
) {
  // rotate the token
  const token = await client.token.rotate({
    url: input.manageUrl,
    accessToken: input.previousToken,
  });

  if (!token.access_token) {
    console.error("!! Failed to rotate token.");
  }

  console.log("<< Rotated Token ");
  console.log(token.access_token);

  const tokenAccessDetails = token.access_token.access;

  const receiveAmount = tokenAccessDetails[0].limits?.receiveAmount?.value;

  const { walletAddressDetails: receiverWalletAddressDetails } =
    await getWalletAddressInfo(client, input.receiverWalletAddress);

  const {
    walletAddress: senderWalletAddress,
    walletAddressDetails: senderWalletAddressDetails,
  } = await getWalletAddressInfo(
    client,
    tokenAccessDetails[0]?.identifier ?? ""
  );

  // create incoming payment
  const incomingPayment = await createIncomingPayment(
    client,
    receiveAmount,
    receiverWalletAddressDetails
  );

  // create quote
  const quote = await createQuote(
    client,
    incomingPayment.id,
    senderWalletAddressDetails
  );

  // create outgoing payment
  try {
    const outgoingPayment = await client.outgoingPayment.create(
      {
        url: senderWalletAddressDetails.resourceServer,
        accessToken: token.access_token.value,
      },
      {
        walletAddress: senderWalletAddress,
        quoteId: quote.id,
      }
    );

    return outgoingPayment;
  } catch (error) {
    console.log(error);
    throw new Error("Error creating subscription outgoing payment");
  }
}