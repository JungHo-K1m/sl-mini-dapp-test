// src/shared/assets/images/missionImageMap.ts

import Images from "./index";

const missionImageMap: { [key: string]: { imageKey: keyof typeof Images; className: string } } = {
  follow_on_x: { imageKey: "Twitter", className: "follow-on-x-mission-card" },
  join_telegram: { imageKey: "Telegram", className: "join-telegram-mission-card" },
  subscribe_to_email: { imageKey: "Email", className: "subscribe-to-email-mission-card" },
  join_the_sl_discord: { imageKey: "Discord", className: "join-discord-mission-card" },
  leave_a_supportive_comment_on_sl_x: { imageKey: "LargeTwitter", className: "comment-on-x-mission-card" },
};

export default missionImageMap;
