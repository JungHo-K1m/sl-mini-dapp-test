import api from '@/shared/api/axiosInstance';

interface RankingResponse {
    content: Array<{
        userId: string;
        starCount: number;
    }>;
    pageable: {
        pageNumber: number;
        pageSize: number;
        offset: number;
        paged: boolean;
        unpaged: boolean;
    };
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    numberOfElements: number;
    empty: boolean;
}

// 페이지 번호를 파라미터로 받아서 사용자 랭킹 정보를 가져오는 함수
export const getRanking = async (pageNum: number): Promise<RankingResponse> => {
    const response = await api.get(`/leader/${pageNum}`);

    // API의 성공 여부 확인 및 데이터 반환
    if (response.status === 200) {
        return response.data;
    } else {
        console.error('Unexpected response:', response);
        throw new Error(response.data.message || 'Failed to fetch ranking information');
    }
};

export default getRanking;
