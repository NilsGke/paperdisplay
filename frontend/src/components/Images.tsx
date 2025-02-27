import { env } from "@/env";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "react-toastify";
import { DownloadIcon, PlayIcon, TrashIcon } from "@radix-ui/react-icons";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import DeleteImageDialog from "./DeleteImageDialog";
export default function Images() {
  const [imagesContainerRef] = useAutoAnimate();

  const {
    data: images,
    error,
    isLoading,
    refetch: refetchImages,
  } = useQuery({
    queryKey: ["images"],
    queryFn: async () => {
      const res = await fetch(`/api/images`);
      if (!res.ok) throw new Error("cannot load images:\n" + res.statusText);
      const data = await res.json();
      return z.array(z.string()).parse(data);
    },
  });

  const { data: currentImageName, refetch: refetchCurrentImage } = useQuery({
    queryKey: ["currentImage"],
    queryFn: async () => {
      const res = await fetch("/api/currentImage");
      if (res.status === 204) return null;
      else return await res.text();
    },
  });

  const {
    mutate: setImae,
    isPending: setImagePending,
    variables: pendingImageName,
  } = useMutation({
    mutationFn: (imageName: string) => {
      const promise = fetch(`/api/setImage/${imageName}`, {
        method: "POST",
      }).then((res) => {
        if (res.ok) return res;
        else throw Error(res.statusText);
      });
      toast.promise(promise, {
        pending: `Applying image: ${imageName}`,
        error: "Error!",
        success: "Updated image",
      });
      return promise;
    },

    onError: (error) => toast.error(`Error: ${error.message}`),
    onSuccess: () => refetchCurrentImage(),
  });

  const {
    mutate: removeImage,
    isPending: removePending,
    variables: removingName,
  } = useMutation({
    mutationFn: (imageName: string) => {
      const promise = fetch(`/api/removeImage/${imageName}`, {
        method: "POST",
      }).then((res) => {
        if (res.ok) return res;
        else throw Error(res.statusText);
      });
      toast.promise(promise, {
        pending: `Removing image: ${imageName}`,
        error: "Error!",
        success: "Removed image",
      });
      return promise;
    },

    onSuccess: () => refetchImages(),
    onError: (error) => toast.error(`Error: ${error.message}`),
  });

  const downloadImage = async (imageName: string) => {
    const imgBlob = await fetch(`/api/images/${imageName}`).then((res) =>
      res.blob()
    );
    const fileURL = URL.createObjectURL(imgBlob);
    const downloadLink = document.createElement("a");
    downloadLink.href = fileURL;
    downloadLink.download = imageName;
    document.body.appendChild(downloadLink);
    downloadLink.addEventListener("click", () =>
      setTimeout(() => URL.revokeObjectURL(fileURL), 5000)
    );
    downloadLink.click();
  };

  return (
    <div
      className="flex flex-wrap items-center justify-center gap-6 pt-2"
      ref={imagesContainerRef}
    >
      {isLoading && (
        <div className="text-zinc-400 animate-pulse">Loading...</div>
      )}

      {error && (
        <code className="text-sm text-red-400">
          <pre>{error.message}</pre>
        </code>
      )}

      {images
        ?.filter((img) => img !== removingName)
        .map((imageName) => (
          <div key={imageName} className="flex flex-col gap-2 group">
            <div
              className={cn(
                "flex relative flex-col w-52 h-32 items-center gap-1 rounded shadow-lg outline outline-1 outline-zinc-100 dark:outline-zinc-800 overflow-hidden",
                {
                  "animate-pulse hover:animate-none hover:brightness-100 brightness-75":
                    setImagePending && pendingImageName === imageName,
                  "outline-black dark:outline-white outline-3 outline-offset-4 outline-dashed":
                    currentImageName === imageName,
                }
              )}
              key={imageName}
            >
              <img
                className="absolute top-0 left-0 w-auto h-32 rounded"
                src={`/api/images/${imageName}`}
                alt={`your image: ${imageName}`}
                height={env.VITE_CANVAS_HEIGHT}
                width={env.VITE_CANVAS_WIDTH}
              />
              <div className="z-10 gap-2 transition-all rounded opacity-0 size-full group-focus-within:opacity-100 group-hover:opacity-100 backdrop-blur-[3px] bg-white/70 dark:bg-black/50">
                <button
                  className={cn("size-full flex justify-center items-center", {
                    "animate-pulse brightness-75":
                      setImagePending && pendingImageName === imageName,
                  })}
                  onClick={() => setImae(imageName)}
                  disabled={setImagePending}
                >
                  <PlayIcon height={40} width={40} />
                </button>

                <div className="absolute flex gap-1 bottom-2 right-2 flex-nowrap ">
                  <button
                    className="p-1 transition-colors rounded hover:bg-zinc-300/40 hover:dark:bg-zinc-800/40"
                    onClick={() => downloadImage(imageName)}
                  >
                    <DownloadIcon />
                  </button>

                  <DeleteImageDialog
                    imageName={imageName}
                    removeImage={() => removeImage(imageName)}
                  >
                    <button
                      className="p-1 transition-colors rounded hover:bg-red-500/40 hover:dark:bg-red-800/40"
                      disabled={setImagePending || removePending}
                    >
                      <TrashIcon />
                    </button>
                  </DeleteImageDialog>
                </div>
              </div>
            </div>

            <p className="w-full text-xs text-center text-zinc-500 dark:text-zinc-300">
              {imageName}
            </p>
          </div>
        ))}
    </div>
  );
}
