import api from '@/shared/api/axiosInstance';

export const checkWallet = async(): Promise<any> => {
    const response = await api.get('/wallet');

    if(response.data.code === 'OK'){
        return response.data.message;
    }else{
        console.error('Unexpected response:', response);
        throw new Error(response.data.message || 'Failed to fetch wallet information');
    }
};

export default checkWallet;