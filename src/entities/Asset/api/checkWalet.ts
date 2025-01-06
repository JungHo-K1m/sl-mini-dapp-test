import api from '@/shared/api/axiosInstance';

export const checkWallet = async(): Promise<any> => {
    const response = await api.get('/wallet');

    if(response.data.code === 'OK'){
        console.log("지갑 정보 호출:", response.data);
        return response.data.message;
    }else{
        console.error('Unexpected response:', response);
        throw new Error(response.data.message || 'Failed to fetch wallet information');
    }
};

export default checkWallet;