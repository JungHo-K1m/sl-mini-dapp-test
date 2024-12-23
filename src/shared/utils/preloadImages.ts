// src/shared/utils/preloadImages.ts

/**
 * 주어진 이미지 URL 배열을 모두 로딩 완료한 뒤 resolve를 호출합니다.
 */
export const preloadImages = async (imageUrls: string[]): Promise<void> => {
    const loaders = imageUrls.map(
      (url) =>
        new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.src = url;
          img.onload = () => resolve();
          img.onerror = () => reject(new Error(`Failed to load image ${url}`));
        })
    );
  
    // 모든 이미지가 로딩될 때까지 대기
    await Promise.all(loaders);
  };
  