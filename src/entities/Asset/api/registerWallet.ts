import api from '@/shared/api/axiosInstance';

export const registerWallet = async(network: string, address: string, isMain: boolean): Promise<any> => {
    const walletInfo = {
        network,
        address,
        isMain
    }
    const response = await api.post('/', { walletInfo });

    if(response.data.code === 'OK'){
        return response.data.data;
    }else{
        console.error('Unexpected response:', response);
        throw new Error(response.data.message || 'Failed to fetch wallet information');
    }
};

export default registerWallet;