import React from 'react';
import Images from '@/shared/assets/images';
import { formatNumber } from '@/shared/utils/formatNumber';
import { useUserStore } from '@/entities/User/model/userModel'; // useUserStore 임포트
import CountUp from 'react-countup'; // CountUp 임포트

interface MyRankingWidgetProps {
  className?: string;
}

const MyRankingWidget: React.FC<MyRankingWidgetProps> = ({className}) => {  
  // useUserStore에서 필요한 데이터 가져오기
  const { rank, starPoints, lotteryCount, slToken } = useUserStore();

  return (
    <div
      className={`flex flex-col items-center justify-center text-white cursor-pointer w-full ${className}  `}
      role="button"
      tabIndex={0}
    >
      <h1 className="font-jalnan text-3xl ">My Rank</h1>
      <div className="bg-box mt-4 px-8 w-full h-24 md:h-32 flex font-semibold ">
        {/* My Rank 섹션 */}
        <div className="w-[121px] h-full flex flex-col items-center justify-center gap-2">
          <p className="text-base font-semibold">My Rank</p>
          <p className="text-2xl text-[#fde047] font-jalnan">
            <CountUp 
              start={0} 
              end={rank} 
              duration={1} 
              separator="," 
            />
          </p>
        </div>
        
        {/* 구분선 */}
        <div className="w-[1px] h-full flex items-center justify-center mx-6">
          <div className="bg-white h-16 w-full"></div>
        </div>
        
        {/* 스타, 추첨권, SL 토큰 섹션 */}
        <div className="w-full h-full flex flex-row items-center justify-around text-xs">
          {/* 스타 포인트 */}
          <div className="flex flex-col items-center justify-center gap-2">
            <img src={Images.Star} alt="star" className="w-6 h-6" />
            <p>
              <CountUp 
                start={0} 
                end={starPoints} 
                duration={1} 
                separator="," 
              />
            </p>
          </div>
          
          {/* 추첨권 */}
          <div className="flex flex-col items-center justify-center gap-2">
            <img
              src={Images.LotteryTicket}
              alt="lottery-ticket"
              className="w-6 h-6"
            />
            <p>
              <CountUp 
                start={0} 
                end={lotteryCount} 
                duration={1} 
                separator="," 
              />
            </p>
          </div>
          
          {/* SL 토큰 */}
          <div className="flex flex-col items-center justify-center gap-2">
            <img
              src={Images.TokenReward}
              alt="RankingSLToken"
              className="w-6 h-6"
            />
            <p>
              <CountUp 
                start={0} 
                end={slToken} 
                duration={1} 
                separator="," 
                preserveValue={true}
              />
            </p>
          </div>
        </div>
      </div>
      
      {/* 설명 텍스트 */}
      <p className="flex items-start justify-start w-full font-medium text-xs md:text-sm mt-2 px-2">
        * Rankings are based on Star Points
      </p>
    </div>
  );
};

export default MyRankingWidget;
