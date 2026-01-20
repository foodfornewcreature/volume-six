import { ReactNode, useEffect } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

interface LayoutProps {
  children: ReactNode;
  footerProps?: React.ComponentProps<typeof Footer>;
}

export function Layout({ children, footerProps }: LayoutProps) {
  // Re-inject GlobalRize Bible Link plugin after React renders content
  // so it can scan dynamic DOM (e.g., on route/content changes).
  useEffect(() => {
    const SRC = "https://bible-link.globalrize.org/plugin.js";

    // Remove any existing plugin script to ensure a fresh run
    const existing = Array.from(document.querySelectorAll(`script[src="${SRC}"]`));
    existing.forEach((el) => el.parentElement?.removeChild(el));

    // Insert a fresh script with the required dataset attributes
    const s = document.createElement("script");
    s.src = SRC;
    s.async = true;
    s.defer = true;
    s.dataset.language = "ta";
    s.dataset.translation = "irvtam";
    s.dataset.theme = "dark";

    // Append to head to keep it global
    document.head.appendChild(s);

    return () => {
      // Optional cleanup if Layout unmounts
      const inserted = Array.from(document.querySelectorAll(`script[src="${SRC}"]`));
      inserted.forEach((el) => el.parentElement?.removeChild(el));
    };
  });

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 overflow-y-auto pt-2 pb-16 md:pb-16">
        {/*
          Fix: provide small mobile gutters without the extra `container` offset.
          - Mobile: px-4 (standard safe reading padding)
          - md+: px-6 with a max readable width
        */}
        <div className="mx-auto w-full max-w-screen-lg px-4 md:px-6 py-2">
          {children}
        </div>
      </main>
      {/* keep safe-area via a wrapper so we don't add unsupported prop to Footer */}
      <div className="footer-safe">
        <Footer {...footerProps} />
      </div>
    </div>
  );
}