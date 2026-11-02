import { Link, NavLink, useNavigate } from "react-router-dom";
import { PenLine, LogOut, UserRound, Plus } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link className="brand" to="/">
          <span className="brand-mark">I</span>
          <span>ISTOMIN<span className="brand-muted"> / JOURNAL</span></span>
        </Link>
        <nav className="nav-links">
          <NavLink to="/" end>Discover</NavLink>
          {user && <NavLink to="/write"><PenLine size={15} /> Write</NavLink>}
        </nav>
        <div className="nav-actions">
          {user ? (
            <>
              <span className="nav-user"><UserRound size={15} /> {user.username}</span>
              <button className="icon-button" onClick={handleLogout} title="Log out"><LogOut size={17} /></button>
              <Link className="button button-small" to="/write"><Plus size={15} /> New story</Link>
            </>
          ) : (
            <>
              <Link className="nav-login" to="/login">Log in</Link>
              <Link className="button button-small" to="/register">Get started</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
