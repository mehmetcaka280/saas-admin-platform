import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { companyName, name, email, password } = req.body || {};

      if (!companyName || !email || !password) {
        return res.status(400).json({
          success: false,
          message:
            "Eksik bilgi: companyName, email ve password alanları zorunludur.",
        });
      }

      const result = await authService.register({
        companyName,
        name,
        email,
        password,
      });

      return res.status(201).json({
        success: true,
        message: "Kayıt işlemi başarıyla tamamlandı.",
        data: result,
      });
    } catch (error: any) {
      const isClientError =
        error.message && error.message.includes("zaten var");
      const statusCode = isClientError ? 400 : 500;

      return res.status(statusCode).json({
        success: false,
        message:
          error.message || "Sunucu tarafından beklenmeyen bir hata oluştu.",
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body || {};

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Eksik bilgi: email ve password alanları zorunludur.",
        });
      }

      const result = await authService.login({ email, password });

      return res.status(200).json({
        success: true,
        message: "Giriş işlemi başarılı.",
        data: result,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Giriş yapılırken bir hata oluştu.",
      });
    }
  }

  async getProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Yetkisiz erişim. Kullanıcı kimliği bulunamadı.",
        });
      }

      const profile = await authService.getProfile(userId);

      return res.status(200).json({
        success: true,
        message: "Profil bilgileri başarıyla getirildi.",
        data: profile,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Profil bilgileri alınırken hata oluştu.",
      });
    }
  }
}