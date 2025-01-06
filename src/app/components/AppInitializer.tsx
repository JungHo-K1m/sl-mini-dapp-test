import React, { useEffect, useRef, useState } from "react";
import liff from "@line/liff";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/entities/User/model/userModel";
import userAuthenticationWithServer from "@/entities/User/api/userAuthentication";
import i18n from "@/shared/lib/il8n";
import SplashScreen from "./SplashScreen";
import checkWallet from "@/entities/Asset/api/checkWalet";


interface AppInitializerProps {
  onInitialized: () => void;
}

const AppInitializer: React.FC<AppInitializerProps> = ({ onInitialized }) => {
  const navigate = useNavigate();
  const { fetchUserData } = useUserStore();
  const [showSplash, setShowSplash] = useState(true);
  const initializedRef = useRef(false);
  const knownRoutes = [
    "", 
    "dice-event", 
    "choose-character",
    "policy-agreement",
    "AI-menu",
    "mission",
    "reward",
    "invite-friends",
    "my-assets",
    "wallet",
    "wallet-list",
    "test",
    "previous-rewards",
    "choose-character",
    "select-pet",
    "regist-pet",
    "edit-pet",
    "diagnosis-list",
    "diagnosis-detail",
    "ai-xray-analysis",
    "ai-dental-analysis",
    "my-nfts",
    "reward-history",
    "first-reward",
    "settings",
    "policy-detail",
    "policy-agreement",
    "referral-rewards",
    "claim-history",
    "sdk-test",
    "invite-friends-list",
  ];
  const referralPattern = /^[A-Za-z0-9]{4,16}$/;


  // 토큰이 있을 때, 사용자 정보 가져오기
  const getUserInfo = async () =>{
    try {
      await fetchUserData();
      console.log("사용자 데이터 정상적으로 가져옴. 주사위 게임 페이지로 이동");
      const walletMessage = await checkWallet();
      if (walletMessage === "Success") {
        console.log("walletCheck 성공. /dice-event 로 이동");
        navigate("/dice-event");
      } else if (walletMessage === "You do not have a registered wallet.") {
        console.log("walletCheck 결과: 지갑 없음. /connect-wallet 로 이동");
        navigate("/connect-wallet");
      } else {
        // 그 외 예상치 못한 응답 처리
        console.error("Unexpected walletCheck response:", walletMessage);
        // 필요시 다른 페이지 이동 혹은 에러 핸들링
      }
    } catch (error: any) {
      if (error.response?.status === 500) {
        console.error("500 오류: 캐릭터가 선택되지 않음. 캐릭터 선택 페이지로 이동");
        navigate("/choose-character");
        return;
      }
      throw error; // 기타 오류는 상위에서 처리
    }
  }

  useEffect(()=>{
    const url = window.location.href;
    const parts  = url.split("/");
    const lastPart  = parts[parts.length - 1];

    // 1) 미리 정의된 라우트 목록에 속하면 레퍼럴 코드가 아님
    if (knownRoutes.includes(lastPart)) {
      console.log("기존 라우트로 인식. 레퍼럴 코드가 아님:", lastPart);
      return;
    }

    // 2) 정규식으로 검사(패턴에 맞으면 코드로 저장)
    if (referralPattern.test(lastPart)) {
      console.log("레퍼럴 코드로 인식:", lastPart);
      localStorage.setItem("referralCode", lastPart);
    } else {
      // 여기서도 '코드가 아닌 어떤 특수 경로'일 가능성 있음
      console.log("레퍼럴 코드 포맷이 아님:", lastPart);
    }
  }, [])

  const handleTokenFlow = async () => {
    const accessToken = localStorage.getItem("accessToken");
  
    if (!accessToken) {
      console.log("액세스 토큰이 없음. 액세스 토큰 재발급 시도...");
      try {
        // 액세스 토큰 재발급 시도
        const refreshSuccessful = await useUserStore.getState().refreshToken();
  
        if (refreshSuccessful) {
          console.log("액세스 토큰 재발급 성공");
          await getUserInfo(); // 사용자 데이터 가져오기
          return;
        } else {
          console.error("액세스 토큰 재발급 실패");
          throw new Error("토큰 재발급 실패");
        }
      } catch (error) {
        console.error("재발급 실패, LINE 로그인 진행...");
        
        if (!liff.isLoggedIn()) {
          console.log("사용자가 로그인되지 않음. 라인 로그인 진행.");
          liff.login();
          return;
        }
  
        // 라인 액세스 토큰 발급
        const lineToken = liff.getAccessToken();
        if (!lineToken) throw new Error("라인 Access Token을 가져오지 못했습니다.");
  
        // 사용자 검증 진행
        const isInitial = await userAuthenticationWithServer(lineToken);
        console.log("사용자 검증 진행");
  
        if (isInitial === undefined) {
          throw new Error("사용자 인증에 실패했습니다.");
        } else if (isInitial === true) {
          // 신규 사용자
          console.log("신규 사용자: 이용약관 동의 페이지로 이동");
          navigate("/policy-agreement");
          return;
        } else {
          // 기존 사용자
          console.log("기존 사용자: 사용자 데이터 확인 중...");
          await fetchUserData();
          navigate("/dice-event");
        }
      }
    } else {
      console.log("액세스 토큰 존재. 사용자 데이터 가져오기...");
      await getUserInfo();
    }
  };
  

  const handleError = (error: any, navigate: (path: string) => void) => {
    console.error("앱 초기화 중 오류:", error);
    if (error.response?.status === 500) {
      console.error("500 오류: 캐릭터가 선택되지 않음. 캐릭터 선택 페이지로 이동");
      navigate("/choose-character");
    } else {
      console.log("라인 로그 아웃 진행");
      localStorage.removeItem("accessToken");
      liff.logout();
      window.location.reload();
    }
  };

  useEffect(() => {
    const initializeApp = async () => {
      if (initializedRef.current) return;
      initializedRef.current = true;
  
      try {
        // LIFF 초기화
        await liff.init({
          liffId: import.meta.env.VITE_LIFF_ID,
          withLoginOnExternalBrowser: true,
        });
  
        // 언어 설정
        const userLanguage = liff.getLanguage();
        const languageMap: { [key: string]: string } = {
          "en-US": "en",
          "ja-JP": "ja",
          "zh-TW": "zh",
        };
        const i18nLanguage = languageMap[userLanguage] || "en";
        i18n.changeLanguage(i18nLanguage);
  
        // 토큰 흐름 관리
        await handleTokenFlow();
      } catch (error) {
        handleError(error, navigate);
      } finally {
        setShowSplash(false);
        onInitialized();
      }
    };
  
    initializeApp();
  }, [fetchUserData, navigate, onInitialized]);  
  
  if (showSplash) {
    return <SplashScreen />;
  }

  return null;
};

export default AppInitializer;
