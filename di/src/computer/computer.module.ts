import { Module } from '@nestjs/common';
import { ComputerController } from './computer.controller';
import { CpuModule } from 'src/cpu/cpu.module';
import { DiskModule } from 'src/disk/disk.module';

@Module({
  controllers: [ComputerController],
  imports: [CpuModule, DiskModule], //Importing CpuModule and disk to access their services in ComputerController
})
export class ComputerModule {}
