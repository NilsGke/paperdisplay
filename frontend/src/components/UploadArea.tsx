import { useEffect, useState } from "react";
import { Button, buttonVariants } from "./ui/button";
import { Input } from "./ui/input";
import { PlusCircledIcon, Cross2Icon, UploadIcon } from "@radix-ui/react-icons";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";

export default function UplaodArea() {
  const [file, setFile] = useState<File | null>(null);
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [filename, setFilename] = useState("");

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
    if (file.type !== "image/bmp") {
      toast.error("Only BMP files are allowed");
      return;
    }
    setFile(file);
    setFilename(file.name);
  };

  const submit = () => {
    if (!filename.endsWith(".bmp"))
      return toast.error("Filename must end with '.bmp'");

    mutate();
  };

  useEffect(() => {
    if (file === null) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target === null || e.target.result === null)
        return toast.error("could not read file");

      if (!(e.target.result instanceof ArrayBuffer)) {
        setDataUrl(e.target.result);
        return;
      }

      const arr = new Uint8Array(e.target.result);
      const header = arr.slice(0, 2);
      if (header[0] !== 0x42 || header[1] !== 0x4d) {
        toast.error("Invalid BMP file");
        return;
      }
      const blob = new Blob([arr], { type: "image/bmp" });
      const url = URL.createObjectURL(blob);
      setDataUrl(url);
      return;
    };
    reader.readAsArrayBuffer(file);
  }, [file]);

  return (
    <label
      htmlFor="fileInput"
      className={cn(
        file === null && buttonVariants({ variant: "ghost" }),
        "flex cursor-pointer border border-dashed w-[30rem] h-[26rem]",
        file !== null && "cursor-auto flex-col gap-2 rounded justify-between"
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
            className="sr-only"
            onChange={onChange}
          />
          <PlusCircledIcon /> Upload Image from Computer
        </>
      ) : (
        <>
          {dataUrl !== null ? (
            <div className="p-2 animate-in fade-in">
              <img
                src={dataUrl}
                alt="your image"
                className="mb-3 rounded h-72 max-h-72"
              />
              <div className="">
                <Input
                  className="text-xs text-center"
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                />
              </div>
            </div>
          ) : (
            <p className="duration-1000 animate-in fade-in">
              selected file: ${file.name} (no preview avalible :/)
            </p>
          )}
          <div className="flex justify-center w-full gap-2 pb-2">
            <Button onClick={submit}>
              <UploadIcon />
            </Button>
            <Button
              variant="secondary"
              onClick={(e) => {
                e.preventDefault();
                setFile(null);
                setDataUrl(null);
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
