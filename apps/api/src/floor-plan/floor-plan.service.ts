import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FloorPlanService {
  constructor(private prisma: PrismaService) {}

  async getZones() {
    return this.prisma.zone.findMany({
      include: { tables: true }
    });
  }

  async getTablesByZone(zoneId: string) {
    return this.prisma.table.findMany({
      where: { zoneId }
    });
  }

  async updateTableStatus(tableId: string, status: string) {
    return this.prisma.table.update({
      where: { id: tableId },
      data: { status }
    });
  }

  async saveLayout(zoneId: string, tables: any[]) {
    // Upsert de mesas para diseño
    const ops = tables.map(t => {
      const { id, ...data } = t;
      return this.prisma.table.upsert({
        where: { id: id.includes('-') ? id : 'new-' + Math.random() }, // Hack simple para nuevos
        update: { ...data, zoneId },
        create: { ...data, zoneId }
      });
    });
    return Promise.all(ops);
  }
}
