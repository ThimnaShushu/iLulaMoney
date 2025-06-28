import express from "express";
import cors from "cors";
import path from "path";
import {
  createIncomingPayment,
  createOutgoingPayment,
  createQuote,
  getAuthenticatedClient,
  createOutgoingPaymentPendingGrant,
  getWalletAddressInfo,
  processSubscriptionPayment,
  makePayment,
  getSenderWalletAddress,
} from "./open-payments.js";

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-API-Key"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), "./public")));

// Root endpoint
app.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "/index.html"));
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
});

// ============== ENDPOINTS ==============

// New simplified payment endpoint - only requires receiver address and amount
app.post("/api/make-payment", async (req, res) => {
  const { receiverWalletAddress, amount } = req.body;

  if (!receiverWalletAddress || !amount) {
    return res.status(400).json({
      error: "Validation failed",
      message: "Please provide receiverWalletAddress and amount",
      received: req.body,
    });
  }

  try {
    console.log(`Making payment from ${getSenderWalletAddress()} to ${receiverWalletAddress} for amount ${amount}`);
    
    // Initialize Open Payments client
    const client = await getAuthenticatedClient();

    // Start the complete payment flow
    const paymentResult = await makePayment(client, receiverWalletAddress, amount);

    return res.status(200).json({ 
      success: true,
      data: paymentResult,
      message: "Payment flow initiated. User authorization required.",
      authorizationUrl: paymentResult.authorizationUrl
    });
  } catch (err) {
    console.error("Error making payment:", err);
    return res.status(500).json({ 
      error: "Failed to initiate payment",
      message: err.message 
    });
  }
});

// Endpoint to complete payment after user authorization
app.post("/api/complete-payment", async (req, res) => {
  const {
    continueAccessToken,
    quoteId,
    interactRef,
    continueUri,
  } = req.body;

  if (!continueAccessToken || !quoteId || !interactRef || !continueUri) {
    return res.status(400).json({
      error: "Validation failed",
      message: "Missing required authorization parameters",
      received: req.body,
    });
  }

  try {
    // Initialize Open Payments client
    const client = await getAuthenticatedClient();

    // Get sender wallet details
    const { walletAddressDetails } = await getWalletAddressInfo(
      client,
      getSenderWalletAddress()
    );

    // Complete the outgoing payment
    const outgoingPaymentResponse = await createOutgoingPayment(
      client,
      {
        senderWalletAddress: getSenderWalletAddress(),
        continueAccessToken,
        quoteId,
        interactRef,
        continueUri,
      },
      walletAddressDetails
    );

    return res.status(200).json({ 
      success: true,
      data: outgoingPaymentResponse,
      message: "Payment completed successfully!" 
    });
  } catch (err) {
    console.error("Error completing payment:", err);
    return res.status(500).json({ 
      error: "Failed to complete payment",
      message: err.message 
    });
  }
});

app.post("/api/create-incoming-payment", async (req, res) => {
  const { senderWalletAddress, receiverWalletAddress, amount } = req.body;

  if (!senderWalletAddress || !receiverWalletAddress || !amount) {
    return res.status(400).json({
      error: "Validation failed",
      message: "Please fill in all the required fields",
      received: req.body,
    });
  }

  try {
    // Initialize Open Payments client
    const client = await getAuthenticatedClient();

    // get wallet details
    const { walletAddressDetails } = await getWalletAddressInfo(
      client,
      receiverWalletAddress
    );

    // create incoming payment resource
    const incomingPayment = await createIncomingPayment(
      client,
      amount,
      walletAddressDetails
    );
    return res.status(200).json({ data: incomingPayment });
  } catch (err) {
    console.error("Error creating incoming payment:", err);
    return res
      .status(500)
      .json({ error: "Failed to create incoming payment" });
  }
});

app.post("/api/create-quote", async (req, res) => {
  const { incomingPaymentUrl } = req.body;

  // Use hardcoded sender wallet address
  const senderWalletAddress = getSenderWalletAddress();

  if (!incomingPaymentUrl) {
    return res.status(400).json({
      error: "Validation failed",
      message: "Please provide incomingPaymentUrl",
      received: req.body,
    });
  }

  try {
    // Initialize Open Payments client
    const client = await getAuthenticatedClient();

    // get wallet details
    const { walletAddressDetails } = await getWalletAddressInfo(
      client,
      senderWalletAddress
    );

    // create quote
    const quote = await createQuote(
      client,
      incomingPaymentUrl,
      walletAddressDetails
    );
    return res.status(200).json({ data: quote });
  } catch (err) {
    console.error("Error creating quote:", err);
    return res
      .status(500)
      .json({ error: "Failed to create quote" });
  }
});

