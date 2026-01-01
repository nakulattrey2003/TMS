import express from "express";
import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import dotenv from "dotenv";
import { typeDefs } from "./schema/typeDefs.js";
import { resolvers } from "./resolvers/index.js";
import { loadShipmentsFromAPI } from "./data/sampleData.js";

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 4000;

// Enable CORS and JSON
app.use(cors());
app.use(express.json());

// Create GraphQL server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // Get token from Authorization header
    const token = req.headers.authorization?.replace("Bearer ", "") || "";
    return { token };
  },
});

// Start the server
async function startServer() {
  // Load shipments from API before starting server
  await loadShipmentsFromAPI();

  await server.start();
  server.applyMiddleware({ app, path: "/graphql" });

  // Simple homepage
  app.get("/", (req, res) => {
    res.json({
      message: "TMS GraphQL API",
      graphql: "/graphql",
      dataSource: "Fake Store API",
    });
  });

  // Debug endpoint: try fetching the product API and return status + snippet
  app.get("/debug/fetch-products", async (req, res) => {
    try {
      const url = "https://fakestoreapi.com/products";
      const response = await fetch(url);
      const contentType = response.headers.get("content-type") || "";
      const status = response.status;
      const ok = response.ok;
      let bodySnippet = "";

      if (contentType.includes("application/json")) {
        const json = await response.json();
        bodySnippet = JSON.stringify(json).substring(0, 1000);
      } else {
        const text = await response.text();
        bodySnippet = text.substring(0, 1000);
      }

      return res.json({ ok, status, contentType, bodySnippet });
    } catch (err) {
      return res
        .status(500)
        .json({ ok: false, error: String(err).substring(0, 500) });
    }
  });

  const httpServer = app.listen(PORT, () => {
    console.log(`\n✅ Server running at http://localhost:${PORT}`);
    console.log(`📊 GraphQL Playground: http://localhost:${PORT}/graphql`);
    console.log(`🌐 Data Source: Fake Store API (fakestoreapi.com)`);
    console.log(`\n👤 Test Accounts:`);
    console.log(`   Admin:    username: admin, password: password123`);
    console.log(`   Employee: username: employee, password: password123\n`);
  });

  httpServer.on("error", (error) => {
    console.error("❌ Server error:", error);
    process.exit(1);
  });

  process.on("SIGTERM", () => {
    console.log("👋 SIGTERM received, shutting down...");
    httpServer.close();
  });
}

startServer();
