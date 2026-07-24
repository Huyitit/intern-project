import { APIRequestContext, APIResponse } from '@playwright/test';
import {RequestOptions} from './options.client'

/**
 * ApiClient class for making API requests
 * @param request - API request context
 * @Return APIResponse
 */
export class ApiClient {
  constructor(private request: APIRequestContext, private token: string) {}

  // set token for client session
  private authHeaders(){
    if (this.token) 
      return {Authorization: `Bearer ${this.token}`};
  }

  // add custom header to request
  private mergeHeader(custom?: Record<string, string>){
    
    return {...this.authHeaders(), ...custom}; 
  }

  async get(url: string, options: RequestOptions = {}): Promise<APIResponse> {
    const res = await this.request.get(url, {
      headers: this.mergeHeader(options.headers),
      params: options.params
    });
    return res;
  }
  async post(url: string, data?: object, options: RequestOptions = {}): Promise<APIResponse> {
    const res = await this.request.post(url, {
      data,
      headers: this.mergeHeader(options.headers),
      params: options.params
    });
    return res;
  }
  async put(url: string, data?: object, options: RequestOptions = {}): Promise<APIResponse> {
    const res = await this.request.put(url, { 
      data,
      headers: this.mergeHeader(options.headers)
    });
    return res;
  }
  async delete(url: string, options: RequestOptions = {}): Promise<APIResponse> {
    const res = await this.request.delete(url, {
      headers: this.mergeHeader(options.headers)
    });
    return res;
  }

  private async handle(res: any) {

    const status = res.status();
    let body: any = null;
    try { 
      body = await res.json();
    } catch {
      // handle file upload/download

    }
    return { status, data: body };
  }
}