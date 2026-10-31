import { ProtectedRoute } from "@/app/(guards)/protected-route";

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute role="admin">
      <div>AdminDashboardPage</div>;
    </ProtectedRoute>
  );
}
