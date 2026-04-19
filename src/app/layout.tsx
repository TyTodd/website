import { Footer, Layout } from "nextra-theme-blog";
import { Banner, Head, Search } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import "nextra-theme-blog/style.css";
import "./globals.css";
import type { ReactElement, ReactNode } from "react";
import Navbar from "@/theme/Navbar";
import { FaHouse } from "react-icons/fa6";
import { NavButton } from "@/components/NavButton";
import { ThemeToggle } from "@/components/ThemeToggle";

export const metadata = {
  title: "Tyrin",
};

/**
 * Render the root HTML document with theme support and Nextra layout.
 *
 * Params:
 * - children: ReactNode content to render inside the layout.
 *
 * Returns:
 * - JSX.Element representing the HTML document structure.
 */
export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}): Promise<ReactElement> {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head />
      <body className="bg-background text-foreground">
        <Layout
          nextThemes={{
            attribute: ["class", "data-theme"],
            defaultTheme: "system",
            enableSystem: true,
          }}
          banner={
            <Navbar
              pageMap={await getPageMap()}
              leftSlot={
                <NavButton key="home-link" href="/" ariaLabel="Home" isIconOnly>
                  <FaHouse size={18} />
                </NavButton>
              }
            >
              <NavButton key="blog-link" href="/posts">
                Blog
              </NavButton>
              <ThemeToggle key="theme-toggle" />
            </Navbar>
          }
        >
          <style>{`
            article, .x\\:prose { max-width: 82ch; }
          `}</style>
          {children}

          <Footer>
            <abbr
              title="This site and all its content are licensed under a Creative Commons Attribution-NonCommercial 4.0 International License."
              style={{ cursor: "help" }}
            ></abbr>{" "}
            {new Date().getFullYear()} © Tyrin Todd.
          </Footer>
        </Layout>
      </body>
    </html>
  );
}
