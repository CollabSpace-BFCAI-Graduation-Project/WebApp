import { redirect } from "next/navigation";

export default function DashboardRedirectPage() {
  redirect("/");
}

export const metadata = {
  title: "Dashboard",
};
