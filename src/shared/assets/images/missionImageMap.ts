// src/shared/assets/images/missionImageMap.ts

import Images from './index';

const missionImageMap: { [key: string]: { imageKey: keyof typeof Images; className: string } } = {
  'Follow on X': { imageKey: 'Twitter', className: 'follow-on-x-mission-card' },
  'Join Telegram': { imageKey: 'Telegram', className: 'join-telegram-mission-card' },
  'Subscribe to Email': { imageKey: 'Email', className: 'subscribe-to-email-mission-card' },
  'Follow on LinkedIn': { imageKey: 'LinkedIn', className: 'follow-on-linkedin-mission-card' },
  // 필요한 만큼 추가적인 미션과 이미지 매핑을 추가하세요.
};

export default missionImageMap;
