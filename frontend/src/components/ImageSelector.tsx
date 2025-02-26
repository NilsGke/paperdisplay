import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useState } from "react";
import { Button } from "./ui/button";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { Check, ChevronsUpDown } from "lucide-react";

export default function ImageSelector({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (newValue: string) => void;
  className?: string;
}) {
  const { data: images } = useQuery({
    queryKey: ["images"],
    queryFn: async () => {
      const res = await fetch(`/api/images`);
      if (!res.ok) throw new Error("cannot load images:\n" + res.statusText);
      const data = await res.json();
      return z.array(z.string()).parse(data);
    },
  });

  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[200px] justify-between", className)}
        >
          {value ? images?.find((image) => image === value) : "Select image"}
          <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0 shadow">
        <Command className="border">
          <CommandInput placeholder="Search Images..." />
          <CommandList>
            <CommandEmpty>No image found.</CommandEmpty>
            <CommandGroup>
              {images?.map((image) => (
                <CommandItem
                  key={image}
                  value={image}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                  className="flex justify-between"
                >
                  <div className="flex ">
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === image ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {image}
                  </div>
                  <img
                    src={`/api/images/${image}`}
                    alt={image}
                    className="w-auto h-8 rounded-sm outline outline-1 outline-zinc-200"
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
