import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Images from "@/shared/assets/images";
import DappPortalSDK from "@linenext/dapp-portal-sdk";

// 간단한 모바일 체크 함수 (정교함은 상황에 따라 보완 가능)
const checkIsMobile = (): boolean => {
  return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

const ConnectWalletPage: React.FC = () => {
  const navigate = useNavigate();

  // 0. 페이지 접근 시 모바일/웹 체크
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [showConnectButton, setShowConnectButton] = useState<boolean>(true);

  useEffect(() => {
    // 페이지 진입 시 1회만 체크
    setIsMobile(checkIsMobile());
  }, []);

  const handleConnectWallet = async () => {
    try {
      console.log("DappPortal SDK 초기화 시작");

      // 1) SDK 초기화
      const sdk = await DappPortalSDK.init({
        clientId: import.meta.env.VITE_LINE_CLIENT_ID || "",
      });
      const walletProvider = sdk.getWalletProvider();
      
      if(isMobile){
        console.log("모바일 접근입니다.");
      } else {
        console.log("외부 접근입니다.");
      }

      // 2) 먼저 계정 요청(사용자에게 지갑 선택 UI가 뜸)
      //    이 로직을 통해 사용자가 실제로 Web/Extension/Mobile 지갑 등을 선택하게 됩니다.
    //   const accounts = (await walletProvider.request({
    //     method: "kaia_requestAccounts",
    //   })) as string[];

    //   // 지갑 선택이 끝난 후, walletType이 갱신됨
    //   const walletType = walletProvider.getWalletType() || null;
    //   console.log("사용자가 선택한 지갑 타입:", walletType);

    //   // 3) 환경과 walletType 간의 조건 불일치 시 예외 처리
    //   if (!isMobile && walletType === "Mobile") {
    //     alert(
    //       "현재 PC 웹 브라우저 환경에서 '모바일 지갑'은 연결할 수 없습니다.\n모바일 환경에서 다시 시도해주세요."
    //     );
    //     // 필요시 로컬 스토리지 key 제거
    //     localStorage.removeItem("sdk.dappportal.io:1001:walletType");
    //     return;
    //   }

    //   // 4) 문제없으면 연결 성공
    //   console.log("지갑 연결 성공:", accounts[0]);
      // setAccount(accounts[0]); // 필요 시 상태 저장

      // 5) 다음 페이지 이동
      navigate("/dice-event");
    } catch (error: any) {
      console.error("에러 발생:", error.message);
      console.error("에러 응답:", error.response?.data || "응답 없음");
      alert("지갑 연결 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div
      className="relative w-full h-screen flex flex-col justify-center items-center bg-cover bg-center"
      style={{
        backgroundImage: `url(${Images.SplashBackground})`,
      }}
    >
      {showConnectButton ? (
        <>
          {/* 애니메이션 로고 */}
          <motion.img
            src={Images.SplashTitle}
            alt="Lucky Dice Logo"
            className="w-[272px] mb-[90px]"
            initial={{ y: 80 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />

          {/* 애니메이션 버튼 */}
          <motion.button
            onClick={handleConnectWallet}
            className="relative w-[340px] h-[150px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeInOut", delay: 0.4 }}
          >
            <img
              src={Images.ConnectButton}
              alt="Wallet Icon"
            />
          </motion.button>
        </>
      ) : (
        // 기본 UI
        <img
          src={Images.SplashTitle}
          alt="Lucky Dice Logo"
          className="w-[272px] mb-[90px]"
        />
      )}
    </div>
  );
};

export default ConnectWalletPage;
