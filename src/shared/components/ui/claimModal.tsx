import React, { useState } from 'react';
import {
    Root as DialogRoot,
    Trigger as DialogTrigger,
    Portal as DialogPortal,
    Title as DialogTitle,
    Description as DialogDescription,
    Overlay as DialogOverlay,
    Content as DialogContent,
  } from '@radix-ui/react-dialog';

enum ClaimStep {
  SELECT_TOKEN = 'SELECT_TOKEN',
  CONNECT_WALLET = 'CONNECT_WALLET',
  CLAIM_FORM = 'CLAIM_FORM',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  FAIL = 'FAIL',
}

interface ClaimModalProps {
  open: boolean;
  onClose: () => void;
}

export const ClaimModal: React.FC<ClaimModalProps> = ({ open, onClose }) => {
  const [step, setStep] = useState<ClaimStep>(ClaimStep.SELECT_TOKEN);
  const [selectedToken, setSelectedToken] = useState<'SL' | 'USDC' | null>(null);
  const [txId, setTxId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // 1) 토큰 선택
  const handleSelectToken = (token: 'SL' | 'USDC') => {
    setSelectedToken(token);

    // SL을 선택했다면 지갑 연결 단계로,
    // (이미 지갑 연결이 되어 있다면 이 부분을 스킵 가능)
    if (token === 'SL') {
      setStep(ClaimStep.CONNECT_WALLET);
    } else {
      // USDC라면 곧바로 ClaimForm 단계 (예: 수령 지갑 주소 입력)
      setStep(ClaimStep.CLAIM_FORM);
    }
  };

  // 2) 지갑 연결 완료
  const handleWalletConnected = () => {
    setStep(ClaimStep.CLAIM_FORM);
  };

  // 3) Claim 시도
  const handleClaim = async (claimAmount: string, walletAddress?: string) => {
    setStep(ClaimStep.LOADING);

    try {
      // 실제 Claim API 호출 or 블록체인 트랜잭션 로직 수행
      // const result = await claimAPI({ token: selectedToken, amount: claimAmount, walletAddress });

      // 예시: 성공 시 TxID를 받아온다고 가정
      const dummyTxId = '0x123456789abcdef';
      setTxId(dummyTxId);

      // 성공 단계로 이동
      setStep(ClaimStep.SUCCESS);
    } catch (error: any) {
      // 실패 단계
      setErrorMessage(error?.message || 'Unknown Error');
      setStep(ClaimStep.FAIL);
    }
  };

  // 4) 모달 닫기 시 초기화
  const handleClose = () => {
    onClose();
    // 필요하다면 step 초기화:
    setStep(ClaimStep.SELECT_TOKEN);
    setSelectedToken(null);
    setErrorMessage('');
    setTxId('');
  };

  return (
    <DialogRoot open={open} onOpenChange={handleClose}>
      <DialogOverlay  className="fixed inset-0 bg-black/50" />
      <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-md">
        
        {/* 필수 접근성 요소: DialogTitle */}
        <DialogTitle>Claim Tokens</DialogTitle>

        {/* 선택적 접근성 요소: DialogDescription(혹은 aria-describedby) */}
        <DialogDescription>
        Select a token and proceed with claiming.
        </DialogDescription>

        {step === ClaimStep.SELECT_TOKEN && (
          <div>
            <h2>Select Token to Claim</h2>
            <button onClick={() => handleSelectToken('SL')}>SL</button>
            <button onClick={() => handleSelectToken('USDC')}>USDC</button>
            <button onClick={handleClose}>Cancel</button>
          </div>
        )}

        {step === ClaimStep.CONNECT_WALLET && (
          <div>
            <h2>Connect Your Wallet (SL Only)</h2>
            {/* 지갑 연결 로직... */}
            <button onClick={handleWalletConnected}>Connect Wallet</button>
            <button onClick={handleClose}>Cancel</button>
          </div>
        )}

        {step === ClaimStep.CLAIM_FORM && (
          <div>
            <h2>{selectedToken} Claim</h2>
            {/* SL이면 'Claim 수량'만, USDC라면 '수령받을 지갑주소 + Claim 수량' 등 폼 구성 */}
            <input placeholder="Enter amount" />
            {selectedToken === 'USDC' && (
              <input placeholder="Enter wallet address" />
            )}
            <button onClick={() => handleClaim('100', '0xWallet')}>Claim</button>
            <button onClick={handleClose}>Cancel</button>
          </div>
        )}

        {step === ClaimStep.LOADING && (
          <div>
            <h2>Processing your claim...</h2>
            <p>Please wait.</p>
          </div>
        )}

        {step === ClaimStep.SUCCESS && (
          <div>
            <h2>Claim Completed</h2>
            <p>Transaction ID: {txId}</p>
            <button onClick={handleClose}>Close</button>
          </div>
        )}

        {step === ClaimStep.FAIL && (
          <div>
            <h2>Claim Failed</h2>
            <p>{errorMessage}</p>
            <button onClick={() => setStep(ClaimStep.SELECT_TOKEN)}>Try Again</button>
            <button onClick={handleClose}>Close</button>
          </div>
        )}
      </DialogContent>
    </DialogRoot>
  );
};
