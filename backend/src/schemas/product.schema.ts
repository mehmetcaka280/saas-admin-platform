import { z } from "zod";

// 1. Yeni Ürün Ekleme Kuralı
export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Ürün adı en az 2 karakter olmalıdır."),
    description: z.string().optional(),
    price: z.number().positive("Fiyat 0'dan büyük bir sayı olmalıdır."),
    stock: z
      .number()
      .int("Stok tam sayı olmalıdır.")
      .nonnegative("Stok negatif olamaz.")
      .optional(),
  }),
});

// 2. Ürün Güncelleme Kuralı
export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Ürün adı en az 2 karakter olmalıdır.").optional(),
    description: z.string().optional(),
    price: z.number().positive("Fiyat 0'dan büyük olmalıdır.").optional(),
    stock: z.number().int().nonnegative().optional(),
  }),
});
