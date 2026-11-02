import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, Search, Sparkles } from "lucide-react";
import { api, getErrorMessage } from "../api/client.js";
import PostCard from "../components/PostCard.jsx";

export default function Home() {
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(params.get("search") || "");
  const [result, setResult] = useState({ items: [], pagination: { page: 1, pages: 1, total: 0 } });
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const activeTag = params.get("tag") || "";
  const activeSearch = params.get("search") || "";
  const page = Number(params.get("page") || 1);

  useEffect(() => {
    setSearch(activeSearch);
    setLoading(true);
    const query = new URLSearchParams({ page: String(page), limit: "9" });
    if (activeSearch) query.set("search", activeSearch);
    if (activeTag) query.set("tag", activeTag);
    api.get(`/posts?${query.toString()}`)
      .then(({ data }) => { setResult(data); setError(""); })
      .catch(err => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [activeSearch, activeTag, page]);

  useEffect(() => {
    api.get("/posts/tags").then(({ data }) => setTags(data.items)).catch(() => setTags([]));
  }, []);

  function submitSearch(event) {
    event.preventDefault();
    const next = new URLSearchParams();
    if (search.trim()) next.set("search", search.trim());
    if (activeTag) next.set("tag", activeTag);
    setParams(next);
  }

  return (
    <>
      <section className="hero">
        <div className="hero-kicker"><Sparkles size={14} /> IDEAS THAT MOVE YOU FORWARD</div>
        <h1>Stories for the<br /><span>curious mind.</span></h1>
        <p>A space for ideas, technology, engineering and everything worth sharing.</p>
        <div className="hero-bottom">
          <Link className="button" to="/register">Join the journal <ArrowRight size={16} /></Link>
          <span>WRITE · READ · BUILD</span>
        </div>
        <div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" />
      </section>

      <main className="content-wrap">
        <div className="section-heading">
          <div><span className="eyebrow">THE LATEST</span><h2>Fresh perspectives</h2></div>
          <span className="result-count">{result.pagination.total} stories</span>
        </div>
        <div className="discover-tools">
          <form className="search-box" onSubmit={submitSearch}>
            <Search size={17} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search articles, topics, ideas…" />
            <button type="submit">Search</button>
          </form>
          <div className="tag-list filter-tags">
            <button className={!activeTag ? "tag-active" : ""} onClick={() => setParams(activeSearch ? { search: activeSearch } : {})}>All</button>
            {tags.map(tag => <button key={tag.name} className={activeTag === tag.name ? "tag-active" : ""} onClick={() => setParams({ ...(activeSearch ? { search: activeSearch } : {}), tag: tag.name })}>#{tag.name}</button>)}
          </div>
        </div>
        {error && <div className="notice notice-error">{error}</div>}
        {loading ? <div className="page-loading">Loading stories…</div> :
          result.items.length ? (
            <>
              <div className="post-grid">{result.items.map(post => <PostCard key={post._id} post={post} />)}</div>
              {result.pagination.pages > 1 && <div className="pagination">
                <button disabled={page <= 1} onClick={() => setParams({ ...(activeSearch ? { search: activeSearch } : {}), ...(activeTag ? { tag: activeTag } : {}), page: String(page - 1) })}>Previous</button>
                <span>{page} / {result.pagination.pages}</span>
                <button disabled={page >= result.pagination.pages} onClick={() => setParams({ ...(activeSearch ? { search: activeSearch } : {}), ...(activeTag ? { tag: activeTag } : {}), page: String(page + 1) })}>Next</button>
              </div>}
            </>
          ) : <div className="empty-state"><h3>No stories yet</h3><p>Try another search, or be the first to publish something.</p><Link className="button" to="/write">Write a story</Link></div>
        }
      </main>
    </>
  );
}
