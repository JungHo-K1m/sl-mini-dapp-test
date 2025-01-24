import api from '@/shared/api/axiosInstance';

async function updatePetInfo(formData: FormData, navigate: any): Promise<any> {
    try {
        const response = await api.post('/update-pet', formData);

        if (response.data.code === 'OK') {
            // 반려동물 정보가 정상적으로 업데이트됨
            return true;
        } else {
            throw new Error(response.data.message || 'Failed to update pet information');
        }
    } catch (error: any) {
        console.error('에러 발생 시점:', error.message);
    }
}

export default updatePetInfo;
