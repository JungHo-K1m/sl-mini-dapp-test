import api from '@/shared/api/axiosInstance';

export const paymentSession = async (itemId: number, pgType: string, buyerDappPortalAddress: string): Promise<any> => {
    const paymentInfo = {
        itemId,
        pgType,
        buyerDappPortalAddress
    };

    try {
    const response = await api.post('/payment/session', paymentInfo);

    // 서버 응답 처리
    if (response.data.code === 'OK') {
        if (response.data.data === null) {
            console.error('결제 세션 실패: data가 null입니다.');
            throw new Error('결제 시도에 실패했습니다.');
        }
        console.log('결제 세션 성공:', response);
        return response.data.data;
    } else {
        console.error('Unexpected response:', response);
        throw new Error(response.data.message || 'Failed to fetch wallet information');
    }
    } catch (error) {
        console.error('결제 세션 중 오류 발생:', error);
        throw error;
    }
};

export default paymentSession;
