import { Module } from '@nestjs/common';
import { DicerollerGateway } from './diceroller.gateway';

@Module({
  providers: [DicerollerGateway]
})
export class DicerollerModule {}
