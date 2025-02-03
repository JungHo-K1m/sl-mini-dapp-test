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

    const response = await api.post('/reward/history/filter', filters);

    if(response.data.code === 'OK'){
        return response.data.data;
    }else{
        console.error('Unexpected response:', response);
        throw new Error(response.data.message || 'Failed to fetch my reward history');
    }
};

export default getRewardsHistory;