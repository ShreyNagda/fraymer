"use client";

import { Area } from "react-easy-crop";
import { FilePicker } from "./FilePicker";
import { ImageCropper } from "./ImageCropper";
import { useRef, useState } from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { RotateCcw } from "lucide-react";

interface PolaroidFrameProps {
  polaroidRef: React.RefObject<HTMLDivElement | null>;
  showDate: boolean;
  frameColor?: string;
  textColor?: string;
  captionFont?: string;
  dateFont?: string;
  caption: string;
  date: string;
  imageFile: string | null;
  imageAfterCrop: string | null;
  onCaptionChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onImageChange: (value: string | null) => void;
  onCropChange: (value: string | null) => void;
  onReset: () => void;
}

export function PolaroidFrame({
  polaroidRef,
  showDate,
  frameColor = "#fff",
  textColor = "#000",
  captionFont = "",
  dateFont = "",
  caption,
  date,
  imageFile,
  imageAfterCrop,
  onCaptionChange,
  onDateChange,
  onImageChange,
  onCropChange,
  onReset,
}: PolaroidFrameProps) {
  const [cropperOpen, setCropperOpen] = useState(false);

  const handleImageUpload = (value: string | null) => {
    onImageChange(value);
    if (value) {
      setCropperOpen(true);
    }
  };

  const dateRef = useRef<HTMLInputElement>(null);

  // Helper function for formatting date
  const formatToDDMMYYYY = (value: string) => {
    if (!value) return "";
    const [year, month, day] = value.split("-");
    return `${day}/${month}/${year}`;
  };

  const onCropDone = (croppedArea: Area): void => {
    const canvasElement = document.createElement("canvas");
    canvasElement.width = croppedArea.width;
    canvasElement.height = croppedArea.height;

    const ctx = canvasElement.getContext("2d");
    const imgObject = new window.Image();
    imgObject.src = imageFile!;

    imgObject.onload = function () {
      ctx?.drawImage(
        imgObject,
        croppedArea.x,
        croppedArea.y,
        croppedArea.width,
        croppedArea.height,
        0,
        0,
        croppedArea.width,
        croppedArea.height
      );
      onCropChange(canvasElement.toDataURL("image/png"));
      setCropperOpen(false);
    };
  };

  const onCropCancel = () => {
    setCropperOpen(false);
    // If we cancel cropping a NEW image (no previous crop), we might want to keep the uncropped version or reset?
    // Current behavior: keeps uncropped.
    onCropChange(imageAfterCrop || imageFile);
  };

  const resetData = () => {
    onReset();
  };

  return (
    <div className="relative">
      <div
        className="relative transition-all duration-500 ease-out hover:scale-[1.02]"
        ref={polaroidRef}
        style={{
          backgroundColor: frameColor,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "18px",
          width: "100%",
          maxWidth: "320px",
          margin: "0 auto",
          aspectRatio: "1 / 1.2",
          boxShadow:
            "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1), 0 0 4px 0px rgb(0 0 0 / 0.1)",
        }}
      >
        {/* Paper Texture Overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply z-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
        <div
          className="w-full aspect-square relative z-0 overflow-hidden"
          style={{
            backgroundColor: frameColor,
            color: textColor,
          }}
        >
          {imageFile == null ? (
            <FilePicker setImage={handleImageUpload} />
          ) : imageAfterCrop == null ? (
            <div className="flex items-center justify-center w-full h-full overflow-hidden relative">
              {/* Main Image */}
              <Image
                src={imageFile}
                alt="image"
                fill
                className="z-10 shadow-lg object-contain"
                unoptimized
              />
            </div>
          ) : (
            <div className="flex items-center justify-center w-full h-full overflow-hidden relative">
              <Image
                src={imageAfterCrop}
                alt="image"
                fill
                className="object-cover object-center"
                unoptimized
              />
            </div>
          )}
        </div>

        <div className="w-full text-left">
          <input
            autoComplete="off"
            type="text"
            style={{
              color: textColor,
              fontSize: "18px",
              fontWeight: "bold",
              width: "100%",
              border: "none",
              outline: "none",
              marginTop: showDate ? "5px" : "15px",
            }}
            value={caption}
            name="caption"
            placeholder="Your Caption"
            className={`bg-transparent  ${captionFont}`}
            onChange={(ev) => onCaptionChange(ev.target.value)}
          />

          {showDate && (
            <div>
              <input
                type="date"
                ref={dateRef}
                className="hidden"
                value={date}
                onChange={(e) => onDateChange(e.target.value)}
              />
              <label
                onClick={() => dateRef?.current?.showPicker?.()}
                style={{
                  color: textColor,
                  fontSize: "15px",
                  fontWeight: "lighter",
                  width: "100%",
                  border: "none",
                  outline: "none",
                  backgroundColor: "transparent",
                  display: "block",
                  cursor: "pointer",
                }}
                className={`${dateFont}`}
              >
                {formatToDDMMYYYY(date) || "Select a date"}
              </label>
            </div>
          )}
        </div>
      </div>
      {imageFile && (
        <div className="m-5 flex items-center justify-center gap-4 z-50">
          <ImageCropper
            image={imageFile}
            onCropDone={onCropDone}
            onCropCancel={onCropCancel}
            open={cropperOpen}
            setOpen={setCropperOpen}
          />
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/10 backdrop-blur-md gap-2 w-full"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="text-black text-center sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Reset Polaroid?</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                This will remove your current image and settings. This action
                cannot be undone.
              </DialogDescription>
              <div className="flex justify-center gap-3 mt-6">
                <DialogClose asChild>
                  <Button variant="secondary">Cancel</Button>
                </DialogClose>
                <Button variant="destructive" onClick={resetData}>
                  Yes, Reset
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}
