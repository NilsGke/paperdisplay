import { useSettings } from "@/lib/settings";
import { buttonVariants } from "./ui/button";
import { Link, Outlet } from "react-router";
import {
  FileTextIcon,
  GitHubLogoIcon,
  HomeIcon,
  MoonIcon,
  PlusCircledIcon,
  SunIcon,
  TextIcon,
} from "@radix-ui/react-icons";
import VersionBanner from "./VersionBanner";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { CalendarClockIcon } from "lucide-react";

export default function Layout() {
  const [settings, setSettings] = useSettings();

  return (
    <div className="size-full grid grid-rows-[auto,1fr,auto]">
      <header className="flex justify-center p-4">
        <nav className="flex items-center gap-2">
          <Link to="/" className={buttonVariants({ variant: "link" })}>
            <HomeIcon /> Home
          </Link>

          <Separator />

          <Link to="/addImage" className={buttonVariants({ variant: "link" })}>
            <PlusCircledIcon /> Add Image
          </Link>

          <Separator />

          <Link to="/quickText" className={buttonVariants({ variant: "link" })}>
            <TextIcon /> Quick Text
          </Link>

          <Separator />

          <Link to="/schedules" className={buttonVariants({ variant: "link" })}>
            <CalendarClockIcon /> Schedules
          </Link>

          <Separator />

          <Link
            to="/serverLogs"
            className={buttonVariants({ variant: "link" })}
          >
            <FileTextIcon /> Server Logs
          </Link>
        </nav>
      </header>

      <div className="overflow-auto size-full">
        <Outlet />
      </div>
      <footer className="flex items-end justify-between p-2">
        <VersionBanner />

        <div className="flex items-center justify-center gap-2 text-zinc-500">
          <Tooltip>
            <TooltipContent>
              <p>Change Theme</p>
            </TooltipContent>
            <TooltipTrigger asChild>
              <button
                className={buttonVariants({ variant: "link" })}
                onClick={() =>
                  setSettings({
                    theme: settings.theme === "dark" ? "light" : "dark",
                  })
                }
              >
                {settings.theme === "dark" ? <MoonIcon /> : <SunIcon />}
              </button>
            </TooltipTrigger>
          </Tooltip>

          <Tooltip>
            <TooltipContent>
              <p>Github Repository</p>
            </TooltipContent>
            <TooltipTrigger>
              <a
                href="https://github.com/NilsGke/paperdisplay"
                target="_blank"
                className={buttonVariants({ variant: "link" })}
              >
                <GitHubLogoIcon className="size-5" />
              </a>
            </TooltipTrigger>
          </Tooltip>
        </div>
      </footer>
    </div>
  );
}

const Separator = () => (
  <div className="w-[1px] h-6 bg-zinc-400 dark:bg-zinc-800" />
);
