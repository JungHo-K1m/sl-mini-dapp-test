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

interface ClearMissionResponse {
    code: string;
    message: string;
    data: Mission[];
}

// 미션을 클리어하는 함수
export const clearMission = async (missionId: number): Promise<Mission[]> => {
    try {
        const response = await api.post<ClearMissionResponse>('/onetime/mission', { id: missionId });

        if (response.data.code === 'OK') {
            console.log(response.data.message); // 성공 메시지 출력
            return response.data.data;
        } else {
            console.error('Unexpected response:', response);
            throw new Error(response.data.message || 'Failed to clear the mission');
        }
    } catch (error: any) {
        console.error('Error clearing mission:', error);
        throw error;
    }
};

export default clearMission;