app.post("/api/outgoing-payment-auth", async (req, res) => {
  const {
    quoteId,
    debitAmount,
    receiveAmount,
    type,
    payments,
    redirectUrl,
    duration,
  } = req.body;

  // Use hardcoded sender wallet address
  const senderWalletAddress = getSenderWalletAddress();

  if (!quoteId) {
    return res.status(400).json({
      error: "Validation failed",
      message: "Please provide quoteId",
      received: req.body,
    });
  }

  try {
    // Initialize Open Payments client
    const client = await getAuthenticatedClient();

    // get wallet details
    const { walletAddressDetails } = await getWalletAddressInfo(
      client,
      senderWalletAddress
    );

    // get outgoing payment auth actioning details
    const outgoingPaymentAuthResponse =
      await createOutgoingPaymentPendingGrant(
        client,
        {
          quoteId,
          debitAmount,
          receiveAmount,
          type,
          payments,
          redirectUrl,
          duration,
        },
        walletAddressDetails
      );
    return res.status(200).json({ data: outgoingPaymentAuthResponse });
  } catch (err) {
    console.error("Error creating outgoing payment auth:", err);
    return res
      .status(500)
      .json({ error: "Failed to create outgoing payment authorization" });
  }
});

app.post("/api/outgoing-payment", async (req, res) => {
  const {
    continueAccessToken,
    quoteId,
    interactRef,
    continueUri,
  } = req.body;

  // Use hardcoded sender wallet address
  const senderWalletAddress = getSenderWalletAddress();

  if (!quoteId) {
    return res.status(400).json({
      error: "Validation failed",
      message: "Please provide quoteId",
      received: req.body,
    });
  }

  try {
    // Initialize Open Payments client
    const client = await getAuthenticatedClient();

    // get wallet details
    const { walletAddressDetails } = await getWalletAddressInfo(
      client,
      senderWalletAddress
    );

    // create outgoing payment resource
    const outgoingPaymentResponse = await createOutgoingPayment(
      client,
      {
        senderWalletAddress,
        continueAccessToken,
        quoteId,
        interactRef,
        continueUri,
      },
      walletAddressDetails
    );

    return res.status(200).json({ data: outgoingPaymentResponse });
  } catch (err) {
    console.error("Error creating outgoing payment:", err);
    return res
      .status(500)
      .json({ error: "Failed to create outgoing payment" });
  }
});

app.post("/api/subscription-payment", async (req, res) => {
  const { receiverWalletAddress, manageUrl, previousToken } = req.body;

  if (!receiverWalletAddress || !manageUrl) {
    return res.status(400).json({
      error: "Validation failed",
      message: "Please fill in all the required fields",
      received: req.body,
    });
  }

  try {
    // Initialize Open Payments client
    const client = await getAuthenticatedClient();

    // create outgoing authorization grant
    const outgoingPaymentResponse = await processSubscriptionPayment(client, {
      receiverWalletAddress,
      manageUrl,
      previousToken,
    });

    return res.status(200).json({ data: outgoingPaymentResponse });
  } catch (err) {
    console.error("Error creating incoming payment:", err);
    return res
      .status(500)
      .json({ error: "Failed to create incoming payment" });
  }
});

// ============== ERROR HANDLING ==============

// 404
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
    message: `The endpoint ${req.method} ${req.originalUrl} does not exist`,
    availableEndpoints: ["GET /", "POST /api/create-incoming-payment"],
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);

  res.status(err.status || 500).json({
    error: "Internal Server Error",
    message: err.message || "Something went wrong",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Express server running on http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  console.log("\n📋 Available endpoints:");
  console.log(
    "  POST   /api/create-incoming-payment  - Create incoming payment resource on receiver account"
  );
  console.log(
    "  POST   /api/create-quote             - Create quote resource on sender account"
  );
  console.log(
    "  POST   /api/outgoing-payment-auth    - Get continuation grant for an outgoing payment on the sender's account"
  );
  console.log(
    "  POST   /api/outgoing-payment         - Create outgoing payment resource on sender's account"
  );
  console.log(
    "  POST   /api/subscription-payment     - Create an outgoing payment from an existing authorized recurring payment"
  );
});

export default app;