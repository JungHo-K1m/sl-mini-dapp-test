import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import Images from "@/shared/assets/images"; // 이미지 객체 import

interface UserState {
  email: string;
  userLv: number;
  characterImage: string;
  slToken: number;
  setEmail: (email: string) => void;
  setUserLv: (level: number) => void;
  setCharacterImage: (image: string) => void;
  setSlToken: (token: number) => void;
  clearUserData: () => void;
}

const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        email: "hi",
        userLv: 1,
        characterImage: Images.CatLv19to20, // 기본 이미지 경로 설정
        slToken: 100,
        setEmail: (email) => set({ email }),
        setUserLv: (level) => set({ userLv: level }),
        setCharacterImage: (image) => set({ characterImage: image }),
        setSlToken: (token) => set({slToken: token}),
        clearUserData: () =>
          set({
            email: "",
            userLv: 1,
            characterImage: Images.CatLv1to2, // 초기화 시 기본값으로 설정
          }),
      }),
      { name: "user-storage" }
    )
  )
);

export default useUserStore;
