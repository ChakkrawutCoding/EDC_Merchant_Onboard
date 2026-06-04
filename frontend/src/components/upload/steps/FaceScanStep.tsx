import { useEffect, useRef, useState } from "react";

import {
    AlertCircle,
    Camera,
    CheckCircle2,
    Loader2,
    RefreshCcw,
    ScanFace,
    UserCheck,
} from "lucide-react";

import type { FormData } from "@/types/form";

type FaceScanStepProps = {
    formData: FormData;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
};

type VerificationResult = {
    matched: boolean;
    score: number;
};

export default function FaceScanStep({ formData, setFormData }: FaceScanStepProps) {
    const videoRef = useRef<HTMLVideoElement | null>(null); //Kept Video Element
    const streamRef = useRef<MediaStream | null>(null); //Kept Camera Stream

    const [isCameraReady, setIsCameraReady] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [cameraError, setCameraError] = useState("");

    const hasPassedVerification = formData.faceVerification?.matched === true;

    const dataUrlSize = (dataUrl: string) => { //ใช้คำนวณขนาดไฟล์จาก Base64
        const base64 = dataUrl.split(",")[1] ?? "";
        return Math.round((base64.length * 3) / 4);
    };

    const verifyFaceMatch = async (): Promise<VerificationResult> => { //Mock up ไว้ก่อน เพราะจริง ๆ ต้องใช้ api
        await new Promise((resolve) => setTimeout(resolve, 1200));

        return {
            matched: true,
            score: 0.91,
        };
    };

    const stopCamera = () => {
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.srcObject = null;
        }

        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;

        setIsCameraReady(false);
    };

    const startCamera = async () => {
        if (!navigator.mediaDevices?.getUserMedia) {
            setCameraError("เบราว์เซอร์นี้ไม่รองรับการเปิดกล้อง");
            return;
        }

        try {
            setCameraError("");
            stopCamera();

            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: "user",
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                },
                audio: false,
            });

            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;

                try {
                    await videoRef.current.play();
                    setIsCameraReady(true);
                } catch (error) {
                    console.warn("Video play was interrupted:", error);
                }
            }
        } catch (error) {
            console.error("Start camera failed:", error);
            setCameraError("ไม่สามารถเปิดกล้องได้ กรุณาอนุญาตการใช้งานกล้อง");
        }
    };

    useEffect(() => {
        if (!formData.faceScan) {
            startCamera();
        }

        return () => {
            stopCamera();
        };
    }, [formData.faceScan]);
    
    const handleCapture = async () => { //กดปุ่ม สแกนใบหน้า จะเข้าตัวนี้
        if (!videoRef.current || !isCameraReady || isVerifying) return; //ไม่มี Video, กล้องยังไม่พร้อม, กำลังตรวจอยู่ 

        if (!formData.citizenIdCard) { //เช็คอัปโหลดบัตรประชาชนหรือยัง
            alert("กรุณาอัปโหลดบัตรประชาชนในขั้นตอนที่ 3 ก่อนสแกนใบหน้า");
            return;
        }

        const video = videoRef.current;
        const canvas = document.createElement("canvas"); //สร้าง Canvas

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const context = canvas.getContext("2d");

        if (!context) return;

        context.drawImage(video, 0, 0, canvas.width, canvas.height); //แคปภาพจาก Webcam ใส่ลง Canvas

        const base64 = canvas.toDataURL("image/jpeg", 0.92); //แปลงเป็น Base64

        setIsVerifying(true);

        try {
            const result = await verifyFaceMatch();

            setFormData((prev) => ({
                ...prev,
                faceScan: {
                    name: "face-scan.jpg",
                    type: "image/jpeg",
                    size: dataUrlSize(base64),
                    base64,
                },
                faceVerification: {
                    matched: result.matched,
                    score: result.score,
                    checkedAt: new Date().toISOString(),
                },
            }));

            if (result.matched) {
                stopCamera();
            }
        } catch (error) {
            console.error("Face verification failed:", error);
            alert("ตรวจสอบใบหน้าไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
        } finally {
            setIsVerifying(false);
        }
    };

    const handleRetake = () => {
        setFormData((prev) => ({
            ...prev,
            faceScan: null,
            faceVerification: null,
        }));
    };

    return (
        <div className="mt-10 flex justify-center">
            <div className="flex w-[min(92vw,620px)] flex-col rounded-3xl border border-gray-300 bg-white p-5 shadow-sm">
                <div className="relative flex h-[420px] items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-gray-500 bg-[#F8FBFF]">
                    {formData.faceScan ? (
                        <img
                            src={formData.faceScan.base64}
                            alt="Face scan"
                            className="h-full w-full object-cover"
                        />
                    ) : cameraError ? (
                        <div className="flex flex-col items-center px-8 text-center text-gray-700">
                            <AlertCircle className="h-14 w-14 text-red-500" />
                            <p className="mt-4 text-lg font-medium">{cameraError}</p>
                        </div>
                    ) : (
                        <>
                            <video
                                ref={videoRef}
                                muted
                                playsInline
                                className="h-full w-full scale-x-[-1] object-cover"
                            />

                            {!isCameraReady && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#F8FBFF] text-gray-700">
                                    <Loader2 className="h-10 w-10 animate-spin" />
                                    <p className="mt-4">กำลังเปิดกล้อง</p>
                                </div>
                            )}

                            <div className="pointer-events-none absolute inset-8 rounded-full border-4 border-white/80 shadow-[0_0_0_999px_rgba(15,23,42,0.28)]" />
                        </>
                    )}
                </div>

                <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        {hasPassedVerification ? (
                            <div className="flex items-center gap-2 text-green-600">
                                <CheckCircle2 className="h-5 w-5" />
                                <span className="font-medium">
                                    ยืนยันใบหน้าสำเร็จ ({Math.round((formData.faceVerification?.score ?? 0) * 100)}%)
                                </span>
                            </div>
                        ) : formData.faceVerification ? (
                            <div className="flex items-center gap-2 text-red-600">
                                <AlertCircle className="h-5 w-5" />
                                <span className="font-medium">ใบหน้าไม่ตรงกับบัตรประชาชน</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-gray-700">
                                <ScanFace className="h-5 w-5" />
                                <span>จัดใบหน้าให้อยู่ในกรอบ แล้วกดสแกนใบหน้า</span>
                            </div>
                        )}

                        <p className="mt-1 text-sm text-gray-500">
                            โหมดนี้เป็นตัวอย่าง flow สำหรับต่อ API ตรวจใบหน้าจริง
                        </p>
                    </div>

                    <div className="flex gap-3">
                        {formData.faceScan && (
                            <button
                                type="button"
                                onClick={handleRetake}
                                className="inline-flex items-center gap-2 rounded-xl bg-gray-600 px-5 py-3 text-white transition hover:bg-gray-700"
                            >
                                <RefreshCcw className="h-5 w-5" />
                                ถ่ายใหม่
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={handleCapture}
                            disabled={!isCameraReady || isVerifying}
                            className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-white transition ${
                                !isCameraReady || isVerifying
                                    ? "cursor-not-allowed bg-gray-300"
                                    : "bg-[#0A84E8] hover:bg-blue-700"
                            }`}
                        >
                            {isVerifying ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : hasPassedVerification ? (
                                <UserCheck className="h-5 w-5" />
                            ) : (
                                <Camera className="h-5 w-5" />
                            )}
                            {isVerifying
                                ? "กำลังตรวจสอบ"
                                : hasPassedVerification
                                  ? "สแกนผ่านแล้ว"
                                  : "สแกนใบหน้า"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

/*  Flow

    เปิดหน้า
        ↓
    useEffect ทำงาน
        ↓
    เปิด Webcam
        ↓
    Video แสดงภาพ
        ↓
    กด "สแกนใบหน้า"
        ↓
    Capture รูปจาก Video
        ↓
    Canvas
        ↓
    Base64
        ↓
    ส่ง API Face Match
        ↓
    ได้ผลลัพธ์
        ↓
    เก็บใน formData
        ↓
    แสดงผลผ่าน / ไม่ผ่าน
    
*/