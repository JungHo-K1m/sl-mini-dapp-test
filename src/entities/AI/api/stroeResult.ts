import api from '@/shared/api/axiosInstance';

async function storeResult(formData: FormData, type: string): Promise<boolean> {
  // 엔드포인트 설정
  const endpointMap: { [key: string]: string } = {
    dental: '/diagnosis/dental/real',
    xray: '/diagnosis/dental/xray',
  };
  const endpoint = endpointMap[type];

  if (!endpoint) {
    console.error(`Invalid type: ${type}`);
    throw new Error(`Invalid type: ${type}`);
  }

  try {
    const response = await api.post(endpoint, formData);

    if (response.data.code === 'OK') {
      console.log("Data stored successfully.");
      return true;
    } else {
      console.warn(`Unexpected response code: ${response.data.code}`);
      throw new Error(response.data.message || `Unexpected response code: ${response.data.code}`);
    }
  } catch (error: any) {
    console.error('Error storing result:', error);
    throw error;
  }
}

export default storeResult;
