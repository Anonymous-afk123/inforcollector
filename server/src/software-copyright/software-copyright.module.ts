import { Module } from '@nestjs/common';
import { SoftwareCopyrightController } from './software-copyright.controller';

@Module({
  controllers: [SoftwareCopyrightController],
})
export class SoftwareCopyrightModule {}
