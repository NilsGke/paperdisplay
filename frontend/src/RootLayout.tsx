import { HomeIcon } from "lucide-react";
import { ReactNode } from "react";
import { NavLink, Outlet } from "react-router";
import { buttonVariants } from "./components/ui/button";

export default function RootLayout() {
  return (
    <div className="size-full">
      <header className="w-full p-2">
        <nav className="flex justify-center gap-2">
          <Link to="/">
            <HomeIcon />
            Home
          </Link>
          <Link to="/trending">Trending Concerts</Link>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

const Link = ({ children, to }: { children: ReactNode; to: string }) => (
  <NavLink className={buttonVariants({ variant: "outline" })} to={to} end>
    {children}
  </NavLink>
);
