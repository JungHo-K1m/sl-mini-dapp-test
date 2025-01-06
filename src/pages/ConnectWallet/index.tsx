import React from "react";
import { useNavigate } from "react-router-dom";
import Images from "@/shared/assets/images";

const ConnectWalletPage: React.FC = () => {
  const navigate = useNavigate();

  // 예시: 클릭 시 지갑 연결 로직(혹은 다른 함수) 실행 후, 게임 페이지로 이동
  const handleConnectWallet = async () => {
    try {
      console.log("지갑 연결 로직 실행...");
      // 여기에 실제 지갑 연결 로직을 추가하세요.
      // 예: await someWalletConnectFunction();

      // 연결 후 이동할 페이지(/dice-event) 등으로 navigate
      navigate("/dice-event");
    } catch (error) {
      console.error("지갑 연결 실패:", error);
    }
  };

  return (
    <div
      className="relative w-full h-screen flex flex-col items-center bg-cover bg-center"
      style={{
        backgroundImage: `url(${Images.SplashBackground})`,
      }}
    >
      {/* 로고 */}
      <img
        src={Images.SplashTitle}
        alt="Lucky Dice Logo"
        className="w-[272px] mb-[90px] mt-[120px]"
      />

      {/* 메인 버튼 박스 */}
      <button
        onClick={handleConnectWallet}
        className="relative w-[340px] h-[150px]"
      >
        {/* 버튼 배경(아이콘) */}
        <img
          src={Images.ConnectButton}
          alt="Wallet Icon"
        />
      </button>
    </div>
  );
};

export default ConnectWalletPage;
