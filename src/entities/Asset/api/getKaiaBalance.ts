export interface KaiaRpcRequest {
    method: string;
    id: number;
    jsonrpc: string;
    params: [string, string];
  }
  
  export interface KaiaRpcResponse<T = any> {
    jsonrpc: string;
    id: number;
    result?: T;
    error?: {
      code: number;
      message: string;
      data?: any;
    };
  }
  

  export async function kaiaGetBalance(
    address: string,
    block: string = 'latest'
  ): Promise<KaiaRpcResponse<string>> {
    const url = 'https://public-en-kairos.node.kaia.io/';
    const requestPayload: KaiaRpcRequest = {
      method: 'kaia_getBalance',
      id: 1,
      jsonrpc: '2.0',
      params: [address, block],
    };
  
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(requestPayload),
    });
  
    if (!response.ok) {
      throw new Error(`네트워크 오류: ${response.statusText}`);
    }
  
    const data: KaiaRpcResponse<string> = await response.json();
    return data;
  }

export default kaiaGetBalance;
