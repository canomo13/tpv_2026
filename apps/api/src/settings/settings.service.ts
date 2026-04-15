import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getSettings() {
    let settings = await this.prisma.businessSettings.findFirst();
    if (!settings) {
      // Crear uno por defecto si no existe
      settings = await this.prisma.businessSettings.create({
        data: {
          name: 'Pastel Premium',
          footerMessage: 'Gracias por su visita'
        }
      });
    }
    return settings;
  }

  async updateSettings(data: any) {
    const settings = await this.getSettings();
    return this.prisma.businessSettings.update({
      where: { id: settings.id },
      data
    });
  }
}
