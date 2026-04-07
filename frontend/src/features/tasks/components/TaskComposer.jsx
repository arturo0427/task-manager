import { useState } from "react";

export function TaskComposer({ isCreating, onCreate }) {
  const [title, setTitle] = useState("");
  const [feedback, setFeedback] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setFeedback("");

    const result = await onCreate(title);

    if (!result.ok) {
      setFeedback(result.message);
      return;
    }

    setTitle("");
  }

  return (
    <section className="panel stack-md">
      <div>
        <p className="eyebrow">Nueva tarea</p>
        <h2>Crear Tarea</h2>
      </div>

      <form className="composer" onSubmit={handleSubmit}>
        <input
          maxLength="150"
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Ej. preparar demo tecnica"
          value={title}
        />
        <button
          className="button button-primary"
          disabled={isCreating}
          type="submit"
        >
          {isCreating ? "Guardando..." : "Agregar"}
        </button>
      </form>

      {feedback ? <p className="form-feedback is-error">{feedback}</p> : null}
    </section>
  );
}
