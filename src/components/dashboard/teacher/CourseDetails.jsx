"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Users, FileText, Video, BarChart2,
  Bell, Pin, Plus, Send, Paperclip, X,
 Heart, MessageCircle, Share2,
 GraduationCap,
  MoreHorizontal, Image, Link2,
} from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────
const TABS= [
  { id: "stream",       label: "Stream",       icon: <BookOpen size={14} /> },
  { id: "classwork",    label: "Classwork",    icon: <FileText size={14} /> },
  { id: "notes",        label: "Notes",        icon: <GraduationCap size={14} /> },
  { id: "online-class", label: "Online Class", icon: <Video size={14} /> },
];

const CAT_META = {
  stream:         { label: "Stream",       color: "#6366F1", bg: "rgba(99,102,241,0.12)",  border: "rgba(99,102,241,0.3)"  },
  classwork:      { label: "Classwork",    color: "#F59E0B", bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.3)"  },
  notes:          { label: "Notes",        color: "#10B981", bg: "rgba(16,185,129,0.12)",  border: "rgba(16,185,129,0.3)"  },
  "online-class": { label: "Online Class", color: "#8B5CF6", bg: "rgba(139,92,246,0.12)",  border: "rgba(139,92,246,0.3)"  },
  poll:           { label: "Poll",         color: "#EC4899", bg: "rgba(236,72,153,0.12)",  border: "rgba(236,72,153,0.3)"  },
};

const AVATAR_COLORS= {
  T: "#6366F1", S: "#10B981", A: "#F59E0B", N: "#EC4899",
  R: "#8B5CF6", M: "#06B6D4", D: "#EF4444", K: "#84CC16",
};

const getAvatarColor = (initials) =>
  AVATAR_COLORS[initials[0]] || "#6366F1";

// ─── Sub-components ───────────────────────────────────────────────────────────

