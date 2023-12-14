import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

import { TransformInterceptor } from './interceptors';
import { HttpErrorFilter } from './shared/httpError.filter';

import { DatabaseModule } from './common/database';
import { LoggerModule } from './common/logger';
import { LoggerMiddleware, UserMiddleware } from './middleware';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { SeedsModule } from './common/seeds/seeds.module';
import { AccountModule } from './modules/account/account.module';
import { AuthModule } from './modules/auth/auth.module';
import { MailModule } from './mail/mail.module';

import { TestModule } from './modules/test/test.module';
import { ProductCategoryModule } from './modules/product-category/product-category.module';
import { ProductModule } from './modules/product/product.module';
import { NewsModule } from './modules/news/news.module';
import { OrderDetailModule } from './modules/order-detail/order-detail.module';
import { OrderDetailsModule } from './modules/order-details/order-details.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MailModule,
    DatabaseModule,
    LoggerModule,
    AuthModule,
    AccountModule,
    SeedsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', ''),
    }),
    
    TestModule,
    ProductCategoryModule,
    ProductModule,
    NewsModule,
    OrderDetailModule,
    OrderDetailsModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware, UserMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
