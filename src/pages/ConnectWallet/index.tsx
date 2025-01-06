import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // framer-motion import
import Images from "@/shared/assets/images";
import DappPortalSDK from "@linenext/dapp-portal-sdk";
import checkWallet from "@/entities/Asset/api/checkWalet";

const ConnectWalletPage: React.FC = () => {
    const navigate = useNavigate();
    const [account, setAccount] = useState<string | null>(null);
    const [showConnectButton, setShowConnectButton] = useState(false);

    const handleConnectWallet = async () => {
        try {
            console.log("초기화 시작");

            // const sdk = await DappPortalSDK.init({
            //     clientId: import.meta.env.VITE_LINE_CLIENT_ID || "",
            //     chainId: "8217", // Klaytn 메인넷
            // });

            // const walletProvider = sdk.getWalletProvider();
            // const accounts = (await walletProvider.request({
            //     method: "kaia_requestAccounts",
            // })) as string[];

            // setAccount(accounts[0]);
            // console.log("지갑 연결 성공:", accounts[0]);
            navigate("/dice-event");
        } catch (error: any) {
            console.error("에러 발생:", error.message);
            console.error("에러 응답:", error.response?.data || "응답 없음");
        }
    };

    const getWalletInfo = async () => {
        try {
            const response = await checkWallet();
            if (response === "Success") {
                navigate("/dice-event");
            } else if (response === "You do not have a registered wallet.") {
                setShowConnectButton(true); // 버튼 표시
            } else {
                console.error("Unexpected walletCheck response:", response);
            }
        } catch (error: any) {
            console.error("getWalletInfo 에러:", error.message);
        }
    };

    useEffect(() => {
        getWalletInfo();
    }, []);

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
                        initial={{ y: 80 }} // 초기 위치
                        animate={{ y: 0 }} // 애니메이션 후 위치
                        transition={{ duration: 0.8, ease: "easeInOut" }} // 애니메이션 시간 및 이징 설정
                    />

                    {/* 애니메이션 버튼 */}
                    <motion.button
                        onClick={handleConnectWallet}
                        className="relative w-[340px] h-[150px]"
                        initial={{ opacity: 0 }} // 초기 투명도
                        animate={{ opacity: 1 }} // 애니메이션 후 투명도
                        transition={{ duration: 0.8, ease: "easeInOut", delay: 0.4 }} // 딜레이 추가
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