function Avatar({ initials, size = 36 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `linear-gradient(135deg, ${getAvatarColor(initials)}, ${getAvatarColor(initials)}99)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.35, fontWeight: 700, color: "#fff",
      flexShrink: 0, letterSpacing: 0.5,
      boxShadow: `0 0 0 2px ${getAvatarColor(initials)}30`,
    }}>
      {initials}
    </div>
  );
}

function CategoryBadge({ category }) {
  const m = CAT_META[category];
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, color: m.color,
      background: m.bg, border: `1px solid ${m.border}`,
      padding: "2px 8px", borderRadius: 20, letterSpacing: 0.4,
    }}>
      {m.label}
    </span>
  );
}

function PostCard({ post, onLike }) {
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [localComments, setLocalComments] = useState(post.comments);

  const handleLike = () => { setLiked(!liked); onLike(post.id); };

  const handleComment = () => {
    if (!commentText.trim()) return;
    const newComment = {
      id: Date.now(), author: "You", initials: "ME",
      role: "student", time: "Just now", content: commentText,
    };
    setLocalComments(prev => [...prev, newComment]);
    setCommentText("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: "rgba(13,22,48,0.9)",
        border: "1px solid rgba(99,102,241,0.15)",
        borderRadius: 16, marginBottom: 14, overflow: "hidden",
        transition: "border-color 0.2s",
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(99,102,241,0.35)"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(99,102,241,0.15)"}
    >
      {/* Pinned banner */}
      {post.pinned && (
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "6px 18px", fontSize: 11, fontWeight: 600,
          color: "#F59E0B", background: "rgba(245,158,11,0.08)",
          borderBottom: "1px solid rgba(245,158,11,0.15)",
        }}>
          <Pin size={11} /> Pinned by teacher
        </div>
      )}

      <div style={{ padding: "16px 18px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 11, marginBottom: 12 }}>
          <Avatar initials={post.initials} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontWeight: 700, color: "#E2E8F0", fontSize: 13 }}>{post.author}</span>
              {post.role === "teacher" && (
                <span style={{
                  fontSize: 9, fontWeight: 700, color: "#6366F1",
                  background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)",
                  padding: "1px 6px", borderRadius: 10, letterSpacing: 0.5,
                }}>TEACHER</span>
              )}
              <CategoryBadge category={post.category} />
              <span style={{ fontSize: 11, color: "#475569", marginLeft: "auto" }}>{post.time}</span>
              <button style={{ background: "none", border: "none", cursor: "pointer", color: "#475569", padding: 0 }}>
                <MoreHorizontal size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <p style={{ color: "#CBD5E1", fontSize: 14, lineHeight: 1.7, margin: "0 0 12px", paddingLeft: 47 }}>
          {post.content}
        </p>

        {/* Attachments */}
        {post.attachments && post.attachments.length > 0 && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12, paddingLeft: 47 }}>
            {post.attachments.map(a => (
              <div key={a} style={{
                background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)",
                borderRadius: 8, padding: "5px 12px", fontSize: 12, color: "#818CF8",
                cursor: "pointer", display: "flex", alignItems: "center", gap: 5,
              }}>
                <Paperclip size={11} /> {a}
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: 4, alignItems: "center", paddingLeft: 47 }}>
          <button onClick={handleLike} style={{
            background: liked ? "rgba(99,102,241,0.12)" : "none",
            border: liked ? "1px solid rgba(99,102,241,0.25)" : "1px solid transparent",
            cursor: "pointer", display: "flex", alignItems: "center", gap: 5,
            color: liked ? "#818CF8" : "#475569", fontSize: 12,
            padding: "5px 10px", borderRadius: 8, transition: "all 0.15s",
          }}>
            <Heart size={13} fill={liked ? "#818CF8" : "none"} />
            {post.likes + (liked ? 1 : 0)}
          </button>
          <button onClick={() => setShowComments(!showComments)} style={{
            background: showComments ? "rgba(99,102,241,0.12)" : "none",
            border: showComments ? "1px solid rgba(99,102,241,0.25)" : "1px solid transparent",
            cursor: "pointer", display: "flex", alignItems: "center", gap: 5,
            color: showComments ? "#818CF8" : "#475569", fontSize: 12,
            padding: "5px 10px", borderRadius: 8, transition: "all 0.15s",
          }}>
            <MessageCircle size={13} /> {localComments.length}
          </button>
          <button style={{
            background: "none", border: "1px solid transparent",
            cursor: "pointer", display: "flex", alignItems: "center", gap: 5,
            color: "#475569", fontSize: 12, padding: "5px 10px", borderRadius: 8,
          }}>
            <Share2 size={13} /> Share
          </button>
        </div>
      </div>

      {/* Comments */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: "hidden" }}
          >
            <div style={{
              borderTop: "1px solid rgba(255,255,255,0.05)",
              padding: "12px 18px 14px",
              background: "rgba(8,13,26,0.5)",
            }}>
              {localComments.length === 0 ? (
                <p style={{ color: "#374151", fontSize: 12, textAlign: "center", padding: "8px 0" }}>
                  No comments yet. Be the first!
                </p>
              ) : (
                localComments.map(c => (
                  <div key={c.id} style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                    <Avatar initials={c.initials} size={28} />
                    <div style={{
                      flex: 1, background: "rgba(30,41,59,0.6)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: 10, padding: "8px 12px",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                        <span style={{ fontWeight: 600, color: "#E2E8F0", fontSize: 12 }}>{c.author}</span>
                        {c.role === "teacher" && (
                          <span style={{ fontSize: 9, color: "#6366F1", fontWeight: 700 }}>TEACHER</span>
                        )}
                        <span style={{ fontSize: 10, color: "#475569", marginLeft: "auto" }}>{c.time}</span>
                      </div>
                      <p style={{ margin: 0, color: "#94A3B8", fontSize: 13, lineHeight: 1.5 }}>{c.content}</p>
                    </div>
                  </div>
                ))
              )}

              {/* Comment input */}
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <Avatar initials="ME" size={28} />
                <div style={{
                  flex: 1, display: "flex", alignItems: "center",
                  background: "rgba(30,41,59,0.8)", border: "1px solid rgba(99,102,241,0.2)",
                  borderRadius: 10, padding: "0 8px 0 12px", gap: 6,
                }}>
                  <input
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleComment()}
                    placeholder="Write a comment..."
                    style={{
                      flex: 1, background: "none", border: "none", outline: "none",
                      color: "#E2E8F0", fontSize: 13, padding: "8px 0",
                    }}
                  />
                  <button onClick={handleComment} style={{
                    background: commentText.trim() ? "rgba(99,102,241,0.3)" : "none",
                    border: "none", cursor: "pointer", color: commentText.trim() ? "#818CF8" : "#374151",
                    padding: "4px 6px", borderRadius: 6, transition: "all 0.15s",
                  }}>
                    <Send size={13} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function PollCard({ poll }) {
  const [voted, setVoted] = useState(poll.voted);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: "rgba(13,22,48,0.9)", border: "1px solid rgba(236,72,153,0.2)",
        borderRadius: 16, padding: "18px 20px", marginBottom: 14,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <BarChart2 size={14} style={{ color: "#EC4899" }} />
        <span style={{
          fontSize: 10, fontWeight: 700, color: "#EC4899",
          background: "rgba(236,72,153,0.12)", border: "1px solid rgba(236,72,153,0.3)",
          padding: "2px 8px", borderRadius: 20,
        }}>POLL · ends {poll.deadline}</span>
        <span style={{ fontSize: 11, color: "#475569", marginLeft: "auto" }}>{poll.totalVotes} votes</span>
      </div>
      <p style={{ fontWeight: 600, color: "#E2E8F0", fontSize: 14, marginBottom: 14 }}>{poll.question}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {poll.options.map((opt, i) => {
          const pct = Math.round((opt.votes / poll.totalVotes) * 100);
          const isVoted = voted === i;
          return (
            <div key={i} onClick={() => !voted && setVoted(i)} style={{
              cursor: voted !== null ? "default" : "pointer",
              background: isVoted ? "rgba(99,102,241,0.15)" : "rgba(15,22,41,0.5)",
              border: `1px solid ${isVoted ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.06)"}`,
              borderRadius: 10, padding: "10px 14px", position: "relative", overflow: "hidden",
              transition: "all 0.15s",
            }}>
              {voted !== null && (
                <div style={{
                  position: "absolute", left: 0, top: 0, height: "100%", width: `${pct}%`,
                  background: isVoted ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.03)",
                  transition: "width 0.6s ease", borderRadius: 10,
                }} />
              )}
              <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, color: isVoted ? "#A5B4FC" : "#CBD5E1" }}>
                  {isVoted ? "✓ " : ""}{opt.label}
                </span>
                {voted !== null && (
                  <span style={{ fontSize: 12, fontWeight: 700, color: isVoted ? "#818CF8" : "#475569" }}>{pct}%</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyFeed({ tab, role }) {
  const meta = {
    stream:         { icon: "💬", title: "No posts yet",        desc: role === "teacher" ? "Share an announcement, resource, or start a discussion with your class." : "Your teacher hasn't posted anything yet. Check back soon." },
    classwork:      { icon: "📋", title: "No classwork yet",    desc: role === "teacher" ? "Create assignments, quizzes, or tasks for your students." : "No assignments have been posted yet." },
    notes:          { icon: "📝", title: "No notes shared",     desc: role === "teacher" ? "Upload lecture notes, slides, or study guides." : "No notes have been shared yet. You can share your own!" },
    "online-class": { icon: "🎥", title: "No sessions posted",  desc: role === "teacher" ? "Schedule or post a link for your next online class." : "No online class sessions have been scheduled yet." },
  };
  const m = meta[tab];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ textAlign: "center", padding: "64px 24px", display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        style={{ fontSize: 52, marginBottom: 16 }}
      >
        {m.icon}
      </motion.div>
      <p style={{ fontWeight: 700, color: "#CBD5E1", fontSize: 16, marginBottom: 8 }}>{m.title}</p>
      <p style={{ color: "#475569", fontSize: 13, maxWidth: 320, lineHeight: 1.6, marginBottom: 20 }}>{m.desc}</p>
      {role === "teacher" && (
        <motion.button
          whileTap={{ scale: 0.96 }}
          style={{
            background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
            border: "none", borderRadius: 12, padding: "10px 20px",
            color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 6,
            boxShadow: "0 4px 16px rgba(99,102,241,0.3)",
          }}
        >
          <Plus size={14} /> Create first post
        </motion.button>
      )}
    </motion.div>
  );
}

// ─── Create Post Panel ────────────────────────────────────────────────────────
function CreatePostPanel({
  activeTab, onClose, onSubmit,
}) {
  const [text, setText] = useState("");
  const [category, setCategory] = useState(activeTab === "stream" ? "stream" : activeTab);

  const submit = () => {
    if (!text.trim()) return;
    onSubmit({
      author: "You (Teacher)", initials: "TE", role: "teacher",
      time: "Just now", content: text, category,
    });
    setText(""); onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      style={{
        background: "rgba(13,22,48,0.98)", border: "1px solid rgba(99,102,241,0.3)",
        borderRadius: 16, padding: "18px", marginBottom: 16,
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <span style={{ fontWeight: 700, color: "#E2E8F0", fontSize: 14 }}>New Post</span>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#475569" }}>
          <X size={16} />
        </button>
      </div>

      {/* Category selector */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
        {(["stream", "classwork", "notes", "online-class", "poll"]).map(cat => {
          const m = CAT_META[cat];
          const isActive = category === cat;
          return (
            <button key={cat} onClick={() => setCategory(cat)} style={{
              background: isActive ? m.bg : "rgba(30,41,59,0.5)",
              border: `1px solid ${isActive ? m.border : "rgba(255,255,255,0.07)"}`,
              borderRadius: 20, padding: "4px 12px",
              color: isActive ? m.color : "#64748B",
              fontSize: 11, fontWeight: isActive ? 700 : 400,
              cursor: "pointer", transition: "all 0.15s",
            }}>
              {m.label}
            </button>
          );
        })}
      </div>

      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Share something with your class…"
        autoFocus
        style={{
          width: "100%", background: "rgba(8,13,26,0.6)",
          border: "1px solid rgba(99,102,241,0.2)", borderRadius: 10,
          padding: "12px 14px", color: "#E2E8F0", fontSize: 14,
          resize: "none", outline: "none", minHeight: 90, fontFamily: "inherit",
          boxSizing: "border-box", lineHeight: 1.6, transition: "border-color 0.2s",
        }}
        onFocus={e => (e.target.style.borderColor = "rgba(99,102,241,0.5)")}
        onBlur={e => (e.target.style.borderColor = "rgba(99,102,241,0.2)")}
      />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
        <div style={{ display: "flex", gap: 4 }}>
          {[Paperclip, Image, Link2].map((Icon, i) => 
            <button key={i} style={{
              background: "none", border: "1px solid transparent", borderRadius: 8,
              padding: "5px 8px", cursor: "pointer", color: "#475569",
              transition: "all 0.15s",
            }}
              onMouseEnter={(e)=> {
                e.currentTarget.style.color = "#818CF8";
                e.currentTarget.style.borderColor = "rgba(99,102,241,0.2)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = "#475569";
                e.currentTarget.style.borderColor = "transparent";
              }}
            >
              <Icon size={14} />
            </button>
          )}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onClose} style={{
            background: "rgba(30,41,59,0.8)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 9, padding: "8px 16px", color: "#64748B", fontSize: 13, cursor: "pointer",
          }}>Cancel</button>
          <button onClick={submit} disabled={!text.trim()} style={{
            background: text.trim() ? "linear-gradient(135deg, #6366F1, #8B5CF6)" : "rgba(30,41,59,0.5)",
            border: "none", borderRadius: 9, padding: "8px 20px",
            color: text.trim() ? "#fff" : "#374151", fontWeight: 700, fontSize: 13,
            cursor: text.trim() ? "pointer" : "not-allowed", transition: "all 0.2s",
          }}>Post</button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CourseDetailsPage({role,courseCode,section,courseTitle,session,teacherName,credits}) {
  const [activeTab, setActiveTab] = useState("stream");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [filterCat, setFilterCat] = useState("all");
  const [posts, setPosts] = useState([]);
  const [polls] = useState([]);
  const [notices] = useState([]);
  const isLive = false; // set true when live class is running

  const handleNewPost = (post) => {
    setPosts(prev => [{ ...post, id: Date.now(), likes: 0, comments: [] }, ...prev]);
  };

  const handleLike = (id) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
  };

  const tabPosts = posts.filter(p =>
    activeTab === "stream" ? true : p.category === activeTab
  );

  const filteredPosts = tabPosts.filter(p =>
    filterCat === "all" || p.category === filterCat
  );

  return (
    <div style={{
      color: "#E2E8F0", minHeight: "100vh", background: "#080d1a",
    }}>

      {/* ── Course Header ── */}
      <div style={{
        background: "linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.08) 50%, rgba(8,13,26,0) 100%)",
        borderBottom: "1px solid rgba(99,102,241,0.15)",
        padding: "28px 32px 0",
        marginTop: 60,
      }}>
        <div style={{ maxWidth: 1300, margin: "0 auto" }}>
          {/* Course info */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <span style={{
                  fontSize: 11, fontWeight: 700, color: "#6366F1", letterSpacing: 1.2,
                  background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.25)",
                  padding: "3px 10px", borderRadius: 20,
                }}>{courseCode}</span>
                <span style={{
                  fontSize: 11, fontWeight: 600, color: "#10B981",
                  background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)",
                  padding: "3px 10px", borderRadius: 20,
                }}>section: {section}</span>
                <span style={{ fontSize: 11, color: "#475569" }}>·</span>
                <span style={{ fontSize: 11, color: "#475569" }}>{session}</span>
              </div>
              <h1 style={{
                fontSize: 24, fontWeight: 800, color: "#fff", margin: "0 0 6px",
                background: "linear-gradient(135deg, #E2E8F0, #94A3B8)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>{courseTitle}</h1>
              <p style={{ margin: 0, fontSize: 13, color: "#64748B" }}>
                {teacherName} · {credits} Credits
              </p>
            </div>
            {role === "teacher" && (
              <div style={{ display: "flex", gap: 8 }}>
                <button style={{
                  background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.25)",
                  borderRadius: 10, padding: "8px 14px", color: "#818CF8",
                  fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
                }}>
                  <Users size={13} /> Manage Students
                </button>
                <button style={{
                  background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.25)",
                  borderRadius: 10, padding: "8px 14px", color: "#818CF8",
                  fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
                }}>
                  <Bell size={13} /> Settings
                </button>
              </div>
            )}
          </div>

          {/* Tab bar */}
          <div style={{ display: "flex", gap: 0 }}>
            {TABS.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button key={tab.id} onClick={() => { setActiveTab(tab.id); setFilterCat("all"); }} style={{
                  background: "none", border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "12px 18px", fontSize: 13, fontWeight: isActive ? 700 : 400,
                  color: isActive ? "#818CF8" : "#475569",
                  borderBottom: isActive ? "2px solid #6366F1" : "2px solid transparent",
                  transition: "all 0.15s", whiteSpace: "nowrap",
                }}>
                  {tab.icon} {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ maxWidth: 1300, margin: "0 auto", display: "flex", padding: "24px 32px", gap: 20 }}>

        {/* ── LEFT SIDEBAR ── */}
        <aside style={{
          width: 220, flexShrink: 0,
          position: "sticky", top: 88,
          height: "calc(100vh - 88px)", overflowY: "auto",
        }}>
          {/* Live class banner */}
          {isLive && (
            <div style={{
              background: "linear-gradient(135deg, rgba(132,204,22,0.12), rgba(16,185,129,0.08))",
              border: "1px solid rgba(132,204,22,0.3)", borderRadius: 14,
              padding: "14px", marginBottom: 16,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                <span style={{
                  width: 7, height: 7, borderRadius: "50%", background: "#84CC16",
                  boxShadow: "0 0 8px #84CC16", display: "inline-block",
                  animation: "pulse 1.5s infinite",
                }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: "#84CC16", letterSpacing: 1.2 }}>LIVE NOW</span>
              </div>
              <p style={{ fontSize: 12, color: "#D1FAE5", fontWeight: 600, margin: "0 0 10px", lineHeight: 1.4 }}>
                Class in progress
              </p>
              <button style={{
                width: "100%", background: "linear-gradient(135deg, #84CC16, #65A30D)",
                border: "none", borderRadius: 8, padding: "8px 0",
                color: "#052E16", fontWeight: 800, fontSize: 12, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
              }}>▶ Join Now</button>
            </div>
          )}

          {/* Course info card */}
          <div style={{
            background: "rgba(13,22,48,0.8)", border: "1px solid rgba(99,102,241,0.15)",
            borderRadius: 14, padding: "14px", marginBottom: 14,
          }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: "#475569", letterSpacing: 1.5, textTransform: "uppercase", margin: "0 0 10px" }}>
              Course Info
            </p>
            {[
              { label: "Code",     value: courseCode },
              { label: "Credits",  value: `${credits} cr` },
              { label: "Section",  value: section },
              { label: "Session",  value: session },
              { label: "Teacher",  value: teacherName },
            ].map(item => (
              <div key={item.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                <span style={{ fontSize: 11, color: "#475569" }}>{item.label}</span>
                <span style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600 }}>{item.value}</span>
              </div>
            ))}
          </div>

          {/* Quick links */}
          <p style={{ fontSize: 10, fontWeight: 700, color: "#475569", letterSpacing: 1.5, textTransform: "uppercase", margin: "0 0 8px" }}>
            Quick Access
          </p>
          {[
            { icon: "📅", label: "Schedule" },
            { icon: "📁", label: "Resources", badge: "0" },
            { icon: "🏆", label: "Grades" },
            { icon: "👥", label: "Classmates" },
          ].map(item => (
            <button key={item.label} style={{
              width: "100%", background: "transparent", border: "1px solid transparent",
              borderRadius: 9, padding: "8px 10px", color: "#64748B", fontSize: 12,
              cursor: "pointer", display: "flex", alignItems: "center", gap: 9,
              textAlign: "left", transition: "all 0.15s", marginBottom: 2,
            }}
             onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(99,102,241,0.08)";
                e.currentTarget.style.borderColor = "rgba(99,102,241,0.2)";
                e.currentTarget.style.color = "#C7D2FE";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "transparent";
                e.currentTarget.style.color = "#64748B";
              }}
            >
              <span style={{ fontSize: 14 }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && (
                <span style={{
                  background: "rgba(99,102,241,0.15)", color: "#818CF8",
                  fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 8,
                }}>{item.badge}</span>
              )}
            </button>
          ))}
        </aside>

        {/* ── CENTER FEED ── */}
        <main style={{ flex: 1, minWidth: 0 }}>

          {/* Create post / filter bar */}
          <div style={{
            position: "sticky", top: 120,
            backdropFilter: "blur(20px)",
            paddingBottom: 14, zIndex: 40, marginBottom: 4,
          }}>
            {/* Create post trigger */}
            {role === "teacher" && !showCreatePost && (
              <div
                onClick={() => setShowCreatePost(true)}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  background: "rgba(13,22,48,0.9)", border: "1px solid rgba(99,102,241,0.2)",
                  borderRadius: 14, padding: "12px 16px", cursor: "text",
                  marginBottom: 12, transition: "border-color 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(99,102,241,0.4)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(99,102,241,0.2)"}
              >
                <Avatar initials="TE" size={32} />
                <span style={{ color: "#374151", fontSize: 14, flex: 1 }}>
                  Share something with your class…
                </span>
                <button style={{
                  background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
                  border: "none", borderRadius: 9, padding: "7px 14px",
                  color: "#fff", fontWeight: 700, fontSize: 12, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 5,
                }}>
                  <Plus size={12} /> Post
                </button>
              </div>
            )}

            {/* Create post panel */}
            <AnimatePresence>
              {showCreatePost && (
                <CreatePostPanel
                  activeTab={activeTab}
                  onClose={() => setShowCreatePost(false)}
                  onSubmit={handleNewPost}
                />
              )}
            </AnimatePresence>

            {/* Filter pills */}
            {posts.length > 0 && (
              <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 2 }}>
              {["all", "stream", "classwork", "notes", "online-class", "poll"].map(cat => {
  const m = isAll ? null : CAT_META[cat];
                  const isActive = filterCat === cat;
                  return (
                    <button key={cat} onClick={() => setFilterCat(cat)} style={{
                      background: isActive ? (isAll ? "rgba(99,102,241,0.2)" : m?.bg) : "rgba(30,41,59,0.5)",
                      border: `1px solid ${isActive ? (isAll ? "rgba(99,102,241,0.4)" : m?.border) : "rgba(255,255,255,0.06)"}`,
                      borderRadius: 20, padding: "5px 13px",
                      color: isActive ? (isAll ? "#A5B4FC" : m?.color) : "#64748B",
                      fontSize: 11, fontWeight: isActive ? 700 : 400,
                      cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s",
                    }}>
                      {isAll ? "All" : m?.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Feed */}
          <AnimatePresence mode="wait">
            {filteredPosts.length === 0 && polls.length === 0 ? (
              <EmptyFeed key={activeTab} tab={activeTab} role={role} />
            ) : (
              <motion.div key="feed" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {filteredPosts.map(post => (
                  <PostCard key={post.id} post={post} onLike={handleLike} />
                ))}
                {(filterCat === "all" || filterCat === "poll") &&
                  polls.map(poll => <PollCard key={poll.id} poll={poll} />)}
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* ── RIGHT SIDEBAR ── */}
        <aside style={{
          width: 220, flexShrink: 0,
          position: "sticky", top: 88,
          height: "calc(100vh - 88px)", overflowY: "auto",
          display: "flex", flexDirection: "column", gap: 0,
        }}>
          {/* Notice Board */}
          <div style={{
            background: "rgba(13,22,48,0.8)", border: "1px solid rgba(99,102,241,0.12)",
            borderRadius: 14, padding: "14px", marginBottom: 14, flex: 1, overflowY: "auto",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: "#475569", letterSpacing: 1.5, textTransform: "uppercase", margin: 0 }}>
                📌 Notices
              </p>
              {role === "teacher" && (
                <button style={{ background: "none", border: "none", cursor: "pointer", color: "#6366F1", fontSize: 11, fontWeight: 600 }}>
                  + Add
                </button>
              )}
            </div>
            {notices.length === 0 ? (
              <div style={{ textAlign: "center", padding: "20px 8px" }}>
                <p style={{ fontSize: 28, margin: "0 0 8px" }}>📭</p>
                <p style={{ fontSize: 11, color: "#374151", margin: 0 }}>No notices yet</p>
                {role === "teacher" && (
                  <p style={{ fontSize: 10, color: "#1F2937", margin: "4px 0 0" }}>Pin important announcements here</p>
                )}
              </div>
            ) : (
              notices.map(n => (
                <div key={n.id} style={{
                  background: n.urgent ? "rgba(239,68,68,0.06)" : "rgba(30,41,59,0.4)",
                  border: `1px solid ${n.urgent ? "rgba(239,68,68,0.18)" : "rgba(255,255,255,0.05)"}`,
                  borderRadius: 9, padding: "9px 11px", marginBottom: 7, cursor: "pointer",
                }}>
                  <p style={{ margin: 0, fontSize: 12, color: n.urgent ? "#FCA5A5" : "#CBD5E1", fontWeight: n.urgent ? 600 : 400, lineHeight: 1.4 }}>
                    {n.urgent && "🔴 "}{n.title}
                  </p>
                  <p style={{ margin: "4px 0 0", fontSize: 10, color: "#475569" }}>{n.time}</p>
                </div>
              ))
            )}
          </div>

          {/* Active Polls */}
          <div style={{
            background: "rgba(13,22,48,0.8)", border: "1px solid rgba(236,72,153,0.12)",
            borderRadius: 14, padding: "14px",
          }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: "#475569", letterSpacing: 1.5, textTransform: "uppercase", margin: "0 0 12px" }}>
              📊 Polls
            </p>
            {polls.length === 0 ? (
              <div style={{ textAlign: "center", padding: "16px 8px" }}>
                <p style={{ fontSize: 28, margin: "0 0 8px" }}>🗳️</p>
                <p style={{ fontSize: 11, color: "#374151", margin: 0 }}>No active polls</p>
                {role === "teacher" && (
                  <p style={{ fontSize: 10, color: "#1F2937", margin: "4px 0 0" }}>Create a poll to get class feedback</p>
                )}
              </div>
            ) : (
              polls.map(poll => (
                <div key={poll.id} style={{
                  background: "rgba(30,41,59,0.4)", border: "1px solid rgba(236,72,153,0.12)",
                  borderRadius: 10, padding: "10px", marginBottom: 10,
                }}>
                  <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 600, color: "#E2E8F0", lineHeight: 1.4 }}>{poll.question}</p>
                  {poll.options.slice(0, 2).map((opt, i) => {
                    const pct = Math.round((opt.votes / poll.totalVotes) * 100);
                    return (
                      <div key={i} style={{ marginBottom: 5 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                          <span style={{ fontSize: 10, color: "#94A3B8" }}>{opt.label}</span>
                          <span style={{ fontSize: 10, color: "#64748B", fontWeight: 700 }}>{pct}%</span>
                        </div>
                        <div style={{ height: 3, background: "rgba(255,255,255,0.05)", borderRadius: 2, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg, #EC4899, #8B5CF6)", borderRadius: 2 }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        </aside>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.4); }
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.25); border-radius: 4px; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>
    </div>
  )
}