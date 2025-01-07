import React, { useState } from "react";
import DappPortalSDK from "@linenext/dapp-portal-sdk"; // Default export로 SDK 가져오기

const WalletConnect: React.FC = () => {
  const [account, setAccount] = useState<string | null>(null);

  const connectWallet = async () => {
    try {
      console.log("초기화 시작");

      // SDK 초기화
      const sdk = await DappPortalSDK.init({
        clientId: import.meta.env.VITE_LINE_CLIENT_ID || "", // 환경 변수에서 clientId 가져오기
        // chainId: "1001", // 테스트 체인 ID
        chainId: "8217", // Klaytn 메인넷
      });

      // console.log("clientId 확인:", import.meta.env.VITE_LINE_CLIENT_ID);
      // console.log("SDK 초기화 완료:", sdk);

      // WalletProvider 가져오기
      const walletProvider = sdk.getWalletProvider();
      console.log("WalletProvider 가져오기 성공:", walletProvider);

      // 지갑 연결 요청
      const accounts = (await walletProvider.request({
        method: "kaia_requestAccounts", // Dapp Portal 가이드에 따라 사용
      })) as string[];

      setAccount(accounts[0]);
      console.log("지갑 연결 성공:", accounts[0]);
    } catch (error: any) {
      console.error("에러 발생:", error.message);
      console.error("에러 응답:", error.response?.data || "응답 없음");
    }
  };

  return (
    <div className="flex flex-col text-white mb-32 px-6 min-h-screen">
      <button onClick={connectWallet}>지갑 연결</button>
      {account && <p>연결된 계정: {account}</p>}
    </div>
  );
};

export default WalletConnect;
