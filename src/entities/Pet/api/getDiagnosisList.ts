import api from '@/shared/api/axiosInstance';

async function getDiagnosisList(petId: string): Promise<any> {
    try {
        const url = `diagnosis/${petId}`;
        const response = await api.post(url);

        if (response.data.code === 'OK') {
            console.log("진단 리스트: ", response.data.data);
            return response.data.data ?? null;
        } else {
            throw new Error(response.data.message || 'Failed to fetch diagnosis list');
        }
    } catch (error: any) {
        console.error('에러 발생 시점:', error.message);
    }
}

export default getDiagnosisList;
