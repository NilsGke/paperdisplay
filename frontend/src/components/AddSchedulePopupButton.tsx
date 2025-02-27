import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "./ui/dialog";
import { Plus } from "lucide-react";
import ImageSelector from "./ImageSelector";
import { TimePicker } from "./timePicker/TimePicker";
import { Button } from "./ui/button";
import { DialogHeader, DialogFooter } from "./ui/dialog";
import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { ToggleGroupItemProps } from "@radix-ui/react-toggle-group";
import { UseMutateFunction } from "@tanstack/react-query";
import { env } from "@/env";
import { cn } from "@/lib/utils";
import type { ScheduledImage } from "@/pages/schedulesPage";
import { toast } from "react-toastify";

export default function AddSchedulePopupButton({
  createSchedule,
}: {
  createSchedule: UseMutateFunction<
    void,
    Error,
    Omit<ScheduledImage, "id">,
    unknown
  >;
}) {
  const [imageName, setImageName] = useState("");
  const [time, setTime] = useState<Date | undefined>(new Date());
  const [days, setDays] = useState<ScheduledImage["days"]>([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);

  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="w-full" asChild>
        <Button variant={"outline"} className="w-full">
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a Scheduled Image</DialogTitle>
          <DialogDescription>
            Select an image, time and days and the Display will automatically
            apply the image on the specified days
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-8">
            <div className="relative flex flex-col justify-center h-full gap-2">
              <ImageSelector
                value={imageName}
                onChange={setImageName}
                className="w-full "
              />

              <TimePicker date={time} setDate={setTime} />
            </div>
            <div
              className="relative rounded -z-10 outline-1 outline outline-zinc-200 dark:outline-zinc-600"
              style={{
                aspectRatio: env.VITE_CANVAS_WIDTH / env.VITE_CANVAS_HEIGHT,
              }}
            >
              <img
                src={`/api/images/${imageName}`}
                alt={imageName === "" ? undefined : imageName}
                className={cn("w-full h-auto", {
                  "opacity-0": imageName === "",
                })}
                style={{
                  aspectRatio: env.VITE_CANVAS_WIDTH / env.VITE_CANVAS_HEIGHT,
                }}
              />
              <div className="absolute top-[53px] left-[75px] text-zinc-300 dark:text-zinc-600 -z-10">
                Preview
              </div>
            </div>
          </div>

          <ToggleGroup
            type="multiple"
            className="justify-between"
            onValueChange={(days) =>
              setDays([
                days.includes("mo"),
                days.includes("tu"),
                days.includes("we"),
                days.includes("th"),
                days.includes("fr"),
                days.includes("sa"),
                days.includes("su"),
              ])
            }
          >
            <DayToggle value="mo">Mo</DayToggle>
            <DayToggle value="tu">Tu</DayToggle>
            <DayToggle value="we">We</DayToggle>
            <DayToggle value="th">Th</DayToggle>
            <DayToggle value="fr">Fr</DayToggle>
            <DayToggle value="sa">Sa</DayToggle>
            <DayToggle value="su">Su</DayToggle>
          </ToggleGroup>
        </div>

        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={() => {
              if (time === undefined) return toast.error("please enter a time");
              if (days.every((day) => day === false))
                return toast.error("please select at least one day");

              const minute = time.getMinutes();
              const hour = time.getHours();

              createSchedule(
                { minute, hour, imageName, days },
                {
                  onSuccess: () => {
                    setOpen(false);
                    setTime(new Date());
                    setImageName("");
                    setDays([false, false, false, false, false, false, false]);
                  },
                }
              );
            }}
            type="button"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DayToggle(props: Omit<ToggleGroupItemProps, "size" | "className">) {
  return (
    <ToggleGroupItem
      {...props}
      className="data-[state=off]:text-zinc-400 dark:data-[state=off]:text-zinc-500 border"
      size="lg"
    >
      {props.children}
    </ToggleGroupItem>
  );
}
