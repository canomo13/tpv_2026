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
}
