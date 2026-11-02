import { Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Home from "./pages/Home.jsx";
import PostDetails from "./pages/PostDetails.jsx";
import Editor from "./pages/Editor.jsx";
import { LoginPage, RegisterPage } from "./pages/AuthPages.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <div className="app-shell">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/posts/:slug" element={<PostDetails />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/write" element={<ProtectedRoute><Editor /></ProtectedRoute>} />
        <Route path="/edit/:id" element={<ProtectedRoute><Editor /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <footer className="site-footer"><div><span className="brand-mark">I</span><strong>ISTOMIN / JOURNAL</strong></div><span>Built for curious minds. © {new Date().getFullYear()}</span></footer>
    </div>
  );
}
