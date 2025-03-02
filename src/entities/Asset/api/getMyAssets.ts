import api from '@/shared/api/axiosInstance';

export const getMyAssets = async(): Promise<any> => {
    const response = await api.get('/assets');

    if(response.data.code === 'OK'){
        console.log("my asset response: ", response);
        return response.data.data;
    }else{
        console.error('Unexpected response:', response);
        throw new Error(response.data.message || 'Failed to fetch wallet information');
    }
};

export default getMyAssets;