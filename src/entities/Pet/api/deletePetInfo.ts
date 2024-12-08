import api from '@/shared/api/axiosInstance';

async function deletePet(petinfo: any, navigate: any): Promise<any> {
    const id = petinfo;
    console.log("Deleting pet with ID:", id);
    const url = `pet/${id}`;

    try {
        const response = await api.delete(url);

        if (response.data.code === 'OK') {
            return true;
        } else {
            throw new Error('Failed to delete pet: Unexpected response code');
        }
    } catch (error: any) {
        console.error('Error occurred:', error.message);

        // 404 또는 기타 오류 처리
        if (error.response && error.response.status === 404) {
            console.error('Resource not found:', error);
            throw new Error('Resource not found. Please check the endpoint.');
        } else if (error.response && error.response.status === 401) {
            // 401 오류 발생 시 인터셉터가 자동으로 토큰 갱신 처리
            console.error('Unauthorized error, redirecting to login if token refresh fails');
            navigate('/login', { replace: true });
        } else {
            console.error('Unexpected error:', error);
            throw error;
        }
    }
}

export default deletePet;
