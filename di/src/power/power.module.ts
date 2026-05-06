import { Module } from '@nestjs/common';
import { PowerService } from './power.service';

@Module({
  providers: [PowerService], //Access within the power module
  exports: [PowerService], //Access to other modules that import this module
})
export class PowerModule {}
