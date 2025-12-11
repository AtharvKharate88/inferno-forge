import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../Navbar";
import "./dashboard.css";
import {
  Search,
  Folder,
  BarChart2,
  Activity,
  Settings,
  List,
} from "lucide-react";

const RepoCard = ({ repo }) => {
  const langs = (repo.languages && repo.languages.slice(0, 3)) || [];
  return (
    <div className="repo-card">
      <div
        style={{ display: "flex", justifyContent: "space-between", gap: 12 }}
      >
        <div style={{ flex: 1 }}>
          <h4 style={{ margin: 0 }}>{repo.name}</h4>
          <p style={{ margin: "8px 0", color: "var(--text-dim)" }}>
            {repo.description || "No description"}
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {langs.map((l) => (
              <span key={l} className="badge language-tag">
                {l}
              </span>
            ))}
          </div>
        </div>

        <div style={{ width: 140, textAlign: "right" }}>
          <div className="muted">⭐ {repo.stars ?? 0}</div>
          <div className="muted">🍴 {repo.forks ?? 0}</div>
          <div className="muted" style={{ marginTop: 8, fontSize: "0.85rem" }}>
            Updated {repo.lastUpdated ?? "—"}
          </div>
          <div style={{ marginTop: 12 }} className="row">
            <button>Open</button>
            <button>Edit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Sidebar = () => {
  return (
    <div className="sidebar card glass">
      <nav>
        <a href="/app">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Folder size={20} /> Dashboard
          </div>
        </a>
        <a href="/app">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <List size={20} /> Repositories
          </div>
        </a>
        <a href="#activity">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Activity size={20} /> Activity
          </div>
        </a>
        <a href="#insights">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <BarChart2 size={20} /> Insights
          </div>
        </a>
        <a href="#settings">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Settings size={20} /> Settings
          </div>
        </a>
      </nav>
    </div>
  );
};

const Dashboard = () => {
  const [repos, setRepos] = useState([]);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [languageFilter, setLanguageFilter] = useState("All");
  const [showPrivate, setShowPrivate] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const fetchRepos = async () => {
      try {
        const res = await fetch(`http://localhost:3000/repo/user/${userId}`);
        if (!res.ok) throw new Error(`fetch repos failed: ${res.status}`);
        const data = await res.json();
        const list = data.repositories || data || [];
        const mapped = list.map((r) => ({
          id: r._id ?? r.id,
          name: r.name ?? r.repoName ?? "Untitled",
          description: r.description ?? r.desc ?? "",
          languages: r.languages ?? (r.language ? [r.language] : []),
          stars: r.stars ?? Math.floor(Math.random() * 500),
          forks: r.forks ?? Math.floor(Math.random() * 50),
          lastUpdated: r.updatedAt
            ? new Date(r.updatedAt).toLocaleDateString()
            : r.lastUpdated,
          private: !!r.private,
        }));
        setRepos(mapped);

        // language detection: for repos missing languages, try calling API endpoint
        const toFetch = mapped.filter(
          (m) => (!m.languages || m.languages.length === 0) && m.id
        );
        if (toFetch.length > 0) {
          try {
            const resArr = await Promise.all(
              toFetch.map(async (r) => {
                try {
                  const resp = await fetch(
                    `http://localhost:3000/repo/${r.id}/languages`
                  );
                  if (!resp.ok) return { id: r.id, languages: [] };
                  const j = await resp.json();
                  const langs = Array.isArray(j) ? j : j.languages || [];
                  return { id: r.id, languages: langs };
                } catch (e) {
                  return { id: r.id, languages: [] };
                }
              })
            );
            const langMap = new Map(
              resArr.map((x) => [String(x.id), x.languages])
            );
            setRepos((prev) =>
              prev.map((p) => ({
                ...p,
                languages:
                  p.languages && p.languages.length > 0
                    ? p.languages
                    : langMap.get(String(p.id)) || [],
              }))
            );
          } catch (e) {
            console.error("Language detection failed", e);
          }
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
        // fallback sample
        setRepos([
          {
            id: 1,
            name: "starter-kit",
            description: "A starter repo",
            languages: ["JavaScript"],
            stars: 12,
            forks: 2,
            lastUpdated: "2025-12-01",
            private: false,
          },
          {
            id: 2,
            name: "design-system",
            description: "Design tokens and components",
            languages: ["TypeScript", "CSS"],
            stars: 321,
            forks: 45,
            lastUpdated: "2025-11-25",
            private: false,
          },
        ]);
      }
    };
    fetchRepos();
  }, []);

  const languages = useMemo(() => {
    const s = new Set();
    repos.forEach((r) => (r.languages || []).forEach((l) => s.add(l)));
    return ["All", ...Array.from(s)];
  }, [repos]);

  const filtered = useMemo(() => {
    let list = repos.slice();
    if (query)
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(query.toLowerCase()) ||
          (r.description || "").toLowerCase().includes(query.toLowerCase())
      );
    if (languageFilter && languageFilter !== "All")
      list = list.filter((r) => (r.languages || []).includes(languageFilter));
    if (!showPrivate) list = list.filter((r) => !r.private);
    if (sortBy === "stars")
      list.sort((a, b) => (b.stars || 0) - (a.stars || 0));
    if (sortBy === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === "recent")
      list.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
    return list;
  }, [repos, query, languageFilter, showPrivate, sortBy]);

  return (
    <>
      <Navbar />
      <div className="app-grid" style={{ padding: 20 }}>
        <Sidebar />

        <div className="content">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              marginBottom: 12,
            }}
          >
            <h2>Your Repositories</h2>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <div className="search-bar">
                <Search size={20} style={{ color: "var(--text-dim)" }} />{" "}
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search repositories..."
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--text-primary)",
                  }}
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: "8px",
                  borderRadius: 8,
                  background: "transparent",
                  border: "1px solid var(--border-color)",
                  color: "var(--text-primary)",
                }}
              >
                <option value="recent">Sort: Recent</option>
                <option value="stars">Sort: Stars</option>
                <option value="name">Sort: Name</option>
              </select>
              <select
                value={languageFilter}
                onChange={(e) => setLanguageFilter(e.target.value)}
                style={{
                  padding: "8px",
                  borderRadius: 8,
                  background: "transparent",
                  border: "1px solid var(--border-color)",
                  color: "var(--text-primary)",
                }}
              >
                {languages.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  color: "var(--text-dim)",
                }}
              >
                <input
                  type="checkbox"
                  checked={showPrivate}
                  onChange={(e) => setShowPrivate(e.target.checked)}
                />{" "}
                Show private
              </label>
            </div>
          </div>

          <div className="user-repo-section">
            {filtered.length === 0 ? (
              <div className="empty-state">No repositories found.</div>
            ) : (
              filtered.map((r) => <RepoCard key={r.id} repo={r} />)
            )}
          </div>
        </div>

        <div style={{ width: 280 }}>
          <div className="card glass">
            <h4>Activity Summary</h4>
            <p className="muted">
              Recent contributions, insights and quick actions will appear here.
            </p>
          </div>
        </div>
      </div>
      {error && (
        <div
          style={{ position: "fixed", bottom: 20, right: 20 }}
          className="error-toast"
        >
          {error}
        </div>
      )}
    </>
  );
};

export default Dashboard;
