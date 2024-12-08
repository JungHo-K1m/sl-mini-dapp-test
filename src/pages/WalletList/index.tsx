import Images from '@/shared/assets/images';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui';
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HiX } from 'react-icons/hi';
import { FaChevronLeft } from "react-icons/fa";
import { AiFillQuestionCircle } from 'react-icons/ai';
import { useTranslation } from "react-i18next";
import registerWallet from '@/entities/Asset/api/registerWallet';

// SelectedWallet 인터페이스 정의
interface SelectedWallet {
  wallet: string;
  img: string;
  network: string; 
}

// 버튼 컴포넌트에서 사용할 props 인터페이스 정의
interface WalletCardProps {
  text: string;
  imgSrc: string;
  network: string; 
}

interface TruncateMiddleProps {
  text: string;
  maxLength: number;
  className?: string;
}

const TruncateMiddle: React.FC<TruncateMiddleProps> = ({
  text,
  maxLength,
  className,
}) => {
  const truncateMiddle = (str: string, maxLen: number): string => {
    if (str.length <= maxLen) return str;

    const charsToShow = maxLen - 3; // 3 characters for "..."
    const frontChars = Math.ceil(charsToShow / 2);
    const backChars = Math.floor(charsToShow / 2);

    return (
      str.substr(0, frontChars) + '...' + str.substr(str.length - backChars)
    );
  };

  const truncatedText = truncateMiddle(text, maxLength);

  return <div className={`font-semibold ${className}`}>{truncatedText}</div>;
};

