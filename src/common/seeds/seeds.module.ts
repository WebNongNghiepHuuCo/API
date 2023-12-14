import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountSeed } from '~/modules/account/seeds/account.seed';
import { Account, AccountSchema } from '~/modules/account/account.schema';

@Module({
  imports: [
    CommandModule,
    MongooseModule.forFeature([
      { name: Account.name, schema: AccountSchema },
    ]),
  ],
  providers: [AccountSeed],
})
export class SeedsModule {}
