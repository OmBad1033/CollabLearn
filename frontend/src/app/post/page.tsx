import Link from 'next/link'
import React from 'react'

function page() {
  return (
    <>
        <div className="h-screen flex flex-col">
            <div className="bg-gray-500 h-1/6 flex flex-row">
                <div className="w-10/12 bg-red-500">Left</div>
                <div className="w-2/12 bg-blue-500 items-center flex justify-center">
                    <Link href="post/create" className="text-white bg-green-900 dark:bg-green-300 dark:text-black rounded-lg p-2"> Create Post</Link>
                </div>
            </div>
            <div className="bg-green-500 h-5/6">PAGE2</div>

        </div>
    
    </>
  )
}

export default page