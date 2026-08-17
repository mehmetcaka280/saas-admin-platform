import { prisma } from "../lib/prisma";

export interface CreateProductInput {
  name: string;
  description?: string;
  price: number;
  stock?: number;
  organizationId: string;
}

export interface UpdateProductInput {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
}

export class ProductService {
  async createProduct(input: CreateProductInput) {
    const { name, description, price, stock, organizationId } = input;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock: stock ?? 0,
        organizationId,
      },
    });
    return product;
  }

  async getProducts(organizationId: string) {
    return await prisma.product.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
    });
  }

  async getProductById(productId: string, organizationId: string) {
    const product = await prisma.product.findFirst({
      where: { id: productId, organizationId },
    });

    if (!product) {
      throw new Error("Ürün bulunamadı veya erişim yetkiniz yok.");
    }
    return product;
  }

  async updateProduct(
    productId: string,
    organizationId: string,
    input: UpdateProductInput,
  ) {
    await this.getProductById(productId, organizationId);

    const updateProduct = await prisma.product.update({
      where: { id: productId },
      data: input,
    });
    return updateProduct;
  }

  async deleteProduct(productId:string,organizationId:string){
    await this.getProductById(productId,organizationId);

    await prisma.product.delete({
      where:{id:productId}
    })

    return{message:"Ürün başarıyla silindi."}
  }
}
