import api from '@/shared/api/axiosInstance';


// 메인으로 사용할 지갑 선택
export const useWalletMain = async(network: string, address: string): Promise<any> => {
    const response = await api.post('/');

    if(response.data.code === 'OK'){
        return response.data.data;
    }else{
        console.error('Unexpected response:', response);
        throw new Error(response.data.message || 'Failed to fetch wallet main');
    }
};

export default useWalletMain;