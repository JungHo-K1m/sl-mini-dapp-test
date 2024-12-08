import React from 'react';
import Images from '@/shared/assets/images';
import {formatNumber} from '@/shared/utils/formatNumber';
import {useNavigate} from 'react-router-dom';
import { useNavigationStore } from '@/shared/store/navigationStore';

interface MonthlyPrizeProps {
  month: number;
  prizeType: string;
  amount: number;
}

const MonthlyPrize: React.FC<MonthlyPrizeProps> = ({
  month,
  prizeType,
  amount, //개수가 아닌 금액상당의 토큰
}) => {
  const navigate = useNavigate();
  const setSelected = useNavigationStore((state) => state.setSelected);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleRankingClick = () => {
    setSelected('/reward');
    if (window.location.pathname !== '/reward') {
      navigate('/reward');
    }
  };

  return (
    <div  onClick={handleRankingClick} className="flex flex-col items-center justify-center w-48 h-36 md:w-96 md:h-44 relative prize-box overflow-visible z-10 gap-2">
      <div className="absolute h-7 w-20 rounded-full border border-black bg-white flex items-center justify-center text-xs -top-4 z-20 font-medium box-border left-14 md:left-36 inset-2">
     {monthNames[month - 1]}
      </div>
      <img src={Images.PrizeImage} alt="token logo" className=" h-14 mt-2" />
      <div className="flex flex-col items-center">
        <p className=" font-semibold text-base">{prizeType}</p>
        <p className=" text-xs font-normal">(Approx. ${formatNumber(amount)})</p>
      </div>
    </div>
  );
};

export default MonthlyPrize;
