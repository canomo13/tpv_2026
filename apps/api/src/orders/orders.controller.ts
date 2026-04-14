import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('active-ticket/:tableId')
  getActiveTicket(@Param('tableId') tableId: string, @Query('userId') userId: string) {
    return this.ordersService.getOrCreateActiveTicket(tableId, userId);
  }

  @Post('items')
  addItem(@Body() data: { ticketId: string; productId: string; quantity: number }) {
    return this.ordersService.addItemToTicket(data.ticketId, data.productId, data.quantity);
  }

  @Post('pay/:ticketId')
  payTicket(@Param('ticketId') ticketId: string) {
    return this.ordersService.closeTicket(ticketId);
  }
}
