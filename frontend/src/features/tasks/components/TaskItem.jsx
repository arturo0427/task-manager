import { useState } from 'react'

export function TaskItem({ isBusy, onDelete, onRename, onToggle, task }) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(task.title)
  const [feedback, setFeedback] = useState('')

  function startEditing() {
    setTitle(task.title)
    setFeedback('')
    setIsEditing(true)
  }

  function cancelEditing() {
    setTitle(task.title)
    setFeedback('')
    setIsEditing(false)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setFeedback('')

    const result = await onRename(task.id, title)

    if (!result.ok) {
      setFeedback(result.message)
      return
    }

    setIsEditing(false)
  }

  return (
    <article className={`task-item ${task.completed ? 'is-completed' : ''}`}>
      <div className="task-item__body">
        <div className="task-item__check">
          <input
            checked={task.completed}
            disabled={isBusy}
            onChange={() => onToggle(task)}
            type="checkbox"
          />
          {isEditing ? (
            <form className="task-item__edit-form" onSubmit={handleSubmit}>
              <input
                className="task-item__edit-input"
                autoFocus
                disabled={isBusy}
                maxLength="150"
                onChange={(event) => setTitle(event.target.value)}
                value={title}
              />
              <div className="task-item__edit-actions">
                <button className="button button-primary" disabled={isBusy} type="submit">
                  Guardar
                </button>
                <button
                  className="button button-ghost"
                  disabled={isBusy}
                  onClick={cancelEditing}
                  type="button"
                >
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <span className="task-item__copy">
              <strong>{task.title}</strong>
              <small>{task.completed ? 'Completada' : 'Pendiente'}</small>
            </span>
          )}
        </div>

        {feedback ? <p className="form-feedback is-error">{feedback}</p> : null}
      </div>

      <div className="task-item__row-actions">
        {!isEditing ? (
          <button
            className="button button-ghost"
            disabled={isBusy}
            onClick={startEditing}
            type="button"
          >
            Editar
          </button>
        ) : null}

        <button
          className="button button-ghost button-danger"
          disabled={isBusy}
          onClick={() => onDelete(task.id)}
          type="button"
        >
          Eliminar
        </button>
      </div>
    </article>
  )
}
