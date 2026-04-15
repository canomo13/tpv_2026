import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { InventoryService } from './inventory.service';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('categories')
  getCategories() {
    return this.inventoryService.getCategories();
  }

  @Post('categories')
  createCategory(@Body('name') name: string) {
    return this.inventoryService.createCategory(name);
  }

  @Delete('categories/:id')
  deleteCategory(@Param('id') id: string) {
    return this.inventoryService.deleteCategory(id);
  }

  @Get('products')
  getProducts(@Query('categoryId') categoryId?: string) {
    return this.inventoryService.getProducts(categoryId);
  }

  @Post('products')
  createProduct(@Body() data: { name: string; price: number; categoryId: string; description?: string }) {
    return this.inventoryService.createProduct(data);
  }

  @Put('products/:id')
  updateProduct(@Param('id') id: string, @Body() data: any) {
    return this.inventoryService.updateProduct(id, data);
  }

  @Delete('products/:id')
  deleteProduct(@Param('id') id: string) {
    return this.inventoryService.deleteProduct(id);
  }

  // --- WAREHOUSES ---
  @Get('warehouses')
  getWarehouses() {
    return this.inventoryService.getWarehouses();
  }

  @Post('warehouses')
  createWarehouse(@Body('name') name: string) {
    return this.inventoryService.createWarehouse(name);
  }

  // --- INGREDIENTS ---
  @Get('ingredients')
  getIngredients() {
    return this.inventoryService.getIngredients();
  }

  @Post('ingredients')
  createIngredient(@Body() data: any) {
    return this.inventoryService.createIngredient(data);
  }

  // --- STOCK ---
  @Get('stock/:warehouseId')
  getStocks(@Param('warehouseId') warehouseId: string) {
    return this.inventoryService.getStocksByWarehouse(warehouseId);
  }

  @Post('stock/adjust')
  adjustStock(@Body() data: { warehouseId: string; ingredientId: string; quantity: number }) {
    return this.inventoryService.updateStockManual(data.warehouseId, data.ingredientId, data.quantity);
  }

  @Post('stock/transfer')
  transferStock(@Body() data: { sourceWarehouseId: string; targetWarehouseId: string; ingredientId: string; quantity: number }) {
    return this.inventoryService.transferStock(data.sourceWarehouseId, data.targetWarehouseId, data.ingredientId, data.quantity);
  }

  // --- RECIPES ---
  @Get('products/:productId/recipe')
  getRecipe(@Param('productId') productId: string) {
    return this.inventoryService.getProductRecipe(productId);
  }

  @Put('products/:productId/recipe')
  updateRecipe(@Param('productId') productId: string, @Body('ingredients') ingredients: any[]) {
    return this.inventoryService.updateProductRecipe(productId, ingredients);
  }
}

