import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserControllerController } from './user-controller/user-controller.controller';

@Module({
  imports: [],
  controllers: [AppController, UserControllerController],
  providers: [AppService],
})
export class AppModule {}
