// daraja-auth.service.ts
import { Injectable, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class DarajaAuthService {
  private cachedToken: string | null = null;
  private tokenExpiresAt = 0;

  constructor(private readonly config: ConfigService) {}

  async getAccessToken(): Promise<string> {
    // Tokens last ~3600s — don't fetch a new one on every request.
    if (this.cachedToken && Date.now() < this.tokenExpiresAt) {
      return this.cachedToken;
    }

    const key = this.config.get<string>('DARAJA_CONSUMER_KEY');
    const secret = this.config.get<string>('DARAJA_CONSUMER_SECRET');
    const basicAuth = Buffer.from(`${key}:${secret}`).toString('base64');

    try {
      const { data } = await axios.get(
        `${this.config.get('DARAJA_BASE_URL')}/oauth/v1/generate?grant_type=client_credentials`,
        { headers: { Authorization: `Basic ${basicAuth}` } },
      );

      const token: string = data.access_token;

      if (!token) {
        throw new HttpException('Invalid response from Daraja: missing access_token', 502);
      }

      this.cachedToken = token;

      // Refresh a little before actual expiry
      this.tokenExpiresAt = Date.now() + (Number(data.expires_in) - 60) * 1000;
      return token;

    } catch (err: any) {
      if (err.response) {
        console.error(" Daraja Auth Error Details:", err.response.data);
      } else {
        console.error("Daraja Connection Network Issue:", err.message);
      }
      throw new HttpException(`Failed to authenticate with Daraja: ${err.message}`, 502);
    }
  }
}