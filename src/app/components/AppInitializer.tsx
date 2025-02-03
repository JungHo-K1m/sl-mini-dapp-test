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

  // ----------------------------------------------------------------
  // 사용자 정보 가져오기
  // ----------------------------------------------------------------
  const getUserInfo = async () => {
    console.log("[AppInitializer] getUserInfo() 호출");

    try {
      await fetchUserData();
      console.log("[AppInitializer] 사용자 데이터 정상적으로 가져옴");
      if(liff.isInClient()){
        console.log("[AppInitializer] line 브라우저 사용 -> /dice-event 이동");
        navigate("/dice-event");
      } else {
        console.log("[AppInitializer] 외부 브라우저 사용 -> /connect-wallet 이동");
        navigate("/connect-wallet");
      }
    } catch (error: any) {
      console.error("[AppInitializer] getUserInfo() 중 에러:", error);

      // 서버에서 500을 던지면 '캐릭터 미선택' 상황으로 간주
      if (error.response?.status === 500) {
        console.error("[AppInitializer] 500 오류: 캐릭터가 선택되지 않음 -> /choose-character 이동");
        navigate("/choose-character");
        return;
      }

      // 그 외 에러는 상위에서 처리하도록 throw
      throw error;
    }
  };

  // ----------------------------------------------------------------
  // 레퍼럴 코드 유무 체크 (URL 마지막 Segment 확인)
  // ----------------------------------------------------------------
  useEffect(() => {
    console.log("[AppInitializer] 레퍼럴 코드 체크 시작");

    const url = window.location.href;
    const parts = url.split("/");
    const lastPart = parts[parts.length - 1];

    // 1) 미리 정의된 라우트 목록에 속하면 레퍼럴 코드가 아님
    if (knownRoutes.includes(lastPart)) {
      console.log(`[AppInitializer] "${lastPart}"는 knownRoutes에 있음 -> 레퍼럴 코드 아님`);
      return;
    }

    // 2) 정규식으로 검사(패턴에 맞으면 코드로 저장)
    if (referralPattern.test(lastPart)) {
      console.log(`[AppInitializer] "${lastPart}"는 레퍼럴 코드 패턴에 부합 -> localStorage에 저장`);
      localStorage.setItem("referralCode", lastPart);
    } else {
      console.log(`[AppInitializer] "${lastPart}"는 레퍼럴 코드가 아님`);
    }
  }, []);

  // ----------------------------------------------------------------
  // 토큰(우리 서버용 Access Token) 처리 & 사용자 검증
  // ----------------------------------------------------------------
  const handleTokenFlow = async () => {
    console.log("[AppInitializer] handleTokenFlow() 시작");

    // 1) 우리 서버용 accessToken 확인
    const accessToken = localStorage.getItem("accessToken");
    console.log("[AppInitializer] 현재 localStorage의 accessToken:", accessToken);

    // 2) 서버용 토큰이 없으면 -> LIFF 로그인 여부 확인
    if (!accessToken) {
      console.log("[AppInitializer] 서버용 토큰이 없음 -> 라인 로그인 여부 확인");

      // if (!liff.isLoggedIn()) {
      //   console.log("[AppInitializer] liff.isLoggedIn() = false -> liff.login() 호출");
      //   liff.login();
      //   return;
      // }

      // 이미 LIFF 로그인되어 있으면 lineToken 추출
      const lineToken = liff.getAccessToken();
      console.log("[AppInitializer] liff.isLoggedIn() = true, lineToken:", lineToken);

      if (!lineToken) {
        // 사용자가 로그인 플로우를 취소했거나 브라우저 쿠키 문제로 실패했을 수 있음
        console.log("[AppInitializer] lineToken 없음 -> 자동로그인 실패 또는 사용자가 취소한 상황 추정");
        // 필요하다면 여기서 재로그인 유도 가능 (UI에서 '다시 로그인' 버튼 등)
        liff.login();
        return;
      }

      // lineToken이 있다면 -> userAuthenticationWithServer()로 서버에 인증 요청
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
    } 

    // 3) 서버용 토큰이 이미 있는 경우 -> 곧바로 사용자 정보 가져오기
    else {
      console.log("[AppInitializer] 서버용 토큰이 있음 -> getUserInfo() 시도");
      await getUserInfo();
    }
  };

  // ----------------------------------------------------------------
  // 에러 핸들링
  // ----------------------------------------------------------------
  const handleError = (error: any, navigate: (path: string) => void) => {
    console.error("[AppInitializer] 앱 초기화 중 오류:", error);

    // 서버에서 500을 던지면 '캐릭터 미선택' 상황으로 간주
    if (error.response?.status === 500) {
      console.error("[AppInitializer] 500 오류 -> /choose-character 이동");
      navigate("/choose-character");
    } else {
      console.error("[AppInitializer] 그 외 오류 -> 라인 로그아웃 후 handleTokenFlow() 재시도");
      localStorage.removeItem("accessToken");
      liff.logout();
      handleTokenFlow();
    }
  };

  // ----------------------------------------------------------------
  // 초기화 Effect
  // ----------------------------------------------------------------
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

        // 1) LIFF 초기화 (외부 브라우저 자동 로그인 활성화)
        await liff.init({
          liffId: import.meta.env.VITE_LIFF_ID,
          withLoginOnExternalBrowser: true,
        });
        console.log("[AppInitializer] LIFF 초기화 완료");

        // 2) 언어 설정
        const userLanguage = liff.getLanguage();
        const languageMap: { [key: string]: string } = {
          "en-US": "en",
          "ja-JP": "ja",
          "zh-TW": "zh",
          "th-TH": "th",
          "ko-KR": "ko",
        };
        const i18nLanguage = languageMap[userLanguage] || "en";
        i18n.changeLanguage(i18nLanguage);
        console.log(`[AppInitializer] 언어 설정 완료 -> ${userLanguage} -> ${i18nLanguage}`);

        // 3) 서버 Access Token 및 자동 로그인 결과 확인
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

  // 스플래시 화면
  if (showSplash) {
    return <SplashScreen />;
  }

  return null;
};

export default AppInitializer;
