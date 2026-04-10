// app/(auth)/layout.tsx
import Header from "../components/header"
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
        <Header />
        {children}
    </>
  )
}
