import { Controller, Post, Body, Get, Patch } from '@nestjs/common';
import { JoiValidationPipe } from 'src/_common/pipes/joi-validation.pipe';
import { RateLimitService } from './rate-limit.service';
import { IRateLimit, IUpdateRateLimit } from './rate-limit.interface';
import schema from './rate-limit.schema';

@Controller('rateLimit')
export class RateLimitController {
  constructor(private readonly rateLimitService: RateLimitService) {}

  @Post()
  createRateLimit() {
    return this.rateLimitService.createRateLimit();
  }

  @Patch()
  updateRateLimit(@Body(new JoiValidationPipe(schema.editRateLimit)) input: IUpdateRateLimit) {
    return this.rateLimitService.updateRateLimit(input);
  }

  @Get()
  rateLimit() {
    return this.rateLimitService.rateLimit();
  }
}
