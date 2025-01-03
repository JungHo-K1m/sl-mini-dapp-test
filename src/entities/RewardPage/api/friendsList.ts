import api from '@/shared/api/axiosInstance';

// 친구목록
export const getFriendsList = async (): Promise<any> => {
    const response = await api.get('/friends/list');

    if (response.data.code === 'OK') {
        console.log("누구 누구 있나? ", response.data.data);
        return response.data.data;
    } else {
        console.error('Unexpected response:', response);
        throw new Error(response.data.message || 'Failed to fetch pet information');
    }
};


export default getFriendsList;
