import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ScrollToTop from "./shared/components/ui/scrollTop";
import AppInitializer from "./app/components/AppInitializer";
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
import DiceEventLayout from "./app/layout/DiceEventLayout";
import WalletList from "./pages/WalletList";
import MyAssets from "./pages/MyAssets";
import MyNfts from "./pages/MyNFTs";
import RewardHistory from "./pages/RewardHistory";
import PreviousRewards from "@/pages/PreviousRewards";


// QueryClient 설정
const queryClient = new QueryClient();

const App:React.FC = () =>{
  const [isInitialized, setIsInitialized] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <ScrollToTop />
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
          <Route path="/my-nfts" element={<DiceEventLayout hidden={true}><MyNfts /></DiceEventLayout>} />
          <Route path="/reward-history" element={<DiceEventLayout hidden={true}><RewardHistory /></DiceEventLayout>} />
        </Routes>
      )}
    </QueryClientProvider>
  );
}

export default App;
