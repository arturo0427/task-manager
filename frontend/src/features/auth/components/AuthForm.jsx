import { useState } from "react";
import { useAuth } from "../../../hooks/useAuth.jsx";

const initialForm = {
  name: "",
  email: "",
  password: "",
};

export function AuthForm() {
  const { isSubmitting, login, register } = useAuth();
  const [mode, setMode] = useState("login");
  const [formValues, setFormValues] = useState(initialForm);
  const [feedback, setFeedback] = useState("");

  function updateField(event) {
    const { name, value } = event.target;

    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
  }

  function switchMode(nextMode) {
    setMode(nextMode);
    setFeedback("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFeedback("");

    const payload = {
      email: formValues.email.trim().toLowerCase(),
      password: formValues.password,
    };

    if (mode === "register") {
      payload.name = formValues.name.trim();

      if (!payload.name) {
        setFeedback("El nombre es obligatorio para crear la cuenta.");
        return;
      }
    }

    const action = mode === "login" ? login : register;
    const result = await action(payload);

    if (!result.ok) {
      setFeedback(result.message);
    }
  }

  return (
    <article className="auth-card panel">
      <div className="auth-card__tabs" aria-label="Cambiar formulario">
        <button
          className={`tab-button ${mode === "login" ? "is-active" : ""}`}
          type="button"
          onClick={() => switchMode("login")}
        >
          Ingresar
        </button>
        <button
          className={`tab-button ${mode === "register" ? "is-active" : ""}`}
          type="button"
          onClick={() => switchMode("register")}
        >
          Crear cuenta
        </button>
      </div>

      <div className="auth-card__content">
        <div>
          <h2>{mode === "login" ? "Iniciar sesion" : "Registrarse"}</h2>
        </div>

        <form className="stack-md" onSubmit={handleSubmit}>
          {mode === "register" ? (
            <label className="field">
              <span>Nombre</span>
              <input
                autoComplete="name"
                name="name"
                onChange={updateField}
                placeholder="Arturo Muñoz"
                required
                value={formValues.name}
              />
            </label>
          ) : null}

          <label className="field">
            <span>Email</span>
            <input
              autoComplete="email"
              name="email"
              onChange={updateField}
              placeholder="arturo@correo.com"
              required
              type="email"
              value={formValues.email}
            />
          </label>

          <label className="field">
            <span>Contrasena</span>
            <input
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              minLength="6"
              name="password"
              onChange={updateField}
              placeholder="******"
              required
              type="password"
              value={formValues.password}
            />
          </label>

          {feedback ? (
            <p className="form-feedback is-error">{feedback}</p>
          ) : null}

          <button
            className="button button-primary"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting
              ? "Procesando..."
              : mode === "login"
                ? "Entrar al panel"
                : "Registrarse"}
          </button>
        </form>
      </div>
    </article>
  );
}
