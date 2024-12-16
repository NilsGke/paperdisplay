import { env } from "@/env";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "react-toastify";

export default function Images() {
  const {
    data: images,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["images"],
    queryFn: async () => {
      const res = await fetch(`/api/images`);
      const data = await res.json();
      return z.array(z.string()).parse(data);
    },
  });

  const {
    mutate,
    isPending,
    variables: pendingImageName,
  } = useMutation({
    mutationFn: async (imageName: string) =>
      fetch(`/api/setImage/${imageName}`, { method: "POST" }),
    onSuccess: () => toast.success("Bild geupdated!"),
    onError: (error) => toast.error(`Error: ${error.message}`),
  });

  return (
    <div className="flex flex-wrap gap-4">
      {isLoading && (
        <div className="text-zinc-400 animate-pulse">Loading...</div>
      )}

      {error && (
        <code className="text-sm text-red-400">
          <pre>{error.message}</pre>
        </code>
      )}

      {images?.map((imageName) => {
        return (
          <div>
            <button
              className={cn(
                "flex flex-col items-center gap-1 rounded shadow active:brightness-90",
                isPending &&
                  pendingImageName === imageName &&
                  "animate-pulse brightness-75"
              )}
              key={imageName}
              onClick={() => mutate(imageName)}
            >
              <img
                className="w-auto h-32 rounded"
                src={`/api/images/${imageName}`}
                alt={`your image: ${imageName}`}
                height={env.VITE_CANVAS_HEIGHT}
                width={env.VITE_CANVAS_WIDTH}
              />
            </button>
            <p className="w-full text-xs text-center text-zinc-500 dark:text-zinc-300">
              {imageName}
            </p>
          </div>
        );
      })}
    </div>
  );
}
