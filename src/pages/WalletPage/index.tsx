import Images from '@/shared/assets/images';
import { FaChevronLeft } from "react-icons/fa";
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineCheck } from 'react-icons/hi';
import { useTranslation } from "react-i18next";
import './WalletPage.css';
import getWallets from '@/entities/Asset/api/getWalletList';

interface TruncateMiddleProps {
  text: string;
  maxLength: number;
  className?: string;
}

// 주소 중간 생략
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

interface Wallet {
  id: number;
  market: string;   // 거래소 이름
  address: string;  // 지갑 주소
  network: string;  // 사용 네트워크 ex) ERC-20 등
  imgSrc: string;
  // isDefault: boolean;
}

const WalletPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // 거래소의 표시 이름을 관리하는 객체
  const DisplayNameList: Record<string, string> = {
    ICP: 'ICP',
    BINANCE: 'BINANCE', // 오타 수정 ('BINACE' → 'BINANCE')
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

  // 거래소별 로고 이미지 목록
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
    ONE_INCH: Images.OneInchLogo,
    BITGET: Images.bitget_logo,
    KRAKEN: Images.kraken_logo,
    GATE_IO: Images.gate_io_logo
  };

  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [selectedWalletId, setSelectedWalletId] = useState<number | null>(null);

  const selectedWallet = wallets.find(wallet => wallet.id === selectedWalletId);
  const registeredMarkets = wallets.map(wallet => wallet.market);

  // API 호출로 지갑 목록 불러오기
  useEffect(() => {
    const fetchWallets = async () => {
      try {
        const walletData = await getWallets();
  
        // walletData가 배열인지 확인
        if (Array.isArray(walletData)) {
          const formattedWallets = walletData.map((wallet: any, index: number) => ({
            id: index + 1,
            market: wallet.market,
            address: wallet.address,
            network: wallet.network,
            imgSrc: Imagelist[wallet.market] || '', // 없는 거래소는 기본값
          }));
          setWallets(formattedWallets);
        } else {
          console.error('Invalid wallet data:', walletData);
          setWallets([]); // 데이터가 배열이 아닌 경우 빈 배열로 초기화
        }
      } catch (error) {
        console.error("Error fetching wallets:", error);
        setWallets([]); // API 호출 실패 시에도 빈 배열로 초기화
      }
    };
  
    fetchWallets();
  }, []);
  

  // 지갑 등록 페이지 이동 + 등록한 지갑의 거래소 목록 전달
  const handleNavigateToWalletList = () => {
    navigate('/wallet-list', { state: { registeredMarkets } });
  };

  // "기본 지갑으로 설정" 버튼 클릭 시 실행되는 함수
  // const handleSetAsDefault = () => {
  //   if (selectedWallet && !selectedWallet.isDefault) {
  //     setWallets(wallets.map(wallet => ({
  //       ...wallet,
  //       isDefault: wallet.id === selectedWallet.id,
  //     })));
  //   }
  // };

  // "삭제" 버튼 클릭 시 실행되는 함수
  const handleDeleteWallet = () => {
    if (selectedWallet) {
      setWallets(wallets.filter(wallet => wallet.id !== selectedWallet.id));
      setSelectedWalletId(null);
    }
  };

  return (
    <div className="flex flex-col text-white mb-32 mx-6 min-h-screen">
      <div className="flex items-center w-full mt-3 mb-8 relative">
        {/* 뒤로가기 버튼 */}
        <FaChevronLeft
          className="text-xl cursor-pointer"
          onClick={() => navigate("/my-assets")}
          aria-label="뒤로가기"
        />
        <h1 className="text-xl font-bold flex-grow text-center">{t("wallet_page.wallet")}</h1>
        <div className="w-5"></div>
      </div>
      <div>
        <h2 className="text-lg font-semibold">{t("wallet_page.wallet_section")}</h2>
        <p className="text-[#a3a3a3] text-sm">{t("wallet_page.wallet_notice")}</p>
        <div className="mt-12">
          {/* 지갑 목록 */}
          <div className="h-[345px] space-y-2 overflow-y-auto">
            {wallets.map((wallet) => (
              <div
                key={wallet.id}
                className={`flex flex-row rounded-2xl px-5 justify-between items-center h-16 border-2 ${
                  wallet.id === selectedWalletId ? 'border-[#0147e5] bg-[#2a2a3d]' : 'border-[#737373] bg-[#1f1e27]'
                } cursor-pointer`}
                onClick={() => setSelectedWalletId(wallet.id)}
              >
                <div className="flex flex-row items-center gap-3">
                  {wallet.imgSrc && <img src={wallet.imgSrc} className="w-6 h-6" alt={`${wallet.market} logo`} />}
                  <div className="flex flex-col text-sm">
                    <p className="text-[#a3a3a3]">{DisplayNameList[wallet.market] || wallet.market}</p>
                    <TruncateMiddle text={wallet.address} maxLength={20} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* 버튼 */}
          <div className="flex flex-col gap-3 font-medium mt-4">
            <button
              className="flex flex-row rounded-3xl h-14 border-2 border-[#142964] box-border w-full items-center justify-center"
              onClick={handleNavigateToWalletList}
            >
              {t("wallet_page.connect_new")}
            </button>
            <button
              className={`border-2 border-[#dd2726] text-[#dd2726] rounded-3xl h-14 w-full box-border ${
                !selectedWallet ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={!selectedWallet}
              onClick={handleDeleteWallet}
            >
              {t("wallet_page.delete")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
