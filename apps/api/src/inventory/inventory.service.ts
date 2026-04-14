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
}
