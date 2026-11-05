import { Router } from "express";
import prisma from "../lib/prisma.js";

const router = Router();

function isProductInput(value: unknown): value is { name: string; price: number } {
  if (typeof value !== "object" || value === null || !("name" in value) || !("price" in value)) {
    return false;
  }

  return (
    typeof value.name === "string" &&
    value.name.trim().length > 0 &&
    typeof value.price === "number" &&
    Number.isSafeInteger(value.price) &&
    value.price >= 0 &&
    value.price <= 2_147_483_647
  );
}

function parseId(value: string): number | null {
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

router.get("/", async (_request, response) => {
  const products = await prisma.product.findMany();
  response.json(products);
});

router.get("/:id", async (request, response) => {
  const id = parseId(request.params.id);
  if (id === null) {
    response.status(400).json({ error: "Product id must be a positive integer." });
    return;
  }

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    response.status(404).json({ error: "Product not found." });
    return;
  }

  response.json(product);
});

router.post("/", async (request, response) => {
  if (!isProductInput(request.body)) {
    response.status(400).json({ error: "Provide a non-empty name and a non-negative integer price." });
    return;
  }

  const product = await prisma.product.create({
    data: {
      name: request.body.name.trim(),
      price: request.body.price,
    },
  });

  response.status(201).json(product);
});

router.put("/:id", async (request, response) => {
  const id = parseId(request.params.id);
  if (id === null) {
    response.status(400).json({ error: "Product id must be a positive integer." });
    return;
  }

  if (!isProductInput(request.body)) {
    response.status(400).json({ error: "Provide a non-empty name and a non-negative integer price." });
    return;
  }

  const existingProduct = await prisma.product.findUnique({ where: { id } });
  if (!existingProduct) {
    response.status(404).json({ error: "Product not found." });
    return;
  }

  const product = await prisma.product.update({
    where: { id },
    data: {
      name: request.body.name.trim(),
      price: request.body.price,
    },
  });

  response.json(product);
});

router.delete("/:id", async (request, response) => {
  const id = parseId(request.params.id);
  if (id === null) {
    response.status(400).json({ error: "Product id must be a positive integer." });
    return;
  }

  const existingProduct = await prisma.product.findUnique({ where: { id } });
  if (!existingProduct) {
    response.status(404).json({ error: "Product not found." });
    return;
  }

  await prisma.product.delete({ where: { id } });
  response.status(204).end();
});

export default router;
