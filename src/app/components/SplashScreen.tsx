// src/components/SplashScreen.tsx
import React from 'react';
import Images from '@/shared/assets/images';

const SplashScreen: React.FC = () => {
  return (
    <div
      className="relative w-full h-screen flex flex-col justify-center items-center bg-cover bg-center"
      style={{
          backgroundImage: `url(${Images.SplashBackground})`,
      }}
    >
      <img
        src={Images.SplashTitle}
        alt="Lucky Dice Logo"
        className="w-[272px] mb-[90px]"
      />
    </div>
  );
};

export default SplashScreen;
