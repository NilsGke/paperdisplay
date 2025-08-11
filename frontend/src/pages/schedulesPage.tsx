import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import AddSchedulePopupButton from "@/components/AddSchedulePopupButton";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import EditSchedulePopupButton from "@/components/EditSchedulePopupButton";
import { env } from "@/env";
import { Switch } from "@/components/ui/switch";

export type ScheduledImage = {
  id: string;
  hour: number;
  minute: number;
  imageName: string;
  days: [boolean, boolean, boolean, boolean, boolean, boolean, boolean];
  enabled: boolean;
};

export default function SchedulesPage() {
  const {
    data: schedules,
    refetch: refetchSchedules,
    isPending: queryIsPending,
  } = useQuery({
    queryKey: ["schedules"],
    queryFn: async () => {
      const res = await fetch("/api/getSchedules");
      if (!res.ok) throw Error("schedules endpoint returned an error");

      const data = await res.json();

      return (data as ScheduledImage[])
        .map((scheduled) => {
          const date = new Date(0);
          date.setHours(scheduled.hour);
          date.setMinutes(scheduled.minute);
          return { ...scheduled, date };
        })
        .sort((a, b) => a.minute - b.minute + a.hour * 100 - b.hour * 100);
    },
  });

  const { mutate: createScheduled } = useMutation({
    mutationFn: async ({
      hour,
      minute,
      imageName,
      days,
      enabled,
    }: Omit<ScheduledImage, "id">) => {
      if (imageName === "") throw new Error("please select an image");
      if (hour === undefined || minute === undefined)
        throw new Error("please enter a time");

      const res = await fetch("/api/addSchedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageName, hour, minute, days, enabled }),
      });

      if (!res.ok) throw Error(res.statusText);
    },
    onError: (error) => toast.error(error.message),
    onSuccess: () => refetchSchedules(),
  });

  const { mutate: editScheduled, isPending: editMutationIsPending } =
    useMutation({
      mutationFn: async ({
        id,
        hour,
        minute,
        imageName,
        days,
        enabled,
      }: ScheduledImage) => {
        if (imageName === "") throw new Error("please select an image");
        if (hour === undefined || minute === undefined)
          throw new Error("please enter a time");

        const res = await fetch("/api/editSchedule", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, imageName, hour, minute, days, enabled }),
        });

        if (!res.ok) throw Error(res.statusText);
      },
      onError: (error) => {
        toast.error(error.message);
      },
      onSuccess: () => refetchSchedules(),
    });

  const { mutate: removeScheduled } = useMutation({
    mutationFn: async ({ id }: Pick<ScheduledImage, "id">) => {
      const res = await fetch("/api/removeSchedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: id,
      });

      if (!res.ok) throw Error(res.statusText);
    },
    onError: (error) => toast.error(error.message),
    onSuccess: () => refetchSchedules(),
  });

  const [containerRef] = useAutoAnimate();

  return (
    <div className="grid p-4 size-full place-items-center">
      <Card className="max-w-5xl">
        <CardHeader>
          <CardTitle>Scheduled Images</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-rows-[repeat(auto,2] gap-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Enabled</TableHead>
                <TableHead className="text-center min-w-40">Image</TableHead>
                <TableHead className="text-center min-w-40">Time</TableHead>
                <TableHead className="text-center min-w-40">Days</TableHead>
                <TableHead className="text-center">Edit</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody ref={containerRef}>
              {schedules?.map((sched) => {
                return (
                  <TableRow
                    key={sched.id}
                    className={cn({
                      "[&>td]:opacity-30 line-through": !sched.enabled,
                    })}
                  >
                    <TableCell>
                      <div className="flex items-center justify-center size-full">
                        <Switch
                          disabled={queryIsPending || editMutationIsPending}
                          checked={sched.enabled}
                          onCheckedChange={() =>
                            editScheduled({
                              ...sched,
                              enabled: !sched.enabled,
                            })
                          }
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center h-full gap-4 font-medium flex-nowrap">
                        <img
                          src={`/api/images/${sched.imageName}`}
                          alt={sched.imageName}
                          className="w-20 rounded outline outline-1 outline-zinc-100"
                          style={{
                            aspectRatio:
                              env.VITE_CANVAS_WIDTH / env.VITE_CANVAS_HEIGHT,
                          }}
                        />
                        {sched.imageName}
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-center">
                      {sched.hour < 10 && "0"}
                      {sched.hour}:{sched.minute < 10 && "0"}
                      {sched.minute}
                    </TableCell>
                    <TableCell className="text-right">
                      <ul className="grid grid-cols-7 gap-2">
                        {sched.days.at(0) ? <DayChip day="Mo" /> : <DayChip />}
                        {sched.days.at(1) ? <DayChip day="Tu" /> : <DayChip />}
                        {sched.days.at(2) ? <DayChip day="We" /> : <DayChip />}
                        {sched.days.at(3) ? <DayChip day="Th" /> : <DayChip />}
                        {sched.days.at(4) ? <DayChip day="Fr" /> : <DayChip />}
                        {sched.days.at(5) ? <DayChip day="Sa" /> : <DayChip />}
                        {sched.days.at(6) ? <DayChip day="Su" /> : <DayChip />}
                      </ul>
                    </TableCell>
                    <TableCell className="!opacity-100">
                      <EditSchedulePopupButton
                        editScheduled={editScheduled}
                        removeScheduled={removeScheduled}
                        initialScheduledImage={sched}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>

            <TableFooter className="bg-transparent">
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={4} className="p-1">
                  <AddSchedulePopupButton createSchedule={createScheduled} />
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function DayChip({ day }: { day?: ReactNode }) {
  return (
    <li
      className={cn("w-8 py-1 px-0 text-xs rounded-md text-center", {
        "bg-zinc-200 dark:bg-zinc-800": day !== undefined,
      })}
    >
      {day}
    </li>
  );
}
