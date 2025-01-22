import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { useMutation } from '@tanstack/react-query';
import Images from "@/shared/assets/images";
import storeResult from '@/entities/AI/api/stroeResult';
import storeDescription from '@/entities/AI/api/storeDescription';
import OpenAI from 'openai';
import { TopTitle } from '@/shared/components/ui';
import getBalance from '@/entities/AI/api/checkBalance';
import slPayment from '@/entities/AI/api/paySL';
import { useSound } from "@/shared/provider/SoundProvider";
import Audios from "@/shared/assets/audio";

const DentalAnalysis: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { i18n, t } = useTranslation();
  const { playSfx } = useSound();

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [label, setLabel] = useState(t("ai_page.Upload_an_X-ray_image_to_start_analysis"));
  const [explanation, setExplanation] = useState("");   // ← 추가: 설명을 저장할 state
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

  // 진단 증상이름과 내용 (기존)
  const symptomsInfo: Record<string, string> = {
      "Gingivitis & Plaque": t("ai_page.reuslts.symptoms_of_gingivitis_and_plaque"),
      "Periodontitis": t("ai_page.reuslts.symptoms_of_periodontitis"),
      "Normal": t("ai_page.reuslts.no_issues_detected"),
      "Gingivitis": t("ai_page.reuslts.symptoms_of_gingivitis"),
  };

  // label(진단명)에 매칭되는 설명을 반환
  // → explanation이 없는 경우 fallback으로 사용
  const getSymptomDescription = (diagLabel: string) =>
      symptomsInfo[diagLabel] || t("ai_page.Diagnosis_information_not_available");

  // 모달 표시
  const showModalFunction = (message: string) => {
      setModalInfo({ isVisible: true, message });
  };

  useEffect(() => {
      // 페이지 최초 로드 시 모달 표시
      setModalInfo({
          isVisible: true,
          message: t("ai_page.5SL_tokens")
      });
  }, []);

  // 이미지 업로더
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    playSfx(Audios.button_click);
  
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
      setLabel(t("ai_page.Click_the_button_to_analyze_the_uploaded_image"));
      setExplanation("");
      setIsAnalyzed(false);
    }
  };

  // File -> Base64 문자열로 변환
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

  // 이미지 확장자 추출 (mimeType 기반)
  function getImageExtension(file: File): string {
    // 예: file.type === "image/jpeg", "image/png" 등
    const mimeType = file.type;
    const extension = mimeType.split("/")[1] || "jpeg";
    return extension;
  }

  // SL 잔고 확인
  const checkBalance = async () => {
    try {
      const response = await getBalance();

      if(response.message === "Success"){
        analyzeImage();
      } else {
        setShowModal(true);
        setSelectedImage(null);
        setIsAnalyzed(false);
        showModalFunction(t("ai_page.5SL_tokens"));
      }
    } catch(error: any){
      console.error("Balance check Error:", error);
      showModalFunction(t("ai_page.Failed_to_analyze_the_image"));
    }
  }

  async function retryWithBackoff(fn: () => any, retries = 5, delay = 5) {
    for (let i = 0; i < retries; i++) {
        try {
            return await fn(); // 함수 실행
        } catch (error: any) {
            if (error.response?.status === 429) {
                const backoffTime = delay * Math.pow(2, i); // 지연 시간 증가
                console.warn(`429 Too Many Requests: 재시도까지 ${backoffTime / 5}초 대기`);
                await new Promise((resolve) => setTimeout(resolve, backoffTime));
            } else {
                throw error; // 다른 에러는 바로 반환
            }
        }
    }
    throw new Error('429 Too Many Requests: 최대 재시도 횟수 초과');
  }

  // 이미지 분석 함수
  const analyzeImage = async () => {
    playSfx(Audios.button_click);
    console.log("현재 사용 언어", i18n.language);
    let useLanguage = "English";

    if(i18n.language === "ko"){
      useLanguage = "Korean"
      console.log("바뀜요: ", useLanguage);
    }
    else if(i18n.language === "en"){
      useLanguage = "English"
      console.log("바뀜요: ", useLanguage);
    }
    else if(i18n.language === "ja"){
      useLanguage = "Japanese"
      console.log("바뀜요: ", useLanguage);
    }
    else if(i18n.language === "zh"){
      useLanguage = "Taiwanese"
      console.log("바뀜요: ", useLanguage);
    }
    else if(i18n.language === "th"){
      useLanguage = "Thai"
      console.log("바뀜요: ", useLanguage);
    }

    if (!selectedImage) {
      showModalFunction(t("ai_page.Please_upload_an_image_before_analysis."));
      return;
    }

    setLoading(true);

    try {
      // 1) File을 Base64 문자열로 변환
      const base64Data = await convertFileToBase64(selectedImage);

      const response = await retryWithBackoff(() => openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            {
              role: "user",
              content: [
                {
                  "type": "image_url",
                  "image_url": {
                    "url": `data:image/${getImageExtension(selectedImage)};base64,${base64Data}`,
                  }
                }
              ],
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
                  "is_x_ray": {
                    "type": "string",
                    "description": "Indicates whether the image is of X-ray, or other.",
                    "enum": [
                      "x-ray",
                      "other"
                    ]
                  },
                  "image_type": {
                    "type": "string",
                    "description": "Indicates whether the image is of a dog, cat, or other.",
                    "enum": [
                      "dog",
                      "cat",
                      "other"
                    ]
                  },
                  "is_tooth_image": {
                    "type": "boolean",
                    "description": "Indicator if the image is specifically of a tooth."
                  },
                  "diagnosis": {
                    "type": "object",
                    "properties": {
                      "diagnostic_name": {
                        "type": "string",
                        "description": "The name of the diagnosis.",
                        "enum": [
                          "Gingivitis & Plaque",
                          "Periodontitis",
                          "Normal"
                        ]
                      },
                      "description": {
                        "type": "string",
                        "description": `A detailed explanation of the diagnosis, translated into ${useLanguage}, at least 150 characters.`
                      }
                    },
                    "required": [
                      "diagnostic_name",
                      "description"
                    ],
                    "additionalProperties": false
                  }
                },
                "required": [
                  "is_x_ray",
                  "image_type",
                  "is_tooth_image",
                  "diagnosis"
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
        })
      );

      // 4) 응답(JSON) 파싱
      const responseData = response;
      console.log("openAI 응답: ", responseData);
      // 모델이 최종 생성한 텍스트
      const assistantMessage = responseData?.choices?.[0]?.message?.content?.trim() || "(No response)";
      console.log("뽑은 데이터: ", assistantMessage);

      // 5) 응답에 따른 분기 처리
      try {
          // assistantMessage를 JSON 객체로 파싱
          const parsedData = JSON.parse(assistantMessage);
          console.log("Parsed Response Data:", parsedData);
      
          // 데이터 유효성 검사 및 분기 처리
          if (parsedData.is_x_ray === "x-ray") {
              // 업로드한 사진이 x-ray 이미지인 경우
              console.log("여기는 x-ray 취급 안해요.");
              showModalFunction(t("ai_page.actual_photo"));
              setIsAnalyzed(false);
              setLabel("Non dental");
              setSelectedImage(null);
              setExplanation(""); // 설명 초기화
          } else if(parsedData.image_type === "other" && parsedData.is_tooth_image === false && parsedData.diagnosis){
              // 업로드한 사진이 전혀 다른 사진인 경우
              console.log("전혀 다른 이미지를 올리셨어요.");
              showModalFunction(t("ai_page.Please_upload_tooth_image"));
              setIsAnalyzed(false);
              setLabel("Non dental");
              setSelectedImage(null);
              setExplanation(""); // 설명 초기화
          } else if((parsedData.image_type === "dog" || parsedData.image_type === "cat") && parsedData.is_tooth_image === false && parsedData.diagnosis){
              // 업로드한 사진이 반려 동물의 사진이지만 치아가 보이지 않는 경우
              console.log("이빨 좀 보이는 사진 올려주세요.");
              showModalFunction(t("ai_page.Please_upload_pets_tooth_image"));
              setIsAnalyzed(false);
              setLabel("Non dental");
              setSelectedImage(null);
              setExplanation(""); // 설명 초기화
          } else if (parsedData.is_tooth_image === true && parsedData.diagnosis) {
              // 분석 성공: 진단 결과 표시
              console.log("분석을 정상적으로 했어요.");
              const originalExplanation = parsedData.diagnosis.description;
      
              setLabel(parsedData.diagnosis.diagnostic_name);
              setExplanation(originalExplanation);
              setIsAnalyzed(true);

              // sl 차감 api 진행
              // try{
              //   const slResponse = await slPayment();

              //   if(slResponse.message === "Success"){
              //     const originalExplanation = parsedData.diagnosis.description;
      
              //     setLabel(parsedData.diagnosis.diagnostic_name);
              //     setExplanation(originalExplanation);
              //     setIsAnalyzed(true);
              //   }else {
              //     setShowModal(true);
              //     setSelectedImage(null);
              //     setIsAnalyzed(false);
              //     showModalFunction(t("ai_page.5SL_tokens"));
              //   }
              // }catch(error: any){
              //   console.error("sl payment Error:", error);
              //   showModalFunction(t("ai_page.Failed_to_analyze_the_image"));
              //   setIsAnalyzed(false);
              //   setSelectedImage(null);
              //   setLabel(t("ai_page.Analysis_failed"));
              //   setExplanation(""); // 설명 초기화
              // }
          } else {
              // 예외 처리: 유효하지 않은 응답
              showModalFunction(t("ai_page.Failed_to_analyze_the_image"));
              setIsAnalyzed(false);
              setSelectedImage(null);
              setLabel(t("ai_page.Analysis_failed"));
              setExplanation(""); // 설명 초기화
          }
      } catch (error) {
          console.error("JSON Parsing Error:", error);
          showModalFunction(t("ai_page.Failed_to_analyze_the_image"));
          setIsAnalyzed(false);
          setSelectedImage(null);
          setLabel(t("ai_page.Analysis_failed"));
          setExplanation(""); // 설명 초기화
      }            
    } catch (error: any) {
        console.error("OpenAI Error:", error);
        setIsAnalyzed(false);
        setSelectedImage(null);
        showModalFunction(t("ai_page.Failed_to_analyze_the_image"));
    } finally {
        setLoading(false);
    }
  };

  // 결과 저장 mutation
  const { mutate: saveResultMutate, isPending: isSaving } = useMutation({
    // mutationFn: (formData: FormData) => storeResult(formData, "dental"),
    
    mutationFn: (formData: FormData) => storeDescription(formData),
    onSuccess: () => navigate('/AI-menu', { state: { id: petId } }),
    onError: () => showModalFunction(t("ai_page.Failed_to_save_result._Please_try_again.")),
  });

  // 결과 저장 함수
  const saveResult = () => {
    playSfx(Audios.button_click);
    if (!selectedImage || !isAnalyzed) {
      showModalFunction(t("ai_page.Please_analyze_the_image_before_saving."));
      return;
    }

    const formData = new FormData();
    formData.append(
      'json',
      new Blob(
        [
          JSON.stringify({
            petId, 
            result: label,
            description: explanation,           
        })], { type: 'application/json' })
    );
    formData.append('file', selectedImage);

    saveResultMutate(formData);
  };

    // 재검사 진행 버튼 함수
    const resetAnalysis = () => {
      playSfx(Audios.button_click);
      setLabel(t("ai_page.Upload_an_X-ray_image_to_start_analysis"));
      setSelectedImage(null);
      setExplanation("");
      setIsAnalyzed(false);
    };

    const handleSeeMore = () => {
      playSfx(Audios.button_click);
      setShowFullText(!showFullText)
    }

    return (
        <div className="flex flex-col items-center text-white mx-6 h-screen overflow-x-hidden">
            <TopTitle title={t('ai_page.ai_dental_examination')} back={true} />

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
                    <p className="text-white font-medium text-base whitespace-nowrap">{t("ai_page.click_here")}</p>
                  </>
                )}
              </label>
            </div>

            {/* 분석 전 버튼 */}
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

            {/* 분석 완료 후 UI */}
            {isAnalyzed && (
                <>
                    <div className="mt-4 text-lg font-semibold">
                        <p>{t("ai_page.Analysis_results")}: {label}</p>
                    </div>

                    <div className="mt-4 p-4 bg-gray-800 rounded-xl max-w-sm mx-auto">
                        <p className={`overflow-hidden text-sm ${showFullText ? '' : 'line-clamp-3'}`}>
                            {
                                // 만약 openAI가 보낸 설명(explanation)이 있으면 우선 표시하고,
                                // 없으면 기존 getSymptomDescription(label)로 대체
                                explanation || getSymptomDescription(label)
                            }
                        </p>
                        <div className="flex justify-center mt-2">
                            <button
                                className="mt-2 w-1/2 text-black font-semibold py-2 px-4 rounded-xl"
                                style={{ backgroundColor: '#FFFFFF' }}
                                onClick={handleSeeMore}
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

            {/* 모달 */}
            {(showModal || modalInfo.isVisible) && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 w-full">
                    <div className="bg-white p-6 rounded-lg text-black text-center w-[70%] max-w-[550px]">
                        <p>
                            {modalInfo.isVisible
                                ? modalInfo.message
                                : t("ai_page.Please_upload_an_image_before_analysis.")}
                        </p>
                        <button
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
                            onClick={() => {
                                playSfx(Audios.button_click);
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

export default DentalAnalysis;
