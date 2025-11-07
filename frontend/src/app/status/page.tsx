"use client";

import { useEffect, useState } from "react";

export default function Status() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch("http://localhost:4000/auth/status", {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          console.log("✅ Logged in user:", data);
          setUser(data);
        } else {
          console.log("❌ Unauthorized");
          setUser(null);
        }
      } catch (err) {
        console.error("Error fetching status:", err);
      }
    };

    checkStatus();
  }, []);

  return (
    <>
      <div className="p-6">
        <h1 className="text-xl font-semibold mb-2">User Status</h1>
        {user ? (
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
            {JSON.stringify(user, null, 2)}
          </pre>
        ) : (
          <p className="text-gray-500">Not logged in.</p>
        )}
      </div>
      <div className="p-6 bg-gray-200 dark:bg-gray-800 rounded-md flex justify-center">
        <div className="flex-col justify-center w-full">
          <h1 className="text-xl font-semibold mb-2">Routes</h1>
          <div className="space-y-2 bg-green-100 dark:bg-green-800 flex align-items-center justify-center p-4">
            <a
              href="/post"
              className="bg-blue-500 hover:bg-blue-700 text-black dark:text-white font-bold py-2 px-4 rounded"
            >
              Posts
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
