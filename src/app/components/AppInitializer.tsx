import React, { useEffect, useRef, useState } from "react";
import liff from "@line/liff";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/entities/User/model/userModel";
import userAuthenticationWithServer from "@/entities/User/api/userAuthentication";
import i18n from "@/shared/lib/il8n";
import SplashScreen from "./SplashScreen";

interface AppInitializerProps {
  onInitialized: () => void;
}

const AppInitializer: React.FC<AppInitializerProps> = ({ onInitialized }) => {
  const navigate = useNavigate();
  const { fetchUserData } = useUserStore();
  const [showSplash, setShowSplash] = useState(true);
  const initializedRef = useRef(false);

  // 미리 정의된 라우트 (레퍼럴 코드 식별용)
  const knownRoutes = [
    "",
    "dice-event",
    "choose-character",
    "AI-menu",
    "mission",
    "reward",
    "invite-friends",
    "my-assets",
    "wallet",
    "wallet-list",
    "test",
    "previous-rewards",
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
    "referral-rewards",
    "claim-history",
    "sdk-test",
    "invite-friends-list",
  ];
  const referralPattern = /^[A-Za-z0-9]{4,16}$/;

  // 사용자 정보 가져오기
  const getUserInfo = async () => {
    console.log("[AppInitializer] getUserInfo() 호출");

    try {
      await fetchUserData();
      console.log("[AppInitializer] 사용자 데이터 정상적으로 가져옴");
      if (liff.isInClient()) {
        console.log("[AppInitializer] LINE 브라우저 사용 -> /dice-event 이동");
        navigate("/dice-event");
      } else {
        console.log("[AppInitializer] 외부 브라우저 사용 -> /connect-wallet 이동");
        navigate("/connect-wallet");
      }
    } catch (error: any) {
      console.error("[AppInitializer] getUserInfo() 중 에러:", error);
      if (error.response?.status === 500) {
        console.error("[AppInitializer] 500 오류: 캐릭터가 선택되지 않음 -> /choose-character 이동");
        navigate("/choose-character");
        return;
      }
      throw error;
    }
  };

  // 레퍼럴 코드 유무 체크
  useEffect(() => {
    console.log("[AppInitializer] 레퍼럴 코드 체크 시작");
    const url = window.location.href;
    const parts = url.split("/");
    const lastPart = parts[parts.length - 1];

    if (knownRoutes.includes(lastPart)) {
      console.log(`[AppInitializer] "${lastPart}"는 knownRoutes에 있음 -> 레퍼럴 코드 아님`);
      return;
    }
    if (referralPattern.test(lastPart)) {
      console.log(`[AppInitializer] "${lastPart}"는 레퍼럴 코드 패턴에 부합 -> localStorage에 저장`);
      localStorage.setItem("referralCode", lastPart);
    } else {
      console.log(`[AppInitializer] "${lastPart}"는 레퍼럴 코드가 아님`);
    }
  }, []);

  // 토큰 처리 및 사용자 검증
  const handleTokenFlow = async () => {
    console.log("[AppInitializer] handleTokenFlow() 시작");
    const accessToken = localStorage.getItem("accessToken");
    console.log("[AppInitializer] 현재 localStorage의 accessToken 확인");

    if (!accessToken) {
      console.log("[AppInitializer] 서버용 토큰이 없음 -> LINE 로그인 여부 확인");

      // LIFF 환경에서는 이미 로그인된 상태여야 하므로, 액세스 토큰을 바로 추출함
      const lineToken = liff.getAccessToken();
      console.log("[AppInitializer] liff.getAccessToken() 결과:", lineToken);

      if (!lineToken) {
        // LINE 토큰이 없으면 더 이상 진행할 수 없음.
        console.error("[AppInitializer] LINE 토큰이 없습니다. dapp 접근이 불가합니다.");
        throw new Error("LINE 인증이 필요합니다.");
      }

      try {
        console.log("[AppInitializer] userAuthenticationWithServer() 호출");
        const refCode = localStorage.getItem("referralCode");
        const isInitial = await userAuthenticationWithServer(lineToken, refCode);

        if (isInitial === undefined) {
          console.error("[AppInitializer] 서버 인증 실패 (isInitial이 undefined)");
          throw new Error("사용자 인증 실패");
        } else if (isInitial) {
          console.log("[AppInitializer] 신규 사용자 -> /choose-character 이동");
          navigate("/choose-character");
        } else {
          console.log("[AppInitializer] 기존 사용자 -> getUserInfo() 시도");
          await getUserInfo();
        }
      } catch (error) {
        console.error("[AppInitializer] userAuthenticationWithServer() 중 에러:", error);
        throw error;
      }
    } else {
      console.log("[AppInitializer] 서버용 토큰이 있음 -> getUserInfo() 시도");
      await getUserInfo();
    }
  };

  // 에러 핸들링
  const handleError = (error: any, navigate: (path: string) => void) => {
    console.error("[AppInitializer] 앱 초기화 중 오류:", error);
    if (error.response?.status === 500) {
      console.error("[AppInitializer] 500 오류 -> /choose-character 이동");
      navigate("/choose-character");
    } else {
      console.error("[AppInitializer] 그 외 오류 발생:", error);
      throw error;
    }
  };

  // 초기화 Effect
  useEffect(() => {
    console.log("[AppInitializer] useEffect() - initializeApp() 진입");
    const initializeApp = async () => {
      if (initializedRef.current) {
        console.log("[AppInitializer] 이미 초기화됨 -> 중단");
        return;
      }
      initializedRef.current = true;

      try {
        console.log("[AppInitializer] LIFF 초기화 시작");
        await liff.init({
          liffId: import.meta.env.VITE_LIFF_ID,
          withLoginOnExternalBrowser: true,
        });
        console.log("[AppInitializer] LIFF 초기화 완료");

        console.log("[AppInitializer] IP 기반 언어 설정 시작");
        let i18nLanguage = "en";
        try {
          const response = await fetch("https://ipapi.co/json/");
          const data = await response.json();
          const countryCode = data.country;
          const languageMapByCountry: { [key: string]: string } = {
            KR: "ko",
            US: "en",
            JP: "ja",
            TW: "zh",
            TH: "th",
          };
          i18nLanguage = languageMapByCountry[countryCode] || "en";
          console.log(`[AppInitializer] IP 기반 언어 설정: ${countryCode} -> ${i18nLanguage}`);
        } catch (error) {
          console.error("IP 기반 위치 정보 조회 실패:", error);
          const userLanguage = liff.getLanguage();
          const languageMap: { [key: string]: string } = {
            "en-US": "en",
            "ja-JP": "ja",
            "zh-TW": "zh",
            "th-TH": "th",
            "ko-KR": "ko",
          };
          i18nLanguage = languageMap[userLanguage] || "en";
          console.log(`[AppInitializer] fallback LIFF 언어 설정: ${userLanguage} -> ${i18nLanguage}`);
        }
        i18n.changeLanguage(i18nLanguage);

        console.log("[AppInitializer] handleTokenFlow() 호출");
        await handleTokenFlow();
      } catch (error) {
        console.error("[AppInitializer] initializeApp() try-catch 에러:", error);
        handleError(error, navigate);
      } finally {
        console.log("[AppInitializer] 초기화 최종 처리 -> 스플래시 제거 및 onInitialized() 호출");
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
