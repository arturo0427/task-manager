import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getStatus() {
    return {
      name: 'Encuba Tasks API',
      status: 'ok',
    };
  }
}
