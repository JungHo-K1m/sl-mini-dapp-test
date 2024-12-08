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

        // 상태 코드 확인 및 오류 처리
        if (error.response && error.response.status === 404) {
            console.error('Resource not found:', error);
            throw new Error('Resource not found. Please check the endpoint.');
        } else if (error.response && error.response.status === 401) {
            // 401 오류 발생 시 인터셉터가 자동으로 토큰 갱신 처리
            console.error('Unauthorized error, redirecting to login if token refresh fails');
            localStorage.removeItem('accessToken');
            navigate('/login', { replace: true });
        } else {
            console.error('Unexpected error updating pet information:', error);
            throw error;
        }
    }
}

export default updatePetInfo;
