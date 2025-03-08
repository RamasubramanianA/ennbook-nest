import { Injectable } from '@nestjs/common';
/**
 * This is the service for the app, initial test service.
 */
@Injectable()
export class AppService {
/**
 * @example
 * Hello World!
 *
 */
  getHello(): string {
    return 'Hello World!';
  }
}
