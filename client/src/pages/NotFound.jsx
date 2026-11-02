import { Link } from "react-router-dom";

export default function NotFound() {
  return <main className="empty-state not-found"><span className="eyebrow">404 / PAGE NOT FOUND</span><h1>Lost in the feed?</h1><p>The page you are looking for does not exist.</p><Link className="button" to="/">Back to the journal</Link></main>;
}
