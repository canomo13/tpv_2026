import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InventoryService {
  private readonly logger = new Logger(InventoryService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Descontar Stock por Escandallo
   * Se dispara al marcar un producto como READY en cocina.
   */
  async deductStockFromRecipe(productId: string, quantity: number, warehouseId?: string) {
    // Si no se especifica almacén, buscamos el de "COCINA" por defecto o el primero disponible
    let targetWarehouseId = warehouseId;
    if (!targetWarehouseId) {
      const warehouse = await this.prisma.warehouse.findFirst({ where: { name: { contains: 'COCINA', mode: 'insensitive' } } });
      targetWarehouseId = warehouse?.id;
    }

    if (!targetWarehouseId) {
      this.logger.error('No se pudo determinar el almacén para el descuento de stock.');
      return;
    }

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { recipe: { include: { ingredient: true } } },
    });

    if (!product || !product.recipe.length) {
      this.logger.warn(`El producto ${product?.name || productId} no tiene receta definida.`);
      return;
    }

    for (const item of product.recipe) {
      const deduction = item.quantity * quantity;
      
      try {
        await this.prisma.stock.update({
          where: {
            warehouseId_ingredientId: {
              warehouseId: targetWarehouseId,
              ingredientId: item.ingredientId,
            },
          },
          data: {
            quantity: {
              decrement: deduction,
            },
          },
        });
        this.logger.log(`Stock: -${deduction} de ${item.ingredient.name} en ${targetWarehouseId}`);
      } catch (e) {
        this.logger.error(`Error descontando stock de ${item.ingredient.name} en almacén ${targetWarehouseId}. ¿Existe el registro de stock?`);
        // Opcional: Crear el registro de stock con balance negativo o alerta
      }
    }
  }

  // --- ALMACENES (WAREHOUSES) ---
  async getWarehouses() {
    return this.prisma.warehouse.findMany({
      include: { _count: { select: { stocks: true } } }
    });
  }

  async createWarehouse(name: string) {
    return this.prisma.warehouse.create({ data: { name } });
  }

  // --- INGREDIENTES (INGREDIENTS) ---
  async getIngredients() {
    return this.prisma.ingredient.findMany({
      orderBy: { name: 'asc' }
    });
  }

  async createIngredient(data: any) {
    return this.prisma.ingredient.create({ data });
  }

  // --- GESTIÓN DE STOCK ---
  async getStocksByWarehouse(warehouseId: string) {
    return this.prisma.stock.findMany({
      where: { warehouseId },
      include: { ingredient: true }
    });
  }

  async updateStockManual(warehouseId: string, ingredientId: string, quantity: number) {
    return this.prisma.stock.upsert({
      where: {
        warehouseId_ingredientId: { warehouseId, ingredientId }
      },
      update: { quantity },
      create: { warehouseId, ingredientId, quantity }
    });
  }

  async transferStock(sourceWarehouseId: string, targetWarehouseId: string, ingredientId: string, quantity: number) {
    // Restar de origen
    await this.prisma.stock.update({
      where: { warehouseId_ingredientId: { warehouseId: sourceWarehouseId, ingredientId } },
      data: { quantity: { decrement: quantity } }
    });

    // Sumar a destino
    return this.prisma.stock.upsert({
      where: { warehouseId_ingredientId: { warehouseId: targetWarehouseId, ingredientId } },
      update: { quantity: { increment: quantity } },
      create: { warehouseId: targetWarehouseId, ingredientId, quantity }
    });
  }

  // --- RECETAS (RECIPES) ---
  async getProductRecipe(productId: string) {
    return this.prisma.recipe.findMany({
      where: { productId },
      include: { ingredient: true }
    });
  }

  async updateProductRecipe(productId: string, ingredients: { ingredientId: string; quantity: number }[]) {
    // Borrar receta anterior
    await this.prisma.recipe.deleteMany({ where: { productId } });

    // Crear nueva receta
    return this.prisma.product.update({
      where: { id: productId },
      data: {
        recipe: {
          create: ingredients.map(ing => ({
            ingredientId: ing.ingredientId,
            quantity: ing.quantity
          }))
        }
      },
      include: { recipe: { include: { ingredient: true } } }
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
      include: { category: true, recipe: true },
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

