import api from '@/shared/api/axiosInstance';

export const registerWallet = async (address: string, market: string): Promise<any> => {
    const walletInfo = {
    address,
    market,
    };

    try {
    const response = await api.post('/wallet/register', walletInfo);

    // 서버 응답 처리
    if (response.data.code === 'OK') {
        if (response.data.data === null) {
            console.error('지갑 검증 실패: data가 null입니다.');
            throw new Error('지갑 검증에 실패했습니다.');
        }
        console.log('지갑 등록 성공:', response);
        return true;
    } else {
        console.error('Unexpected response:', response);
        throw new Error(response.data.message || 'Failed to fetch wallet information');
    }
    } catch (error) {
        console.error('지갑 등록 중 오류 발생:', error);
        throw error;
    }
};

export default registerWallet;
