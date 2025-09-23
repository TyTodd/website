import { Footer, Layout, Navbar, ThemeSwitch } from 'nextra-theme-blog'
import { Banner, Head, Search } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-blog/style.css'
import type { ReactNode } from 'react'
 
export const metadata = {
  title: 'Blog Example'
}
 
export default async function RootLayout({ children }: { children: ReactNode }) {
 
  return (
    <html lang="en" suppressHydrationWarning>
      <Head backgroundColor={{ dark: '#0f172a', light: '#fefce8' }} />
      <body>
        <Layout>
          <Navbar pageMap={await getPageMap()}>
            {/* <Search /> */}
            <a href="/posts/projects">Projects</a>
            <ThemeSwitch />
          </Navbar>
 
          {children}
 
          <Footer>
            <abbr
              title="This site and all its content are licensed under a Creative Commons Attribution-NonCommercial 4.0 International License."
              style={{ cursor: 'help' }}
            >
              
            </abbr>{' '}
            {new Date().getFullYear()} © Tyrin Todd.
          </Footer>
        </Layout>
      </body>
    </html>
  )
}