import { Module } from '@nestjs/common';
import { ReportGeneratorService } from './services/report-generator.service';
import { ReportController } from './controllers/report.controller';

@Module({
  providers: [ReportGeneratorService],
  controllers: [ReportController]
})
export class ErrorHandlingModule {}
