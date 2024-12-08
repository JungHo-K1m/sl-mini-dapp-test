import React from 'react';

const UserLevel: React.FC<{
  userLv: number;
  charactorImageSrc: string;
}> = ({ userLv, charactorImageSrc }) => {
  // 사용자 레벨에 따른 클래스명 및 메인 컬러 결정
  let levelClassName = '';
  let mainColor = '';

  if (userLv >= 1 && userLv <= 4) {
    levelClassName = 'lv1to4-box';
    mainColor = '#dd2726';
  } else if (userLv >= 5 && userLv <= 8) {
    levelClassName = 'lv5to8-box';
    mainColor = '#f59e0b';
  } else if (userLv >= 9 && userLv <= 12) {
    levelClassName = 'lv9to12-box';
    mainColor = '#facc15';
  } else if (userLv >= 13 && userLv <= 16) {
    levelClassName = 'lv13to16-box';
    mainColor = '#22c55e';
  } else if (userLv >= 17 && userLv <= 20) {
    levelClassName = 'lv17to20-box';
    mainColor = '#0147e5';
  }

  return (
    <div
      className={`flex flex-col items-center justify-center rounded-3xl w-32 h-36 md:w-48 md:h-44 ${levelClassName}`}
    >
      <img
        src={charactorImageSrc}
        className="w-24 h-24 md:w-32 md:h-32"
        alt={`Character Level ${userLv}`}
      />
      <div className="flex flex-row items-center w-full px-4 gap-2">
        <p className="font-semibold text-[8px] md:text-xs">Lv.{userLv}</p>
        <div className="flex flex-row border border-[#F59E0B] rounded-full w-full h-2 gap-[0.5px]">
          {/* 레벨 진행 바 */}
          {[...Array(20)].map((_, i) => {
            let barColor = '';
            if (i < 4) {
              barColor = '#DD2726';
            } else if (i < 8) {
              barColor = '#F59E0B';
            } else if (i < 12) {
              barColor = '#FACC15';
            } else if (i < 16) {
              barColor = '#22C55E';
            } else {
              barColor = '#0147E5';
            }
            return (
              <div
                key={i}
                className={`w-[5%] ${
                  i === 0 ? 'rounded-l-full' : ''
                } ${i === 19 ? 'rounded-r-full' : ''}`}
                style={{
                  backgroundColor: barColor,
                  display: userLv > i ? 'block' : 'none',
                }}
              ></div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UserLevel;
