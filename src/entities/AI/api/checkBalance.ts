import api from '@/shared/api/axiosInstance';

//ai 진단 전, 재화 차감을 위해 잔액 확인
export const checkBalance = async(): Promise<any> => {
    const response = await api.post('');
}

export default checkBalance;