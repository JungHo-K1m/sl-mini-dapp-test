// src/components/SplashScreen.tsx
import React from 'react';

const SplashScreen: React.FC = () => {
  return (
    <div style={styles.container}>
      <img src="/splash.png" alt="Splash Screen" style={styles.image} />
    </div>
  );
};

const styles = {
  container: {
    position: 'fixed' as 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#ffffff', // 필요에 따라 배경색 변경
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as 'cover',
  },
};

export default SplashScreen;
