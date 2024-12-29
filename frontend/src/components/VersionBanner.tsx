import { useQuery } from "@tanstack/react-query";
import { buttonVariants } from "./ui/button";
import { UpdateIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

export default function VersionBanner() {
  const {
    data: currentVersion,
    isPending: currentPending,
    error: currentError,
  } = useQuery({
    queryKey: ["currentVersion"],
    queryFn: () => fetch("/api/version").then((res) => res.text()),
  });

  const {
    data: latestVersion,
    isPending: latestPending,
    error: latestError,
  } = useQuery({
    queryKey: ["latestVersion"],
    queryFn: () =>
      fetch(
        "https://raw.githubusercontent.com/NilsGke/paperdisplay/refs/heads/main/version.txt"
      ).then((res) => res.text()),
  });

  const error = currentError || latestError;

  if (error)
    return (
      <div>
        Cannot fetch current version
        <details>
          <summary>Details</summary>
          {error.name} <br />
          {error.message}
        </details>
      </div>
    );

  if (currentPending || latestPending)
    return (
      <div>
        <div className="text-sm text-zinc-500">Version: {currentVersion}</div>
      </div>
    );

  return (
    <div>
      <div className="text-sm text-zinc-500">Version: {currentVersion}</div>
      {currentVersion === latestVersion && (
        <a
          href="https://github.com/NilsGke/paperdisplay/blob/main/update.md"
          target="_blank"
          className={cn(buttonVariants(), "relative")}
        >
          <UpdateIcon /> Update avalible
          <div className="absolute bg-blue-400 rounded-full size-3 dark:bg-blue-500 -top-1 -right-1" />
          <div className="absolute bg-blue-400 rounded-full animate-ping size-3 dark:bg-blue-500 -top-1 -right-1" />
        </a>
      )}
    </div>
  );
}
