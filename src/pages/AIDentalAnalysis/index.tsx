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
                            "detail": "high"
                        }
                      }
                    ]
                  },
                  {
                    "role": "assistant",
                    "content": [
                      {
                        "type": "text",
                        "text": "{\"classification\":\"dog\",\"tooth_image\":\"true\",\"diagnosis\":{\"diagnostic_name\":\"Gingivitis & Plaque\",\"explanation\":\"The image shows obvious signs of gingivitis and plaque buildup. The gums appear inflamed and swollen, which are indicators of gingivitis, while the discolored patches on the teeth suggest the accumulation of plaque. If left untreated, this condition can progress into periodontitis, causing significant dental and health issues for the animal. Routine dental care and professional cleaning might be necessary to address this.\"}}"
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
                            "detail": "high"
                        }
                      }
                    ]
                  },
                  {
                    "role": "assistant",
                    "content": [
                      {
                        "type": "text",
                        "text": "{\"classification\":\"NOPE\",\"tooth_image\":\"Non dental\",\"diagnosis\":{\"diagnostic_name\":\"Normal\",\"explanation\":\"This image does not contain a dental context, so there is no diagnosis to be provided. It is rather an architectural or landscape image likely showing a well-known building illuminated at night.\"}}"
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
                            "detail": "high"
                        }
                      }
                    ]
                  },
                  {
                    "role": "assistant",
                    "content": [
                      {
                        "type": "text",
                        "text": "{\"classification\":\"dog\",\"tooth_image\":\"Non dental\",\"diagnosis\":{\"diagnostic_name\":\"Normal\",\"explanation\":\"The image depicts a dog during bath time, with soap or foam on its head for a playful touch. There are no visible dental elements or context to analyze for dental health assessment. This image provides a charming and lighthearted view of a pet care routine.\"}}"
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
                        "classification": {
                          "type": "string",
                          "description": "Determine whether the image is of a dog, cat, or neither.",
                          "enum": [
                            "dog",
                            "cat",
                            "NOPE"
                          ]
                        },
                        "tooth_image": {
                          "type": "string",
                          "description": "Indicates if the image is a tooth image.",
                          "enum": [
                            "true",
                            "false",
                            "Non dental"
                          ]
                        },
                        "diagnosis": {
                          "type": "object",
                          "description": "If it is a tooth image, provide the diagnosis details.",
                          "properties": {
                            "diagnostic_name": {
                              "type": "string",
                              "description": "Name of the diagnosis related to dental health.",
                              "enum": [
                                "Gingivitis & Plaque",
                                "Periodontitis",
                                "Normal"
                              ]
                            },
                            "explanation": {
                              "type": "string",
                              "description": "Detailed explanation of the diagnosis with at least 200 characters."
                            }
                          },
                          "required": [
                            "diagnostic_name",
                            "explanation"
                          ],
                          "additionalProperties": false
                        }
                      },
                      "required": [
                        "classification",
                        "tooth_image",
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
                if (parsedData.classification === "NOPE" || parsedData.tooth_image === "Non dental") {
                    // 치아 이미지가 아닌 경우
                    showModalFunction(t("ai_page.Please_upload_pets_tooth_image"));
                    setIsAnalyzed(false);
                    setLabel("Non dental");
                    setSelectedImage(null);
                    setExplanation(""); // 설명 초기화
                } else if (
                    parsedData.classification === "dog" &&
                    parsedData.tooth_image === "true" &&
                    parsedData.diagnosis
                ) {
                    // 분석 성공: 진단 결과 표시
                    const originalExplanation = parsedData.diagnosis.explanation;
            
                    // OpenAI Chat 모델을 사용하여 설명 번역
                    const translateExplanation = async (text: string, targetLanguage: string) => {
                        try {
                            const response = await openai.chat.completions.create({
                                model: "gpt-4o",
                                messages: [
                                    {
                                        role: "system",
                                        content: `You are a translation assistant. Translate the following text into ${targetLanguage}:`,
                                    },
                                    {
                                        role: "user",
                                        content: text,
                                    },
                                ],
                            });
            
                            const translatedText = response?.choices?.[0]?.message?.content?.trim();
                            return translatedText || text; // 번역 실패 시 원본 텍스트 반환
                        } catch (error) {
                            console.error("Translation Error:", error);
                            return text; // 번역 실패 시 원본 텍스트 반환
                        }
                    };
            
                    // 번역 실행
                    const translatedExplanation = await translateExplanation(
                        originalExplanation,
                        i18n.language // 현재 언어 코드 사용
                    );
            
                    setLabel(parsedData.diagnosis.diagnostic_name);
                    setExplanation(translatedExplanation);
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

    const translateResponse = async (originalText: string, targetLanguage: string) => {
        try {
            const response = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: `You are a translation assistant. Translate the following text into ${targetLanguage}:`,
                    },
                    {
                        role: "user",
                        content: originalText,
                    },
                ],
            });
    
            const translatedText = response?.choices?.[0]?.message?.content?.trim();
            console.log("Translated Text:", translatedText);
    
            return translatedText;
        } catch (error) {
            console.error("Translation Error:", error);
            return null;
        }
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
