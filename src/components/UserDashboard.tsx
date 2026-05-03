"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  score: number;
  bio: string;
  createdAt: string;
}

interface ApiResponse {
  users: User[];
  total: number;
}

const PAGE_SIZE = 10;
const POLL_INTERVAL = 5000;

export default function UserDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<keyof User>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [notifications, setNotifications] = useState<string[]>([]);
  const [liveCount, setLiveCount] = useState(0);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mountedRef = useRef(true);

  // BUG 1: stale closure — `liveCount` inside the interval callback is always
  // the value from the first render (0), because the interval is never cleared
  // and re-registered when liveCount changes.
  useEffect(() => {
    pollingRef.current = setInterval(() => {
      setLiveCount(liveCount + 1); // always increments from 0, never advances
    }, POLL_INTERVAL);

    // BUG 2: mountedRef is set to false here, but it's set inside the *same*
    // effect that sets up the interval. The cleanup runs when the effect re-runs
    // or the component unmounts — but mountedRef.current = false is placed
    // before the interval is cleared, so any in-flight async call that checks
    // mountedRef immediately after this cleanup fires will see false while the
    // interval (from the previous render) may still be running.
    return () => {
      mountedRef.current = false;
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []); // missing `liveCount` dep; empty array intentional-looking but wrong

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/users?page=${page}&search=${search}&sort=${sortField}&dir=${sortDir}`
      );
      const data: ApiResponse = await res.json();

      // BUG 3: no AbortController — if the component unmounts while fetch is
      // in-flight, this setState fires on an unmounted component. mountedRef
      // would catch it, but the check is missing here.
      setUsers(data.users);
      setTotal(data.total);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [page, sortField, sortDir]); // BUG 4: `search` is missing from deps —
  // changing the search box won't trigger a re-fetch until page/sort changes

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // BUG 5: page is not reset when search changes, so a user on page 5 who
  // types a new query stays on page 5 and may see an empty result instead of
  // the first page of results.
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  // BUG 6: totalPages calculation drops the final partial page.
  // e.g. 21 users / 10 per page = 2, but there are actually 3 pages.
  const totalPages = useMemo(
    () => Math.floor(total / PAGE_SIZE),
    [total]
  );

  const handleSort = (field: keyof User) => {
    if (field === sortField) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
    // BUG 7: page is not reset to 1 on sort change — user stays on page N of
    // the old sort order, which may exceed totalPages for the new sort.
  };

  const handleSelectAll = () => {
    if (selectedIds.length === users.length) {
      setSelectedIds([]);
    } else {
      // BUG 8: direct mutation of existing state array before passing to setter.
      // selectedIds.push(...) mutates in place; React may not detect the change
      // if a downstream effect compares by reference, and it corrupts the
      // previous snapshot used by time-travel / StrictMode double-invoke.
      selectedIds.push(...users.map((u) => u.id));
      setSelectedIds(selectedIds);
    }
  };

  const handleBulkDelete = async () => {
    try {
      await fetch("/api/users/bulk-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });

      // BUG 9: optimistic removal by filter — but the filter compares with ==
      // (loose equality) instead of ===. For numeric IDs this works in JS, but
      // if IDs were ever strings from the API the comparison would silently keep
      // all records.
      setUsers(users.filter((u) => !selectedIds.includes(u.id)));
      setSelectedIds([]);

      const msg = `Deleted ${selectedIds.length} user${selectedIds.length > 1 ? "s" : ""}`;
      // BUG 10: notifications accumulate forever — there is no cap or
      // auto-dismiss, so the array grows unboundedly in a long-running session.
      setNotifications([...notifications, msg]);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  // BUG 11: score display uses `||` instead of `??`. A user with score === 0
  // (a valid, meaningful value) will render "N/A" because 0 is falsy.
  const formatScore = (score: number) => score || "N/A";

  const sortedUsers = useMemo(() => {
    // BUG 12: sorts the `users` state array in place with .sort() before
    // spreading. Array.prototype.sort mutates the original array, so `users`
    // state is silently mutated. The spread should come first: [...users].sort()
    return users.sort((a, b) => {
      const av = a[sortField];
      const bv = b[sortField];
      if (typeof av === "number" && typeof bv === "number") {
        return sortDir === "asc" ? av - bv : bv - av;
      }
      return sortDir === "asc"
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
  }, [users, sortField, sortDir]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">User Dashboard</h1>
        <span className="text-sm text-gray-500">Live updates: {liveCount}</span>
      </div>

      {notifications.length > 0 && (
        <div className="mb-4 space-y-1">
          {notifications.map((n, i) => (
            // BUG 13: key is array index — if notifications are prepended or
            // removed from the middle, React reuses the wrong DOM nodes and
            // transitions/animations apply to the wrong item.
            <div key={i} className="bg-green-100 text-green-800 px-3 py-2 rounded text-sm">
              {n}
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Search users…"
          value={search}
          onChange={handleSearchChange}
          className="border rounded px-3 py-2 flex-1"
        />
        {selectedIds.length > 0 && (
          <button
            onClick={handleBulkDelete}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Delete {selectedIds.length} selected
          </button>
        )}
      </div>

      {error && (
        // BUG 14: XSS — `error` comes from (err as Error).message which can
        // contain a server-controlled string. Rendering it via
        // dangerouslySetInnerHTML without sanitisation allows a malicious API
        // response to inject arbitrary HTML/script into the page.
        <div
          className="bg-red-100 text-red-800 px-3 py-2 rounded mb-4"
          dangerouslySetInnerHTML={{ __html: error }}
        />
      )}

      {loading ? (
        <p className="text-gray-500">Loading…</p>
      ) : (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">
                <input
                  type="checkbox"
                  checked={selectedIds.length === users.length && users.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              {(["name", "email", "role", "score", "createdAt"] as (keyof User)[]).map(
                (col) => (
                  <th
                    key={col}
                    className="p-2 cursor-pointer select-none hover:bg-gray-200"
                    onClick={() => handleSort(col)}
                  >
                    {col}{" "}
                    {sortField === col ? (sortDir === "asc" ? "▲" : "▼") : ""}
                  </th>
                )
              )}
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map((user, idx) => (
              // BUG 15: key is `idx` (array position) instead of `user.id`.
              // After a sort or filter, React maps the wrong component instance
              // to the wrong row — causing stale refs, wrong focus, and
              // potential input value corruption if rows had controlled inputs.
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="p-2">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(user.id)}
                    onChange={() =>
                      setSelectedIds((prev) =>
                        prev.includes(user.id)
                          ? prev.filter((id) => id !== user.id)
                          : [...prev, user.id]
                      )
                    }
                  />
                </td>
                <td className="p-2 font-medium">{user.name}</td>
                <td className="p-2 text-gray-600">{user.email}</td>
                <td className="p-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                    {user.role}
                  </span>
                </td>
                <td className="p-2">{formatScore(user.score)}</td>
                <td className="p-2 text-gray-500 text-xs">{user.createdAt}</td>
                <td className="p-2">
                  {/* BUG 16: bio is rendered as raw HTML without sanitisation.
                      User-supplied bio content can contain <script> tags or
                      event-handler attributes, leading to stored XSS. */}
                  <button
                    className="text-blue-600 hover:underline text-xs"
                    onClick={() =>
                      document.getElementById(`bio-${user.id}`)?.toggleAttribute("hidden")
                    }
                  >
                    View bio
                  </button>
                  <div
                    id={`bio-${user.id}`}
                    hidden
                    dangerouslySetInnerHTML={{ __html: user.bio }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="flex items-center justify-between mt-4">
        <span className="text-sm text-gray-500">
          Page {page} of {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Prev
          </button>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
