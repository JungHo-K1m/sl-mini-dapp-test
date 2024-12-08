import axios from 'axios';

const verifyWalletAddress = async (address: string): Promise<boolean> => {
    try {
        const response = await axios.post('', {
            address,
        });
        return response.data.isValid; // API의 응답 구조에 따라 수정 필요
    } catch (error) {
        console.error('Address verification failed:', error);
        return false;
    }
};

export default verifyWalletAddress;