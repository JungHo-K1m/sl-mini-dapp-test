import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Images from "@/shared/assets/images";
import DappPortalSDK from "@linenext/dapp-portal-sdk";
import registerKaiaWallet from "@/entities/Asset/api/registerKaiaWallet";
import { kaiaGetBalance, KaiaRpcResponse } from "@/entities/Asset/api/getKaiaBalance";

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

  const [balance, setBalance] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

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


      const kaiaRegist = await registerKaiaWallet("0xE7173731309E07da77DA0452179212B9Ea7DBfd7");

      const response: KaiaRpcResponse<string> = await kaiaGetBalance(
        '0xE7173731309E07da77DA0452179212B9Ea7DBfd7'
      );
      if (response.error) {
        setError(response.error.message);
      } else if (response.result) {
        setBalance(response.result);
        console.log("잔고: ", response.result);
      }
      if(kaiaRegist){
        navigate("/dice-event");
      } else {
        console.error("에러 발생");
        alert("지갑 연결 중 오류가 발생했습니다. 다시 시도해주세요.");
      };
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
            className="relative w-[342px] h-[56px]"
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
