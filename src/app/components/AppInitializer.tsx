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

  useEffect(() => {
    const initializeApp = async () => {
      if (initializedRef.current) return;
      initializedRef.current = true;

      try {
        // LIFF 초기화
        await liff.init({ liffId: import.meta.env.VITE_LIFF_ID });

        // 언어 설정
        const userLanguage = liff.getLanguage();
        const languageMap: { [key: string]: string } = {
          "ko-KR": "ko",
          "en-US": "en",
          "ja-JP": "ja",
          "zh-TW": "zh",
        };
        const i18nLanguage = languageMap[userLanguage] || "en";
        i18n.changeLanguage(i18nLanguage);

        const accessToken = localStorage.getItem("accessToken");
        console.log("로컬 액세스 토큰 확인: ", accessToken);

        if (accessToken) {
          // 토큰이 존재하면 사용자 데이터 가져오기
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
        } else {
          // 토큰이 없는 경우 라인 로그인 진행
          if (!liff.isLoggedIn()) {
            liff.login();
            return;
          }

          const idToken = liff.getIDToken();
          if (!idToken) throw new Error("ID 토큰을 가져오지 못했습니다.");

          console.log("라인 ID Token 확인 : ", idToken);

          // 신규/기존 사용자 확인
          try {
            const isInitial = await userAuthenticationWithServer(idToken);

            if (isInitial === undefined) {
              throw new Error("사용자 인증에 실패했습니다.");
            } else if (isInitial === true) {
              console.log("신규 사용자: 캐릭터 선택 페이지로 이동");
              navigate("/choose-character");
              return;
            } else {
              // 기존 사용자
              console.log("기존 사용자: 사용자 데이터 확인 중...");
              await fetchUserData();
              navigate("/dice-event");
            }
          } catch (error: any) {
            if (error.response?.status === 500) {
              console.error("500 오류: 캐릭터가 선택되지 않음. 캐릭터 선택 페이지로 이동");
              navigate("/choose-character");
              return;
            }
            throw error;
          }
        }
      } catch (error) {
        console.error("앱 초기화 중 오류:", error);
        // 기존 토큰 제거
        localStorage.removeItem("accessToken");
        // LIFF 로그아웃
        console.log("라인 로그 아웃 진행");
        liff.logout();
        // 페이지 새로고침하여 재인증 유도
        window.location.reload();
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
