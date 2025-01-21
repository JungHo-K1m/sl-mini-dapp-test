// src/entities/User/api/saveSoundSetting.ts
import api from "@/shared/api/axiosInstance";

// 사운드 설정 정보를 담을 타입 (필요에 따라 조정)
export interface SoundSettingData {
  masterVolume: number;
  masterMute: boolean;
  backVolume: number;
  backMute: boolean;
  effectVolume: number;
  effectMute: boolean;
}

async function saveSoundSetting(soundData: SoundSettingData): Promise<boolean> {
  try {
    // 실제 API 호출
    const response = await api.post("/setting/bgm", soundData);

    // 백엔드에서 code === 'OK' && data가 있으면 성공 처리
    if (response.data.code === "OK") {
      if (response.data.data !== null) {
        console.log("사운드 설정 저장 성공:", response.data);
        return true;
      } else {
        console.warn("사운드 설정 저장 실패 (data = null):", response.data);
        return false;
      }
    } else {
      // 백엔드에서 code가 OK가 아닌 경우
      console.warn(`Unexpected response code: ${response.data.code}`);
      throw new Error(
        response.data.message ||
          `Unexpected response code: ${response.data.code}`
      );
    }
  } catch (error: any) {
    console.error("Error storing result:", error);
    throw error; // 상위에서 처리하도록 에러 재발생
  }
}

export default saveSoundSetting;
