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

type Schedule = {
  id: string;
  name: string;
  next_run_time: string;
  args: string[];
  kwargs: string[];
  misfire_grace_time: number;
  max_instances: number;
};

export default function SchedulesPage() {
  const { data: schedules, refetch: refetchSchedules } = useQuery({
    queryKey: ["schedules"],
    queryFn: async () => {
      const res = await fetch("/api/getSchedules");
      if (!res.ok) throw Error("schedules endpoint returned an error");

      const data = await res.json();
      console.log(data);
      return (data as Schedule[]).sort((a, b) => {
        const da = new Date(a.next_run_time);
        const db = new Date(b.next_run_time);

        return (
          da.getMinutes() -
          db.getMinutes() +
          da.getHours() * 100 -
          db.getHours() * 100
        );
      });
    },
  });

  const { mutate: createSchedule } = useMutation({
    mutationFn: async ({
      image,
      time,
    }: {
      image: string;
      time: Date | undefined;
    }) => {
      if (image === "") throw new Error("please select an image");
      if (time === undefined) throw new Error("please enter a time");

      const res = await fetch("/api/addSchedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageName: image,
          hour: time.getHours(),
          minute: time.getMinutes(),
        }),
      });

      if (!res.ok) throw Error(res.statusText);
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => refetchSchedules(),
  });

  const [containerRef] = useAutoAnimate();

  return (
    <div className="grid p-4 size-full place-items-center">
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Schedules</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-rows-[repeat(auto,2] gap-4">
          <Table>
            <TableHeader>
              <TableRow className="divide-x">
                <TableHead className="text-center min-w-40">Image</TableHead>
                <TableHead className="text-center min-w-40">Time</TableHead>
                <TableHead className="text-center min-w-40">Days</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody ref={containerRef}>
              {schedules?.map((schedule) => {
                const date = new Date(schedule.next_run_time);
                const minutes = date.getMinutes();
                const hours = date.getHours();

                return (
                  <TableRow key={schedule.id}>
                    <TableCell className="font-medium">
                      {schedule.args.at(0)}
                    </TableCell>
                    <TableCell>
                      {hours < 10 && "0"}
                      {hours}:{minutes < 10 && "0"}
                      {minutes}
                    </TableCell>
                    <TableCell className="text-right">
                      {schedule.id.substring(0, 8)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>

            <TableFooter className="bg-transparent">
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={3} className="p-1">
                  <AddSchedulePopupButton createSchedule={createSchedule} />
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
