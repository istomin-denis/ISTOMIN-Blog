import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Clock3, Eye, MessageCircle, Pencil, Trash2 } from "lucide-react";
import { api, getErrorMessage } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function PostDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    const { data } = await api.get(`/posts/${slug}`);
    setPost(data.post); setComments(data.comments);
  }
  useEffect(() => { load().catch(err => setError(getErrorMessage(err))); }, [slug]);

  async function addComment(event) {
    event.preventDefault(); setBusy(true); setError("");
    try { await api.post(`/posts/${post._id}/comments`, { text }); setText(""); await load(); }
    catch (err) { setError(getErrorMessage(err)); }
    finally { setBusy(false); }
  }
  async function removePost() {
    if (!window.confirm("Delete this story permanently?")) return;
    try { await api.delete(`/posts/${post._id}`); navigate("/"); }
    catch (err) { setError(getErrorMessage(err)); }
  }
  async function removeComment(id) {
    try { await api.delete(`/comments/${id}`); await load(); }
    catch (err) { setError(getErrorMessage(err)); }
  }

  if (error && !post) return <main className="content-wrap"><div className="notice notice-error">{error}</div><Link to="/">Back to stories</Link></main>;
  if (!post) return <div className="page-loading">Loading story…</div>;
  const isOwner = user && post.author?._id === user.id;

  return (
    <main className="article-wrap">
      <button className="back-link" onClick={() => navigate(-1)}><ArrowLeft size={15} /> Back to stories</button>
      <article className="article">
        {post.coverImage && <img className="article-cover" src={post.coverImage} alt="" />}
        <div className="article-topline"><span className="eyebrow">ISTOMIN JOURNAL</span>{isOwner && <div className="article-actions"><Link to={`/edit/${post._id}`}><Pencil size={15} /> Edit</Link><button onClick={removePost}><Trash2 size={15} /> Delete</button></div>}</div>
        <h1>{post.title}</h1>
        {post.excerpt && <p className="article-excerpt">{post.excerpt}</p>}
        <div className="article-meta"><span>By <strong>{post.author?.username}</strong></span><i />{new Date(post.createdAt).toLocaleDateString()}<i /><span><Eye size={14} /> {post.views} views</span><i /><span><Clock3 size={14} /> {Math.max(1, Math.ceil(post.content.split(/\s+/).length / 210))} min read</span></div>
        <div className="tag-list article-tags">{post.tags?.map(tag => <Link key={tag} to={`/?tag=${encodeURIComponent(tag)}`}>#{tag}</Link>)}</div>
        <div className="article-content">{post.content.split(/\n{2,}/).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
      </article>
      <section className="comments-section">
        <div className="section-heading"><div><span className="eyebrow">COMMUNITY</span><h2>Discussion <span className="comment-count">{comments.length}</span></h2></div><MessageCircle size={22} /></div>
        {user ? <form className="comment-form" onSubmit={addComment}><textarea value={text} onChange={e => setText(e.target.value)} minLength={2} maxLength={1200} required placeholder="Share a thoughtful response…" /><button className="button" disabled={busy}>{busy ? "Sending…" : "Post comment"}</button></form> : <div className="notice"><Link to="/login">Sign in</Link> to join the discussion.</div>}
        {error && <div className="notice notice-error">{error}</div>}
        <div className="comment-list">{comments.map(comment => <div className="comment" key={comment._id}><div className="comment-avatar">{comment.author?.username?.[0]?.toUpperCase() || "U"}</div><div className="comment-body"><div className="comment-meta"><strong>{comment.author?.username}</strong><span>{new Date(comment.createdAt).toLocaleDateString()}</span>{user?.id === comment.author?._id && <button onClick={() => removeComment(comment._id)} title="Delete comment"><Trash2 size={14} /></button>}</div><p>{comment.text}</p></div></div>)}</div>
      </section>
    </main>
  );
}
