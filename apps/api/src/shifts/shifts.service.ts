import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ShiftsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Obtener el turno activo de un usuario
   */
  async getActiveShift(userId: string) {
    return this.prisma.shift.findFirst({
      where: {
        userId,
        endTime: null,
      },
    });
  }

  /**
   * Iniciar jornada (Clock In)
   */
  async clockIn(userId: string) {
    const active = await this.getActiveShift(userId);
    if (active) {
      throw new BadRequestException('Ya tienes un turno activo abierto.');
    }

    return this.prisma.shift.create({
      data: {
        userId,
        startTime: new Date(),
      },
    });
  }

  /**
   * Finalizar jornada (Clock Out)
   */
  async clockOut(userId: string) {
    const active = await this.getActiveShift(userId);
    if (!active) {
      throw new BadRequestException('No tienes ningún turno activo para cerrar.');
    }

    return this.prisma.shift.update({
      where: { id: active.id },
      data: {
        endTime: new Date(),
      },
    });
  }

  /**
   * Cierre automático de turnos antiguos (> 12 horas)
   * Este método debería ejecutarse mediante un Cron job o al iniciar el sistema.
   */
  async autoCloseOldShifts() {
    const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);

    const result = await this.prisma.shift.updateMany({
      where: {
        endTime: null,
        startTime: {
          lt: twelveHoursAgo,
        },
      },
      data: {
        endTime: new Date(), // En un caso real, quizás se cerraría al tiempo máximo permitido
      },
    });

    return result.count;
  }
}
