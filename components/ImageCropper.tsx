"use client";

import { useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import { Crop } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";

export function ImageCropper({
  image,
  onCropDone,
  onCropCancel,
  open,
  setOpen,
}: {
  image: string;
  onCropDone: (croppedArea: Area) => void;
  onCropCancel: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [aspectRatio] = useState(1); // You can change this if needed

  function onCropComplete(_: Area, croppedAreaPixels: Area) {
    setCroppedArea(croppedAreaPixels);
  }

  const handleCropApply = () => {
    if (croppedArea) {
      onCropDone(croppedArea);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          className="bg-white/10 hover:bg-white/20 text-white border border-white/10 backdrop-blur-md gap-2 w-full"
        >
          <Crop className="w-4 h-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[90vw] w-full sm:max-w-3xl p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>Crop Image</DialogTitle>
        </DialogHeader>

        <div className="relative w-full h-[400px] bg-muted">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <DialogFooter className="p-4 border-t flex justify-between gap-2">
          <DialogClose asChild>
            <Button variant="secondary" onClick={onCropCancel}>
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleCropApply}>Crop & Apply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
