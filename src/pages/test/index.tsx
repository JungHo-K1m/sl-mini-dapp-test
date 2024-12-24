// import React, { useState } from "react";
// import DappPortalSDK from '@linenext/dapp-portal-sdk'

// const sdk = await DappPortalSDK.init({ clientId: process.env.VITE_LINE_CLIENT_ID || "" });
// const provider = sdk.getWalletProvider()
// const WalletConnect: React.FC =  () => {
    

//   const connectWallet = async () => {
//     try {
//       // SDK 초기화
//       const kaia = await initializeKaia({
//         clientId: process.env.VITE_LINE_CLIENT_ID || "", // 환경 변수에서 clientId 읽기
//       });

//       // 지갑 연결 요청
//       const accounts = await kaia.kaia_requestAccounts();
//       setAccount(accounts[0]); // 첫 번째 계정 저장
//       console.log("지갑 연결 성공:", accounts[0]);
//     } catch (error) {
//       console.error("지갑 연결 실패:", error);
//     }
//   };

//   return (
//     <div>
//       <button onClick={connectWallet}>지갑 연결</button>
//       {account && <p>연결된 계정: {account}</p>}
//     </div>
//   );
// };

// export default WalletConnect;
