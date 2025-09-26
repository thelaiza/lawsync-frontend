// src/components/Layout.jsx
import Sidebar from "./Sidebar"; 
import "../styles/layout.css";

export default function Layout({ title, children, action }) {
  return (
    <div className="ls-shell">
      <Sidebar />
      <main className="ls-main">
        <header className="ls-header">
          <h1>{title}</h1>
          {action}
        </header>
        <section className="ls-content">{children}</section>
      </main>
    </div>
  );
}
