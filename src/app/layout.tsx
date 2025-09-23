import { Footer, Layout, ThemeSwitch } from "nextra-theme-blog";
import { Banner, Head, Search } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import "nextra-theme-blog/style.css";
import type { ReactElement, ReactNode } from "react";
import Navbar from "@/theme/Navbar";
import { FaHouse } from "react-icons/fa6";
import { ThemeProvider } from "next-themes";

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
      <Head backgroundColor={{ dark: "#0f172a", light: "#fefce8" }} />
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Layout>
            <style>{`
            :root {
              --container-max: 1360px;
              --prose-max-ch: 82ch;
            }
            main { max-width: var(--container-max); margin-inline: auto; }
            article, .prose { max-width: var(--prose-max-ch); }
          `}</style>
            <Navbar
              pageMap={await getPageMap()}
              leftSlot={
                <a
                  href="/"
                  aria-label="Home"
                  style={{ display: "inline-flex", alignItems: "center" }}
                >
                  <FaHouse size={18} />
                </a>
              }
            >
              {/* <Search /> */}
              <a href="/posts?tags=project">Projects</a>
              <ThemeSwitch />
            </Navbar>

            {children}

            <Footer>
              <abbr
                title="This site and all its content are licensed under a Creative Commons Attribution-NonCommercial 4.0 International License."
                style={{ cursor: "help" }}
              ></abbr>{" "}
              {new Date().getFullYear()} © Tyrin Todd.
            </Footer>
          </Layout>
        </ThemeProvider>
      </body>
    </html>
  );
}
