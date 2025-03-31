"use client";
import { useState } from "react";
import { IKUpload } from "imagekitio-next";
import { Loader2 } from "lucide-react";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";

interface FileUploadProps {
    onSuccess: (res: IKUploadResponse) => void;
    onProgress?: (progress: number) => void;
    fileType?: "image" | "video";
}

export default function FileUpload({
    onSuccess,
    onProgress,
    fileType = "image"
}: FileUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
  const onError = (err: {message: string}) => {
    setError(err.message);
    setUploading(false);
  };
  
  const handleSuccess = (response: IKUploadResponse) => {
    setUploading(false);
    setError(null);
    onSuccess(response);
  };
  
  const handleProgress = (evt: ProgressEvent) => {
    if(evt.lengthComputable && onProgress){
        const percentComplete = (evt.loaded / evt.total) * 100;
        onProgress(Math.round(percentComplete));
    }
  };
  
  const handleStartUpload = () => {
    setUploading(true);
    setError(null);
  };

  const validateFile = (file: File) => {
    if(fileType === "video") {
        if(!file.type.startsWith("video/")){
            setError("Please upload a video file");
            return false;
        }
        if(file.size > 100*1024*1024){
            setError("File size exceeds 100MB");
            return false;
        }
    }else {
        const validTypes = ["image/jpeg", "image/png", "image/webp"];
        if(!validTypes.includes(file.type)){
            setError("Please upload a valid image file");
            return false;
        }
        if(file.size > 5*1024*1024){
            setError("File size exceeds 5MB");
            return false;
        }
    }
    return false;
  }
  return (
    <div className="space-y-2">
        <IKUpload
          fileName={fileType === "video" ? "video" : "image"}
          useUniqueFileName={true}
          validateFile={validateFile}
          onError={onError}
          onSuccess={handleSuccess}
          onUploadProgress={handleProgress}
          onUploadStart={handleStartUpload}
          folder={fileType === "video" ? "/videos" : "/images"}
          className="file-input file-input-bordered w-full"
          accept={fileType === 'video' ? 'video/*' : 'image/*'}
        />
        {
            uploading && (
                <div className="flex items-centern gap-2 text-sm text-primary">
                    <Loader2 className="animate-spin w-4 h-4" />
                    <span>Uploading...</span>
                </div>
            )
        }
        {error && <div className="text-red-500 text-sm">{error}</div>}
    </div>
  );
}