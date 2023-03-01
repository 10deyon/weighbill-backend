import { Controller, Get, Response } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { UtiliHelpers } from './shared';

@Controller()
export class AppController {

  @ApiOkResponse()
  @Get('health')
  public getHealth(@Response() res): UtiliHelpers {
    return UtiliHelpers.sendJsonResponse(
      res,
      {},
      'Health OK! From Gatekeeper Service'
    );
  }
}
