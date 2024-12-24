import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ScrollToTop from "./shared/components/ui/scrollTop";
import AppInitializer from "./app/components/AppInitializer";
import { TourProvider } from "@reactour/tour";
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import { useUserStore } from "@/entities/User/model/userModel";
import "./App.css";

// 페이지 컴포넌트들
import AIMenu from "@/pages/AIMenu";
import SelectCharacterPage from "./pages/SelectCharacter";
import DiceEvent from "@/pages/DiceEvent";
import WalletPage from "@/pages/WalletPage";
import MissionPage from "@/pages/MissionPage";
import Reward from "@/pages/RewardPage";
import InviteFriends from "@/pages/InviteFriends";
import SlotMachine from "@/pages/SlotMachine";
import PetRegister from "@/pages/PetRegister";
import SelectPet from "@/pages/SelectPet";
import EditPet from "@/pages/EditPet";
import DiagnosisRecords from "@/pages/DiagnosisList";
import DiagnosisDetail from "@/pages/DiagnosisDetail";
import AIXrayAnalysis from "@/pages/AIXrayAnalysis";
import DentalAnalysis from "./pages/AIDentalAnalysis";
import DiceEventLayout from "./app/layout/DiceEventLayout";
import WalletList from "./pages/WalletList";
import MyAssets from "./pages/MyAssets";
import MyNfts from "./pages/MyNFTs";
import RewardHistory from "./pages/RewardHistory";
import PreviousRewards from "@/pages/PreviousRewards";
import FirstRewardPage from "./pages/FirstReward";
import SettingsPage from "./pages/SettingsPage";
import PolicyDetailPage from "./pages/PolicyDetail";
import AgreementPage from "./pages/Agreement";
import FriendRewards from "./pages/FriendRewards";


// 튜토리얼
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
  

const App:React.FC = () =>{
  const [isInitialized, setIsInitialized] = useState(false);
  const {completeTutorialFunc} = useUserStore();
  const disableBody = (target:any) => disableBodyScroll(target)
  const enableBody = (target:any) => enableBodyScroll(target)

  useEffect(() => {
    const preventContextMenu = (e: { preventDefault: () => void }) => {
      e.preventDefault();
    };

    document.addEventListener("contextmenu", preventContextMenu);

    return () => {
      document.removeEventListener("contextmenu", preventContextMenu);
    };
  }, []);

  return (
    <>
        <ScrollToTop />
        <TourProvider
            steps={steps}
            afterOpen={disableBody} 
            beforeClose={enableBody}
            onClickMask={async ({ setCurrentStep, currentStep, steps, setIsOpen }) => {
                if (steps) {
                    if (currentStep === steps.length - 1) {
                        await completeTutorialFunc();
                        setIsOpen(false);

                    }
                    setCurrentStep((s) => (s === steps.length - 1 ? 0 : s + 1));
                }
            } }

            onClickClose={async ({ setIsOpen }) => {
                await completeTutorialFunc();
                setIsOpen(false);
            } }

            styles={{
                popover: (base) => ({
                    ...base,
                    "--reactour-accent": "#0147E5",
                    borderRadius: 10,
                }),
                maskArea: (base) => ({ ...base, rx: 10, margin: 30 }),
                // maskWrapper: (base) => ({ ...base, color: "#0147E5" }),
                badge: (base) => ({ ...base, left: "auto", right: "-0.8125em" }),
                // controls: (base) => ({ ...base, marginTop: 100 }),
                close: (base) => ({ ...base, right: "auto", left: 8, top: 8 }),
            }} >
            {!isInitialized && (
                // 앱 초기화 진행 컴포넌트 사용
                <AppInitializer onInitialized={() => setIsInitialized(true)} />
            )}
            {isInitialized && (
                <Routes>
                    {/* DiceEventLayout Pages */}
                    <Route path="/" element={<Navigate to="/dice-event" />} />
                    <Route path="/dice-event" element={<DiceEventLayout><DiceEvent /></DiceEventLayout>} />
                    <Route path="/AI-menu" element={<DiceEventLayout><AIMenu /></DiceEventLayout>} />
                    <Route path="/mission" element={<DiceEventLayout><MissionPage /></DiceEventLayout>} />
                    <Route path="/reward" element={<DiceEventLayout><Reward /></DiceEventLayout>} />
                    <Route path="/invite-friends" element={<DiceEventLayout><InviteFriends /></DiceEventLayout>} />
                    <Route path="/my-assets" element={<DiceEventLayout><MyAssets /></DiceEventLayout>} />
                    <Route path="/wallet" element={<DiceEventLayout><WalletPage /></DiceEventLayout>} />
                    <Route path="/wallet-list" element={<DiceEventLayout><WalletList /></DiceEventLayout>} />
                    <Route path="/test" element={<DiceEventLayout><SlotMachine /></DiceEventLayout>} />
                    <Route path="/previous-rewards" element={<DiceEventLayout><PreviousRewards /></DiceEventLayout>} />


                    {/* Hidden Pages */}
                    <Route path="/choose-character" element={<DiceEventLayout hidden={true}><SelectCharacterPage /></DiceEventLayout>} />
                    <Route path="/select-pet" element={<DiceEventLayout hidden={true}><SelectPet /></DiceEventLayout>} />
                    <Route path="/regist-pet" element={<DiceEventLayout hidden={true}><PetRegister /></DiceEventLayout>} />
                    <Route path="/edit-pet" element={<DiceEventLayout hidden={true}><EditPet /></DiceEventLayout>} />
                    <Route path="/diagnosis-list" element={<DiceEventLayout hidden={true}><DiagnosisRecords /></DiceEventLayout>} />
                    <Route path="/diagnosis-detail" element={<DiceEventLayout hidden={true}><DiagnosisDetail /></DiceEventLayout>} />
                    <Route path="/ai-xray-analysis" element={<DiceEventLayout hidden={true}><AIXrayAnalysis /></DiceEventLayout>} />
                    <Route path="/ai-dental-analysis" element={<DiceEventLayout hidden={true}><DentalAnalysis /></DiceEventLayout>} />
                    <Route path="/my-nfts" element={<DiceEventLayout hidden={true}><MyNfts /></DiceEventLayout>} />
                    <Route path="/reward-history" element={<DiceEventLayout hidden={true}><RewardHistory /></DiceEventLayout>} />
                    <Route path="/first-reward" element={<DiceEventLayout hidden={true}><FirstRewardPage /></DiceEventLayout>} />
                    <Route path="/settings" element={<DiceEventLayout hidden={true}><SettingsPage /></DiceEventLayout>} />
                    <Route path="/policy-detail" element={<DiceEventLayout hidden={true}><PolicyDetailPage /></DiceEventLayout>} />
                    <Route path="/policy-agreement" element={<DiceEventLayout hidden={true}><AgreementPage /></DiceEventLayout>} />
                    <Route path="/referral-rewards" element={<DiceEventLayout hidden={true}><FriendRewards /></DiceEventLayout>} />
                </Routes>
            )}
        </TourProvider>
    </>
  );
}

export default App;
