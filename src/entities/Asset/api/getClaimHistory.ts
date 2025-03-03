import api from '@/shared/api/axiosInstance';

export const getClaimHistory = async(pageNum: number): Promise<any> => {
    const response = await api.get(`/claim/${pageNum}`);

    if (response.status === 200) {
        console.log("클래임 내역: ", response);
        return response.data;
    }else{
        console.error('Unexpected response:', response);
        throw new Error(response.data.message || 'Failed to fetch item information');
    }
};

export default getClaimHistory;