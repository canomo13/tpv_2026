import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { ShiftsService } from './shifts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('shifts')
@UseGuards(JwtAuthGuard)
export class ShiftsController {
  constructor(private shiftsService: ShiftsService) {}

  @Get('current')
  async getCurrentShift(@Request() req: any) {
    return this.shiftsService.getActiveShift(req.user.userId);
  }

  @Post('clock-in')
  async clockIn(@Request() req: any) {
    return this.shiftsService.clockIn(req.user.userId);
  }

  @Post('clock-out')
  async clockOut(@Request() req: any) {
    return this.shiftsService.clockOut(req.user.userId);
  }

  @Post('auto-close')
  async autoClose() {
    // Nota: En producción esto se llamaría desde un Cron job o similar
    return this.shiftsService.autoCloseOldShifts();
  }
}
