// app/(admin)/admin/users/page.tsx
"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4001";

type User = { id: string; email: string; name: string; role: string; createdAt: string };

export default function AdminUsersPage() {
  const [rows, setRows] = useState<User[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("token") || "";
      const res = await fetch(`${API}/api/auth/users?skip=0&take=50`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data?.error || "Failed to load users");
        return;
      }
      setRows(data.users);
      setTotal(data.total);
    })();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Users ({total})</h1>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2 pr-4">Email</th>
            <th className="py-2 pr-4">Name</th>
            <th className="py-2 pr-4">Role</th>
            <th className="py-2 pr-4">Joined</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((u) => (
            <tr key={u.id} className="border-b">
              <td className="py-2 pr-4">{u.email}</td>
              <td className="py-2 pr-4">{u.name}</td>
              <td className="py-2 pr-4">{u.role}</td>
              <td className="py-2 pr-4">{new Date(u.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
