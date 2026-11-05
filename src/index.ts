import express from "express";
import productRoutes from "./routes/productRoutes.js";

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.use(express.json());


app.get("/", (_req, res) => {
  res.status(200).send("Server is up and running 💫");
});

app.use(productRoutes);

app.listen(port, () => {
  console.log(`Express is running on Port ${port}`);
});