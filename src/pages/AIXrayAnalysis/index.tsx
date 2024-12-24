import React, { useState, useEffect } from 'react';
import * as tmImage from '@teachablemachine/image';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { useMutation } from '@tanstack/react-query';
import Images from "@/shared/assets/images";
import storeResult from '@/entities/AI/api/stroeResult';
import { TopTitle } from '@/shared/components/ui';

const AIXrayAnalysis: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const [model, setModel] = useState<tmImage.CustomMobileNet | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [label, setLabel] = useState(t("ai_page.Upload_an_X-ray_image_to_start_analysis"));
  const [loading, setLoading] = useState(false);
  const [showFullText, setShowFullText] = useState(false);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [modalInfo, setModalInfo] = useState({ isVisible: false, message: '' });

  const petData = location.state as { id: string };
  const petId = petData?.id || '';

  const symptomsInfo: Record<string, string> = {
    "Periodontitis": t("ai_page.reuslts.symptoms_of_periodontitis"),
    "Normal": t("ai_page.reuslts.no_issues_detected"),
    "Decrease in dental bone density": t("ai_page.reuslts.decrease_in_dental_bone_density"),
    "Fractured tooth": t("ai_page.reuslts.fractured_tooth"),
    "Gingivitis": t("ai_page.reuslts.symptoms_of_gingivitis"),
    "Healthy": t("ai_page.reuslts.no_issues_detected_healthy"),
  };

  const getSymptomDescription = (label: string) =>
    symptomsInfo[label] || t("ai_page.Diagnosis_information_not_available");

  const showModalFunction = (message: string) => {
    setModalInfo({ isVisible: true, message });
  };

  useEffect(() => {
      // 페이지 최초 로드 시 모달 표시
      setModalInfo({
          isVisible: true,
          message: t("ai_page.Please_upload_x_ray_image")
      });
  }, []);

  const loadModel = async () => {
    if (model) return model;
    try {
      const modelPath = "/ai_model/xray";
      const loadedModel = await tmImage.load(`${modelPath}/model.json`, `${modelPath}/metadata.json`);
      setModel(loadedModel);
      return loadedModel;
    } catch (error) {
      console.error("Failed to load model:", error);
      showModalFunction(t("ai_page.Failed_to_load_the_AI_model._Please_try_again_later_or_check_your_network_connection."));
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
      setLabel(t("ai_page.Click_the_button_to_analyze_the_uploaded_image"));
      setIsAnalyzed(false);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) {
      showModalFunction(t("ai_page.Please_upload_an_image_before_analysis."));
      return;
    }

    setLoading(true);
    const loadedModel = await loadModel();

    if (loadedModel && selectedImage) {
      const imageElement = new Image();
      imageElement.src = URL.createObjectURL(selectedImage);
      imageElement.onload = async () => {
        const predictions = await loadedModel.predict(imageElement);
        const highestPrediction = predictions.reduce((prev, current) =>
          prev.probability > current.probability ? prev : current
        );

        setLabel(
          highestPrediction.probability > 0.95
            ? t(`ai_page.reuslts.${highestPrediction.className.replace(/ /g, "_")}`, { defaultValue: t("ai_page.reuslts.Normal") })
            : t("ai_page.reuslts.Normal")
        );
        setIsAnalyzed(true);
        setLoading(false);
      };
    } else {
      setLoading(false);
    }
  };

  const { mutate: saveResultMutate, isPending: isSaving } = useMutation({
    mutationFn: (formData: FormData) => storeResult(formData, "xray"),
    onSuccess: () => navigate('/AI-menu', { state: { id: petId } }),
    onError: () => showModalFunction(t("ai_page.Failed_to_save_result._Please_try_again.")),
  });

  const saveResult = () => {
    if (!selectedImage || !isAnalyzed) {
      showModalFunction(t("ai_page.Please_analyze_the_image_before_saving."));
      return;
    }

    const formData = new FormData();
    formData.append(
      'json',
      new Blob([JSON.stringify({ petId, result: label })], { type: 'application/json' })
    );
    formData.append('file', selectedImage);

    saveResultMutate(formData);
  };

  const resetAnalysis = () => {
    setLabel(t("ai_page.Upload_an_X-ray_image_to_start_analysis"));
    setSelectedImage(null);
    setIsAnalyzed(false);
  };

  return (
    <div className="flex flex-col items-center text-white mx-6 h-screen overflow-x-hidden">
      <TopTitle title={t('ai_page.ai_xray_analysis')} back={true} />

      <div className="mt-6 w-full max-w-sm mx-auto rounded-md overflow-hidden p-2 flex flex-col items-center">
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          {selectedImage ? (
            <img
              src={URL.createObjectURL(selectedImage)}
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

      {!isAnalyzed && (
        <div className="mt-6 w-full max-w-lg mx-auto">
          <button
            className={`w-full text-white text-lg py-2 px-4 rounded-full ${loading ? 'cursor-wait' : ''}`}
            style={{ backgroundColor: '#0147E5' }}
            onClick={analyzeImage}
            disabled={loading}
          >
            {loading ? t("ai_page.Analyzing...") : t("ai_page.Upload_image_and_analysis")}
          </button>
        </div>
      )}

      {isAnalyzed && (
        <>
          <div className="mt-4 text-lg font-semibold">
            <p>{t("ai_page.Analysis_results")}: {label}</p>
          </div>

          <div className="mt-4 p-4 bg-gray-800 rounded-xl max-w-sm mx-auto">
            <p className={`overflow-hidden text-sm ${showFullText ? '' : 'line-clamp-3'}`}>
              {getSymptomDescription(label)}
            </p>
            <div className="flex justify-center mt-2">
              <button
                className="mt-2 w-1/2 text-black font-semibold py-2 px-4 rounded-xl"
                style={{ backgroundColor: '#FFFFFF' }}
                onClick={() => setShowFullText(!showFullText)}
                >
                {t(showFullText ? "ai_page.See_less" : "ai_page.See_more")}
              </button>
            </div>
          </div>

          <div className="flex w-full max-w-sm justify-between mt-10 mb-16">
            <button
              className="w-[48%] h-14 text-white text-base py-2 px-4 rounded-full border-2"
              style={{ backgroundColor: '#252932', borderColor: '#35383F' }}
              onClick={resetAnalysis}
            >
              Retest
            </button>
            <button
              className={`w-[48%] h-14 text-white text-base py-2 px-4 rounded-full ${isSaving ? 'cursor-wait' : ''}`}
              style={{ backgroundColor: isSaving ? '#555' : '#0147E5' }}
              onClick={saveResult}
              disabled={isSaving}
            >
              {isSaving ? t("ai_page.Saving") : t("ai_page.Save")}
            </button>
          </div>
        </>
      )}

      {(showModal || modalInfo.isVisible) && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 w-full">
          <div className="bg-white p-6 rounded-lg text-black text-center w-[70%] max-w-[550px]">
            <p>{modalInfo.isVisible ? modalInfo.message : t("ai_page.Please_upload_an_image_before_analysis.")}</p>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
              onClick={() => {
                setShowModal(false);
                setModalInfo({ isVisible: false, message: '' });
              }}
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
