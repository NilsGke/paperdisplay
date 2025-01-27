import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { env } from "@/env";
import monochrome from "@/helpers/monochrome";
import {
  BlendingModeIcon,
  FilePlusIcon,
  FontBoldIcon,
  PaperPlaneIcon,
  TransparencyGridIcon,
} from "@radix-ui/react-icons";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const fonts = [
  "Arial",
  "Verdana",
  "Tahoma",
  "Trebuchet MS",
  "Times New Roman",
  "Georgia",
  "Garamond",
  "Courier New",
  "Brush Script MT",
] as const;

export default function QuickTextPage() {
  const [text, setText] = useState("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [invert, setInvert] = useState(false);
  const [bold, setBold] = useState(false);
  const [dithering, setDithering] = useState(false);
  const [font, setFont] = useState<(typeof fonts)[number]>("Arial");

  // preview on save
  const [loadPreview, setLoadPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  useEffect(() => {
    if (!loadPreview || canvasRef.current === null) return setPreviewUrl(null);

    setPreviewUrl(canvasRef.current.toDataURL());
  }, [loadPreview]);
  const { mutate: saveFile } = useMutation({
    mutationFn: async () => {
      if (canvasRef.current === null) {
        toast.error("could not get canvas");
        throw new Error("could not get canvas");
      }
      const blob = await new Promise<Blob | null>((r) =>
        canvasRef.current!.toBlob(r)
      );
      if (blob === null) {
        toast.error("could not make blob out of canvas");
        throw new Error("could not make blob out of canvas");
      }
      const file = new File([blob], fileName);

      if (file === null) throw Error("no file selected");
      const data = new FormData();

      data.append(
        "file",
        new File([file], fileName, {
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
      if (response.status === 200)
        return toast.success("successfully saved image!");
      else {
        toast.error(response.statusText);
        toast.error(await response.text());
      }
    },
    onError: (error) => {
      toast.error(error.message ?? error);
    },
  });

  // draw to canvas
  useEffect(() => {
    // mostly ai generated
    const canvas = canvasRef.current;
    if (!canvas) {
      throw new Error("Canvas is not available");
    }

    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) throw new Error("Failed to get 2D context");

    // Clear the canvas
    context.fillStyle = invert ? "black" : "white";
    context.fillRect(0, 0, canvas.width, canvas.height);

    const maxWidth = canvas.width * 0.8; // 80% of canvas width
    const maxHeight = canvas.height * 0.8; // 80% of canvas height
    const x = canvas.width / 2;

    const lineHeightRatio = 1.2; // Line height as a ratio of font size
    let fontSize = 80; // Start with an initial font size
    const minFontSize = 10; // Prevent font size from becoming too small
    context.textAlign = "center"; // Center horizontally
    context.fillStyle =
      text.length > 0 ? (invert ? "white" : "black") : invert ? "#333" : "#ddd";

    const lines: string[] = [];
    let lineHeight = 10;

    // Adjust font size dynamically
    while (fontSize > minFontSize) {
      context.font = `${bold ? "bold " : ""}${fontSize}px ${font}`;
      lineHeight = fontSize * lineHeightRatio;

      const textLines = (text.length === 0 ? "preview" : text).split("\n"); // Split into explicit new lines
      lines.length = 0; // Clear previous lines
      for (const textLine of textLines) {
        const words = textLine.split(" ");
        let line = "";
        for (let i = 0; i < words.length; i++) {
          const testLine = line + words[i] + " ";
          const testWidth = context.measureText(testLine).width;
          if (testWidth > maxWidth && i > 0) {
            lines.push(line.trim());
            line = words[i] + " ";
          } else {
            line = testLine;
          }
        }
        lines.push(line.trim()); // Add the last line of this block
      }

      const totalHeight = lines.length * lineHeight;
      if (totalHeight <= maxHeight) {
        break; // Exit the loop when the text fits
      }
      fontSize--; // Decrease font size and try again
    }

    // Calculate the vertical offset to center the text block
    const totalHeight = lines.length * lineHeight;
    let offsetY = (canvas.height - totalHeight) / 2 + lineHeight / 2; // Center vertically

    // Draw each line, centered horizontally and vertically
    for (let i = 0; i < lines.length; i++) {
      context.fillText(lines[i], x, offsetY);
      offsetY += lineHeight;
    }

    if (dithering) {
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const dithered = monochrome(imageData, 0.5, "floydsteinberg");
      context.putImageData(dithered, 0, 0);
    }
  }, [invert, text, dithering, font, bold]);

  const { mutate } = useMutation({
    mutationFn: async (file: File) => {
      const data = new FormData();
      data.append("file", file);

      const promise = fetch("/api/previewImage", {
        method: "POST",
        body: data,
      }).then((res) => {
        if (!res.ok) throw Error(res.statusText);
        return res;
      });

      toast.promise(promise, {
        pending: "applying image",
        success: "Done!",
        error: "Error!",
      });
    },

    onError: (error) => {
      toast.error(error.message);
      console.error(error);
    },
  });

  const submit = () => {
    if (canvasRef.current === null) return toast.error("could not get canvas");

    const callback = async (blob: Blob | null) => {
      if (blob === null)
        throw Error("could not create bitmap blob from canvas");
      const file = new File([blob], "temp.bmp", {
        type: blob.type,
        lastModified: new Date().getTime(),
      });

      mutate(file);
    };

    canvasRef.current.toBlob(callback, "image/bmp", 1);
  };

  return (
    <div className="grid p-4 size-full place-items-center">
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Quick Text</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-rows-[repeat(auto,2] gap-4">
          <div className="flex flex-col gap-2">
            <Textarea
              autoFocus
              placeholder="type your text here…"
              className="w-full resize-none"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="flex gap-2">
              <Select
                value={font}
                onValueChange={(newFont: typeof font) => setFont(newFont)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                  {fonts.map((font) => (
                    <SelectItem
                      key={font}
                      value={font}
                      style={{
                        fontFamily: font,
                      }}
                    >
                      {font}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <ToggleGroup
                orientation="horizontal"
                variant="outline"
                type="multiple"
                className="gap-2 "
                value={[
                  invert ? "invert" : undefined,
                  dithering ? "dithering" : undefined,
                  bold ? "bold" : undefined,
                ].filter((s) => s !== undefined)}
                onValueChange={(
                  selected: ("invert" | "dithering" | "bold")[]
                ) => {
                  setInvert(selected.includes("invert"));
                  setDithering(selected.includes("dithering"));
                  setBold(selected.includes("bold"));
                }}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ToggleGroupItem value="bold">
                      <FontBoldIcon />
                    </ToggleGroupItem>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>bold</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <ToggleGroupItem value="invert">
                      <BlendingModeIcon />
                    </ToggleGroupItem>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>invert image</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <ToggleGroupItem value="dithering">
                      <TransparencyGridIcon />
                    </ToggleGroupItem>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>apply dithering</p>
                  </TooltipContent>
                </Tooltip>
              </ToggleGroup>

              <Dialog onOpenChange={(state) => setLoadPreview(state)}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="ml-auto">
                    <FilePlusIcon />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Save Image</DialogTitle>
                    <DialogDescription>
                      Please provide a filename below
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex items-center space-x-2">
                    <img
                      src={previewUrl || undefined}
                      className="w-full h-auto rounded"
                      alt={"your image"}
                      height={env.VITE_CANVAS_HEIGHT}
                      width={env.VITE_CANVAS_WIDTH}
                    />
                  </div>
                  <Input
                    type="text"
                    placeholder="yourFileName.bmp"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                  />
                  <DialogFooter className="flex justify-between w-full">
                    <Button
                      type="submit"
                      className="px-3"
                      onClick={() => {
                        if (!fileName.endsWith(".bmp"))
                          return toast.error("filename must end with .bmp");
                        saveFile();
                      }}
                    >
                      Save Image
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div>
            <canvas
              height={env.VITE_CANVAS_HEIGHT}
              width={env.VITE_CANVAS_WIDTH}
              ref={canvasRef}
              className="w-full h-auto bg-white rounded outline outline-1 outline-zinc-200 dark:outline-zinc-800"
            />
          </div>
          <Button onClick={submit}>
            <PaperPlaneIcon /> Send to display
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
