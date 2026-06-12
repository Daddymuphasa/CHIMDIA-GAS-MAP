import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './modules/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuditModule } from './modules/audit/audit.module';
import { GisModule } from './modules/gis/gis.module';

@Module({
  imports: [DatabaseModule, AuthModule, AuditModule, GisModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
