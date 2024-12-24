import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { useMutation } from '@tanstack/react-query';
import Images from "@/shared/assets/images";
import storeResult from '@/entities/AI/api/stroeResult';
import { TopTitle } from '@/shared/components/ui';

const DentalAnalysis: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

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

            // 2) ChatCompletion API에 보낼 메시지 (분석 가이드라인 + Base64 이미지)
            const requestBody = {
                model: "gpt-4o",
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: `제공된 이미지에 대해 다음과 같이 분석하라:
                                        1. 강아지인지 고양이인지 판단하라.
                                        - 강아지나 고양이가 아닌 경우: "NOPE"이라고 답변하라.
                                        - 강아지나 고양이가 맞는 경우: 해당 이미지가 강아지/고양이의 치아 이미지인지 판단하라.
                                        - 치아 이미지가 아닌 경우: "Non dental"이라고 답변하라.
                                        2. 치아 이미지가 맞는 경우, 아래 질병을 판별하여 "진단명" : "설명"으로 답변한다. "설명"은 사진에 대한 진단의 상세 내용이다.
                                        - 진단명 클래스 : "Gingivitis & Plaque","Periodontitis", "Normal"
                                        답변은 "NOPE" ,"Non dental", "진단명":"설명" 중 하나로만 한다. 이때, "진단명":"설명"은 2번의 결과이다.`
                            },
                            {
                                type: "image_url",
                                image_url: {
                                    url: `data:image/${getImageExtension(selectedImage)};base64,${base64Data}`
                                }
                            }
                        ]
                    },
                ],
                max_tokens: 300
            };

            // 3) OpenAI API 호출
            const OPENAI_API_KEY = import.meta.env.VITE_OPEN_AI_API_KEY;
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`OpenAI API Error: ${response.status} ${response.statusText}`);
            }

            // 4) 응답(JSON) 파싱
            const responseData = await response.json();
            console.log("openAI 응답: ", responseData);
            // 모델이 최종 생성한 텍스트
            const assistantMessage = responseData?.choices?.[0]?.message?.content?.trim() || "(No response)";

            // 5) 응답에 따른 분기 처리
            if (assistantMessage === "NOPE") {
                // 요구사항 1: "NOPE"인 경우 모달
                showModalFunction("반려동물의 치아 이미지를 업로드해주세요.");
                setIsAnalyzed(false);
                setLabel("NOPE"); // 상태 표시 (원하시면 변경/생략 가능)
            } 
            else if (assistantMessage === "Non dental" || assistantMessage === "None-Dental") {
                // 요구사항 2: "Non dental"인 경우 모달
                showModalFunction("치아가 보이는 이미지로 다시 업로드해주세요.");
                setIsAnalyzed(false);
                setLabel("Non dental"); // 상태 표시 (원하시면 변경/생략 가능)
            } 
            else {
                // 요구사항 3: 응답이 "진단명 + 설명"인 경우
                // 예: "Gingivitis & Plaque: 치석이 심한 상태입니다."
                // 콜론(:) 기준으로 진단명과 설명을 분리하는 예시
                if (assistantMessage.includes(":")) {
                    const splitted = assistantMessage.split(":");
                    const diagnosis = splitted[0].trim();
                    const desc = splitted.slice(1).join(":").trim(); // 콜론이 여러 번 있을 경우 대비

                    setLabel(diagnosis);    // 진단명
                    setExplanation(desc);    // 설명
                } else {
                    // 만약 콜론(:)이 없다면, 진단명만 있다고 보고 설명은 비우기
                    setLabel(assistantMessage);
                    setExplanation("");
                }
                setIsAnalyzed(true);
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
