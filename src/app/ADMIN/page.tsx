import type { Metadata } from "next";
import Admin from "@/components/admin/Admin";

export const metadata: Metadata = { title: "Admin · Primera Perla", robots: { index: false, follow: false } };

export default function Page() {
  return <Admin />;
}
