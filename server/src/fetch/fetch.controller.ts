import { Controller, Post, Body } from '@nestjs/common';
import { FetchClient, Config, HeaderUtils } from 'coze-coding-dev-sdk';
import { Request } from 'express';

interface FetchUrlDto {
  url: string;
}

@Controller('fetch')
export class FetchController {
  @Post('url')
  async fetchUrl(@Body() body: FetchUrlDto) {
    console.log('[FetchController] Fetching URL:', body.url);
    
    const config = new Config();
    const client = new FetchClient(config);
    
    const response = await client.fetch(body.url);
    
    console.log('[FetchController] Status:', response.status_code);
    console.log('[FetchController] Title:', response.title);
    
    return {
      code: response.status_code === 0 ? 200 : response.status_code,
      msg: response.status_message || 'Success',
      data: response
    };
  }
}
