import { Link } from "react-router-dom";
import { Clock3, ArrowUpRight } from "lucide-react";

function readingTime(content = "") {
  return Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 210));
}

export default function PostCard({ post }) {
  return (
    <article className="post-card">
      {post.coverImage && <Link to={`/posts/${post.slug}`} className="post-cover"><img src={post.coverImage} alt="" loading="lazy" /></Link>}
      <div className="post-card-body">
        <div className="post-meta"><span>{post.author?.username || "ISTOMIN member"}</span><i />{new Date(post.createdAt).toLocaleDateString()}</div>
        <h2><Link to={`/posts/${post.slug}`}>{post.title}</Link></h2>
        <p>{post.excerpt || post.content.slice(0, 150) + "…"}</p>
        <div className="post-card-bottom">
          <div className="tag-list">{(post.tags || []).slice(0, 3).map(tag => <Link key={tag} to={`/?tag=${encodeURIComponent(tag)}`}>#{tag}</Link>)}</div>
          <span className="read-time"><Clock3 size={13} /> {readingTime(post.content)} min</span>
        </div>
        <Link className="card-arrow" to={`/posts/${post.slug}`} aria-label={`Read ${post.title}`}><ArrowUpRight size={18} /></Link>
      </div>
    </article>
  );
}
