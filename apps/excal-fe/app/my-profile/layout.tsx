// app/(main)/layout.tsx
import Header from "@/components/Header"
import { ThemeProvider } from "next-themes"
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Header />
          {children}
        </ThemeProvider>
  )
}
