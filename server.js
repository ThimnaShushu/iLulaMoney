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
  const { senderWalletAddress, incomingPaymentUrl } = req.body;

  if (!senderWalletAddress || !incomingPaymentUrl) {
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
    console.error("Error creating incoming payment:", err);
    return res
      .status(500)
      .json({ error: "Failed to create incoming payment" });
  }
});

app.post("/api/outgoing-payment-auth", async (req, res) => {
  const {
    senderWalletAddress,
    quoteId,
    debitAmount,
    receiveAmount,
    type,
    payments,
    redirectUrl,
    duration,
  } = req.body;

  if (!senderWalletAddress || !quoteId) {
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
    console.error("Error creating incoming payment:", err);
    return res
      .status(500)
      .json({ error: "Failed to create incoming payment" });
  }
});

app.post("/api/outgoing-payment", async (req, res) => {
  const {
    senderWalletAddress,
    continueAccessToken,
    quoteId,
    interactRef,
    continueUri,
  } = req.body;

  if (!senderWalletAddress || !quoteId) {
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
    console.error("Error creating incoming payment:", err);
    return res
      .status(500)
      .json({ error: "Failed to create incoming payment" });
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