import { Router } from "express";
import type { RequestHandler } from "express";
import prisma from "../lib/prisma.js";

const router = Router();

const getAllItems: RequestHandler = async (_request, response) => {
  try {
    const items = await prisma.product.findMany();

    response.status(200).json({
      success: true,
      message: 'Berhasil mengambil data',
      data: items,
    });
  } catch (error) {
    console.error("Gagal mengambil data produk:", error);
    response.status(500).json({
      success: false,
      message: 'Gagal mengambil data',
    });
  }
};

router.get("/product", getAllItems);

const createProduct: RequestHandler = async (request, response) => {
  const { name, price } = request.body ?? {};

  if (
    typeof name !== "string" ||
    name.trim().length === 0 ||
    typeof price !== "number" ||
    !Number.isSafeInteger(price) ||
    price < 0 ||
    price > 2_147_483_647
  ) {
    response.status(400).json({
      success: false,
      message: "Nama produk dan harga berupa bilangan bulat non-negatif wajib diisi.",
    });
    return;
  }

  try {
    const product = await prisma.product.create({
      data: { name: name.trim(), price },
    });

    response.status(201).json({
      success: true,
      message: "Berhasil menambahkan produk",
      data: product,
    });
  } catch (error) {
    console.error("Gagal menambahkan produk:", error);
    response.status(500).json({
      success: false,
      message: "Gagal menambahkan produk",
    });
  }
};

router.post("/product", createProduct);

const updateProduct: RequestHandler = async (request, response) => {
  const { id, name, price } = request.body ?? {};

  if (
    !Number.isSafeInteger(id) ||
    id <= 0 ||
    typeof name !== "string" ||
    name.trim().length === 0 ||
    typeof price !== "number" ||
    !Number.isSafeInteger(price) ||
    price < 0 ||
    price > 2_147_483_647
  ) {
    response.status(400).json({
      success: false,
      message: "ID, nama produk, dan harga yang valid wajib diisi.",
    });
    return;
  }

  try {
    const product = await prisma.product.update({
      where: { id },
      data: { name: name.trim(), price },
    });

    response.status(200).json({
      success: true,
      message: "Berhasil mengupdate produk",
      data: product,
    });
  } catch (error) {
    console.error("Gagal mengupdate produk:", error);
    response.status(500).json({
      success: false,
      message: "Gagal mengupdate produk",
    });
  }
};

router.put("/product", updateProduct);

const deleteProduct: RequestHandler = async (request, response) => {
  const id = Number(request.params.id);

  if (!Number.isSafeInteger(id) || id <= 0) {
    response.status(400).json({
      success: false,
      message: "ID produk harus berupa bilangan bulat positif.",
    });
    return;
  }

  try {
    await prisma.product.delete({ where: { id } });

    response.status(200).json({
      success: true,
      message: "Berhasil menghapus produk",
    });
  } catch (error) {
    console.error("Gagal menghapus produk:", error);
    response.status(500).json({
      success: false,
      message: "Gagal menghapus produk",
    });
  }
};

router.delete("/product/:id", deleteProduct);

export default router;