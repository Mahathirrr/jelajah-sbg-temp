// lib/midtrans.ts
import https from 'https';

export class MidtransService {
  private serverKey: string;
  private isProduction: boolean;

  constructor() {
    this.serverKey = process.env.MIDTRANS_SERVER_KEY || '';
    this.isProduction = process.env.MIDTRANS_IS_PRODUCTION === 'true';
  }

  // Create transaction token
  async createTransaction(parameter: any): Promise<string> {
    const auth = Buffer.from(this.serverKey + ':').toString('base64');
    const payload = JSON.stringify(parameter);
    
    return new Promise((resolve, reject) => {
      const options = {
        hostname: this.isProduction ? 'app.midtrans.com' : 'app.sandbox.midtrans.com',
        port: 443,
        path: '/snap/v1/transactions',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${auth}`,
          'Content-Length': Buffer.byteLength(payload)
        }
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            if (response.token) {
              resolve(response.token);
            } else {
              reject(new Error('No token received from Midtrans'));
            }
          } catch (error) {
            reject(error);
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.write(payload);
      req.end();
    });
  }

  // Get transaction status
  async getTransactionStatus(orderId: string): Promise<any> {
    const auth = Buffer.from(this.serverKey + ':').toString('base64');
    
    return new Promise((resolve, reject) => {
      const options = {
        hostname: this.isProduction ? 'api.midtrans.com' : 'api.sandbox.midtrans.com',
        port: 443,
        path: `/v2/${orderId}/status`,
        method: 'GET',
        headers: {
          'Authorization': `Basic ${auth}`,
        }
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            resolve(response);
          } catch (error) {
            reject(error);
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.end();
    });
  }
}

export const midtrans = new MidtransService();