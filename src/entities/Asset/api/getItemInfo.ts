import api from '@/shared/api/axiosInstance';

export const getItemInfo = async(): Promise<any> => {
    const response = await api.get('/store/items');

    if(response.data.code === 'OK'){
        return response.data.data;
    }else{
        console.error('Unexpected response:', response);
        throw new Error(response.data.message || 'Failed to fetch item information');
    }
};

export default getItemInfo;