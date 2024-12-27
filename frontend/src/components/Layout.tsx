import { useSettings } from "@/lib/settings";
import { Button, buttonVariants } from "./ui/button";
import { Link, Outlet } from "react-router";
import {
  HomeIcon,
  Pencil1Icon,
  PlusCircledIcon,
  TextIcon,
} from "@radix-ui/react-icons";

export default function Layout() {
  const [settings, setSettings] = useSettings();

  return (
    <div className="size-full grid grid-rows-[auto,1fr]">
      <header className="flex justify-between p-4">
        <nav className="flex items-center gap-2">
          <Link to="/" className={buttonVariants({ variant: "link" })}>
            <HomeIcon /> Home
          </Link>

          <Separator />

          <Link to="/addImage" className={buttonVariants({ variant: "link" })}>
            <PlusCircledIcon /> Add Image
          </Link>

          <Separator />

          <Link to="/editImage" className={buttonVariants({ variant: "link" })}>
            <Pencil1Icon /> Edit Image
          </Link>

          <Separator />

          <Link to="/quickText" className={buttonVariants({ variant: "link" })}>
            <TextIcon /> Quick Text
          </Link>
        </nav>
        <Button
          variant="secondary"
          onClick={() =>
            setSettings({
              theme: settings.theme === "dark" ? "light" : "dark",
            })
          }
        >
          {settings.theme === "dark" ? "🌚" : "🌞"}
        </Button>
      </header>

      <div className="overflow-auto size-full">
        <Outlet />
      </div>
    </div>
  );
}

const Separator = () => (
  <div className="w-[1px] h-6 bg-zinc-400 dark:bg-zinc-800" />
);
