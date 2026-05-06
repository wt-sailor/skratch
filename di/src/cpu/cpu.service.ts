import { Injectable } from '@nestjs/common';
import { PowerService } from 'src/power/power.service';

@Injectable()
export class CpuService {
  constructor(private powerService: PowerService) {}
  compute(a: number, b: number) {
    console.log('using 10 W power');
    this.powerService.supplyPower(10);
    return a + b;
  }
}
