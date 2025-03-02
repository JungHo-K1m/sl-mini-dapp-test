// getPaymentStatus.ts

// 결제 상태로 가능한 문자열 타입들을 정의합니다.
export type PaymentStatus =
  | 'CREATED'
  | 'STARTED'
  | 'REGISTERED_ON_PG'
  | 'CAPTURED'
  | 'CONFIRMED'
  | 'CONFIRM_FAILED'
  | 'FINALIZED'
  | 'CANCELED';

// API 응답 인터페이스
export interface PaymentStatusResponse {
  status: PaymentStatus;
}

/**
 * 결제 상태를 가져오는 함수
 *
 * @param paymentId - 조회할 결제의 ID
 * @returns PaymentStatusResponse 객체 (예: { status: 'CONFIRMED' })
 * @throws API 호출 실패 시 에러 발생
 */
export async function getPaymentStatus(
  paymentId: string
): Promise<PaymentStatusResponse> {
  const endpoint =
    'https://payment.dappportal.io/api/payment-v1/payment/status';
  const url = `${endpoint}?id=${encodeURIComponent(paymentId)}`;

  const response = await fetch(url, { method: 'GET' });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const errorDetail = errorBody.detail || response.statusText;
    throw new Error(
      `Failed to get payment status. HTTP ${response.status}: ${errorDetail}`
    );
  }

  // JSON 응답 파싱 후 결과를 확인하기 위해 console.log 추가
  const data: PaymentStatusResponse = await response.json();

  return data;
}
