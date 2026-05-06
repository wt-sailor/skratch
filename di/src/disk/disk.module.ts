import { Module } from '@nestjs/common';
import { DiskService } from './disk.service';
import { PowerModule } from 'src/power/power.module';

@Module({
  providers: [DiskService],
  imports: [PowerModule], //Importing the PowerModule to access PowerService in DiskService
  exports: [DiskService], //Exporting DiskService to be used in other modules
})
export class DiskModule {}
