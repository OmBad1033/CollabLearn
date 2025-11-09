"use client";
import { Post } from "@/lib/types";
import Link from "next/link";
import React, { useEffect, useState } from "react";

function Page() {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch("http://localhost:4000/post/all", {
          credentials: "include",
        });
        const data: Post[] = await res.json();
        setPosts(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(true);
      }
    };
    fetchPost();
  }, []);

  console.log(posts);
  console.log(loading);

  return (
    <>
      <div className="h-screen flex flex-col">
        <div className="bg-gray-500 flex flex-row h-1/6">
          <div className="w-10/12 bg-red-500 flex flex-row justify-between items-stretch">
            <div className="text-6xl bg-slate-500 font-semibold text-black w-6/12 flex items-center justify-center">
              POSTS
            </div>
            <div className=" bg-orange-400 font-semibold text-black w-6/12 h-full flex flex-col gap-2">
              <div className="flex-[4] w-full flex items-center justify-center">
                Notifications
              </div>
              <div className="flex-[8] w-full bg-white flex items-center justify-center">
                Todo
              </div>
            </div>
          </div>
          <div className="w-2/12 bg-blue-500 items-center flex justify-center">
            <Link
              href="post/create"
              className="text-white bg-green-900 dark:bg-green-300 dark:text-black rounded-lg p-2"
            >
              Create Post
            </Link>
          </div>
        </div>
        <div className="bg-green-500 flex-1 h-5/6">
          <div className="bg-green-500 flex-1 h-5/6 p-4">
            <div className="border border-black rounded-lg overflow-hidden">
              <div className="flex h-12 font-semibold text-black bg-gray-200">
                <div className="flex-[1] flex items-center justify-center border-r border-black">
                    id
                </div>
                <div className="flex-[2] flex items-center justify-center border-r border-black">
                    title
                </div>
                <div className="flex-[1] flex items-center justify-center border-r border-black">
                    content
                </div>
                <div className="flex-[1] flex items-center justify-center border-r border-black">
                    createdAt
                </div>
                <div className="flex-[2] flex items-center justify-center">
                    assetUrls
                </div>
              </div>

              {posts?.map((post, index)=> (
                 <div className="flex h-12 bg-white" key={index}>
                 <div className="flex-[1] flex items-center justify-center border-r border-t border-black">
                   {post['id']}
                 </div>
                 <div className="flex-[2] flex items-center justify-center border-r border-t border-black">
                   {post['title']}
                 </div>
                 <div className="flex-[1] flex items-center justify-center border-r border-t border-black">
                 {post['content']}
                 </div>
                 <div className="flex-[1] flex items-center justify-center border-r border-t border-black">
                 {post['createdAt']}
                 </div>
                 <div className="flex-[2] flex flex-col items-center justify-center border-t border-black overflow-scroll">
                   {post.assetUrls.map((url, index)=> (
                    <div key={index} className="border border-t-2 border-b-2 ">
                        {url}
                    </div>
                   ))}
                 </div>
               </div>

              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Page;
