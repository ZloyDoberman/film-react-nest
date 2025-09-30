import { HttpException, HttpStatus } from '@nestjs/common';

export class PlaceException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.CONFLICT);
  }
}
