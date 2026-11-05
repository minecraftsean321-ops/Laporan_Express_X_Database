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

export default router;