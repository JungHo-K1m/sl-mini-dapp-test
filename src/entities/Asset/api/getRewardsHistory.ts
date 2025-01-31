import api from '@/shared/api/axiosInstance';

export const getRewardsHistory = async(
    assetType: string | null, 
    changeType: string | null, 
    startDate: string | null, 
    endDate: string | null, page: number): Promise<any> => {
    
    const filters = {
        assetType,
        changeType,
        startDate,
        endDate,
        page
    }

    console.log("필터링 조건: ", filters);

    const response = await api.post('/reward/history/filter', filters);

    if(response.data.code === 'OK'){
        console.log("내역 확인: ", response.data.data);
        return response.data.data;
    }else{
        console.error('Unexpected response:', response);
        throw new Error(response.data.message || 'Failed to fetch my reward history');
    }
};

export default getRewardsHistory;