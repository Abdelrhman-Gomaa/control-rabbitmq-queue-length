import { Global, Module } from '@nestjs/common';
import { databaseProviders } from './database.provider';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [...databaseProviders],
  exports: [...databaseProviders]
})
export class DatabaseModule { }
