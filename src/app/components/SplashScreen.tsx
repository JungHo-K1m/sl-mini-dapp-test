// src/components/SplashScreen.tsx
import React from 'react';

const SplashScreen: React.FC = () => {
  return (
    <div className="w-full h-screen bg-[#0D1226]">
      <img
        src="/splash.png"
        alt="Splash Screen"
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default SplashScreen;
