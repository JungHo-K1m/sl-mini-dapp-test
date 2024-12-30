import React, { useState } from "react";
import axios from "axios";

const WalletConnect: React.FC = () => {
  const [account, setAccount] = useState<string | null>(null);

  const connectWallet = async () => {
    try {
      const clientId = import.meta.env.VITE_LINE_CLIENT_ID || "";
      console.log("사용 중인 clientId:", clientId);

      // 직접 요청 보내기
      const response = await axios.post(
        "https://wallet.dappportal.io/api/v1/request-session/request",
        {}, // 요청 본문
        {
          headers: {
            "x-client-id": clientId, // 헤더에 clientId 추가
          },
        }
      );

      setAccount(response.data.accounts[0]); // 연결된 계정 설정
      console.log("지갑 연결 성공:", response.data.accounts[0]);
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
