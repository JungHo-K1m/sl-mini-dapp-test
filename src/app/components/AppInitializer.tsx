import React, { useEffect, useRef, useState } from "react";
import liff from "@line/liff";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/entities/User/model/userModel";
import { useCookies } from "react-cookie"; 
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
  const [cookies] = useCookies(["refreshToken"]); 

  // 쿠키에서 특정 쿠키값 가져오기
  const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(";").shift() || null;
    }
    return null;
  };

  // 토큰이 있을 때, 사용자 정보 가져오기
  const getUserInfo = async () =>{
    try {
      await fetchUserData();
      console.log("사용자 데이터 정상적으로 가져옴. 주사위 게임 페이지로 이동");
      navigate("/dice-event");
    } catch (error: any) {
      if (error.response?.status === 500) {
        console.error("500 오류: 캐릭터가 선택되지 않음. 캐릭터 선택 페이지로 이동");
        navigate("/choose-character");
        return;
      }
      throw error; // 기타 오류는 상위에서 처리
    }
  }

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
          withLoginOnExternalBrowser: true,  // 외부 브라우저에서도 자동 로그인 실행
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
  
        // 액세스 토큰 존재 여부 확인
        let accessToken = localStorage.getItem("accessToken");
  
        if (accessToken) {
          // 액세스 토큰이 존재하는 경우, 사용자 정보 가져오기 api 사용
          await getUserInfo();
        } else {
          // 액세스 토큰이 존재하지 않는 경우, 리프레시 토큰 확인
          // const refreshToken = getCookie("refreshToken");
          const refreshToken = cookies.refreshToken;
          if (refreshToken) {
            // 리프레시 토큰이 존재하는 경우
            console.log("refresh Token: ", refreshToken);
            try {
              // 액세스 토큰 재발급 및 로컬 스토리지 저장
              const refreshSuccessful = await useUserStore.getState().refreshToken();
              if (refreshSuccessful) {
                console.log("액세스 토큰 갱신 성공");
                await getUserInfo();
              } else {
                console.error("리프레시 토큰 갱신 실패");
                throw new Error("리프레시 토큰 갱신 실패");
              }
            } catch (error) {
              handleError(error, navigate);
            }
          } else {
            // 리프레시 토큰도 존재하지 않는 경우
            if (!liff.isLoggedIn()) {
              // 라인 로그인 진행
              console.log("사용자가 로그인되지 않음. 라인 로그인 진행.");
              liff.login();
              return;
            }
  
            // 라인 액세스 토큰 발급
            const lineToken = liff.getAccessToken();
            if (!lineToken) throw new Error("라인 Access Token을 가져오지 못했습니다.");
  
            // 사용자 검증 진행
            const isInitial = await userAuthenticationWithServer(lineToken);
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
        }
      } catch (error) {
        handleError(error, navigate);
      } finally {
        setShowSplash(false);
        onInitialized();
      }
    };
  
    initializeApp();
  }, [cookies.refreshToken, fetchUserData, navigate, onInitialized]);
  
  
  
  if (showSplash) {
    return <SplashScreen />;
  }

  return null;
};

export default AppInitializer;
