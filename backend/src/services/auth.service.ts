import { Role } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import jwt from "jsonwebtoken";

export interface RegisterInput {
  email: string;
  password: string;
  name?: string;
  companyName: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export class AuthService {
  async register(input: RegisterInput) {
    const { email, password, name, companyName } = input;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error("Bu email adresi ile kayıtlı bir kullanıcı zaten var.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const slug = companyName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-");

    const { user, organization } = await prisma.$transaction(async (tx) => {
      const createdOrganization = await tx.organization.create({
        data: {
          name: companyName,
          slug: slug,
        },
      });

      const createdUser = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role: Role.ADMIN,
          organizationId: createdOrganization.id,
        },
      });

      return {
        user: createdUser,
        organization: createdOrganization,
      };
    });

    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      organization,
    };
  }

  async login(input: LoginInput) {
    const { email, password } = input;
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("Email veya şifre hatalı.");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Email veya şifre hatalı.");
    }

    const secret: string = process.env.JWT_SECRET || "fallback-secret-key";
    const expiresIn: string = process.env.JWT_EXPIRES_IN || "1d";

    const token = jwt.sign(
      {
        userId: user.id,
        organizationId: user.organizationId,
        role: user.role,
      },
      secret,
      { expiresIn } as jwt.SignOptions
    );

    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  }

  // Profil getirme metodu (küçük 'g' harfiyle)
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        organization: true,
      },
    });

    if (!user) {
      throw new Error("Kullanıcı bulunamadı.");
    }

    const { password: _, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }
}