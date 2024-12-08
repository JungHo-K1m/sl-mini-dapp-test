// // src/pages/MainPage/index.tsx

// import React, { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useUserStore } from '@/entities/User/model/userModel';

// const MainPage: React.FC = () => {
//   const navigate = useNavigate();
//   const {
//     login,
//     fetchUserData,
//     userId,
//     isLoading,
//     error,
//     // 기타 필요한 상태들
//   } = useUserStore();

//   useEffect(() => {
//     const checkAuthentication = async () => {
//       console.log('Step 1-1: 사용자가 미니앱에 접근');
//       console.log('Step 2-1: 로컬 스토리지에서 토큰 확인 시작');
//       const telegram = window.Telegram?.WebApp;
//       const initData = telegram?.initData || '';
//       console.log('Step 1-1: 사용자가 미니앱에 접근 - Telegram initData:', initData);

//       // 로컬 스토리지에서 토큰 확인
//       const accessToken = localStorage.getItem('accessToken');
//       console.log('Step 2-1: accessToken:', accessToken);

//       if (accessToken && userId) {
//         console.log('Step 2-2: 토큰이 존재함. Step 3으로 진행');
//         console.log('Step 3-1: 토큰의 텔레그램 사용자 ID와 현재 사용자 ID 비교 시작');

//         // 현재 텔레그램 사용자 ID 얻기
//         const currentTelegramUserId = telegram?.initDataUnsafe?.user?.id;
//         console.log('Step 3-2: currentTelegramUserId:', currentTelegramUserId);

//         // ID 비교
//         if (currentTelegramUserId && userId === currentTelegramUserId.toString()) {
//           console.log('Step 3-3: 사용자 ID 일치. Step 4으로 진행');
//           console.log('Step 4-1: 토큰 유효성 서버 검증 시작');
//           // 토큰 서버 검증
//           try {
//             await fetchUserData();
//             console.log('Step 4-2: 토큰 유효성 검증 성공. /dice-event 페이지로 이동');
//             navigate('/dice-event');
//           } catch (err) {
//             console.error('Step 4-3: 토큰 검증 실패:', err);
//             // 토큰 무효: 토큰 삭제하고 인증을 다시 진행
//             localStorage.removeItem('accessToken');
//             localStorage.removeItem('refreshToken');
//             authenticateWithInitData(initData);
//           }
//         } else {
//           console.warn('Step 3-4: 사용자 ID 불일치. 토큰을 삭제하고 Step 5로 진행');
//           // ID 불일치: 토큰 삭제하고 인증을 다시 진행
//           localStorage.removeItem('accessToken');
//           localStorage.removeItem('refreshToken');
//           authenticateWithInitData(initData);
//         }
//       } else {
//         console.log('Step 2-3: 토큰이 없거나 userId가 없음. Step 5로 진행');
//         // 토큰 또는 userId 없음: 인증을 진행
//         authenticateWithInitData(initData);
//       }
//     };

//     const authenticateWithInitData = async (initData: string) => {
//       console.log('Step 5-1: 텔레그램 initData를 통한 인증 시작');
//       try {
//         // initData로 서버에 인증 요청
//         await login(initData);
//         console.log('Step 5-2: 인증 성공. /dice-event 페이지로 이동');
//         // 인증 성공: 필요한 페이지로 이동
//         navigate('/dice-event');
//       } catch (err: any) {
//         console.error('Step 5-3: 인증 실패:', err);
//         if (err.message === 'User not found') {
//           console.log('Step 5-4: 신규 사용자. /sign-up 페이지로 이동');
//           // 신규 사용자: 회원가입 페이지로 이동
//           navigate('/sign-up');
//         } else if (err.message === 'Invalid initData') {
//           console.log('Step 5-5: initData 문제. 로그인 재시도 필요.');
//           // initData 문제가 있을 경우, 로그로 대체
//           console.log('Authentication failed due to invalid data. Please try again.');
//         } else {
//           // 기타 에러 처리
//           console.log('Step 5-6: 기타 에러 발생. 사용자에게 알림 표시');
//           console.log('Authentication failed. Please try again.');
//         }
//       }
//     };

//     checkAuthentication();
//   }, [fetchUserData, login, navigate, userId]);

//   if (isLoading) {
//     console.log('Step 6: 로딩 중...');
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     console.error('Step 7: 에러 발생:', error);
//     return <div>Error loading data: {error}</div>;
//   }

//   console.log('Step 8: 인증 완료. 메인 페이지 표시.');
//   return (
//     <div className="main-page-container">
//       <p>Welcome to the Dice Event Mini-App!</p>
//       {/* 추가적인 UI 요소 */}
//     </div>
//   );
// };

// export default MainPage;
