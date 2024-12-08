import React, { useState, useEffect } from 'react';
import * as tmImage from '@teachablemachine/image';
import { FaChevronLeft } from "react-icons/fa";
import Images from "@/shared/assets/images";
import { useNavigate, useLocation } from 'react-router-dom';
import storeResult from '@/entities/AI/api/stroeResult';
import useMainPageStore from '@/shared/store/useMainPageStore';
import { useMutation } from '@tanstack/react-query';

const AIXrayAnalysis: React.FC = () => {
  const [model, setModel] = useState<tmImage.CustomMobileNet | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [label, setLabel] = useState('Upload an X-ray image to start analysis.');
  const [loading, setLoading] = useState(false);
  const [showFullText, setShowFullText] = useState(false);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const { selectedMenu } = useMainPageStore();
  const navigate = useNavigate();
  const location = useLocation();
  const petData = location.state as { id: string };
  const [id] = useState<string>(petData?.id || '');

  let Alert = '';

  if (selectedMenu === 'ai-analysis') {
    Alert = "Please upload an actual photo of your pet's teeth.\nPerformance may be suboptimal as this is in beta test mode.";
  } else if (selectedMenu === 'x-ray') {
    Alert = "Please upload an X-ray image of your pet's teeth.\nPerformance may be suboptimal as this is in beta test mode.";
  }

  const [caution, setCaution] = useState(Alert);

  // useMutation 훅 사용
  const { mutate: saveResultMutate, isPending: isSaving } = useMutation<boolean, Error, FormData>({
    mutationFn: (formData) => {
      if (selectedMenu === 'ai-analysis') {
        return storeResult(formData, "dental");
      } else if (selectedMenu === 'x-ray') {
        return storeResult(formData, "xray");
      } else {
        return Promise.reject(new Error('Selected menu is not set.'));
      }
    },
    onSuccess: (result) => {
      if (result) {
        navigate('/diagnosis-list', { state: { id: id } });
        console.log('Result saved successfully.');
      } else {
        alert('Failed to save the result. Redirecting to AI menu...');
        navigate('/AI-menu');
      }
    },
    onError: (error: any) => {
      console.error('Error saving result:', error);
      alert(error.message || 'Failed to save result. Please try again.');
    },
  });

  // 서버에 저장하는 함수
  const saveResult = () => {
    if (selectedImage && isAnalyzed) {
      if (selectedMenu) {
        const formData = new FormData();
        formData.append(
          'json',
          new Blob([JSON.stringify({ petId: id, result: label })], { type: 'application/json' })
        );
        formData.append('file', selectedImage);

        saveResultMutate(formData);
      } else {
        alert('An error occurred: selected menu is not set.');
      }
    } else {
      alert('Please analyze the image before saving.');
    }
  };

  return (
    <div className="flex flex-col items-center text-white mx-6 md:mx-28 min-h-screen">
      <div className="flex items-center w-full mt-7 mb-8 relative">
        <FaChevronLeft
          className="text-xl cursor-pointer mr-2"
          onClick={() => navigate(-1)}
        />
        <h1 className="text-xl font-bold flex-grow text-center">
          {selectedMenu === 'x-ray' ? 'AI X-ray Analysis' : 'AI Dental Examination'}
        </h1>
        <div className="w-6"></div>
      </div>
      {/* ...기존 UI 코드... */}
      <div className="flex w-full max-w-sm justify-between mt-10 mb-16">
        <button
          className="w-[48%] h-14 text-white text-base py-2 px-4 rounded-full border-2"
          style={{ backgroundColor: '#252932', borderColor: '#35383F' }}
          onClick={() => {
            setLabel('');
            setSelectedImage(null);
            setIsAnalyzed(false);
          }}
        >
          Retest
        </button>
        <button
          className={`w-[48%] h-14 text-white text-base py-2 px-4 rounded-full ${
            isSaving ? 'cursor-wait' : ''
          }`}
          style={{ backgroundColor: isSaving ? '#555' : '#0147E5' }}
          onClick={saveResult}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
};

export default AIXrayAnalysis;
