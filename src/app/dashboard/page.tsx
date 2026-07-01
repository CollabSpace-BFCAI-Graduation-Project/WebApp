import { redirect } from "next/navigation";

export default function DashboardRedirectPage() {
  redirect("/spaces");
}

export const metadata = {
  title: "Dashboard",
};
