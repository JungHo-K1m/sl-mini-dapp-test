import React, { useState, useEffect } from 'react';
import * as tmImage from '@teachablemachine/image';
import { FaChevronLeft } from "react-icons/fa";
import Images from "@/shared/assets/images";
import { useNavigate, useLocation } from 'react-router-dom';
import storeResult from '@/entities/AI/api/stroeResult';
import useToken from '@/entities/AI/api/useToken';
import checkBalance from '@/entities/AI/api/checkBalance';
import useMainPageStore from '@/shared/store/useMainPageStore';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from "react-i18next";

const AIXrayAnalysis: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [model, setModel] = useState<tmImage.CustomMobileNet | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [label, setLabel] = useState('Upload an X-ray image to start analysis.');
  const [loading, setLoading] = useState(false);
  const [showFullText, setShowFullText] = useState(false);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const { selectedMenu } = useMainPageStore();
  const petData = location.state as { id: string };
  const [id] = useState<string>(petData?.id || '');
  const [modalInfo, setModalInfo] = useState({
    isVisible: false,
    message: '',
  });
  
  const showModalFunction = (message: string) => {
    setModalInfo({
      isVisible: true,
      message,
    });
  };
  

  // 최초 안내 문구 표시
  let Alert = '';

  if(selectedMenu === 'ai-analysis'){
    Alert = t("ai_page.Please_upload_actual_photo");
  } else if(selectedMenu === 'x-ray'){
    Alert = t("ai_page.Please_upload_x_ray_image");
  }

  // useMutation 훅 사용
  const { mutate: saveResultMutate, isPending: isSaving } = useMutation<boolean, Error, FormData>({
    mutationFn: (formData) => {
      if (selectedMenu === 'ai-analysis') {
        return storeResult(formData, "dental");
      } else if(selectedMenu === 'x-ray'){

        return storeResult(formData, "xray");
      }else {
        return Promise.reject(new Error(t("ai_page.An_error_occurred:_selected_menu_is_not_set.")));
      }
    },
    onSuccess: () => {
      navigate('/diagnosis-list', { state: { id: id } });
      console.log('Result saved successfully.');
    },
    onError: (error: any) => {
      console.error('Error saving result:', error);
      showModalFunction(t("ai_page.Failed_to_save_result._Please_try_again."));
    },
  });

  // 진단 가능한 항목에 대한 설명
  const symptomsInfo: Record<string, string> = {
    "Gingivitis & Plaque": t("ai_page.reuslts.symptoms_of_gingivitis_and_plaque"),
    "Periodontitis": t("ai_page.reuslts.symptoms_of_periodontitis"),
    "Normal": t("ai_page.reuslts.no_issues_detected"),
    "Decrease in dental bone density": t("ai_page.reuslts.decrease_in_dental_bone_density"),
    "Fractured tooth": t("ai_page.reuslts.fractured_tooth"),
    "Gingivitis": t("ai_page.reuslts.symptoms_of_gingivitis"),
    "Healthy": t("ai_page.reuslts.no_issues_detected_healthy"),
  };
  
  const getSymptomDescription = (label: string) =>
    symptomsInfo[label] || t("ai_page.Diagnosis_information_not_available.");
  

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
        showModalFunction(t("ai_page.Failed_to_load_the_AI_model._Please_try_again_later_or_check_your_network_connection."));
      }
    }
    return model; // 이미 로드된 모델이 있으면 반환
  };

  // 이미지 업로드 핸들러
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedImage(event.target.files[0]);
      setLabel(t("ai_page.Click_the_button_to_analyze_the_uploaded_image."));
      setIsAnalyzed(false);
    }
  };

  // 이미지 분석 함수
  const analyzeImage = async () => {

     // 이미지를 업로드하지 않았을 때 모달 표시
    if (!selectedImage) {
      setShowModal(true);
      showModalFunction(t("ai_page.Please_upload_an_image_before_analysis."));
      return;
    }
  
    setLoading(true);
    const loadedModel = await loadModel(); // 모델을 로드하고 가져옴
  
    try {
      // ai진단을 사용할 SL 토큰 있는지 먼저 확인
      const balance = await checkBalance();
  
      // SL 토큰이 충분한 경우
      if (balance) {
        // 토큰 사용 API 사용
        const tokenUsed = await useToken();
  
        // 토큰 사용 후 이미지 분석 진행
        if (loadedModel && selectedImage && tokenUsed) {
          const imageElement = document.createElement("img");
          imageElement.src = window.URL.createObjectURL(selectedImage); // 파일에서 생성된 URL 사용
          imageElement.onload = async () => {
            const prediction = await loadedModel.predict(imageElement);
            const highestPrediction = prediction.reduce((prev, current) =>
              prev.probability > current.probability ? prev : current
            );
  
            console.log(
              "Current prediction:",
              highestPrediction.className,
              "Probability:",
              highestPrediction.probability
            );
  
            // 번역된 라벨 설정
            const predictionKey = highestPrediction.className.replace(/ /g, "_");
            const translatedLabel =
              highestPrediction.probability > 0.95
                ? t(`ai_page.reuslts.${predictionKey}`, { defaultValue: t("ai_page.reuslts.Normal") })
                : t("ai_page.reuslts.Normal");

  
            setLabel(translatedLabel); // 번역된 라벨을 상태에 저장
            setLoading(false);
            setIsAnalyzed(true);
            saveResult();
          };
        } else {
          setLoading(false);
        }
      } else {
        // SL 토큰이 부족한 경우 처리
        showModalFunction(t("ai_page.Failed_to_load_records._Please_try_again_later."));
        setLoading(false);
      }
    } catch (error: any) {
      console.error("Error during analysis:", error);
      setLoading(false);
      showModalFunction(t("ai_page.Failed_to_load_the_AI_model._Please_try_again_later_or_check_your_network_connection."));
    }
  };
  


  // 서버에 저장하는 함수
  const saveResult = () => {
    if (!selectedImage || !isAnalyzed) {
      showModalFunction(t("ai_page.Please_analyze_the_image_before_saving."));
      return;
    }
  
    if (!selectedMenu) {
      showModalFunction(t("ai_page.An_error_occurred:_selected_menu_is_not_set."));
      return;
    }
  
    const formData = new FormData();
    formData.append("json", new Blob([JSON.stringify({ petId: id, result: label })], { type: "application/json" }));
    formData.append("file", selectedImage);
  
    saveResultMutate(formData);
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
      return t("ai_page.ai_xray_analysis");
    } else if (selectedMenu === 'ai-analysis') {
      return t("ai_page.ai_dental_examination");
    } else {
      return t("ai_page.ai_analysis");
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
        <div className="w-5"></div>
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
              alt="Uploaded X-ray image"
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
            {loading ? t("ai_page.Analyzing...") : t("ai_page.Upload_image_and_analysis")}
          </button>
        </div>
      )}
  
      {/* 분석 결과 표시 */}
      {isAnalyzed && (
        <>
          <div id="label-container" className="mt-4 text-lg font-semibold">
            {/* 진단명 */}
            <p>{t("ai_page.Analysis_results")}: {label}</p>
          </div>
  
          <div className="mt-4 p-4 bg-gray-800 text-white rounded-xl shadow-md max-w-sm mx-auto">
            {/* 진단 결과 설명 */}
            <p
              className="overflow-hidden text-sm"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: showFullText ? undefined : 3,
                WebkitBoxOrient: 'vertical',
              }}
              >
              {getSymptomDescription(label)}
            </p>
            <div className="flex justify-center mt-2">
              {/* 더 보기 버튼, 줄이기 버튼 */}
              {!showFullText ? (
                <button
                  className="mt-2 w-1/2 text-black text-base font-semibold py-2 px-4 rounded-xl"
                  style={{ backgroundColor: '#FFFFFF' }}
                  onClick={() => setShowFullText(true)}
                  >
                  {t("ai_page.See_more")}
                </button>
              ) : (
                <button
                  className="mt-2 w-1/2 text-black text-base font-semibold py-2 px-4 rounded-xl"
                  style={{ backgroundColor: '#FFFFFF' }}
                  onClick={() => setShowFullText(false)}
                  >
                  {t("ai_page.See_less")}
                </button>
              )}
            </div>
          </div>
  
          
          <div className="flex w-full max-w-sm justify-between mt-10 mb-16">
            {/* Retest 버튼 */}
            <button
              className="w-[48%] h-14 text-white text-base py-2 px-4 rounded-full border-2"
              style={{ backgroundColor: '#252932', borderColor: '#35383F' }}
              onClick={clickReset}
              >
              {t("ai_page.Retest")}
            </button>
            {/* Home 버튼 */}
            <button
              className="w-[48%] h-14 text-white text-base py-2 px-4 rounded-full border-2"
              style={{ backgroundColor: '#0147E5', borderColor: '#0147E5' }}
              onClick={()=>navigate('/AI-menu')}
              >
              {t("ai_page.Home")}
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
              {t("OK")}
            </button>
          </div>
        </div>
      )}


      {modalInfo.isVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 w-[80%]">
            <div className="bg-white text-black p-6 rounded-lg text-center">
                <div> &nbsp;</div>
                <p>{modalInfo.message}</p>
                <div> &nbsp;</div>
                <button
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
                    onClick={()=>setModalInfo({ isVisible: false, message: '' })}
                    >
                    {t("OK")}
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default AIXrayAnalysis;
