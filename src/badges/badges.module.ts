import { MiddlewareConsumer, Module, NestModule, RequestMethod, forwardRef } from '@nestjs/common';
import { BadgesService } from './badges.service';
import { BadgesController } from './badges.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Badge, badgeSchema } from './schema/badge.schema';
import { BadgeList, badgeListSchema } from './schema/badgeList.schema';
import { MulterModule } from '@nestjs/platform-express';
import { MulterBadgeConfig } from 'src/middleware/multer.badge.config';
import { RequiredMiddleware } from 'src/middleware/requierd.middleware';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Badge.name, schema: badgeSchema}, { name: BadgeList.name, schema: badgeListSchema}]),
  forwardRef(()=> UsersModule), MulterModule.registerAsync({ useClass: MulterBadgeConfig })
],
  controllers: [BadgesController],
  providers: [BadgesService],
  exports: [BadgesService]
})
export class BadgesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequiredMiddleware).forRoutes({ path: 'badges', method: RequestMethod.POST }, 
    { path: 'badges/ddddddddd', method: RequestMethod.POST }, { path: 'badges', method: RequestMethod.GET }
    );
  }
}
