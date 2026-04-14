import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InventoryService {
  private readonly logger = new Logger(InventoryService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Descontar Stock por Escandallo
   * Se dispara al crear un ticket. Recorre la receta del producto
   * y descuenta los ingredientes del almacén especificado.
   */
  async deductStockFromRecipe(productId: string, quantity: number, warehouseId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { recipe: { include: { ingredient: true } } },
    });

    if (!product || !product.recipe.length) {
      this.logger.warn(`El producto ${productId} no tiene receta definida para escandallo.`);
      return;
    }

    for (const item of product.recipe) {
      const deduction = item.quantity * quantity;
      
      // Actualizar el stock en el almacén específico para el ingrediente
      await this.prisma.stock.update({
        where: {
          warehouseId_ingredientId: {
            warehouseId: warehouseId,
            ingredientId: item.ingredientId,
          },
        },
        data: {
          quantity: {
            decrement: deduction,
          },
        },
      });
      
      this.logger.log(`[Escandallo] Descontados ${deduction} de ${item.ingredient.name} en almacén ${warehouseId}`);
    }
  }

  async getWarehouseStock(warehouseId: string) {
    return this.prisma.stock.findMany({
      where: { warehouseId },
      include: { ingredient: true, product: true },
    });
  }

  // --- CATEGORÍAS ---
  async getCategories() {
    return this.prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: 'asc' }
    });
  }

  async createCategory(name: string) {
    return this.prisma.category.create({
      data: { name }
    });
  }

  async deleteCategory(id: string) {
    return this.prisma.category.delete({
      where: { id }
    });
  }

  // --- PRODUCTOS ---
  async getProducts(categoryId?: string) {
    return this.prisma.product.findMany({
      where: categoryId ? { categoryId } : {},
      include: { category: true },
      orderBy: { name: 'asc' }
    });
  }

  async createProduct(data: { name: string; price: number; categoryId: string; description?: string }) {
    return this.prisma.product.create({
      data: {
        name: data.name,
        price: data.price,
        description: data.description,
        category: { connect: { id: data.categoryId } }
      }
    });
  }

  async updateProduct(id: string, data: any) {
    return this.prisma.product.update({
      where: { id },
      data
    });
  }

  async deleteProduct(id: string) {
    return this.prisma.product.delete({
      where: { id }
    });
  }
}
