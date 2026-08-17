import { Request, Response } from "express";
import { ProductService } from "../services/product.service";

const productService = new ProductService();

export class ProductController {
  // 1. Ürün Oluştur
  async create(req: Request, res: Response) {
    try {
      const { name, description, price, stock } = req.body || {};
      const organizationId = req.user?.organizationId;

      if (!organizationId) {
        return res.status(401).json({
          success: false,
          message: "Yetkisiz işlem. Şirket kimliği bulunamadı.",
        });
      }

      if (!name || price === undefined) {
        return res.status(400).json({
          success: false,
          message: "Eksik bilgi: 'name' ve 'price' alanları zorunludur.",
        });
      }

      const product = await productService.createProduct({
        name,
        description,
        price: Number(price),
        stock: stock !== undefined ? Number(stock) : undefined,
        organizationId,
      });

      return res.status(201).json({
        success: true,
        message: "Ürün başarıyla oluşturuldu.",
        data: product,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Ürün oluşturulurken bir hata meydana geldi.",
      });
    }
  }

  // 2. Tüm Ürünleri Getir
  async getAll(req: Request, res: Response) {
    try {
      const organizationId = req.user?.organizationId;

      if (!organizationId) {
        return res.status(401).json({
          success: false,
          message: "Yetkisiz işlem. Şirket kimliği bulunamadı.",
        });
      }

      const products = await productService.getProducts(organizationId);

      return res.status(200).json({
        success: true,
        message: "Ürünler başarıyla listelendi.",
        count: products.length,
        data: products,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Ürünler getirilirken sunucu hatası oluştu.",
      });
    }
  }

  // 3. Tek Bir Ürün Getir
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const organizationId = req.user?.organizationId;

      if (!organizationId) {
        return res.status(401).json({
          success: false,
          message: "Yetkisiz işlem.",
        });
      }

      const product = await productService.getProductById(id, organizationId);

      return res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error: any) {
      return res.status(404).json({
        success: false,
        message: error.message || "Ürün bulunamadı.",
      });
    }
  }

  // 4. Ürün Güncelle
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const organizationId = req.user?.organizationId;
      const { name, description, price, stock } = req.body || {};

      if (!organizationId) {
        return res.status(401).json({
          success: false,
          message: "Yetkisiz işlem.",
        });
      }

      const updatedProduct = await productService.updateProduct(
        id,
        organizationId,
        {
          name,
          description,
          price: price !== undefined ? Number(price) : undefined,
          stock: stock !== undefined ? Number(stock) : undefined,
        }
      );

      return res.status(200).json({
        success: true,
        message: "Ürün başarıyla güncellendi.",
        data: updatedProduct,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Ürün güncellenirken hata oluştu.",
      });
    }
  }

  // 5. Ürün Sil
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const organizationId = req.user?.organizationId;

      if (!organizationId) {
        return res.status(401).json({
          success: false,
          message: "Yetkisiz işlem.",
        });
      }

      const result = await productService.deleteProduct(id, organizationId);

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Ürün silinirken hata oluştu.",
      });
    }
  }
}