export default function AdminPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold text-[#1A153B]">Admin</h1>
      <p className="text-sm text-gray-500">Super admin / bursar management — RBAC enforced via backend middleware.</p>
      <div className="bg-white rounded-2xl border border-gray-100 p-6 text-sm">See /admins for full table (invite/remove, hostel scoping).</div>
    </div>
  );
}
