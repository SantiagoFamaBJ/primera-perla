import type { Metadata } from "next";
import Admin from "@/components/admin/Admin";

export const metadata: Metadata = { title: "Admin · Muestras Densell White", robots: { index: false, follow: false } };

export default function Page() {
  return <Admin />;
}
