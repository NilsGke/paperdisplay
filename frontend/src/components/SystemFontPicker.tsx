import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface FontData {
  family: string;
  fullName: string;
  postscriptName: string;
}

async function fetchFonts(): Promise<FontData[]> {
  if (!("queryLocalFonts" in window)) {
    toast("Font Access API not supported in this browser.");
    throw new Error("Font Access API not supported in this browser.");
  }

  try {
    const availableFonts = await (window as any).queryLocalFonts();

    const uniqueFontsMap = new Map<string, FontData>();

    for (const font of availableFonts) {
      if (!uniqueFontsMap.has(font.family)) {
        uniqueFontsMap.set(font.family, {
          family: font.family,
          fullName: font.fullName,
          postscriptName: font.postscriptName,
        });
      }
    }

    return Array.from(uniqueFontsMap.values()).sort((a, b) =>
      a.family.localeCompare(b.family),
    );
  } catch (err: any) {
    if (err.name === "NotAllowedError") {
      toast.error("Permission to local fonts denied.");
      throw new Error("Permission denied to access local fonts.");
    }
    toast.error("Failed to load local fonts.");
    throw new Error("Failed to load fonts: " + err.message);
  }
}

export default function SystemFontPicker({
  selectedSystemFont,
  setSelectedSystemFont,
}: {
  selectedSystemFont: string | null;
  setSelectedSystemFont: (font: string) => void;
}) {
  const {
    data: fonts,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["system-fonts"],
    queryFn: fetchFonts,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  return (
    <Select
      value={selectedSystemFont || ""}
      onValueChange={(value) => setSelectedSystemFont(value)}
    >
      <SelectTrigger className="border p-2 rounded w-48">
        {isFetching && <p>Loading fonts...</p>}

        {error instanceof Error && (
          <p className="text-red-500">{error.message}</p>
        )}
        {fonts && <SelectValue placeholder="Select local font" />}
      </SelectTrigger>
      <SelectContent>
        {fonts?.map((font) => (
          <SelectItem
            key={font.family}
            value={font.family}
            style={{ fontFamily: font.family }}
          >
            {font.family}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
