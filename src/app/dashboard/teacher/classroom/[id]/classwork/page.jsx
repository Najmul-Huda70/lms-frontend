"use client";
import React, { useMemo, useState } from "react";
import classworkData from "../../../../../../data/classwork.json";
import Link from "next/link";
import Image from "next/image";
import {
  MoreVertical,
  Clock,
  Calendar,
  FileText,
  Download,
} from "lucide-react";

export default function Classwork() {
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [Value, setValue] = useState("");
  const [filters, setFilters] = useState({
    year: "All",
    semester: "All",
    type: "All",
  });

  const HandleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleFilterBtn = () => {
    setOpen(!open);
    HandleFilterChange("year", "All");
    HandleFilterChange("semester", "All");
    HandleFilterChange("type", "All");
  };

  return (
    <div className="m-5 p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-center my-5 gap-4">
        <div className="w-full flex items-center h-11 text-lg bg-[#0f172a] text-[#d1d5db] rounded-lg shadow-md overflow-hidden px-2">
          <input
            type="text"
            name="search"
            defaultValue={Value}
            autoComplete="off"
            onChange={(e) => setValue(e.target.value)}
            id="input"
            placeholder="Search work id , title..."
            className="w-full h-full outline-none text-lg px-2 caret-blue-500"
          />
          <label htmlFor="input" className="px-2 cursor-text">
            <svg viewBox="0 0 512 512" className="w-3 fill-gray-500">
              <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
            </svg>
          </label>
          <div className="h-4/5 w-0.5 bg-gray-800"></div>
          <button className="p-3 m-1 h-full rounded-md hover:bg-gray-800 transition">
            <svg viewBox="0 0 384 512" className="w-3 fill-blue-500">
              <path d="M192 0C139 0 96 43 96 96V256c0 53 43 96 96 96s96-43 96-96V96c0-53-43-96-96-96zM64 216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 89.1 66.2 162.7 152 174.4V464H120c-13.3 0-24 10.7-24 24s10.7 24 24 24h72 72c13.3 0 24-24 24-24s-10.7-24-24-24H216V430.4c85.8-11.7 152-85.3 152-174.4V216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 70.7-57.3 128-128 128s-128-57.3-128-128V216z" />
            </svg>
          </button>
        </div>
        <div className="w-30">
          <button
            onClick={handleFilterBtn}
            className="
              px-6 py-1 rounded-lg min-h-[2.4em] min-w-[3em]
              flex items-center gap-2
              text-[18px] font-bold tracking-wide leading-none text-white/90
              bg-[linear-gradient(140deg,#0f172a_0%,#1e293b_50%,rgba(15,23,42,0.7)_100%)]
              shadow-[inset_0.4px_1px_4px_rgba(128,128,128,0.8)]
              transition-all duration-100 ease-[cubic-bezier(0.22,0.61,0.36,1)] hover:scale-110
              hover:shadow-[inset_0.4px_1px_4px_rgba(128,128,128,1),2px_4px_8px_rgba(0,0,0,0.3)] hover:text-white
              hover:[text-shadow:0_0_10px_rgba(255,255,255,0.4)]
              active:scale-100 active:tracking-widest active:text-white
              active:shadow-[inset_0.4px_1px_8px_rgba(128,128,128,1),0_0_8px_rgba(96,165,250,0.6)] active:[text-shadow:0_0_20px_rgba(255,255,255,1)]
            "
          >
            Pending
          </button>
        </div>
        <div className="w-30">
          <button
            onClick={handleFilterBtn}
            className="
              px-6 py-1 rounded-lg min-h-[2.4em] min-w-[3em]
              flex items-center gap-2
              text-[18px] font-bold tracking-wide leading-none text-white/90
              bg-[linear-gradient(140deg,#0f172a_0%,#1e293b_50%,rgba(15,23,42,0.7)_100%)]
              shadow-[inset_0.4px_1px_4px_rgba(128,128,128,0.8)]
              transition-all duration-100 ease-[cubic-bezier(0.22,0.61,0.36,1)] hover:scale-110
              hover:shadow-[inset_0.4px_1px_4px_rgba(128,128,128,1),2px_4px_8px_rgba(0,0,0,0.3)] hover:text-white
              hover:[text-shadow:0_0_10px_rgba(255,255,255,0.4)]
              active:scale-100 active:tracking-widest active:text-white
              active:shadow-[inset_0.4px_1px_8px_rgba(128,128,128,1),0_0_8px_rgba(96,165,250,0.6)] active:[text-shadow:0_0_20px_rgba(255,255,255,1)]
            "
          >
            Complete
          </button>
        </div>
      </div>

      <div className="mx-auto grid grid-cols-2 justify-center gap-5">
        {classworkData.length ? (
          classworkData.map((work, index) => {
            return (
              <div
                key={index}
                className="group relative w-full p-4 pb-18 rounded-xl bg-[#0f172a] text-white overflow-hidden 
                  shadow-[inset_0_-16px_24px_rgba(255,255,255,0.15)]"
              >
                <h2 className="text-lg font-bold text-center text-cyan-400 ">
                  {work.title}
                </h2>
                <div className="mt-3 flex flex-col flex-wrap gap-2 text-md font-medium text-gray-300">
                  <span>
                    <span className="text-yellow-400">Category:</span>{" "}
                    {work.category}
                  </span>
                  <span>{work.description || "N/A"}</span>

                  {/* Post Document */}
                  {work.attachments && work.attachments.hasFile && (
                    <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-4 flex items-center justify-between group hover:bg-gray-800/60 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="bg-red-500/10 p-3 rounded-lg text-red-500">
                          <FileText size={24} />
                        </div>
                        <div className="max-w-37.5 md:max-w-xs">
                          <p className="text-sm font-semibold text-gray-200 truncate">
                            {work.attachments.fileName?.split("/").pop()}
                          </p>
                          <p className="text-[10px] text-gray-500 font-bold uppercase mt-0.5">
                            PDF • {work.attachments.fileSize}
                          </p>
                        </div>
                      </div>
                      <a
                        href={work.attachments.fileUrl}
                        className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg transition-all"
                      >
                        <Download size={18} />
                      </a>
                    </div>
                  )}
                </div>

                <div className="absolute w-[95%] bottom-2">
                  <div className="w-full h-0.5 bg-gray-700 my-2"></div>
                  <div className="flex gap-10 justify-between items-center text-sm">
                    <span className="text-gray-400">
                      {work.deadlineTime} , {work.deadlineDate}
                    </span>
                    <Link href={`classroom/${work.id.toLowerCase()}/classwork`}>
                      <div className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-700 cursor-pointer transition">
                        <i className="fa-solid fa-user"></i>
                      </div>
                    </Link>
                    <span className="text-gray-400">
                      {work.deadlineTime} , {work.deadlineDate}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-gray-400 font-semibold text-center col-span-full">
            No Course Available
          </div>
        )}
      </div>
    </div>
  );
}