"use client";

import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { Download, Share2, Check } from "lucide-react";

import { PolaroidFrame } from "@/components/PolaroidFrame";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import colorList from "@/utils/color";
import fontList from "@/utils/fonts";
import { exportDivToCanvas } from "@/utils/exportDivToCanvas";
import { Header } from "@/components/Header";

export default function Home() {
  const polaroidRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<{
    caption: string;
    date: string;
    imageFile: string | null;
    imageAfterCrop: string | null;
  }>({
    caption: "",
    date: "",
    imageFile: null,
    imageAfterCrop: null,
  });
  const [showDate, setShowDate] = useState(true);
  const [fontIndex, setFontIndex] = useState(0);
  const [frameIndex, setFrameIndex] = useState(0);
  const [customColor, setCustomColor] = useState<string | null>(null);

  const handleFontChange = useCallback((value: string) => {
    const index = fontList.findIndex((f) => f.font.className === value);
    if (index !== -1) setFontIndex(index);
  }, []);

  const handleColorChange = useCallback((value: string) => {
    const index = colorList.findIndex((c) => c.name === value);
    if (index !== -1) {
      setFrameIndex(index);
      setCustomColor(null);
    }
  }, []);

  const reset = useCallback(() => {
    setData({
      caption: "Your Caption",
      date: "",
      imageFile: null,
      imageAfterCrop: null,
    });
    setShowDate(true);
    setFontIndex(0);
    setFrameIndex(0);
  }, []);

  const handleDownload = useCallback(async () => {
    if (polaroidRef.current?.querySelector("img")) {
      const canvas = await exportDivToCanvas(polaroidRef.current);
      const link = document.createElement("a");
      link.download = "polaroid.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success("Polaroid created successfully!");
    } else {
      toast.error("Please upload an image first!");
    }
  }, []);

  const handleShare = async () => {
    if (polaroidRef.current && polaroidRef.current.querySelector("img")) {
      const canvas = await exportDivToCanvas(polaroidRef.current);
      canvas.toBlob(async (blob) => {
        if (!blob) {
          toast.error("Failed to prepare image for sharing.");
          return;
        }
        const file = new File([blob], "polaroid.png", { type: "image/png" });
        if (navigator.share) {
          try {
            await navigator.share({
              title: "My Polaroid",
              files: [file],
            });
            toast.success("Share initiated!");
          } catch (error) {
            console.log(error);
            toast.error("Sharing failed.");
          }
        } else {
          toast.error("Sharing not supported on this device.");
        }
      });
    } else {
      toast.error("Please upload an image first!");
    }
  };

  const currentColorScheme = {
    frameColor: customColor || colorList[frameIndex]?.frame || "#fff",
    textColor: customColor ? "#000" : colorList[frameIndex]?.text || "#000",
  };
  const currentFontScheme = {
    captionFont: fontList[fontIndex].font.className,
    dateFont: fontList[fontIndex].secondary.className,
  };

  return (
    <div className="min-h-screen h-full md:h-screen  flex flex-col bg-linear-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 w-full flex items-center justify-center p-4 md:p-6">
        <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 items-start md:items-center">
          {/* Left Side: Preview Area */}
          <div className="flex items-center justify-center p-2 order-1 md:order-1">
            <div className="relative group w-full scale-100 md:scale-100">
              {/* Ambient glow behind the polaroid */}
              <PolaroidFrame
                polaroidRef={polaroidRef}
                showDate={showDate}
                frameColor={currentColorScheme.frameColor}
                textColor={currentColorScheme.textColor}
                captionFont={currentFontScheme.captionFont}
                dateFont={currentFontScheme.dateFont}
                caption={data.caption}
                date={data.date}
                imageFile={data.imageFile}
                imageAfterCrop={data.imageAfterCrop}
                onCaptionChange={(value) =>
                  setData((prev) => ({ ...prev, caption: value }))
                }
                onDateChange={(value) =>
                  setData((prev) => ({ ...prev, date: value }))
                }
                onImageChange={(value) =>
                  setData((prev) => ({
                    ...prev,
                    imageFile: value,
                    imageAfterCrop: null,
                  }))
                }
                onCropChange={(value) =>
                  setData((prev) => ({ ...prev, imageAfterCrop: value }))
                }
                onReset={reset}
              />
            </div>
          </div>

          {/* Right Side: Controls */}
          <div className="flex flex-col gap-6 bg-white/5 p-4 md:p-8 rounded-xl backdrop-blur-xl border border-white/10 shadow-2xl order-2 md:order-2">
            <div className="space-y-4">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between px-4 py-3 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                  <label
                    htmlFor="showDate"
                    className="text-white font-medium text-sm cursor-pointer"
                  >
                    Show Date
                  </label>
                  <Checkbox
                    id="showDate"
                    className="border-white/50 data-[state=checked]:bg-white data-[state=checked]:text-black"
                    checked={showDate}
                    onCheckedChange={() => setShowDate((prev) => !prev)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-slate-400 uppercase tracking-wider font-semibold px-1">
                    Typography
                  </label>
                  <Select
                    defaultValue={currentFontScheme.captionFont}
                    onValueChange={handleFontChange}
                  >
                    <SelectTrigger className="w-full h-11 bg-white/5 border-white/10 text-white px-4 outline-hidden hover:bg-white/10 transition-colors">
                      <SelectValue placeholder="Select a font" />
                    </SelectTrigger>
                    <SelectContent>
                      {fontList.map((font, idx) => (
                        <SelectItem key={idx} value={font.font.className}>
                          {font.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-400 uppercase tracking-wider font-semibold px-1">
                  Frame Style
                </label>
                <div className="grid grid-cols-5 gap-3">
                  {colorList.map((color, idx) => (
                    <div
                      key={idx}
                      className={`relative group cursor-pointer transition-all duration-200 h-10 ${
                        idx === frameIndex && !customColor
                          ? ""
                          : "hover:scale-105 opacity-70 hover:opacity-100"
                      }`}
                      onClick={() => handleColorChange(color.name)}
                      title={color.name}
                    >
                      <div
                        className="w-full h-full rounded-lg shadow-lg border border-white/10"
                        style={{
                          backgroundColor: color.frame,
                        }}
                      >
                        {idx === frameIndex && !customColor && (
                          <div className="w-full h-full flex items-center justify-center">
                            <Check
                              className="w-5 h-5"
                              style={{ color: color.text }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  <div
                    className={`relative group cursor-pointer transition-all duration-200 h-10 ${
                      customColor
                        ? ""
                        : "hover:scale-105 opacity-70 hover:opacity-100"
                    }`}
                    title="Custom Color"
                  >
                    <div className="w-full h-full rounded-lg shadow-lg border border-white/10 bg-linear-to-br from-pink-500 via-purple-500 to-blue-500 flex items-center justify-center overflow-hidden">
                      <input
                        type="color"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) => {
                          setCustomColor(e.target.value);
                          setFrameIndex(-1);
                        }}
                        value={customColor || "#ffffff"}
                      />
                      <span className="text-white font-bold text-xl">+</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleDownload}
                className="flex-1 h-12 text-lg font-medium bg-white text-black hover:bg-slate-200"
                title="Download"
              >
                <Download className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                onClick={handleShare}
                className="flex-1 h-12 text-lg font-medium border-white/20 text-white hover:bg-white/10 hover:text-white"
                title="Share"
              >
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full p-6 text-center border-t border-white/5 bg-black/20 backdrop-blur-xs">
        <p className="text-slate-500 text-sm">
          Made with ❤️ by{" "}
          <a
            href="https://github.com/ShreyNagda"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-white transition-colors"
          >
            Shrey Nagda
          </a>
        </p>
      </footer>
    </div>
  );
}
