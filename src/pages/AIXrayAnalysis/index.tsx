import React, { useState, useEffect } from 'react';
import * as tmImage from '@teachablemachine/image';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { useMutation } from '@tanstack/react-query';
import Images from "@/shared/assets/images";
import storeResult from '@/entities/AI/api/stroeResult';
import OpenAI from 'openai';
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

  
  const openai = new OpenAI({
      apiKey: import.meta.env.VITE_OPEN_AI_API_KEY,
      dangerouslyAllowBrowser: true,
  });

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
  
  function getImageExtension(file: File): string {
    // 예: file.type === "image/jpeg", "image/png" 등
    const mimeType = file.type;
    const extension = mimeType.split("/")[1] || "jpeg";
    return extension;
  }
  
  async function convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // "data:image/png;base64,..." 부분을 둘로 나누고 뒷부분만 사용
        const base64String = result.split(",")[1];
        if (base64String) {
          resolve(base64String);
        } else {
          reject("Failed to convert file to base64.");
        }
      };
      reader.onerror = (error) => reject(error);
    });
  }

  const analyzeImage = async () => {
    if (!selectedImage) {
      showModalFunction(t("ai_page.Please_upload_an_image_before_analysis."));
      return;
    }

    setLoading(true);
    const loadedModel = await loadModel();

    try{
      const base64Data = await convertFileToBase64(selectedImage);
      
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            "role": "user",
            "content": [
              {
                "type": "image_url",
                "image_url": {
                  "url": `data:image/${getImageExtension(selectedImage)};base64,${base64Data}`,
                }
              }
            ]
          },
        ],
        response_format: {
          "type": "json_schema",
          "json_schema": {
            "name": "image_analysis",
            "strict": true,
            "schema": {
              "type": "object",
              "properties": {
                "image_type": {
                  "type": "string",
                  "description": "Type of the analyzed image.",
                  "enum": [
                    "human_xray",
                    "pet_xray",
                    "non_xray"
                  ]
                }
              },
              "required": [
                "image_type"
              ],
              "additionalProperties": false
            }
          }
        },
        temperature: 1,
        max_completion_tokens: 2048,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      });
      
      const responseData = response;
      console.log("openAI 응답: ", responseData);
      const assistantMessage = responseData?.choices?.[0]?.message?.content?.trim() || "(No response)";
      console.log("뽑은 데이터: ", assistantMessage);

      try{
        const parsedData = JSON.parse(assistantMessage);
        console.log("Parsed Response Data:", parsedData);

        if(parsedData.image_type === "human_xray"){
          // 업로드한 사진이 사람의 x-ray 이미지인 경우
          console.log("사람의 x-ray까지 분석은 못해요.");
          showModalFunction("upload your pet's xray, not human's.");
          setIsAnalyzed(false);
          setLabel("Upload Again");
          setSelectedImage(null);
          getSymptomDescription("");
        } else if(parsedData.image_type === "non_xray"){
          // 업로드한 사진이 전혀 x-ray 이미지가 아닌 겨우
          console.log("반려동물의 x-ray이미지만 올려주세요.");
          showModalFunction("Please upload your pet's x-ray Image.");
          setIsAnalyzed(false);
          setLabel("Upload Again");
          setSelectedImage(null);
          getSymptomDescription("");
        } else if(parsedData.image_type === "pet_xray"){
          // 업로드한 사진이 반려 동물의 x-ray 이미지인 경우
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
        } else {
          // 예외 처리: 유효하지 않은 응답
          showModalFunction(t("ai_page.Failed_to_analyze_the_image"));
          setIsAnalyzed(false);
          setSelectedImage(null);
          setLabel(t("ai_page.Analysis_failed"));
          getSymptomDescription("");
        }
      } catch(error){
        console.error("JSON Parsing Error:", error);
        showModalFunction(t("ai_page.Failed_to_analyze_the_image"));
        setIsAnalyzed(false);
        setSelectedImage(null);
        setLabel(t("ai_page.Analysis_failed"));
      }
    } catch(error: any){
      console.error("OpenAI Error:", error);
      showModalFunction(t("ai_page.Failed_to_analyze_the_image"));
    } finally {
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

      <div className="mt-6 w-full max-w-sm mx-auto p-2 flex flex-col items-center">
        {/* 실제 파일 업로드 input (숨김 처리) */}
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />

        <label
          htmlFor="file-upload"
          className="cursor-pointer w-[280px] h-[280px] flex flex-col items-center justify-center rounded-3xl border-2 bg-[#2E3364B2] border-[#3937A3] overflow-hidden">
          {selectedImage ? (
            // 이미 파일을 업로드했다면 미리보기
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Uploaded X-ray"
              className="w-full h-full object-cover"
            />
          ) : (
            // 아직 업로드 전이면, 화살표 이미지 + 안내 문구
            <>
              <img
                src={Images.UploadArrow} 
                alt="Upload arrow"
                className="w-20 h-20 mb-6"
              />
              <p className="text-white font-medium text-base">Click here to upload your image</p>
            </>
          )}
        </label>
      </div>

      {!isAnalyzed && (
        <div className="mt-6 w-full max-w-lg mx-auto">
          <button
            className={`w-full h-14 text-white text-base font-medium py-2 px-4 rounded-full ${loading ? 'cursor-wait' : ''}`}
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
