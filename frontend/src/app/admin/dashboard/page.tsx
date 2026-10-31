import { ProtectedRoute } from "@/app/(auth)/protected-route";

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute role="admin">
      <div>AdminDashboardPage</div>;
    </ProtectedRoute>
  );
}
