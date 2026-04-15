import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { FloorPlanService } from './floor-plan.service';

@Controller('floor-plan')
export class FloorPlanController {
  constructor(private floorPlanService: FloorPlanService) {}

  @Get('zones')
  async getZones() {
    return this.floorPlanService.getZones();
  }

  @Post('layout/:zoneId')
  async saveLayout(@Param('zoneId') zoneId: string, @Body() tables: any[]) {
    return this.floorPlanService.saveLayout(zoneId, tables);
  }

  @Put('table/:id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.floorPlanService.updateTableStatus(id, status);
  }
}
