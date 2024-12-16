import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import InstallPrompt from "./components/InstallPrompt";
import DiceEvent from "@/pages/DiceEvent";
import WalletPage from "@/pages/WalletPage";
import MissionPage from "@/pages/MissionPage";
import Reward from "@/pages/RewardPage";
import DiceEventLayout from "./layout/DiceEventLayout";
import InviteFriends from "@/pages/InviteFriends";

// added pages
import AIMenu from "@/pages/AIMenu";
import AIXrayAnalysis from "@/pages/AIXrayAnalysis";
import PetRegister from "@/pages/PetRegister";
import SelectPet from "@/pages/SelectPet";
import EditPet from "@/pages/EditPet";
import DiagnosisRecords from "@/pages/DiagnosisList";
import DiagnosisDetail from "@/pages/DiagnosisDetail";
import SplashScreen from "./components/SplashScreen";
import SelectCharacterPage from "@/pages/SelectCharacter";
import PreviousRewards from "@/pages/PreviousRewards";
import FirstRewardPage from "@/pages/FirstReward";
import RewardHistory from "@/pages/RewardHistory";
import MyAssets from "@/pages/MyAssets";
import MyNfts from "@/pages/MyNFTs";
import WalletList from "@/pages/WalletList";
import { TourProvider } from "@reactour/tour";
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import { useUserStore } from "@/entities/User/model/userModel";

// VERCEL 프로젝트에서 가져온 AppInitializer (위치에 맞게 수정)
import AppInitializer from "./components/AppInitializer";

const queryClient = new QueryClient();

