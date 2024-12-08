import api from '@/shared/api/axiosInstance';

export const getNFTList = async(): Promise<any> => {
    const response = await api.get('/');

    if(response.data.code === 'OK'){
        return response.data.data;
    }else{
        console.error('Unexpected response:', response);
        throw new Error(response.data.message || 'Failed to fetch wallet information');
    }
};

export default getNFTList;