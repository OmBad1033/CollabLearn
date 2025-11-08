import Link from 'next/link'
import React from 'react'

function page() {
  return (
    <>
        <div className="h-screen flex flex-col">
            <div className="bg-gray-500 flex flex-row h-1/6">
                <div className="w-10/12 bg-red-500 flex flex-row justify-between items-stretch">
                    <div className="text-6xl bg-slate-500 font-semibold text-black w-6/12 flex items-center justify-center">POSTS</div>
                    <div className=" bg-orange-400 font-semibold text-black w-6/12 h-full flex flex-col gap-2">
                        <div className="flex-[4] w-full flex items-center justify-center">Notifications</div>
                        <div className="flex-[8] w-full bg-white flex items-center justify-center">Todo</div>
                    </div>
                </div>
                <div className="w-2/12 bg-blue-500 items-center flex justify-center">
                    <Link href="post/create" className="text-white bg-green-900 dark:bg-green-300 dark:text-black rounded-lg p-2"> Create Post</Link>
                </div>
            </div>
            <div className="bg-green-500 flex-1 h-5/6">PAGE2</div>
        </div>
    </>
  )
}

export default page