"use client";

import { useState } from "react";
import {
  Lock,
  Bell,
  Shield,
  Moon,
  GraduationCap,
  LogOut,
  Trash2,
} from "lucide-react";

function Toggle({ on, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-[42px] h-6 rounded-full relative transition-colors ${
        on ? "bg-indigo-500" : "bg-[#2A3150]"
      }`}
    >
      <span
        className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all"
        style={{ left: on ? "20px" : "2px" }}
      />
    </button>
  );
}

function SectionHeader({ icon: IconEl, title, desc }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-9 h-9 rounded-xl bg-indigo-500/15 flex items-center justify-center text-indigo-400 shrink-0">
        <IconEl className="w-4.5 h-4.5" />
      </div>
      <div>
        <h3 className="text-white font-semibold text-sm">{title}</h3>
        {desc && <p className="text-slate-500 text-xs">{desc}</p>}
      </div>
    </div>
  );
}

function Row({ label, desc, children }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0 gap-4">
      <div className="min-w-0">
        <div className="text-slate-200 text-sm">{label}</div>
        {desc && <div className="text-slate-500 text-xs mt-0.5">{desc}</div>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export default function TeacherSettings({
  onChangePassword,
  onChangeEmail,
  onManageSessions,
  onLogoutAll,
  onDeactivate,
}) {
  const [notif, setNotif] = useState({
    submission: true,
    notice: true,
    message: false,
    weeklyDigest: true,
  });
  const [classDefaults, setClassDefaults] = useState({
    autoAccept: false,
    reminder: true,
    gradingScale: "Letter grade (A–F)",
  });
  const [twoFA, setTwoFA] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [lang, setLang] = useState("English");

  const toggleNotif = (key) => setNotif((s) => ({ ...s, [key]: !s[key] }));
  const toggleClassDefault = (key) => setClassDefaults((s) => ({ ...s, [key]: !s[key] }));

  return (
    <div className="min-h-screen w-full bg-[#0A0D18] text-slate-200 px-4 py-8 md:px-10">
      <div className="max-w-3xl mt-20 mx-auto">
        <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-indigo-400 to-indigo-600 bg-clip-text text-transparent mb-1">
          Settings
        </h1>
        <p className="text-slate-500 text-sm mb-6">
          Manage your account, notifications and class preferences
        </p>

        <div className="space-y-5">
          {/* Account */}
          <div className="bg-[#12172A] border border-[#232A44] rounded-2xl p-5">
            <SectionHeader icon={Lock} title="Account" desc="Password and email" />
            <Row label="Email address" desc="mrkhan.cse@neu.ac.bd">
              <button
                onClick={onChangeEmail}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
              >
                Change
              </button>
            </Row>
            <Row label="Password" desc="Last changed 3 months ago">
              <button
                onClick={onChangePassword}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
              >
                Update
              </button>
            </Row>
          </div>

          {/* Security */}
          <div className="bg-[#12172A] border border-[#232A44] rounded-2xl p-5">
            <SectionHeader icon={Shield} title="Security" desc="Keep your account protected" />
            <Row label="Two-factor authentication" desc="Add an extra layer of security">
              <Toggle on={twoFA} onClick={() => setTwoFA(!twoFA)} />
            </Row>
            <Row label="Active sessions" desc="2 devices currently signed in">
              <button
                onClick={onManageSessions}
                className="text-xs text-red-400 hover:text-red-300 font-medium"
              >
                Manage
              </button>
            </Row>
          </div>

          {/* Notifications */}
          <div className="bg-[#12172A] border border-[#232A44] rounded-2xl p-5">
            <SectionHeader icon={Bell} title="Notifications" desc="Choose what you get notified about" />
            <Row label="Assignment submissions" desc="When a student submits work">
              <Toggle on={notif.submission} onClick={() => toggleNotif("submission")} />
            </Row>
            <Row label="Notice board updates" desc="New notices from admin">
              <Toggle on={notif.notice} onClick={() => toggleNotif("notice")} />
            </Row>
            <Row label="Student messages" desc="Direct messages from students">
              <Toggle on={notif.message} onClick={() => toggleNotif("message")} />
            </Row>
            <Row label="Weekly digest email" desc="Summary of class activity">
              <Toggle on={notif.weeklyDigest} onClick={() => toggleNotif("weeklyDigest")} />
            </Row>
          </div>

          {/* Class defaults */}
          <div className="bg-[#12172A] border border-[#232A44] rounded-2xl p-5">
            <SectionHeader
              icon={GraduationCap}
              title="Class defaults"
              desc="Applied to new courses you create"
            />
            <Row label="Auto-accept enrollment requests" desc="Skip manual approval for new students">
              <Toggle on={classDefaults.autoAccept} onClick={() => toggleClassDefault("autoAccept")} />
            </Row>
            <Row label="Submission deadline reminders" desc="Auto-remind students before due dates">
              <Toggle on={classDefaults.reminder} onClick={() => toggleClassDefault("reminder")} />
            </Row>
            <Row label="Default grading scale">
              <select
                value={classDefaults.gradingScale}
                onChange={(e) =>
                  setClassDefaults((s) => ({ ...s, gradingScale: e.target.value }))
                }
                className="bg-[#0A0D18] border border-white/10 rounded-lg text-xs text-slate-300 px-2 py-1.5 focus:outline-none"
              >
                <option>Letter grade (A–F)</option>
                <option>Percentage (0–100)</option>
                <option>GPA (0–4.0)</option>
              </select>
            </Row>
          </div>

          {/* Appearance */}
          <div className="bg-[#12172A] border border-[#232A44] rounded-2xl p-5">
            <SectionHeader icon={Moon} title="Appearance" desc="Personalize how the portal looks" />
            <Row label="Theme">
              <div className="flex bg-[#0A0D18] rounded-lg p-1 border border-white/10">
                {["dark", "light"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`px-3 py-1 rounded-md text-xs capitalize transition ${
                      theme === t ? "bg-indigo-600 text-white" : "text-slate-400"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </Row>
            <Row label="Language">
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="bg-[#0A0D18] border border-white/10 rounded-lg text-xs text-slate-300 px-2 py-1.5 focus:outline-none"
              >
                <option>English</option>
                <option>বাংলা</option>
              </select>
            </Row>
          </div>

          {/* Danger zone */}
          <div className="bg-[#12172A] border border-red-500/20 rounded-2xl p-5">
            <SectionHeader icon={Trash2} title="Danger zone" desc="Irreversible actions" />
            <Row label="Log out of all devices" desc="End every active session immediately">
              <button
                onClick={onLogoutAll}
                className="flex items-center gap-1.5 text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 px-3 py-1.5 rounded-lg"
              >
                <LogOut className="w-3.5 h-3.5" />
                Log out all
              </button>
            </Row>
            <Row label="Deactivate account" desc="Hide your profile and pause access">
              <button
                onClick={onDeactivate}
                className="text-xs bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 px-3 py-1.5 rounded-lg"
              >
                Deactivate
              </button>
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
}