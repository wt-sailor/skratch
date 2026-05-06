import { Module } from '@nestjs/common';
import { CpuService } from './cpu.service';
import { PowerModule } from 'src/power/power.module';

@Module({
  providers: [CpuService],
  imports: [PowerModule], //Importing the PowerModule to access PowerService in CpuService
  exports: [CpuService], //Exporting CpuService to be used in other modules
})
export class CpuModule {}
