import React, { useState, useEffect, useMemo } from "react";
import { IoChevronBackOutline } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSound } from "@/shared/provider/SoundProvider";
import Audios from "@/shared/assets/audio";
import Images from "@/shared/assets/images";
import DappPortalSDK from "@linenext/dapp-portal-sdk";
import paymentSession from "@/entities/Asset/api/payment";
import getItemInfo from "@/entities/Asset/api/getItemInfo";
import { getPaymentStatus, PaymentStatusResponse } from "@/entities/Asset/api/getPaymentStatus";
import { kaiaGetBalance, KaiaRpcResponse } from "@/entities/Asset/api/getKaiaBalance";
import { HiX } from "react-icons/hi";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui";
import { BigNumber, ethers } from "ethers";
import LoadingSpinner from "@/shared/components/ui/loadingSpinner";
import { v4 as uuidv4 } from "uuid";

const ItemStore: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { playSfx } = useSound();

  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [finish, setFinish] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [needWallet, setNeedWallet] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState("");
  // selectedItem를 아이템의 itemId (number)로 관리합니다.
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [agreeRefund, setAgreeRefund] = useState(false);
  const [agreeEncrypted, setAgreeEncrypted] = useState(false);
  const [balance, setBalance] = useState<string>("");
  const [account, setAccount] = useState("");
  // location.state로 전달된 값이 있다면 초기값으로 설정
  const balanceFromState = location.state?.balance || null;
  const walletAddressFromState = location.state?.walletAccount || null;
  const [itemData, setItemData] = useState<any[]>([]);
  const [paymentId, setPaymentId] = useState<string | null>(null);

  // USD(STRIPE) 결제 진행 시 시작 시간을 기록합니다.
  const [paymentStartTime, setPaymentStartTime] = useState<number | null>(null);

  // 결제 버튼은 아이템 선택, 체크박스 동의, 결제 진행 중이 아닐 때 활성화됩니다.
  const isEnabled =
    selectedItem !== null && agreeRefund && agreeEncrypted && !isLoading;

  // API를 통해 아이템 데이터 조회
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const items = await getItemInfo();
        if (items) {
          console.log("아이템 정보 확인", items);
          setItemData(items);
        } else {
          console.log("아이템 정보 실패", items);
        }
      } catch (err) {
        console.error("Failed to fetch items:", err);
      }
    };
    fetchItems();
  }, []);

  // 계정(account)이 변경되면 잔액 조회 진행
  useEffect(() => {
    const fetchBalance = async () => {
      if (!account) return;
      try {
        const response: KaiaRpcResponse<string> = await kaiaGetBalance(account);
        if (response.error) {
          console.log("잔고 확인 에러: ", response.error);
        } else if (response.result) {
          const KAIA_DECIMALS = 18;
          const balanceBigNumber = BigNumber.from(response.result);
          const formattedBalance = ethers.utils.formatUnits(
            balanceBigNumber,
            KAIA_DECIMALS
          );
          setBalance(Number(formattedBalance).toFixed(2));
        }
      } catch (err) {
        console.error("Failed to fetch balance:", err);
      }
    };
    fetchBalance();
  }, [account]);

  // location.state에 walletAddress가 있다면 account에 설정, 없으면 지갑 연결 안내 표시
  useEffect(() => {
    if (walletAddressFromState) {
      setAccount(walletAddressFromState);
    } else {
      setNeedWallet(true);
    }
  }, [walletAddressFromState]);

  // 결제 상태 폴링
  useEffect(() => {
    if (!paymentId) return;

    let isPollingActive = true;

    const pollPaymentStatus = async () => {
      if (!isPollingActive) return;
      try {
        const statusResponse: PaymentStatusResponse = await getPaymentStatus(paymentId);
        console.log("Polling payment status:", statusResponse);

        if (statusResponse.status === "FINALIZED") {
          setPaymentMessage("결제가 성공적으로 완료되었습니다.");
          setIsLoading(false);
          setFinish(true);
          setIsSuccess(true);
          setPaymentId(null);
          return; // polling 종료
        } else if (
          statusResponse.status === "CANCELED" ||
          statusResponse.status === "CONFIRM_FAILED"
        ) {
          setPaymentMessage("결제에 실패하였습니다.");
          setIsLoading(false);
          setFinish(true);
          setIsSuccess(false);
          setPaymentId(null);
          return; // polling 종료
        }
      } catch (error) {
        console.error("Error polling payment status:", error);
      }
      // 1초 후 다음 폴링 호출
      if (isPollingActive) {
        setTimeout(pollPaymentStatus, 1000);
      }
    };

    pollPaymentStatus();

    return () => {
      // 컴포넌트 언마운트 시 또는 paymentId가 변경될 때 폴링 중단
      isPollingActive = false;
    };
  }, [paymentId]);


  // 뒤로가기 버튼
  const handleBackClick = () => {
    playSfx(Audios.button_click);
    navigate(-1);
  };

  // 아이템 선택 (itemId를 selectedItem에 저장)
  const handleSelectItem = (itemId: number) => {
    playSfx(Audios.button_click);
    setSelectedItem(itemId);
  };

  // 결제 로직 진행
  const handleCheckout = async (
    paymentMethod: "STRIPE" | "CRYPTO",
    sdkOptions = {}
  ) => {
    if (!account) {
      setNeedWallet(true);
      return;
    }
    playSfx(Audios.button_click);
    setIsLoading(true);
    try {
      // UUID 생성 후 idempotencyKey에 저장
      const key = uuidv4();
      console.log("결제 중복 방지 uuid: ", key);

      const sdk = await DappPortalSDK.init({
        clientId: import.meta.env.VITE_LINE_CLIENT_ID || "",
        ...sdkOptions,
      });

      // STRIPE 결제의 경우 startPayment 전에 시작 시간 기록
      if (paymentMethod === "STRIPE") {
        setPaymentStartTime(Date.now());
      }

      // selectedItem는 itemId로 관리되므로 그대로 사용합니다.
      const response = await paymentSession(
        selectedItem as number,
        paymentMethod,
        account,
        key
      );
      if (response) {
        console.log("결제 진행 payment id :", response.id);
        const walletProvider = sdk.getWalletProvider();
        await walletProvider.request({ method: "kaia_requestAccounts" });
        const paymentProvider = sdk.getPaymentProvider();
        await paymentProvider.startPayment(response.id);
        setPaymentId(response.id);
      }
    } catch (error: any) {
      console.error(`${paymentMethod} 결제 진행 중 오류 발생:`, error);
      
      if (paymentMethod === "STRIPE") {
        if (error.code === -32001) {
          setPaymentMessage("Purchase Cancled.");
        } else if (error.code === -32002) {
          setPaymentMessage("Purchase Failed.");
        } else if (error.code === -3200) {
          setPaymentMessage("Insufficient Balance.");
        } else if (error.message && error.message.includes("SDK's startPayment")) {
          setPaymentMessage("Purchase Failed.");
        } else if (error.message && error.message.includes("expiration")) {
          setPaymentMessage("Purchase Cancled.");
        } else if(paymentStartTime){
          const elapsedSeconds = (Date.now() - paymentStartTime) / 1000;
          if (elapsedSeconds >= 580 && elapsedSeconds < 2280) {
            // Case.2 : startPayment 실행 후 사용자가 승인하지 않아 취소된 경우
            setPaymentMessage("Purchase Canceled (Expired approval).");
          } else if (elapsedSeconds >= 2280) {
            // Case.1 : create API는 호스팅되었으나 startPayment가 실행되지 않은 경우
            setPaymentMessage("Purchase Canceled (Payment not executed).");
          } else {
            setPaymentMessage("Purchase Canceled.");
          }
        } else {
          setPaymentMessage("Please try again later.");
        }
      } else { // CRYPTO 결제 처리
        if (error.code === -32001) {
          setPaymentMessage("Purchase Cancled.");
        } else if (error.code === -32002) {
          setPaymentMessage("Purchase Failed.");
        } else if (error.code === -3200) {
          setPaymentMessage("Insufficient Balance.");
        } else {
          setPaymentMessage("Please try again later.");
        }
      }
      setIsSuccess(false);
      setFinish(true);
      setPaymentId(null);
      setIsLoading(false);
    }
  };

  // USD 결제 선택
  const handleUSDCheckout = async () => {
    await handleCheckout("STRIPE", { chainId: "1001" });
  };

  // KAIA 결제 선택
  const handleKaiaCheckout = async () => {
    await handleCheckout("CRYPTO", { chainId: "1001" });
  };

  // 아이템 정보 모달 표시
  const handleInfo = () => {
    playSfx(Audios.button_click);
    setShowModal(true);
  };

  // 지갑 연결 및 잔액 조회
  const handleConnectWallet = async () => {
    playSfx(Audios.button_click);
    setNeedWallet(false);
    const sdk = await DappPortalSDK.init({
      clientId: import.meta.env.VITE_LINE_CLIENT_ID || "",
      chainId: "1001",
    });
    const walletProvider = sdk.getWalletProvider();
    const accounts = (await walletProvider.request({
      method: "kaia_requestAccounts",
    })) as string[];
    if (accounts.length === 0) return;
    const walletAddr = accounts[0];
    setAccount(walletAddr);

    try {
      const response: KaiaRpcResponse<string> = await kaiaGetBalance(walletAddr);
      if (response.error) {
        console.log("잔고 확인 에러: ", response.error);
      } else if (response.result) {
        const KAIA_DECIMALS = 18;
        const balanceBigNumber = BigNumber.from(response.result);
        const formattedBalance = ethers.utils.formatUnits(
          balanceBigNumber,
          KAIA_DECIMALS
        );
        setBalance(Number(formattedBalance).toFixed(2));
      }
    } catch (err: any) {
      console.error("Failed to fetch balance:", err);
    }
  };

  // 선택된 아이템 정보 조회 (selectedItem의 itemId와 매칭)
  const selectedItemInfo = useMemo(() => {
    if (selectedItem === null || itemData.length === 0) return null;
    return itemData.find((item) => item.itemId === selectedItem);
  }, [selectedItem, itemData]);

  // 결제 내역 조회
  const handlePaymentHistory = async () => {
    playSfx(Audios.button_click);
    const sdk = await DappPortalSDK.init({
      clientId: import.meta.env.VITE_LINE_CLIENT_ID || "",
      chainId: "1001",
    });
    const paymentProvider = sdk.getPaymentProvider();
    await paymentProvider.openPaymentHistory();
  };

  // 아이템별 배경색 결정 함수
  const getBackgroundGradient = (itemName: string) => {
    const name = itemName.toUpperCase();
    if (name === "AUTO") {
      return "linear-gradient(180deg, #0147E5 0%, #FFFFFF 100%)";
    } else if (name === "REWARD") {
      return "linear-gradient(180deg, #FF4F4F 0%, #FFFFFF 100%)";
    } else {
      return "linear-gradient(180deg, #22C55E 0%, #FFFFFF 100%)";
    }
  };

  return (
    isLoading ? (
      <LoadingSpinner className="h-screen" />
    ) : (
      <div className="flex flex-col items-center text-white px-6 min-h-screen">
        {/* 상단 영역 */}
        <div className="h-14 flex items-center w-full font-bold text-xl mb-4 justify-between">
          <IoChevronBackOutline
            className="w-6 h-6 cursor-pointer"
            onClick={handleBackClick}
          />
          <p>{t("asset_page.item_store")}</p>
          <img
            src={Images.Receipt}
            className="w-6 h-6 cursor-pointer"
            onClick={handlePaymentHistory}
          />
        </div>

        {/* 아이템 목록 (2열 그리드) */}
        <div className="grid grid-cols-2 gap-4 mt-4 w-full mb-40">
          {itemData.map((item) => (
            <div
              key={item.itemId}
              className={`bg-[#1F1E27] border-2 p-[10px] rounded-xl flex flex-col items-center ${
                selectedItem === item.itemId ? "border-blue-400" : "border-[#737373]"
              }`}
              onClick={() => handleSelectItem(item.itemId)}
            >
              <div
                className="relative w-full aspect-[145/102] rounded-md mt-1 mx-1 overflow-hidden flex items-center justify-center"
                style={{ background: getBackgroundGradient(item.itemName) }}
              >
                <img
                  src={item.itemUrl}
                  alt={item.itemName}
                  className="w-[80px] h-[80px] object-cover"
                />
                <img
                  src={Images.infoMark}
                  alt="info"
                  className="absolute top-1 right-1 w-5 h-5"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedItem(item.itemId);
                    handleInfo();
                  }}
                />
              </div>
              <p className="mt-2 text-sm font-semibold">{item.itemName}</p>
            </div>
          ))}
        </div>

        {/* 체크박스 및 결제 버튼 영역 */}
        <div className="fixed bottom-0 px-6">
          <div className="flex flex-col gap-3 mb-5">
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={agreeRefund}
                onChange={() => {
                  playSfx(Audios.button_click);
                  setAgreeRefund(!agreeRefund);
                }}
              />
              <span className="text-xs font-medium">
                {t("asset_page.agree_non_refundable")}
                <a
                  href="https://docs.dappportal.io/mini-dapp/mini-dapp-sdk/payment-provider/policy/refund"
                  className="text-xs font-semibold text-[#3B82F6] ml-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("asset_page.learn_more")}
                </a>
              </span>
            </label>
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={agreeEncrypted}
                onChange={() => {
                  playSfx(Audios.button_click);
                  setAgreeEncrypted(!agreeEncrypted);
                }}
              />
              <span className="text-xs font-medium">
                {t("asset_page.provide_encrypted_id")}
                <a
                  href="https://www.lycorp.co.jp/en/company/privacypolicy/"
                  className="text-xs font-semibold text-[#3B82F6] ml-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("asset_page.learn_more")}
                </a>
              </span>
            </label>
          </div>

          <div className="mb-3 flex justify-center items-center">
            <span className="text-sm text-[#A3A3A3]">Available Balance :</span>
            <span className="text-sm text-white ml-1">
              {balance || balanceFromState} KAIA
            </span>
          </div>

          <div className="flex w-full gap-3 mb-5">
            <button
              disabled={!isEnabled}
              onClick={handleKaiaCheckout}
              className={
                isEnabled
                  ? "w-1/2 bg-[#0147E5] px-6 py-3 rounded-full text-base font-medium"
                  : "w-1/2 bg-[#555] px-6 py-3 rounded-full text-base font-medium text-white"
              }
            >
              {selectedItemInfo
                ? `${selectedItemInfo.kaiaPrice} KAIA`
                : "KAIA"}
            </button>
            <button
              disabled={!isEnabled}
              onClick={handleUSDCheckout}
              className={
                isEnabled
                  ? "w-1/2 border-2 border-[#0147E5] text-white px-6 py-3 rounded-full text-base font-medium"
                  : "w-1/2 border-2 border-[#555] text-[#555] px-6 py-3 rounded-full text-base font-medium"
              }
            >
              {selectedItemInfo
                ? `USD $${selectedItemInfo.usdPrice}`
                : "USD"}
            </button>
          </div>
        </div>

        {/* 아이템 설명 모달창 */}
        <AlertDialog open={showModal}>
          <AlertDialogContent className="rounded-3xl bg-[#21212F] text-white border-none">
            <AlertDialogHeader>
              <AlertDialogDescription className="sr-only">
                Item details
              </AlertDialogDescription>
              <AlertDialogTitle className="text-center font-bold text-xl">
                <div className="flex flex-row items-center justify-between">
                  <div>&nbsp;</div>
                  <p>{selectedItemInfo?.itemName}</p>
                  <HiX
                    className="w-6 h-6 cursor-pointer"
                    onClick={() => {
                      playSfx(Audios.button_click);
                      setShowModal(false);
                    }}
                  />
                </div>
              </AlertDialogTitle>
            </AlertDialogHeader>
            <div className="flex flex-col items-center justify-center">
              <div
                className="relative w-full aspect-[145/102] rounded-md mt-1 mx-1 overflow-hidden flex items-center justify-center"
                style={{
                  background: selectedItemInfo
                    ? getBackgroundGradient(selectedItemInfo.itemName)
                    : "linear-gradient(180deg, #AAAAAA 0%, #FFFFFF 100%)",
                }}
              >
                <img
                  src={selectedItemInfo?.itemUrl}
                  alt={selectedItemInfo?.itemName}
                  className="w-[80px] h-[80px] object-cover"
                />
              </div>
              <div className="mt-6 text-lg font-semibold">
                <p>{selectedItemInfo?.itemName}</p>
              </div>
              <div className="mt-1 text-base font-normal">
                <p>{selectedItemInfo?.description}</p>
              </div>
            </div>
          </AlertDialogContent>
        </AlertDialog>

        {/* 결제 결과(성공/실패) 안내 모달창 */}
        <AlertDialog open={finish}>
          <AlertDialogContent className="rounded-3xl bg-[#21212F] text-white border-none">
            <AlertDialogHeader>
              <AlertDialogDescription className="sr-only">
                Payment result
              </AlertDialogDescription>
              <AlertDialogTitle className="text-center font-bold text-xl"></AlertDialogTitle>
            </AlertDialogHeader>
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-full rounded-full mt-12 mx-1 overflow-hidden flex items-center justify-center">
                <img
                  src={isSuccess ? Images.success : Images.failed}
                  alt={isSuccess ? "success" : "failed"}
                  className="w-[50px] h-[50px] object-cover"
                />
              </div>
              <p className="mt-5 text-xl font-semibold">{paymentMessage}</p>
              <div className="mt-10">
                <button
                  onClick={() => {
                    playSfx(Audios.button_click);
                    setFinish(false);
                    navigate("/my-assets")
                  }}
                  className="w-[165px] h-14 rounded-full bg-[#0147E5] text-white text-base font-medium"
                >
                  {isSuccess ? "Continue" : "Close"}
                </button>
              </div>
            </div>
          </AlertDialogContent>
        </AlertDialog>

        {/* 지갑 연결 안내 모달창 */}
        <AlertDialog open={needWallet}>
          <AlertDialogContent className="rounded-3xl bg-[#21212F] text-white border-none">
            <AlertDialogHeader>
              <AlertDialogDescription className="sr-only">
                Wallet Connection
              </AlertDialogDescription>
              <AlertDialogTitle className="text-center font-bold text-xl"></AlertDialogTitle>
            </AlertDialogHeader>
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <p className="text-sm font-semibold mt-4">
                You need to connect Wallet to check your balance.
              </p>
              <img
                src={Images.ConnectButton}
                className="relative w-[342px] h-[56px] object-fill"
                onClick={handleConnectWallet}
                alt="Wallet Icon"
              />
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    )
  );
};

export default ItemStore;
