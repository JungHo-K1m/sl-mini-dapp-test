import api from '@/shared/api/axiosInstance';

async function getRecords(petId: string): Promise<any> {
    try {
        
        const url = `/diagnosis/record/${petId}`;
        const response = await api.get(url);

        if (response.data.code === 'OK') {
            console.log("get Records: ", response.data.data);
            return response.data.data;
        } else {
            console.warn('Unexpected response code:', response.data.code);
            throw new Error(response.data.message || 'Failed to fetch records');
        }
    } catch (error: any) {
        console.error('에러 발생 시점:', error.message);
    }
}

export default getRecords;
