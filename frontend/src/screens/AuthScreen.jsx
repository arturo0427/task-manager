import { AuthForm } from "../features/auth/components/AuthForm.jsx";

export function AuthScreen() {
  return (
    <main className="app-shell">
      <section className="auth-shell">
        <article className="hero-panel">
          <span className="eyebrow">Frontend React + JWT</span>
          <h1>Encuba Tasks</h1>

          <div className="feature-grid">
            <div className="feature-card">
              <strong>Autenticacion</strong>
              <span>Login, registro y token.</span>
            </div>

            <div className="feature-card">
              <strong>Tareas</strong>
              <span>Listar, crear, completar y eliminar.</span>
            </div>
          </div>
        </article>

        <AuthForm />
      </section>
    </main>
  );
}