const walletList: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

    // 모든 네트워크와 등록된 네트워크 정의
    const allNetworks = ['ICP', 'BINANCE', 'OKX', 'OKX_WALLET', 'BYBIT', 'HTX', 'KUCOIN', 'MEXC', 'TRUST_WALLET', 'ONE_INCH', 'BITGET', 'KRAKEN', 'GATE_IO'];
    // 거래소의 표시 이름을 관리하는 객체
    const DisplayNameList: Record<string, string> = {
        ICP: 'ICP',
        BINANCE: 'BINACE',
        OKX: 'OKX',
        OKX_WALLET: 'OKX WALLET',
        BYBIT: 'BYBIT',
        HTX: 'HTX',
        KUCOIN: 'KUCOIN',
        MEXC: 'MEXC',
        TRUST_WALLET: 'TRUST WALLET',
        ONE_INCH: '1INCH',
        BITGET: 'BITGET',
        KRAKEN: 'KRAKEN',
        GATE_IO: 'GATE.IO',
    };

    const registeredNetworks: string[] = location.state?.registeredNetworks || [];

    // 등록되지 않은 네트워크 필터링
    const availableNetworks = allNetworks.filter(
        (network) => !registeredNetworks.includes(network)
    );

    const [open, setOpen] = useState(false);
    const [walletInputOpen, setWalletInputOpen] = useState(false);
    const [tipOpen, setTipOpen] = useState(false);
    const [walletConnectSuccessOpen, setWalletConnectSuccessOpen] = useState(false);
    const [address, setAddress] = useState('');
    const [selectedWallet, setSelectedWallet] = useState<SelectedWallet>({
        wallet: '', // 초기값 설정
        img: '',
        network: '',
    });

    // 네트워크별 로고 이미지 목록
    const Imagelist: Record<string, string> = {
        ICP: Images.IcpLogo,
        BINANCE: Images.BinanceLogo,
        OKX: Images.OkxLogo,
        OKX_WALLET: Images.OkxLogo,
        BYBIT: Images.BybitLogo,
        HTX: Images.HtxLogo,
        KUCOIN: Images.KucoinLogo,
        MEXC: Images.MexcLogo,
        TRUST_WALLET: Images.TrustLogo,
        ONE_INCH : Images.OneInchLogo,
        BITGET: Images.bitget_logo,
        KRAKEN: Images.kraken_logo,
        GATE_IO: Images.gate_io_logo
    };

    // 거래소별 사이트 URL을 관리하는 객체
    const ExchangeUrls: Record<string, string> = {
        ICP: 'https://www.internetcomputer.org/',
        BINANCE: 'https://www.binance.com/',
        OKX: 'https://www.okx.com/',
        OKX_WALLET: 'https://www.okx.com/wallet',
        BYBIT: 'https://www.bybit.com/',
        HTX: 'https://www.htx.com/',
        KUCOIN: 'https://www.kucoin.com/',
        MEXC: 'https://www.mexc.com/',
        TRUST_WALLET: 'https://trustwallet.com/',
        ONE_INCH: 'https://1inch.io/',
        BITGET: 'https://www.bitget.com/',
        KRAKEN: 'https://www.kraken.com/',
        GATE_IO: 'https://www.gate.io/',
    };

    // 거래소별 사이트 URL이동 버튼 클릭 핸들러
    const handleCreateAccount = () => {
        const selectedExchangeUrl = ExchangeUrls[selectedWallet.network];
        if (selectedExchangeUrl) {
            window.open(selectedExchangeUrl, '_blank'); // 새 탭에서 열기
        } else {
            console.error('URL not found for the selected exchange');
        }
    };

    // 네트워크 선택 핸들러
    const handleOpen = (
        event: React.MouseEvent<HTMLButtonElement>,
        network: string
    ) => {
        event.preventDefault();
        setOpen(true);

        const buttonElement = event.currentTarget;
        const textElement = buttonElement.querySelector('p');
        const imgElement = buttonElement.querySelector('img');

        if (textElement && imgElement) {
            const buttonText = textElement.textContent ?? '';
            const buttonImg = imgElement.getAttribute('src') ?? '';

            setSelectedWallet({
                wallet: buttonText,
                img: buttonImg,
                network: network,
            });
        } else {
            console.error('Text or image element not found');
        }
    };

    const handleClose = () => {
     setOpen(false);
    };

    const handleWalletInputOpen = () => {
        handleClose();
        setWalletInputOpen(true);
    };

    const handleWalletInputClose = () => {
        setWalletInputOpen(false);
    };

    const handleTipOpen = () => {
        setTipOpen(true);
    };

    const handleTipClose = () => {
        setTipOpen(false);
    };

    const handleWalletConnectSuccessOpen = () => {
        handleWalletInputClose();
        setWalletConnectSuccessOpen(true);
    };

    const handleWalletConnectSuccessClose = () => {
        setWalletConnectSuccessOpen(false);
        navigate('/wallet')
    };

    // 네트워크 카드 목록
    const WalletCard: React.FC<WalletCardProps> = ({
        text,
        imgSrc,
        network,
    }) => {
        return (
            <button
                className="flex items-center gap-2 border-2 border-[#142964] h-16 rounded-3xl pl-5 md:mx-28"
                onClick={(e) => handleOpen(e, network)}
            >
                <img src={imgSrc} className="w-6 h-6" alt={`${text} logo`} />
                <p className="text-lg">{text}</p>
            </button>
        );
    };

    const handleRegisterWallet = async () => {
        if (selectedWallet.network && address) {
            try {
                const isMain = false;
                const response = await registerWallet(
                    selectedWallet.network,
                    address,
                    isMain
                );

                if (response) {
                    handleWalletConnectSuccessOpen();
                } else {
                // API 에러 처리
                }
            } catch (error) {
                // 네트워크 또는 기타 오류 처리
            }
        } else {
          // 입력 오류 처리
        }
    };

    return (
        <div className="flex flex-col text-white mb-32  mx-6 min-h-screen">
            <div className="flex items-center w-full mt-3 mb-8 relative">
                {/* 뒤로가기 버튼 */}
                <FaChevronLeft
                    className="text-xl cursor-pointer"
                    onClick={() => navigate(-1)}
                />
                <h1 className="text-xl font-bold flex-grow text-center">{t("wallet_page.wallet")}</h1>
                <div className="w-5"></div>
            </div>

            {/* 필터링된 네트워크 표시 */}
            <div className="flex flex-col gap-3">
                {availableNetworks.map((network) => (
                    <WalletCard
                        key={network}
                        text={DisplayNameList[network]} 
                        imgSrc={Imagelist[network]}
                        network={network}
                    />
                ))}
            </div>

            {/* 1번 모달창 - 지갑 선택 */}
            <AlertDialog open={open}>
                <AlertDialogContent className=" rounded-3xl bg-[#21212F] text-white border-none">
                    <AlertDialogHeader>
                        <AlertDialogTitle className=" text-center font-bold text-xl">
                            <div className="flex flex-row items-center justify-between">
                                <div> &nbsp;</div>
                                <p>{selectedWallet.wallet} {t("wallet_page.wallet")}</p>
                                <HiX className={'w-6 h-6 '} onClick={handleClose} />
                            </div>
                        </AlertDialogTitle>
                    </AlertDialogHeader>
                    <div className=" flex flex-col items-center justify-center w-full h-full gap-10">
                        <div className="mt-20  w-40 h-40 bg-gradient-to-b from-[#2660f4] to-[#3937a3] rounded-[40px]  flex items-center justify-center">
                            <div className="w-[158px] h-[158px] logo-bg rounded-[40px] flex items-center justify-center">
                                <img src={selectedWallet.img} className=" w-16 h-16" />
                            </div>
                        </div>
                        <div className="text-center space-y-2">
                            <p className=" text-xl font-semibold">
                                {t("wallet_page.wallet_question", { wallet: selectedWallet.wallet })}
                            </p>
                            <p className=" text-[#a3a3a3]">
                                {t("wallet_page.receive_reward")}
                                <br />
                                {t("wallet_page.add_wallet_address")}
                            </p>
                        </div>
                        <div className="space-y-3 w-full">
                            {/* 지갑 주소 입력 모달창 열기 버튼 */}
                            <button
                                className=" w-full h-14 rounded-full bg-[#0147e5]"
                                onClick={handleWalletInputOpen}
                                >
                                {t("wallet_page.yes")}
                            </button>
                            {/* 지갑 주소 생성 페이지로 이동 버튼 - 추후 수정 필요 */}
                            <button 
                                className=" w-full h-14 rounded-full bg-[#0D1226] border border-[#142964]"
                                onClick={handleCreateAccount}
                                >
                                {t("wallet_page.create_account")}
                            </button>
                        </div>
                    </div>
                </AlertDialogContent>
            </AlertDialog>


            {/* 2번 모달창 - 주소 입력 */}
            <AlertDialog open={walletInputOpen}>
                <AlertDialogContent className=" rounded-3xl bg-[#21212F] text-white border-none">
                    <AlertDialogHeader>
                            <AlertDialogTitle className=" text-center font-bold text-xl">
                                <div className="flex flex-row items-center justify-between">
                                    <div> &nbsp;</div>
                                    <p>{selectedWallet.wallet} {t("wallet_page.wallet")}</p>
                                    <HiX className={'w-6 h-6 '} onClick={handleWalletInputClose} />
                                </div>
                            </AlertDialogTitle>
                    </AlertDialogHeader>
                    <div className=" flex flex-col items-center justify-center w-full h-full gap-10 pt-20">
                        <div className="text-center space-y-2">
                            <p className=" text-xl font-semibold">
                                Balance {selectedWallet.wallet}
                            </p>
                            <p className=" text-[#a3a3a3]">
                                {t("wallet_page.receive_reward")}
                                <br />
                                {t("wallet_page.add_wallet_address")}
                            </p>
                        </div>
                        <div>
                            <input
                                placeholder={t("wallet_page.deposit_address")}
                                className=" w-full h-14 px-5 rounded-2xl bg-[#21212f] border-2 border-[#142964]"
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-row w-full gap-3">
                            <button
                                className="flex items-center justify-center h-14 min-w-14 border-2 border-[#142964] rounded-2xl"
                                onClick={handleTipOpen}
                            >
                                {' '}
                                <AiFillQuestionCircle className="w-6 h-6" />
                            </button>
                            <button
                                className={` w-full h-14 rounded-full bg-[#0147e5] ${
                                address === '' ? 'opacity-40' : ''
                                }`}
                                disabled={address === ''}
                                onClick={handleRegisterWallet}
                                >
                                {t("wallet_page.next")}
                            </button>
                        </div>
                    </div>
                </AlertDialogContent>
            </AlertDialog>


            {/* 3번 모달창 - 안내 사항 */}
            <AlertDialog open={tipOpen}>
                <AlertDialogContent className=" rounded-3xl bg-[#21212F] text-white border-none">
                    <AlertDialogHeader>
                        <AlertDialogTitle className=" text-center font-bold text-xl">
                            <div className="flex flex-row items-center justify-between">
                                <div> &nbsp;</div>
                                <p>{t("wallet_page.tip")}</p>
                                <HiX className={'w-6 h-6 '} onClick={handleTipClose} />
                            </div>
                        </AlertDialogTitle>
                    </AlertDialogHeader>
                    <div className=" flex flex-col items-center justify-center w-full h-full gap-3 pt-8">
                        <div className="space-y-1">
                            <div className="flex flex-row items-start text-xl font-semibold ">
                                <p> 1. &nbsp;</p>
                                <p>{t("wallet_page.find_wallet")}</p>
                            </div>
                            <p className="text-[#a3a3a3] pl-4">
                            {t("wallet_page.open_exchange")}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <div className="flex flex-row items-start text-xl font-semibold ">
                                <p> 2.&nbsp;</p>
                                <p>{t("wallet_page.copy_wallet")}</p>
                            </div>
                            <p className="text-[#a3a3a3] pl-4">
                            {t("wallet_page.evm")}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <div className="flex flex-row items-start text-xl font-semibold ">
                                <p> 3.&nbsp;</p>
                                <p>{t("wallet_page.enter_address")}</p>
                            </div>
                            <p className="text-[#a3a3a3] pl-4">
                                {t("wallet_page.receive_token")}
                            </p>
                        </div>
                    </div>
                </AlertDialogContent>
            </AlertDialog>

            {/* 4번 모달창 - 완료 안내 */}
            <AlertDialog open={walletConnectSuccessOpen}>
                <AlertDialogContent className=" rounded-3xl bg-[#21212F] text-white border-none">
                    <AlertDialogHeader>
                        <AlertDialogTitle className=" text-center font-bold text-xl">
                            <div className="flex flex-row items-center justify-between">
                                <div> &nbsp;</div>
                                <p>{selectedWallet.wallet} {t("wallet_page.wallet")}</p>
                                <HiX
                                    className={'w-6 h-6 '}
                                    onClick={handleWalletConnectSuccessClose}
                                    />
                            </div>
                        </AlertDialogTitle>
                    </AlertDialogHeader>
                    <div className=" flex flex-col items-center justify-center w-full h-full gap-3 pt-8">
                        <p className=" text-xl font-semibold">{t("wallet_page.connected")}</p>
                        <p className="text-[#a3a3a3] text-center">
                            {t("wallet_page.connection_success_prefix")}(
                            <span className="text-white">
                                <TruncateMiddle
                                    text={address}
                                    maxLength={20}
                                    className="inline font-medium"
                                    />
                            </span>
                            ){t("wallet_page.connection_success_suffix")}
                        </p>
                        <button
                            className="bg-[#0147e5] rounded-3xl  h-14 w-full font-medium mt-[200px]"
                            onClick={handleWalletConnectSuccessClose}
                            >
                            {t("wallet_page.done")}
                        </button>
                    </div>
                </AlertDialogContent>
            </AlertDialog>

            <div className=" mx-6 ">
                <p className="text-sm text-[#0D1226]">
                    Please select a defualt wallet or add a new wallet.
                </p>
            </div>
        </div>
    );
};

export default walletList;
