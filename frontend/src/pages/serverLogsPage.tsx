import Spinner from "@/components/Spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

export default function ServerLogsPage() {
  const {
    data: logs,
    error,
    isPending,
    isRefetching,
  } = useQuery({
    queryKey: ["logs"],
    queryFn: async () => {
      const res = await fetch("/api/logs");
      if (res.ok) return res.text();
      else throw Error(res.statusText);
    },
    retry: (failureCount) => failureCount < 3,
    refetchInterval: 2000,
  });

  return (
    <div className="flex items-center justify-center p-4 size-full">
      <Card className="min-w-full lg:min-w-[55rem] max-w-[90%] max-h-[80vh] overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <h2>Server Logs</h2> {(isPending || isRefetching) && <Spinner />}
          </CardTitle>
        </CardHeader>
        <CardContent className="h-full max-h-[75vh] overflow-scroll scroll-smooth flex flex-col-reverse">
          {error && (
            <pre className="text-red-400 dark:text-red-700">
              {error.message}
            </pre>
          )}
          <div className="h-full max-h-full">
            <pre className="text-sm">{logs}</pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
