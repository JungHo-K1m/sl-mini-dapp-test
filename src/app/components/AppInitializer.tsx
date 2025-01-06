import React, { useEffect, useRef, useState } from "react";
import liff from "@line/liff";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/entities/User/model/userModel";
import userAuthenticationWithServer from "@/entities/User/api/userAuthentication";
import i18n from "@/shared/lib/il8n";
import SplashScreen from "./SplashScreen";

// 필요하다면 별도의 에러 페이지를 만들어도 됩니다.
const ErrorScreen: React.FC<{ message: string }> = ({ message }) => (
  <div style={{ padding: 20 }}>
    <h2>에러가 발생했습니다</h2>
    <p>{message}</p>
    <p>계속 문제가 발생하면 고객센터로 문의해주세요.</p>
  </div>
);

interface AppInitializerProps {
  onInitialized: () => void;
}

const AppInitializer: React.FC<AppInitializerProps> = ({ onInitialized }) => {
  const navigate = useNavigate();
  const { fetchUserData } = useUserStore();
  const [showSplash, setShowSplash] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); 
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

  // 사용자 정보 가져오기
  const getUserInfo = async () => {
    await fetchUserData(); 
    console.log("사용자 데이터 정상적으로 가져옴. 주사위 게임 페이지로 이동");
    navigate("/dice-event");
  };

  // URL에서 마지막 파트(예: /AAAA1234)가 레퍼럴 코드인지 식별
  useEffect(() => {
    const url = window.location.href;
    const parts = url.split("/");
    const lastPart = parts[parts.length - 1];

    if (knownRoutes.includes(lastPart)) {
      console.log("기존 라우트로 인식. 레퍼럴 코드가 아님:", lastPart);
      return;
    }

    if (referralPattern.test(lastPart)) {
      console.log("레퍼럴 코드로 인식:", lastPart);
      localStorage.setItem("referralCode", lastPart);
    } else {
      console.log("레퍼럴 코드 포맷이 아님:", lastPart);
    }
  }, []);

  /**
   * 액세스 토큰 확인 → 필요시 재발급 → 없으면 Line 로그인 → etc
   */
  const handleTokenFlow = async () => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      console.log("액세스 토큰이 없음. 액세스 토큰 재발급 시도...");
      try {
        const refreshSuccessful = await useUserStore.getState().refreshToken();
        if (refreshSuccessful) {
          console.log("액세스 토큰 재발급 성공");
          await getUserInfo();
          return;
        } else {
          console.error("액세스 토큰 재발급 실패");
          throw new Error("TOKEN_REFRESH_FAILED");
        }
      } catch (error) {
        console.error("재발급 실패, LINE 로그인 진행...");

        // (1) 라인 인앱 브라우저인지 체크: 아닐 경우 에러로 처리할 수도 있음
        if (!liff.isInClient()) {
          // 예: Line 브라우저가 아닌데 로그인 시도 → 동작 불가
          throw new Error("LINE_CLIENT_REQUIRED");
        }

        // (2) 실제 로그인
        if (!liff.isLoggedIn()) {
          console.log("사용자가 로그인되지 않음. 라인 로그인 진행.");
          liff.login(); // 이 시점에서 LINE 로그인 창으로 이동 (Line 브라우저 내)
          return;
        }

        // (3) liff.getAccessToken()으로 라인 액세스 토큰 가져오기
        const lineToken = liff.getAccessToken();
        if (!lineToken) {
          throw new Error("LINE_TOKEN_NOT_FOUND");
        }

        // (4) 서버 회원가입 or 인증
        const isInitial = await userAuthenticationWithServer(lineToken);
        console.log("사용자 검증 진행");

        if (isInitial === undefined) {
          throw new Error("USER_AUTH_FAILED"); 
        } else if (isInitial === true) {
          console.log("신규 사용자: 이용약관 동의 페이지로 이동");
          navigate("/policy-agreement");
          return;
        } else {
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

  /**
   * 에러 처리 로직
   * - 상황에 따라 logout+reload 대신, 사용자에게 안내하거나 에러 페이지로 보냄
   */
  const handleError = (error: any) => {
    console.error("앱 초기화 중 오류:", error);

    // 예: 서버에서 500이 떨어지면 캐릭터 미선택 상황
    if (error.response?.status === 500) {
      console.error("500 오류: 캐릭터가 선택되지 않음. 캐릭터 선택 페이지로 이동");
      navigate("/choose-character");
      return;
    }

    // 예: Line 브라우저 필수지만, 아닌 경우
    if (error.message === "LINE_CLIENT_REQUIRED") {
      setErrorMessage("이 앱은 LINE 인앱 브라우저에서만 실행 가능합니다.");
      return; 
    }

    // 예: 토큰 재발급 실패 등 치명적 에러
    if (error.message === "TOKEN_REFRESH_FAILED") {
      // 정말 복구가 불가능하다고 판단되면 이때만 로그아웃
      console.log("[치명적 오류] 재발급 실패. 로그아웃 후 안내 페이지로 이동합니다.", error);
      localStorage.removeItem("accessToken");
      // liff.logout();
      // 일반적으로는 reload 대신 "로그인이 필요합니다" 등의 안내 페이지로 이동
      // navigate("/error-page");
      return;
    }

    // 그 외 일반적인 에러
    console.log("일반 에러: 에러 메시지 표시 후 흐름 중단", error);
    setErrorMessage("예기치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
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

        // 토큰 흐름 진행
        await handleTokenFlow();
      } catch (error) {
        // 에러 처리 (재시도 무한 루프 방지)
        handleError(error);
      } finally {
        setShowSplash(false);
        onInitialized();
      }
    };

    initializeApp();
  }, [fetchUserData, navigate, onInitialized]);

  // Splash 화면(로딩)
  if (showSplash) {
    return <SplashScreen />;
  }

  // 에러 메시지가 세팅되었다면 간단한 에러 화면 렌더링
  if (errorMessage) {
    return <ErrorScreen message={errorMessage} />;
  }

  // 정상인 경우 children 또는 null 반환
  return null;
};

export default AppInitializer;
