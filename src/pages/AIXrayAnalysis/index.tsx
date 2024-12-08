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

  // 최초 안내 문구 표시
  let Alert = '';

  if(selectedMenu === 'ai-analysis'){
    Alert = "Please upload an actual photo of your pet's teeth.\nPerformance may be suboptimal as this is in beta test mode.";
  } else if(selectedMenu === 'x-ray'){
    Alert = "Please upload an X-ray image of your pet's teeth.\nPerformance may be suboptimal as this is in beta test mode.";
  }

  const [caution, setCaution] = useState(Alert);

  // useMutation 훅 사용
  const { mutate: saveResultMutate, isPending: isSaving } = useMutation<boolean, Error, FormData>({
    mutationFn: (formData) => {
      if (selectedMenu === 'ai-analysis') {
        return storeResult(formData, "dental");
      } else if(selectedMenu === 'x-ray'){

        return storeResult(formData, "xray");
      }else {
        return Promise.reject(new Error('Selected menu is not set.'));
      }
    },
    onSuccess: () => {
      navigate('/diagnosis-list', { state: { id: id } });
      console.log('Result saved successfully.');
    },
    onError: (error: any) => {
      console.error('Error saving result:', error);
      alert(error.message || 'Failed to save result. Please try again.');
    },
  });


  // 진단 가능한 항목에 대한 설명
  const symptomsInfo: Record<string, string> = {
    "Gingivitis & Plaque": "Symptoms of gingivitis and plaque have been detected in your dog. It is important to visit the vet as soon as possible to address this condition. Maintaining good oral hygiene is crucial for your pet's health.",
    "Periodontitis": "Symptoms of periodontitis have been detected in your dog. This condition can cause discomfort and pain. We recommend seeing a veterinarian promptly for proper diagnosis and treatment.",
    "Normal": "No issues were detected in your dog's teeth. Keep maintaining good dental hygiene to ensure their continued health.",
    "Decrease in dental bone density": "A decrease in dental bone density has been detected in your dog's X-ray. This could indicate bone loss, which may require veterinary attention. Regular check-ups and appropriate dental care are recommended.",
    "Fractured tooth": "Symptoms of a fractured tooth have been detected in your dog. It is important to visit the vet as soon as possible to address this condition. Fractured teeth can cause discomfort and lead to other oral health issues.",
    "Gingivitis": "Symptoms of gingivitis have been detected in your dog. Gingivitis can lead to more severe dental issues if untreated. It is recommended to see a veterinarian to discuss a treatment plan.",
    "Healthy": "No issues were detected in your dog's teeth. Your dog's dental health appears to be good. Keep maintaining regular oral hygiene to ensure their continued health."
  };

  // Teachable Machine 모델 로드 함수
  const loadModel = async () => {
    if (!model) {
      try {
        let modelURL = "";
        let metadataURL = "";

        if (selectedMenu === 'x-ray') {
          // 기존 모델 경로
          modelURL = "/ai_model/xray/model.json";
          metadataURL = "/ai_model/xray/metadata.json";
        } else if (selectedMenu === 'ai-analysis') {
          // 새로운 모델 경로
          modelURL = "/ai_model/dental/model.json";
          metadataURL = "/ai_model/dental/metadata.json";
        } else {
          // 기본 모델 경로 (필요에 따라 설정)
          modelURL = "/ai_model/default/model.json";
          metadataURL = "/ai_model/default/metadata.json";
        }

        const loadedModel = await tmImage.load(modelURL, metadataURL);
        setModel(loadedModel);
        return loadedModel; // 모델 로드 후 반환
      } catch (error) {
        console.error("Failed to load model:", error);
        alert("Failed to load the AI model. Please try again later or check your network connection.");
      }
    }
    return model; // 이미 로드된 모델이 있으면 반환
  };

  // 이미지 업로드 핸들러
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedImage(event.target.files[0]);
      setLabel("Click the button to analyze the uploaded image.");
      setIsAnalyzed(false);
    }
  };

  // 이미지 분석 함수
  const analyzeImage = async () => {
    if (!selectedImage) {
      setShowModal(true); // 이미지를 업로드하지 않았을 때 모달 표시
      setCaution('Please upload an image before analysis.');
      return;
    }

    setLoading(true);
    const loadedModel = await loadModel(); // 모델을 로드하고 가져옴

    if (loadedModel && selectedImage) {
      const imageElement = document.createElement('img');
      imageElement.src = window.URL.createObjectURL(selectedImage); // 파일에서 생성된 URL 사용
      imageElement.onload = async () => {
        const prediction = await loadedModel.predict(imageElement);
        const highestPrediction = prediction.reduce((prev, current) =>
          prev.probability > current.probability ? prev : current
        );

        console.log("Current prediction:", highestPrediction.className, "Probability:", highestPrediction.probability);

        if (highestPrediction.probability > 0.95) {
          setLabel(highestPrediction.className);
        } else {
          setLabel("Normal"); // 확률이 낮을 때 기본 라벨로 설정
        }

        setLoading(false);
        setIsAnalyzed(true);
      };
    } else {
      setLoading(false);
    }
  };


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

  // 분석 재실행 버튼
  const clickReset = () => {
    setLabel('');
    setSelectedImage(null);
    setIsAnalyzed(false);
  }
  
  // 제목 설정
  const getTitle = () => {
    if (selectedMenu === 'x-ray') {
      return 'AI X-ray Analysis';
    } else if (selectedMenu === 'ai-analysis') {
      return 'AI Dental Examination';
    } else {
      return 'AI Analysis';
    }
  };

  return (
    <div className="flex flex-col items-center text-white mx-6 md:mx-28  min-h-screen">
      <div className="flex items-center w-full mt-7 mb-8 relative">
        {/* 뒤로가기 버튼 */}
        <FaChevronLeft
          className="text-xl cursor-pointer mr-2"
          onClick={() => navigate(-1)}
        />
        <h1 className="text-xl font-bold flex-grow text-center">{getTitle()}</h1>
        <div className="w-6"></div>
      </div>
  
      <div className="mt-6 w-full max-w-sm mx-auto rounded-md overflow-hidden p-2 flex flex-col items-center">
        {/* 숨겨진 파일 업로드 인풋 */}
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        {/* 이미지 선택 전에는 업로드 버튼, 선택 후에는 업로드된 이미지 */}
        <label htmlFor="file-upload" className="cursor-pointer">
          {selectedImage ? (
            <img
              src={window.URL.createObjectURL(selectedImage)}
              alt="Uploaded X-ray"
              className="w-64 h-64 rounded-md object-fill"
            />
          ) : (
            <img
              src={Images.uploader}
              alt="Click here to upload your image"
              className="w-64 h-64 object-cover"
            />
          )}
        </label>
      </div>
  
      {/* 분석 버튼: 분석이 진행 중이거나 완료된 경우 숨김 */}
      {!isAnalyzed && (
        <div className="mt-6 w-full max-w-lg mx-auto rounded-md overflow-hidden">
          <button
            className={`w-full text-white text-lg py-2 px-4 rounded-full ${
              loading ? 'cursor-wait' : ''
            }`}
            style={{ backgroundColor: '#0147E5' }}
            onClick={analyzeImage}
            disabled={loading}
          >
            {loading ? 'Analyzing...' : 'Upload image and analysis'}
          </button>
        </div>
      )}
  
      {/* 분석 결과 표시 */}
      {isAnalyzed && (
        <>
          <div id="label-container" className="mt-4 text-lg font-semibold">
            <p>Analysis results: {label}</p>
          </div>
  
          <div className="mt-4 p-4 bg-gray-800 text-white rounded-xl shadow-md max-w-sm mx-auto">
            <p
              className="overflow-hidden text-sm"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: showFullText ? undefined : 3,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {symptomsInfo[label]}
            </p>
            <div className="flex justify-center mt-2">
              {!showFullText ? (
                <button
                  className="mt-2 w-1/2 text-black text-base font-semibold py-2 px-4 rounded-xl"
                  style={{ backgroundColor: '#FFFFFF' }}
                  onClick={() => setShowFullText(true)}
                >
                  See more
                </button>
              ) : (
                <button
                  className="mt-2 w-1/2 text-black text-base font-semibold py-2 px-4 rounded-xl"
                  style={{ backgroundColor: '#FFFFFF' }}
                  onClick={() => setShowFullText(false)}
                >
                  See less
                </button>
              )}
            </div>
          </div>
  
          {/* Retest 및 Save 버튼을 수평으로 배치 */}
          <div className="flex w-full max-w-sm justify-between mt-10 mb-16">
            <button
              className="w-[48%] h-14 text-white text-base py-2 px-4 rounded-full border-2"
              style={{ backgroundColor: '#252932', borderColor: '#35383F' }}
              onClick={clickReset}
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
        </>
      )}
  
      {/* 이미지 업로드 요청 모달 */}
      {showModal && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center md:mx-10">
          <div className="bg-white p-6 rounded-lg text-black text-center mx-3">
            <p>
              {Alert.split('\n').map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </p>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg w-1/2"
              onClick={() => setShowModal(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
  
};

export default AIXrayAnalysis;
