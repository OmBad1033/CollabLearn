"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

function Page() {
  const checkPost = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log("Form Submitted");
    setOnSubmit(true);
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title");
    const content = formData.get("content");
    const files = formData.getAll("files") as File[];
    console.log("Title:", title, "Content:", content, "Files:", files);
    const filesTypes: {
      fileName: string;
      fileType: string;
      contentType: string;
    }[] = [];
    files.forEach((file: File) => {
      const fileType = file.type.split("/")[0];
      filesTypes.push({
        fileName: file.name,
        fileType,
        contentType: file.type,
      });
    });
    const uploadUrls: {
      uploadUrl: string;
      key: string;
      expiresIn: number;
    }[] = await getUploadUrls(filesTypes);

    const assetUrls = await uploadAssets(uploadUrls, files);

    console.log("Asset Urls:", assetUrls);
  };

  const getUploadUrls = async (
    filesTypes: {
      fileName: string;
      fileType: string;
      contentType: string;
    }[]
  ) => {
    const res = await fetch("http://localhost:4000/post/upload-urls", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ files: filesTypes }),
    });
    if (res.ok) {
      const data = await res.json();
      console.log("Upload Urls:", data.uploadUrls);
      return data.uploadUrls;
    } else {
      console.log("Error while requesting upload urls:", res);
      return [];
    }
  };

  const uploadAssets = async (
    uploadUrls: {
      uploadUrl: string;
      key: string;
      expiresIn: number;
    }[],
    files: File[]
  ) => {
    if (uploadUrls.length === 0) {
      setOnSubmit(false);
      alert("Error while requesting upload urls");
      return;
    }
    const uploadPromises = uploadUrls.map(async (upload, index) => {
      const url = upload.uploadUrl;
      const file = files[index];
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
          "x-amz-server-side-encryption": "AES256",
        },
        body: file,
      });
      if (!res.ok) {
        throw new Error("Error while uploading file");
      }
      console.log("File uploaded:", upload.key);
      return upload.key;
    });
  };

  const [onSubmit, setOnSubmit] = useState(false);
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center gap-2">
      <h1 className="text-3xl font-bold">Create Post</h1>
      <div className="w-1/2 h-1/2 bg-blue-500 rounded-lg shadow-lg flex flex-col items-center justify-center">
        {onSubmit && <p className="text-white">Creating Post...</p>}
        {!onSubmit && (
          <form
            onSubmit={checkPost}
            className="max-w-md mx-auto flex flex-col p-8 bg-white rounded-xl border border-gray-300 text-black gap-6"
          >
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-700">
                Title
              </label>
              <input
                type="text"
                name="title"
                placeholder="Title"
                className="w-full p-3 border-gray-200 rounded-lg bg-gray-300"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-700">
                Title
              </label>
              <input
                type="text"
                name="content"
                placeholder="Content"
                className="w-full p-3 border-gray-200 rounded-lg bg-gray-300"
              />
            </div>
            {/* Allowed types only image, video, pdf */}
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-700">
                Files
              </label>
              <input
                type="file"
                name="files"
                className="w-full p-3 border-gray-200 rounded-lg bg-gray-300"
                accept="image/*,video/*"
                multiple
              />
            </div>
            <button
              type="submit"
              className={cn(
                "w-full h-10 rounded-lg shadow-lg bg-green-400 hover:bg-green-800 text-white font-bold",
                onSubmit && "opacity-50 bg-slate-500 cursor-not-allowed"
              )}
              disabled={onSubmit}
            >
              Create
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Page;
