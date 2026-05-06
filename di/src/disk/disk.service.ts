import { Injectable } from '@nestjs/common';
import { PowerService } from 'src/power/power.service';

@Injectable()
export class DiskService {
  constructor(private powerService: PowerService) {}

  getData() {
    console.log('using 20 W power');
    this.powerService.supplyPower(20);
    return 'data!!!!!';
  }
}
