import api from '@/shared/api/axiosInstance';

//ai 진단으로 인한 재화 사용
export const useToken = async(): Promise<any> => {
    const response = await api.post('');
}

export default useToken;