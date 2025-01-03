import { useNavigate } from "react-router-dom";
import React, { useState } from "react";

const AgreementPage: React.FC = () => {
  const navigate = useNavigate();
  const [modalContent, setModalContent] = useState<string>(""); // 모달에 표시할 HTML 파일 경로
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 상태
  const [allChecked, setAllChecked] = useState(false);
  const [checkedItems, setCheckedItems] = useState({
    termsOfService: false,
    privacyPolicy: false,
    commercePolicy: false,
  });

  // 모든 체크박스가 체크되었는지 확인
  const isAllChecked = Object.values(checkedItems).every((item) => item);

  const handleCheckAll = () => {
    const newValue = !allChecked;
    setAllChecked(newValue);
    setCheckedItems({
      termsOfService: newValue,
      privacyPolicy: newValue,
      commercePolicy: newValue,
    });
  };

  const handleCheckItem = (key: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof checkedItems],
    }));
  };

  const handleOpenModal = (file: string) => {
    setModalContent(`/policies/${file}`); // 파일 경로 설정
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalContent("");
  };

  const handleNext = () => {
    if (isAllChecked) {
      navigate("/choose-character"); // 캐릭터 선택 페이지로 이동
    }
  };

  return (
    <div className="flex flex-col items-center text-white min-h-screen px-6 pt-36 relative">
      <h1 className="text-2xl font-bold text-center mb-20">Welcome to the<br/>Scan My Pet!</h1>
      <div className="w-full max-w-md py-6 rounded-lg">
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="allTerms"
            checked={allChecked}
            onChange={handleCheckAll}
            className="w-5 h-5 mr-2"
          />
          <label htmlFor="allTerms" className="font-semibold text-lg">
            Agree to all terms and conditions
          </label>
        </div>
        <hr className="border-gray-600 mb-4" />
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="termsOfService"
            checked={checkedItems.termsOfService}
            onChange={() => handleCheckItem("termsOfService")}
            className="w-5 h-5 mr-2"
          />
          <button
            className="font-medium text-base text-left underline"
            onClick={() => handleOpenModal("termsOfService.html")}
          >
            Terms of Service
          </button>
        </div>
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="privacyPolicy"
            checked={checkedItems.privacyPolicy}
            onChange={() => handleCheckItem("privacyPolicy")}
            className="w-5 h-5 mr-2"
          />
          <button
            className="font-medium text-base text-left underline"
            onClick={() => handleOpenModal("privacyPolicy.html")}
          >
            Privacy Policy
          </button>
        </div>
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="commercePolicy"
            checked={checkedItems.commercePolicy}
            onChange={() => handleCheckItem("commercePolicy")}
            className="w-5 h-5 mr-2"
          />
          <button
            className="font-medium text-base text-left underline"
            onClick={() => handleOpenModal("electronicCommerce.html")}
          >
            Electronic Commerce Policy
          </button>
        </div>
      </div>

      {/* 하단 고정 버튼 */}
      <button
        className={`w-[80%] max-w-md py-3 text-lg font-medium rounded-full fixed bottom-4 left-1/2 transform -translate-x-1/2 ${
          isAllChecked ? "bg-[#0147E5] text-white" : "bg-gray-500 text-gray-300"
        }`}
        disabled={!isAllChecked}
        onClick={handleNext}
      >
        Next
      </button>

      {/* 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#0D1226] bg-opacity-50 z-50">
          <div className=" w-full max-w-md p-6 rounded-lg overflow-y-auto max-h-[80%] bg-[#0D1226]">
            <iframe
              src={modalContent}
              title="Policy Document"
              className="w-full h-[60vh] border-none"
            ></iframe>
            <button
              className="mt-4 px-4 py-2 bg-[#0147E5] text-white rounded-full w-full"
              onClick={handleCloseModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgreementPage;
