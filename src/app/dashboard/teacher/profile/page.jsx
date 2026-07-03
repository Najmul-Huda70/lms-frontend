"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  BadgeCheck,
  Building2,
  BookOpen,
  Clock,
  Users,
  Star,
  Pencil,
  Camera,
} from "lucide-react";

function StatCard({ value, label, icon: IconEl }) {
  return (
    <div className="bg-[#12172A] border border-[#232A44] rounded-2xl p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-indigo-500/15 flex items-center justify-center text-indigo-400 shrink-0">
        <IconEl className="w-5 h-5" />
      </div>
      <div>
        <div className="text-white font-semibold text-lg leading-none">{value}</div>
        <div className="text-slate-400 text-xs mt-1">{label}</div>
      </div>
    </div>
  );
}

function InfoRow({ icon: IconEl, label, value }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-white/5 last:border-0">
      <IconEl className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-slate-500 text-xs">{label}</div>
        <div className="text-slate-200 text-sm mt-0.5 break-words">{value}</div>
      </div>
    </div>
  );
}

export default function TeacherProfile({
  teacher = {
    initials: "MRK",
    name: "Dr. Mahmudur Rahman Khan",
    designation: "Assistant Professor",
    department: "Department of Computer Science & Engineering",
    employeeId: "FAC-CSE-0142",
    email: "mrkhan.cse@neu.ac.bd",
    phone: "+880 1711-000000",
    officeRoom: "Building B, Room 304",
    officeHours: "Sun–Thu, 2:00 PM – 4:00 PM",
    qualification: "PhD in Computer Science, BUET",
    specialization: "Algorithms, Machine Learning",
    stats: { courses: 5, students: 312, experience: "6 yrs", rating: "4.8" },
    courses: ["CSE 220 - DSA", "CSE 411 - ML", "CSE 115 - Programming", "CSE 330 - Algorithms"],
    bio: "Assistant Professor teaching Data Structures and Algorithms with 6+ years of classroom and research experience. Passionate about problem-solving pedagogy.",
  },
  onSave,
}) {
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState(teacher.bio);

  const handleToggle = () => {
    if (editing && onSave) onSave({ ...teacher, bio });
    setEditing(!editing);
  };

  return (
    <div className="min-h-screen w-full bg-[#0A0D18] text-slate-200 px-4 py-8 md:px-10">
      <div className="max-w-4xl mt-20 mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-indigo-400 to-indigo-600 bg-clip-text text-transparent">
              Teacher Profile
            </h1>
            <p className="text-slate-500 text-sm mt-1">Your public info visible to students and admins</p>
          </div>
          <button
            onClick={handleToggle}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 transition text-white text-sm font-medium px-4 py-2 rounded-xl"
          >
            <Pencil className="w-4 h-4" />
            {editing ? "Save changes" : "Edit profile"}
          </button>
        </div>

        {/* Header card */}
        <div className="bg-[#12172A] border border-[#232A44] rounded-3xl p-6 md:p-8 mb-6 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl" />
          <div className="flex flex-col md:flex-row items-start md:items-center gap-5 relative">
            <div className="relative shrink-0">
              <div className="w-24 h-24 rounded-2xl ring-4 ring-[#0A0D18] shadow-[0_0_0_6px_#6366f1] bg-gradient-to-br from-lime-300 to-indigo-400 flex items-center justify-center text-2xl font-bold text-slate-900">
                {teacher.initials}
              </div>
              {editing && (
                <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center border-2 border-[#12172A]">
                  <Camera className="w-4 h-4 text-white" />
                </button>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-white">{teacher.name}</h2>
                <span className="text-xs bg-indigo-500/15 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">
                  {teacher.designation}
                </span>
              </div>
              <p className="text-slate-400 text-sm mt-1">{teacher.department}</p>
              <p className="text-slate-500 text-xs mt-1">Employee ID: {teacher.employeeId}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <StatCard value={teacher.stats.courses} label="Active courses" icon={BookOpen} />
          <StatCard value={teacher.stats.students} label="Total students" icon={Users} />
          <StatCard value={teacher.stats.experience} label="Experience" icon={BadgeCheck} />
          <StatCard value={teacher.stats.rating} label="Avg. rating" icon={Star} />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Contact & academic */}
          <div className="bg-[#12172A] border border-[#232A44] rounded-2xl p-5">
            <h3 className="text-white font-semibold text-sm mb-2">Contact &amp; academic info</h3>
            <InfoRow icon={Mail} label="Email" value={teacher.email} />
            <InfoRow icon={Phone} label="Phone" value={teacher.phone} />
            <InfoRow icon={Building2} label="Office room" value={teacher.officeRoom} />
            <InfoRow icon={Clock} label="Office hours" value={teacher.officeHours} />
            <InfoRow icon={BadgeCheck} label="Qualification" value={teacher.qualification} />
            <InfoRow icon={BookOpen} label="Specialization" value={teacher.specialization} />
          </div>

          {/* Bio */}
          <div className="bg-[#12172A] border border-[#232A44] rounded-2xl p-5">
            <h3 className="text-white font-semibold text-sm mb-3">About</h3>
            {editing ? (
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={6}
                className="w-full bg-[#0A0D18] border border-white/10 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 resize-none"
              />
            ) : (
              <p className="text-slate-300 text-sm leading-relaxed">{bio}</p>
            )}

            <h3 className="text-white font-semibold text-sm mt-6 mb-3">Courses teaching</h3>
            <div className="flex flex-wrap gap-2">
              {teacher.courses.map((c) => (
                <span
                  key={c}
                  className="text-xs bg-white/5 border border-white/10 text-slate-300 px-3 py-1.5 rounded-full"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}