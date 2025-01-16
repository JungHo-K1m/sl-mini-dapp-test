import api from '@/shared/api/axiosInstance';

async function storeDescription(formData: FormData): Promise<boolean> {
  // 엔드포인트 설정
  try {
    const response = await api.post('/diagnosis/dental/real', formData);

    if (response.data.code === 'OK') {
      if(response.data.data !== null){
        console.log("뭐하카나: ", response.data);
        return true;
      }else {
        console.log("뭐하카나: ", response.data);
        return false;
      }
    } else {
      console.warn(`Unexpected response code: ${response.data.code}`);
      throw new Error(response.data.message || `Unexpected response code: ${response.data.code}`);
    }
  } catch (error: any) {
    console.error('Error storing result:', error);
    throw error;
  }
}

export default storeDescription;
