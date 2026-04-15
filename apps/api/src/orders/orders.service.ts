import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InventoryService } from '../inventory/inventory.service';
import { KitchenGateway } from './kitchen.gateway';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private inventoryService: InventoryService,
    private kitchenGateway: KitchenGateway
  ) {}

  /**
   * Obtener el ticket activo de una mesa o crear uno nuevo si no existe.
   */
  async getOrCreateActiveTicket(tableId: string, userId: string) {
    let ticket = await this.prisma.ticket.findFirst({
      where: {
        tableId,
        status: 'OPEN'
      },
      include: {
        items: {
          include: { product: true },
          orderBy: { status: 'asc' }
        }
      }
    });

    if (!ticket) {
      // Crear nuevo ticket y marcar mesa como ocupada
      ticket = await this.prisma.ticket.create({
        data: {
          tableId,
          userId,
          status: 'OPEN',
          total: 0,
          currentHash: 'pending'
        },
        include: {
          items: {
            include: { product: true }
          }
        }
      });

      await this.prisma.table.update({
        where: { id: tableId },
        data: { status: 'occupied' }
      });
    }

    return ticket;
  }

  /**
   * Añadir un producto al ticket.
   */
  async addItemToTicket(ticketId: string, productId: string, quantity: number, notes?: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) throw new NotFoundException('Producto no encontrado');

    // Buscamos si ya existe el mismo producto CON la misma nota (si hay notas distintas, son items distintos)
    const existingItem = await this.prisma.orderItem.findFirst({
      where: { ticketId, productId, notes: notes || null, status: 'PENDING' }
    });

    let orderItem;
    if (existingItem) {
      orderItem = await this.prisma.orderItem.update({
        where: { id: existingItem.id },
        data: { quantity: { increment: quantity } },
        include: { product: true, ticket: { include: { table: true } } }
      });
    } else {
      orderItem = await this.prisma.orderItem.create({
        data: {
          ticketId,
          productId,
          quantity,
          price: product.price,
          notes: notes || null,
          status: 'PENDING'
        },
        include: { product: true, ticket: { include: { table: true } } }
      });
    }

    // Notificar a cocina
    this.kitchenGateway.notifyNewOrder(orderItem);

    // Recalcular total del ticket
    const allItems = await this.prisma.orderItem.findMany({
      where: { ticketId }
    });
    
    const newTotal = allItems.reduce((acc, item) => {
      return acc + (Number(item.price) * item.quantity);
    }, 0);

    await this.prisma.ticket.update({
      where: { id: ticketId },
      data: { total: newTotal }
    });

    return this.prisma.ticket.findUnique({
      where: { id: ticketId },
      include: { items: { include: { product: true } } }
    });
  }

  /**
   * Obtener todos los pedidos para cocina (Tickets abiertos con items no servidos)
   */
  async getKitchenOrders() {
    return this.prisma.ticket.findMany({
      where: {
        status: 'OPEN',
        items: {
          some: {
            status: { in: ['PENDING', 'PREPARING', 'READY'] }
          }
        }
      },
      include: {
        table: true,
        items: {
          where: {
            status: { in: ['PENDING', 'PREPARING', 'READY'] }
          },
          include: { product: true }
        }
      },
      orderBy: { createdAt: 'asc' }
    });
  }

  /**
   * Actualizar estado de un item de pedido
   */
  async updateItemStatus(itemId: string, status: string) {
    const item = await this.prisma.orderItem.update({
      where: { id: itemId },
      data: { status },
      include: { product: true, ticket: { include: { table: true } } }
    });

    // Notificar cambio
    this.kitchenGateway.notifyStatusChange(item);

    // Si el estado es READY, descontamos stock automáticamente
    if (status === 'READY') {
      try {
        await this.inventoryService.deductStockFromRecipe(item.productId, item.quantity);
      } catch (e) {
        console.error('Error al descontar stock:', e);
      }
    }
    
    return item;
  }


  /**
   * Cerrar ticket (Cobrar).
   */
  async closeTicket(ticketId: string) {
    const ticket = await this.prisma.ticket.update({
      where: { id: ticketId },
      data: { 
        status: 'PAID',
        paidAt: new Date()
      },
      include: { table: true }
    });

    if (ticket.tableId) {
      await this.prisma.table.update({
        where: { id: ticket.tableId },
        data: { status: 'free' }
      });
    }

    return ticket;
  }
}

