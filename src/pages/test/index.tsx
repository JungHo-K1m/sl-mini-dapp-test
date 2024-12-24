import React, { useState } from "react";
import DappPortalSDK from "@linenext/dapp-portal-sdk"; // Default export로 SDK 가져오기

const WalletConnect: React.FC = () => {
  const [account, setAccount] = useState<string | null>(null);

  const connectWallet = async () => {
    try {
      // SDK 초기화
      const sdk = await DappPortalSDK.init({
        clientId: process.env.VITE_LINE_CLIENT_ID || "", // 환경 변수에서 clientId 읽기
      });

      // WalletProvider 가져오기
      const walletProvider = sdk.getWalletProvider();
      console.log("walletProvider 가져오기: ",walletProvider);

      // 지갑 연결 요청
      const accounts = (await walletProvider.request({
        method: "kaia_requestAccounts", // Wallet 연결 요청
      })) as string[]; // 반환 값을 string 배열로 단언

      setAccount(accounts[0]); // 첫 번째 계정 저장
      console.log("지갑 연결 성공:", accounts[0]);
    } catch (error) {
      console.error("지갑 연결 실패 또는 clientId 오류:", error);
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
