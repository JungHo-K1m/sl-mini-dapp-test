import api from '@/shared/api/axiosInstance';

// 친구목록
export const getReferralDetail = async (assetType: any, startDate: any, endDate: any, friendId: any): Promise<any> => {
    const filters = {
        assetType,
        startDate,
        endDate,
        friendId
    }
    
    const response = await api.post('/friends/reward/details', filters);
    console.log("다음 조건으로 날라감요: ", filters);

    if (response.data.code === 'OK') {
        
        console.log("수입이 좀 있나? ", response.data.data);
        return response.data.data;
    } else {
        console.error('Unexpected response:', response);
        throw new Error(response.data.message || 'Failed to fetch pet information');
    }
};


export default getReferralDetail;
