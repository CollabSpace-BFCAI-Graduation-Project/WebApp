import { Sidebar } from "./_dashboard-components/Sidebar";

interface SharedLayoutProps {
  children: React.ReactNode;
}
export default function SharedLayout({ children }: SharedLayoutProps) {
  return (
    <div>
      <Sidebar />
      {children}
    </div>
  );
}
