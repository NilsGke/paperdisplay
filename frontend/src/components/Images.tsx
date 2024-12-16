import { env } from "@/env";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";

export default function Images() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["images"],
    queryFn: async () => {
      const res = await fetch(`/api/images`);
      const data = await res.json();
      return z.array(z.string()).parse(data);
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (imageName: string) => {
      const res = await fetch(`/api/setImage/${imageName}`);
      console.log(res);
    },
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

      {data?.map((imageName) => (
        <div
          className="flex flex-col items-center gap-1 rounded shadow"
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
          <p className="text-xs text-zinc-500 dark:text-zinc-300">
            {imageName}
          </p>
        </div>
      ))}
    </div>
  );
}
