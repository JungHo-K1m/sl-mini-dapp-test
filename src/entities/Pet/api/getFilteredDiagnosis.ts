import api from '@/shared/api/axiosInstance';

async function getFilteredDiagnosis(type: string | null, record: string | null, petId: string, endDate: string | null, startDate: string | null): Promise<any> {
    try {
        const filter = {
            type: type,
            label: record,
            petId: petId,
            endDate: endDate,
            startDate: startDate
        };

        const response = await api.post('/diagnosis', filter);

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

export default getFilteredDiagnosis;