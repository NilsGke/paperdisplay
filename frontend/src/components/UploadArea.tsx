import { useEffect, useRef, useState } from "react";
import { Button, buttonVariants } from "./ui/button";
import { Input } from "./ui/input";
import { PlusCircledIcon, Cross2Icon, UploadIcon } from "@radix-ui/react-icons";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import dataUrlFromImageFile from "@/helpers/dataUrlFromImagefile";
import { env } from "@/env";
import { Slider } from "./ui/slider";

export default function UplaodArea() {
  const [file, setFile] = useState<File | null>(null);
  const [filename, setFilename] = useState("");
  const [htmlImage, setHtmlImage] = useState<HTMLImageElement | null>(null);
  const [size, setSize] = useState(100);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationFn: async () => {
      if (file === null) throw Error("no file selected");
      const data = new FormData();

      data.append(
        "file",
        new File([file], filename, {
          // necessary because here we can change the filename
          type: file.type,
          lastModified: file.lastModified,
        })
      );
      data.append("user", "hubot");
      return fetch("/api/addImage", {
        method: "POST",
        body: data,
      });
    },
    onSuccess: async (response) => {
      if (response.status === 200) {
        navigate("/");
        return toast.success("successfully uploaded image!");
      } else {
        toast.error(response.statusText);
        toast.error(await response.text());
      }
    },
    onError: (error) => {
      toast.error(error.message ?? error);
    },
  });

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (fileList === null || fileList.length === 0) {
      toast.warn("No file selected");
      return;
    }
    const file = fileList[0];
    // ensure file is bmp file
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image");
      return;
    }
    setFile(file);
    setFilename(file.name);
  };

  useEffect(() => {
    if (file === null || canvasRef.current === null) return;

    dataUrlFromImageFile(file).then((imageUrl) => {
      const base_image = new Image();
      base_image.src = imageUrl;
      base_image.onload = () => setHtmlImage(base_image);
    });
  }, [file, size]);

  useEffect(() => {
    if (htmlImage === null) return;

    const canvas = canvasRef.current;
    if (canvas === null) return;

    const context = canvas.getContext("2d");
    if (context === null) return;

    context.clearRect(0, 0, canvas.width, canvas.height);

    const imgLength = (htmlImage.width / 100) * size;
    const imgHeight = (htmlImage.height / 100) * size;

    context.drawImage(
      htmlImage,
      0,
      0,
      htmlImage.width,
      htmlImage.height,
      canvas.width / 2 - imgLength / 2,
      canvas.height / 2 - imgHeight / 2,
      imgLength,
      imgHeight
    );
  }, [htmlImage, size]);

  return (
    <label
      htmlFor="fileInput"
      className={cn(
        file === null && buttonVariants({ variant: "ghost" }),
        "flex cursor-pointer border border-dashed w-[30rem]",
        file === null && "h-[20vh]",
        file !== null && "cursor-auto flex-col gap-2 rounded"
      )}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();

        let newFile: File;

        if (e.dataTransfer.items) {
          // Use DataTransferItemList interface to access the file(s)
          const item = [...e.dataTransfer.items].at(0);

          if (item === undefined || item.kind !== "file")
            return toast.error("did not receive a file");

          const parsed = item.getAsFile();
          if (parsed === null) return toast.error("could not parse file");
          newFile = parsed;
        } else {
          // Use DataTransfer interface to access the file(s)
          const item = e.dataTransfer.files.item(0);
          if (item === null) return toast.error("could not get file from drop");
          newFile = item;
        }

        setFile(newFile);
        setFilename(newFile.name);
      }}
    >
      {file === null ? (
        <>
          <Input
            id="fileInput"
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={onChange}
          />
          <PlusCircledIcon /> Upload Image from Computer
        </>
      ) : (
        <>
          <div className="p-2 animate-in fade-in">
            <canvas
              className="w-full h-auto mb-3 rounded"
              height={env.VITE_CANVAS_HEIGHT}
              width={env.VITE_CANVAS_WIDTH}
              ref={canvasRef}
              style={{
                aspectRatio: env.VITE_CANVAS_WIDTH / env.VITE_CANVAS_HEIGHT,
              }}
            >
              Your browser does not support html canvas
            </canvas>
            <div className="">
              <Slider
                min={1}
                max={1000}
                value={[size]}
                onValueChange={(values) => setSize(values.at(0) || 100)}
              />
              <Input
                className="text-xs text-center"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-center w-full gap-2 pb-2">
            <Button onClick={() => mutate()}>
              <UploadIcon />
            </Button>
            <Button
              variant="secondary"
              onClick={(e) => {
                e.preventDefault();
                setFile(null);
              }}
            >
              <Cross2Icon />
            </Button>
          </div>
        </>
      )}
    </label>
  );
}
