import express from "express";
import type { ErrorRequestHandler } from "express";
import productRoutes from "./routes/productRoutes.js";

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.get("/", (_req, res) => {
  res.status(200).send("Server is up and running 💫");
});

app.use(express.json());
app.use("/products", productRoutes);
app.use((request, response) => {
  response.status(404).json({ error: `Route not found: ${request.method} ${request.path}` });
});

const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  console.error("Unhandled request error:", error);
  response.status(500).json({ error: "Internal server error" });
};

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});