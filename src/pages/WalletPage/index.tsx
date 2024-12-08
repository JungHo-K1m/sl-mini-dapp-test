import Images from '@/shared/assets/images';
import { FaChevronLeft } from "react-icons/fa";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineCheck } from 'react-icons/hi';
import { useTranslation } from "react-i18next";
import './WalletPage.css';

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

interface Wallet {
  id: number;
  network: string;
  address: string;
  imgSrc: string;
  isDefault: boolean;
}

const WalletPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // 더미 데이터로 지갑 목록 설정
  const [wallets, setWallets] = useState<Wallet[]>([
    {
      id: 1,
      network: 'ICP',
      address: '0xaec93f4a5c1234567890abcdef8885',
      imgSrc: Images.IcpLogo,
      isDefault: false,
    },
    {
      id: 2,
      network: 'BINANCE',
      address: '0xbec93f4a5c1234567890abcdef7775',
      imgSrc: Images.BinanceLogo,
      isDefault: true,
    },
    // 필요한 만큼 지갑 추가
  ]);

  // 선택된 지갑의 ID를 저장하는 상태
  const [selectedWalletId, setSelectedWalletId] = useState<number | null>(null);

  // 선택된 지갑 객체
  const selectedWallet = wallets.find(wallet => wallet.id === selectedWalletId);

  const registeredNetworks = wallets.map(wallet => wallet.network);

  // 지갑 등록 페이지 이동 + 등록한 지갑의 네트워크 목록 전달
  const handleNavigateToWalletList = () => {
    navigate('/wallet-list', { state: { registeredNetworks } });
};


  // "기본 지갑으로 설정" 버튼 클릭 시 실행되는 함수
  const handleSetAsDefault = () => {
    if (selectedWallet && !selectedWallet.isDefault) {
      setWallets(wallets.map(wallet => ({
        ...wallet,
        isDefault: wallet.id === selectedWallet.id,
      })));
    }
  };

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
          onClick={() => navigate(-1)}
        />
        <h1 className="text-xl font-bold flex-grow text-center">{t("wallet_page.wallet")}</h1>
        <div className="w-5"></div>
      </div>
      <div>
        <h2 className="text-lg font-semibold">{t("wallet_page.wallet_section")}</h2>
        <p className="text-[#a3a3a3] text-sm">
          {t("wallet_page.wallet_notice")}
        </p>
        <div className="mt-12">
          {/* 지갑 목록 표시 */}
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
                  <img src={wallet.imgSrc} className="w-6 h-6" alt={`${wallet.network} logo`} />
                  <div className="flex flex-col text-sm">
                    <p className="text-[#a3a3a3]">{wallet.network}</p>
                    <TruncateMiddle text={wallet.address} maxLength={20} />
                  </div>
                </div>
                {/* 기본 지갑 설정 시 main 표시 */}
                {wallet.isDefault && (
                  <button className="flex flex-row gap-1 rounded-full bg-[#0147e5] h-7 w-16 items-center justify-center text-xs font-medium">
                    Main <HiOutlineCheck className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* 버튼 영역 */}
          <div className="flex flex-col gap-3 font-medium mt-4">
            {/* 지갑 등록 페이지 이동 */}
            <button 
              className="flex flex-row rounded-3xl h-14 border-2 border-[#142964] box-border w-full items-center justify-center"
              onClick={handleNavigateToWalletList}
              >
              {t("wallet_page.connect_new")}
            </button>
            <div className="flex flex-row gap-3">
              {/* 기본 지갑 설정 버튼 - 추후 수정 필요*/}
              <button
                className={`bg-[#0147E5] rounded-3xl h-14 w-2/3 ${
                  !selectedWallet || selectedWallet.isDefault ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={!selectedWallet || selectedWallet.isDefault}
                onClick={handleSetAsDefault}
                >
                {t("wallet_page.set_default")}
              </button>
              {/* 지갑 삭제 버튼 - 추후 수정 필요*/}
              <button
                className={`border-2 border-[#dd2726] text-[#dd2726] rounded-3xl h-14 w-1/3 box-border ${
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
    </div>
  );
};

export default WalletPage;
