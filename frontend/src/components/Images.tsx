import { env } from "@/env";
import { imagesSchema } from "@/schemas";
import { useQuery } from "@tanstack/react-query";

export default function Images() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["images"],
    queryFn: async () => {
      const res = await fetch(`${env.VITE_BACKEND_URL}/images`);
      const data = res.json();
      return imagesSchema.parse(data);
    },
  });

  return (
    <div>
      {isLoading && (
        <div className="text-zinc-400 animate-pulse">Loading...</div>
      )}

      {error && (
        <code className="text-sm text-red-400">
          <pre>{error.message}</pre>
        </code>
      )}

      {data?.map((image) => (
        <div className="rounded shadow">
          <img
            src={image.url}
            alt={`your image: ${image.name}`}
            height={env.VITE_CANVAS_HEIGHT}
            width={env.VITE_CANVAS_WIDTH}
          />
        </div>
      ))}
    </div>
  );
}
