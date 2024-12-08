import api from '@/shared/api/axiosInstance';
import { NavigateFunction } from 'react-router-dom';

async function getRecords(navigate: NavigateFunction): Promise<any> {
    try {
        const response = await api.get('/diagnosis/record');

        if (response.data.code === 'OK') {
            console.log("get Records: ", response.data.data);
            return response.data.data;
        } else {
            console.warn('Unexpected response code:', response.data.code);
            throw new Error(response.data.message || 'Failed to fetch records');
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
            console.error('Unexpected error:', error);
            throw error;
        }
    }
}

export default getRecords;
