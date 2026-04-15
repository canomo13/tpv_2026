import { Module } from '@nestjs/common';
import { FloorPlanService } from './floor-plan.service';
import { FloorPlanController } from './floor-plan.controller';

@Module({
  controllers: [FloorPlanController],
  providers: [FloorPlanService],
  exports: [FloorPlanService],
})
export class FloorPlanModule {}
