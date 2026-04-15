import { Controller, Get, Post, Body, Param, Put, Delete, Query, Patch } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('active-ticket')
  getOrCreateTicket(@Body() body: { tableId: string; userId: string }) {
    return this.ordersService.getOrCreateActiveTicket(body.tableId, body.userId);
  }

  @Post('add-item')
  addItem(@Body() body: { ticketId: string; productId: string; quantity: number; notes?: string }) {
    return this.ordersService.addItemToTicket(body.ticketId, body.productId, body.quantity, body.notes);
  }

  @Get('kitchen')
  getKitchenOrders() {
    return this.ordersService.getKitchenOrders();
  }

  @Patch('item/:itemId/status')
  updateItemStatus(@Param('itemId') itemId: string, @Body() body: { status: string }) {
    return this.ordersService.updateItemStatus(itemId, body.status);
  }

  @Post(':ticketId/close')
  closeTicket(@Param('ticketId') ticketId: string) {
    return this.ordersService.closeTicket(ticketId);
  }
}
