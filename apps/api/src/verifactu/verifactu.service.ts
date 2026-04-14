import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class VeriFactuService {
  constructor(private prisma: PrismaService) {}

  /**
   * Genera un registro Ticket compatible con VeriFactu mediante encadenamiento de hashes.
   */
  async signAndHashTicket(ticketId: string, ticketData: any) {
    // 1. Obtener el último ticket para conseguir el hash previo
    const lastTicket = await this.prisma.ticket.findFirst({
      orderBy: { createdAt: 'desc' },
      where: { NOT: { id: ticketId } }
    });

    const prevHash = lastTicket?.currentHash || '0000000000000000000000000000000000000000000000000000000000000000';
    const chainIndex = (lastTicket?.chainIndex || 0) + 1;

    // 2. Datos para el hash (Contenido del Ticket + Hash anterior)
    const contentToHash = JSON.stringify(ticketData) + prevHash + chainIndex;
    const currentHash = crypto
      .createHash('sha256')
      .update(contentToHash)
      .digest('hex');

    // 3. Actualizar el ticket con los datos fiscales
    return this.prisma.ticket.update({
      where: { id: ticketId },
      data: {
        prevHash,
        currentHash,
        chainIndex,
      },
    });
  }
}
