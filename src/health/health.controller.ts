import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Controller('health')
export class HealthController {
  constructor(private readonly dataSource: DataSource) {}

  @Get()
  async check(): Promise<{ status: string; db: string }> {
    try {
      await this.dataSource.query('SELECT 1');
      return { status: 'ok', db: 'connected' };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown database error';
      throw new ServiceUnavailableException({
        status: 'error',
        db: 'disconnected',
        message,
      });
    }
  }
}
