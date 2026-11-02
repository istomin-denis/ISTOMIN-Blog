import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";
import { api, getErrorMessage } from "../api/client.js";

const empty = { title: "", excerpt: "", content: "", tags: "", coverImage: "" };

export default function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    api.get(`/posts/by-id/${id}`).then(({ data }) => {
      setForm({ title: data.post.title, excerpt: data.post.excerpt || "", content: data.post.content, tags: (data.post.tags || []).join(", "), coverImage: data.post.coverImage || "" });
    }).catch(err => setError(getErrorMessage(err)));
  }, [id]);

  async function submit(event) {
    event.preventDefault(); setBusy(true); setError("");
    const payload = { ...form, tags: form.tags.split(",").map(tag => tag.trim()).filter(Boolean) };
    try {
      const { data } = id ? await api.patch(`/posts/${id}`, payload) : await api.post("/posts", payload);
      navigate(`/posts/${data.post.slug}`);
    } catch (err) { setError(getErrorMessage(err)); }
    finally { setBusy(false); }
  }

  return (
    <main className="editor-wrap">
      <button className="back-link" onClick={() => navigate(-1)}><ArrowLeft size={15} /> Back</button>
      <div className="editor-heading"><span className="eyebrow">YOUR WORKSPACE</span><h1>{id ? "Edit story" : "Create a story"}</h1><p>Make it useful. Make it yours.</p></div>
      <form className="editor-form" onSubmit={submit}>
        <label>Title<input required minLength={4} maxLength={120} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="A title that makes people curious…" /></label>
        <label>Short description<textarea rows="2" maxLength={240} value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} placeholder="What is this story about?" /></label>
        <label>Cover image URL <span className="optional">optional</span><input type="url" value={form.coverImage} onChange={e => setForm({ ...form, coverImage: e.target.value })} placeholder="https://example.com/image.jpg" /></label>
        <label>Tags <span className="optional">comma separated, up to 8</span><input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="technology, security, development" /></label>
        <label>Story<textarea className="story-input" required minLength={30} maxLength={30000} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="Start with an idea…" /></label>
        {error && <div className="notice notice-error">{error}</div>}
        <div className="editor-footer"><span>{form.content.trim().split(/\s+/).filter(Boolean).length} words</span><button className="button" disabled={busy}>{busy ? "Publishing…" : id ? "Save changes" : "Publish story"} <Send size={15} /></button></div>
      </form>
    </main>
  );
}
