"use client";
import React, { use } from "react";
import courses from "../../../data/courses.json";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function CourseNavbar({ params }) {
  const { id } = use(params);
  const course = courses.find(
    (item) => item.courseId.toLowerCase() === id.toLowerCase(),
  );
  const pathname = usePathname();
  
  // active link style
  const linkStyle = (path) =>
    `px-4 py-2 text-sm font-medium transition-all duration-300 rounded-md ${
      pathname === path
        ? "text-cyan-400 border-b-2 border-cyan-400 bg-cyan-900/20"
        : "text-gray-400 hover:text-white hover:bg-gray-800"
    }`;

  return (
    <div className="space-y-4">
      <nav className="flex gap-1 sticky top-16 z-2 bg-gray-950 px-4 mb-4 border-b border-gray-800">
        <Link
          href={`/classroom/${id}`}
          className={linkStyle(`/classroom/${id}`)}
        >
          Stream
        </Link>
        <Link
          href={`/classroom/${id}/classwork`}
          className={linkStyle(`/classroom/${id}/classwork`)}
        >
          Classwork
        </Link>
        <Link
          href={`/classroom/${id}/file`}
          className={linkStyle(`/classroom/${id}/file`)}
        >
          File Explorer
        </Link>
        <Link
          href={`/classroom/${id}/online-class`}
          className={linkStyle(`/classroom/${id}/online-class`)}
        >
          Online Class
        </Link>
      </nav>
    </div>
  );
}