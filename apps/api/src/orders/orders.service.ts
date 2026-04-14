import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InventoryService } from '../inventory/inventory.service';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private inventoryService: InventoryService
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
          include: { product: true }
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
   * Añadir un producto al ticket. Si ya existe, incrementa la cantidad.
   */
  async addItemToTicket(ticketId: string, productId: string, quantity: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) throw new NotFoundException('Producto no encontrado');

    const existingItem = await this.prisma.orderItem.findFirst({
      where: { ticketId, productId }
    });

    if (existingItem) {
      await this.prisma.orderItem.update({
        where: { id: existingItem.id },
        data: { quantity: { increment: quantity } }
      });
    } else {
      await this.prisma.orderItem.create({
        data: {
          ticketId,
          productId,
          quantity,
          price: product.price
        }
      });
    }

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
   * Cerrar ticket (Cobrar). 
   * Aquí se integraría VeriFactu en el futuro.
   */
  async closeTicket(ticketId: string) {
    const ticket = await this.prisma.ticket.update({
      where: { id: ticketId },
      data: { status: 'PAID' },
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
