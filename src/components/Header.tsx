import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { FileText } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/*
        Remove Tailwind `container` (adds asymmetric small-screen padding).
        Use symmetric gutters: px-4 on mobile, md:px-6, and keep centered max width.
      */}
      <div className="mx-auto w-full max-w-screen-lg px-4 md:px-6 flex h-14 items-center">
        <div className="mr-4 flex">
          <Link to="/" className="flex flex-col items-start">
            <span className="font-bold font-anek-tamil text-2xl">Volume Six</span>
            <span className="text-xs font-normal">The New Creation</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end">
          <Link to="/changelog" className="mr-4 p-1 hover:bg-accent/10 rounded transition-colors">
            <FileText className="h-5 w-5 text-foreground" />
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
