import "./globals.css";
import NavBar from "./components/NavBar";
import ProductedRoute from "./components/ProductedRoute";
import { api } from "./lib/api";
import { QueryProvider } from "./components/QueryProvider";
export const metadata = { title: "Notes App", description: "Frontend-only notes app" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  console.log(api)
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <QueryProvider>
          <ProductedRoute>
          <NavBar />
          <div className="max-w-3xl mx-auto p-2">{children}</div>
          </ProductedRoute>
        </QueryProvider>
      </body>
    </html>
  );
}
