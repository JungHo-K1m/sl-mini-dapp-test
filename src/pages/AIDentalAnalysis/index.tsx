import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { useMutation } from '@tanstack/react-query';
import Images from "@/shared/assets/images";
import storeResult from '@/entities/AI/api/stroeResult';
import OpenAI from 'openai';
import { TopTitle } from '@/shared/components/ui';

const DentalAnalysis: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { i18n, t } = useTranslation();

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
            message: t("ai_page.Please_upload_actual_photo")
        });
    }, []);

    // 이미지 업로더
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
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

    // 이미지 분석 함수
    const analyzeImage = async () => {
        if (!selectedImage) {
            showModalFunction(t("ai_page.Please_upload_an_image_before_analysis."));
            return;
        }

        setLoading(true);

        try {
            // 1) File을 Base64 문자열로 변환
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
                    {
                      "role": "assistant",
                      "content": [
                        {
                          "type": "text",
                          "text": "{\"animal_type\":\"cat\",\"image_type\":\"x-ray\",\"diagnosis\":{\"diagnostic_name\":\"Periodontitis\",\"explanation\":\"The dental x-ray indicates advanced periodontal disease, known as periodontitis. In this condition, the supporting structures of the teeth, including the gums and bone, are damaged due to bacterial infection. The image suggests bone loss and possible formation of periodontal pockets, typical indicators of periodontitis. This disease can eventually lead to tooth loss if not addressed. Managing such a condition involves thorough cleaning and, in severe cases, might require surgical intervention to prevent further damage.\"}}"
                        }
                      ]
                    },
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
                    {
                      "role": "assistant",
                      "content": [
                        {
                          "type": "text",
                          "text": "{\"image_type\":\"x-ray\",\"is_tooth_image\":true,\"diagnosis\":{\"diagnostic_name\":\"Periodontitis\",\"description\":\"The dental x-ray suggests signs of periodontitis, which is an advanced stage of gum disease involving bone loss around teeth. This can lead to loose teeth if not treated.\"},\"final_answer\":\"The x-ray shows signs consistent with periodontitis, indicating bone loss around the teeth.\"}"
                        }
                      ]
                    },
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
                    {
                      "role": "assistant",
                      "content": [
                        {
                          "type": "text",
                          "text": "{\"image_type\":\"dog\",\"is_tooth_image\":false,\"diagnosis\":{\"diagnostic_name\":\"Normal\",\"description\":\"This is an image of a dog during a bath, with shampoo lather on its coat. There's nothing diagnostically significant to find; the dog appears to be in a normal bathing situation.\"},\"final_answer\":\"The image is of a dog receiving a bath, appearing normal and healthy.\"}"
                        }
                      ]
                    }
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
                            "description": "Indicates whether the image is of a dog, cat, an X-ray, or other.",
                            "enum": [
                              "dog",
                              "cat",
                              "x-ray",
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
                                "description": `A detailed explanation of the diagnosis, translated into ${i18n.language}, at least 200 characters.`
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
            });

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
                if (parsedData.image_type === "x-ray") {
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
                } else if ((parsedData.image_type === "dog" || parsedData.image_type === "cat") && parsedData.is_tooth_image === true && parsedData.diagnosis) {
                    // 분석 성공: 진단 결과 표시
                    console.log("분석을 정상적으로 했어요.");
                    
                    const originalExplanation = parsedData.diagnosis.description;
            
                    // // OpenAI Chat 모델을 사용하여 설명 번역
                    // const translateExplanation = async (text: string, targetLanguage: string) => {
                    //     try {
                    //         const response = await openai.chat.completions.create({
                    //             model: "gpt-4o",
                    //             messages: [
                    //                 {
                    //                     role: "system",
                    //                     content: `You are a translation assistant. Translate the following text into ${targetLanguage}:`,
                    //                 },
                    //                 {
                    //                     role: "user",
                    //                     content: text,
                    //                 },
                    //             ],
                    //         });
            
                    //         const translatedText = response?.choices?.[0]?.message?.content?.trim();
                    //         return translatedText || text; // 번역 실패 시 원본 텍스트 반환
                    //     } catch (error) {
                    //         console.error("Translation Error:", error);
                    //         return text; // 번역 실패 시 원본 텍스트 반환
                    //     }
                    // };
            
                    // // 번역 실행
                    // const translatedExplanation = await translateExplanation(
                    //     originalExplanation,
                    //     i18n.language // 현재 언어 코드 사용
                    // );
            
                    setLabel(parsedData.diagnosis.diagnostic_name);
                    setExplanation(originalExplanation);
                    setIsAnalyzed(true);
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
            showModalFunction(t("ai_page.Failed_to_analyze_the_image"));
        } finally {
            setLoading(false);
        }
    };

    // 결과 저장 mutation
    const { mutate: saveResultMutate, isPending: isSaving } = useMutation({
        mutationFn: (formData: FormData) => storeResult(formData, "dental"),
        onSuccess: () => navigate('/AI-menu', { state: { id: petId } }),
        onError: () => showModalFunction(t("ai_page.Failed_to_save_result._Please_try_again.")),
    });

    // 결과 저장 함수
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

    // 재검사 진행 버튼 함수
    const resetAnalysis = () => {
        setLabel(t("ai_page.Upload_an_X-ray_image_to_start_analysis"));
        setSelectedImage(null);
        setExplanation("");
        setIsAnalyzed(false);
    };

    return (
        <div className="flex flex-col items-center text-white mx-6 h-screen overflow-x-hidden">
            <TopTitle title={t('ai_page.ai_dental_examination')} back={true} />

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

            {/* 분석 전 버튼 */}
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
