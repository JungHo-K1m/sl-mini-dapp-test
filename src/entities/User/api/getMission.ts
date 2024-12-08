import api from '@/shared/api/axiosInstance';

interface Mission {
    id: number;
    name: string;
    description: string;
    diceReward: number;
    starReward: number;
    redirectUrl: string | null;
    type: 'ONETIME' | 'RECURRING';
    isCleared: boolean;
}

interface MissionResponse {
    code: string;
    message: string;
    data: Mission[];
}

// 미션 정보를 가져오는 함수
export const getMission = async (): Promise<Mission[]> => {
    try {
        const response = await api.get<MissionResponse>('/missions');

        if (response.data.code === 'OK') {
            return response.data.data;
        } else {
            console.error('Unexpected response:', response);
            throw new Error(response.data.message || 'Failed to fetch mission information');
        }
    } catch (error: any) {
        console.error('Error fetching mission data:', error);
        throw error;
    }
};

export default getMission;