const steps = [
  {
    selector: "#first-step",
    content: (
      <div className="text-sm">
        <strong>Roll Dice Button:</strong> Click this button to roll the dice.
      </div>
    ),
    stepInteraction: false,
  },
  {
    selector: "#second-step",
    content: (
      <div className="text-sm">
        <strong>Dice Gauge:</strong> Press and hold the button to move the gauge bar, covering six sections (1–6).<div style={{ marginBottom: "1rem" }}></div>
        Rolling the dice within the gauge range gives a <strong>50% chance</strong> to trigger the <strong>Lucky Dice effect</strong> and display the corresponding number.
      </div>
    ),
    stepInteraction: false,
  },
  {
    selector: "#third-step",
    content: (
      <div className="text-sm">
        <strong>Dice Refill:</strong> Once all dice are used, the text changes to <em>'Refill Dice.'</em> Click it to refill your dice.<div style={{ marginBottom: "1rem" }}></div>
        After refilling, you can receive new dice again after <strong>1 hour</strong>.<div style={{ marginBottom: "1rem" }}></div>
        When the refill time is over, the text changes to <em>'Waiting.'</em> If you have no dice left, it reverts to <em>'Refill Dice.'</em>
      </div>
    ),
    stepInteraction: false,
  },
  {
    selector: "#fourth-step",
    content: (
      <div className="text-sm">
        <strong>NFT Dashboard:</strong> Displays the <strong>number of NFTs</strong> you own.<div style={{ marginBottom: "1rem" }}></div>
        Click it to view the <strong>effects</strong> of your owned NFTs.
      </div>
    ),
    stepInteraction: false,
  },
  {
    selector: "#fifth-step",
    content: (
      <div className="text-sm">
        <strong>Auto Function:</strong> If you own an <strong>Auto NFT</strong>, the dice will roll automatically.<div style={{ marginBottom: "1rem" }}></div>
        When the refill time arrives, the dice will also be refilled and rolled automatically.<div style={{ marginBottom: "1rem" }}></div>
        This function only works while you are on the <strong>Game section</strong> and does not apply to actions on <em>Rock-Paper-Scissors</em>, <em>Spin</em>, or <em>Anywhere tiles</em>.
      </div>
    ),
    stepInteraction: false,
  },
];

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false); // AppInitializer 사용을 위한 상태
  const {completeTutorialFunc} = useUserStore();
  const disableBody = (target:any) => disableBodyScroll(target)
  const enableBody = (target:any) => enableBodyScroll(target)

  useEffect(() => {
    // 스플래시 화면을 일정 시간 후에 숨김
    const splashTimeout = setTimeout(() => {
      setShowSplash(false);
    }, 1500);

    return () => {
      clearTimeout(splashTimeout);
    };
  }, []);

  useEffect(() => {
    const preventContextMenu = (e: { preventDefault: () => void }) => {
      e.preventDefault();
    };

    document.addEventListener("contextmenu", preventContextMenu);

    return () => {
      document.removeEventListener("contextmenu", preventContextMenu);
    };
  }, []);

  const renderDiceEventLayout = (
    path: string,
    component: React.ReactNode,
    hidden = false
  ) => (
    <Route
      path={path}
      element={<DiceEventLayout hidden={hidden}>{component}</DiceEventLayout>}
    />
  );

  // 초기화 전이면 AppInitializer 표시
  if (!isInitialized) {
    return <AppInitializer onInitialized={() => setIsInitialized(true)} />;
  }

  // 초기화 완료 후 Splash 화면 로직
  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TourProvider
        steps={steps}    
        afterOpen={disableBody} beforeClose={enableBody}
        onClickMask={async({ setCurrentStep, currentStep, steps, setIsOpen })  => {
          if (steps) {
            if (currentStep === steps.length - 1) {
              await completeTutorialFunc();
              setIsOpen(false);
           
            }
            setCurrentStep((s) => (s === steps.length - 1 ? 0 : s + 1));
          }
        }}
        onClickClose={ async({ setIsOpen }) => {
          await completeTutorialFunc();
          setIsOpen(false);
        }}
        styles={{
          popover: (base) => ({
            ...base,
            "--reactour-accent": "#0147E5",
            borderRadius: 10,
          }),
          maskArea: (base) => ({ ...base, rx: 10, margin: 30 }),
          badge: (base) => ({ ...base, left: "auto", right: "-0.8125em" }),
          close: (base) => ({ ...base, right: "auto", left: 8, top: 8 }),
        }}
      >
        <Router>
          <div>
            <Routes>

              {/* DiceEventLayout Pages */}
              {renderDiceEventLayout("/dice-event", <DiceEvent />)}
              {renderDiceEventLayout("/mission", <MissionPage />)}
              {renderDiceEventLayout("/AI-menu", <AIMenu/>)}
              {renderDiceEventLayout("/reward", <Reward />)}
              {renderDiceEventLayout("/invite-friends", <InviteFriends />)}
              {renderDiceEventLayout("/my-assets", <MyAssets/>)}
              {renderDiceEventLayout("/wallet", <WalletPage />)}
              {renderDiceEventLayout("/wallet-list", <WalletList />)}
              {renderDiceEventLayout("/previous-rewards", <PreviousRewards />)}

              {/* Hidden Pages */}
              {renderDiceEventLayout("/choose-character", <SelectCharacterPage />, true)}
              {renderDiceEventLayout("/regist-pet", <PetRegister />, true)}
              {renderDiceEventLayout("/select-pet", <SelectPet />, true)}
              {renderDiceEventLayout("/edit-pet", <EditPet />, true)}
              {renderDiceEventLayout("/diagnosis-list", <DiagnosisRecords />, true)}
              {renderDiceEventLayout("/diagnosis-detail", <DiagnosisDetail />, true)}
              {renderDiceEventLayout("/ai-xray-analysis", <AIXrayAnalysis />, true)}
              {renderDiceEventLayout("/my-nfts", <MyNfts />, true)}
              {renderDiceEventLayout("/reward-history", <RewardHistory />, true)}
              {renderDiceEventLayout("/first-reward", <FirstRewardPage />, true)}
            </Routes>
          </div>
        </Router>
      </TourProvider>
    </QueryClientProvider>
  );
};

export default App;
