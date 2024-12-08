import api from '@/shared/api/axiosInstance';

async function getDiagnosisList(type: string | null, record: string | null, petId: string, navigate: any): Promise<any> {
    try {
        const filter = {
            type: type,
            record: record,
            petId: petId
        };

        const response = await api.post('/diagnosis', filter);

        if (response.data.code === 'OK') {
            return response.data.data ?? null;
        } else {
            throw new Error(response.data.message || 'Failed to fetch diagnosis list');
        }
    } catch (error: any) {
        console.error('에러 발생 시점:', error.message);

        // 404 오류 또는 인증 오류 등 다양한 상태 코드 처리
        if (error.response && error.response.status === 404) {
            console.error('Resource not found:', error);
            throw new Error('Resource not found. Please check the endpoint.');
        } else if (error.response && error.response.status === 401) {
            // 인터셉터가 401 오류에 대한 토큰 갱신을 자동 처리함
            console.error('Unauthorized error, redirecting to login if token refresh fails');
            localStorage.removeItem('accessToken');
            navigate('/login', { replace: true });
        } else {
            console.error('Unexpected error fetching diagnosis list:', error);
            throw error;
        }
    }
}

export default getDiagnosisList;
