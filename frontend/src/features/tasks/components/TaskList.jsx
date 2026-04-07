import { TaskItem } from "./TaskItem.jsx";

export function TaskList({ onDelete, onRename, onToggle, pendingTaskIds, tasks }) {
  if (!tasks.length) {
    return (
      <section className="panel empty-state">
        <p className="eyebrow">Sin tareas</p>
        <h2>Tu lista esta vacia</h2>
        <p className="muted">
          Crea la primera tarea usando el formulario de la izquierda.
        </p>
      </section>
    );
  }

  return (
    <section className="panel stack-md">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Listado protegido</p>
          <h2>Tareas actuales</h2>
        </div>
        <span className="pill">{tasks.length} registradas</span>
      </div>

      <div className="task-list">
        {tasks.map((task) => (
          <TaskItem
            isBusy={pendingTaskIds.includes(task.id)}
            key={task.id}
            onDelete={onDelete}
            onRename={onRename}
            onToggle={onToggle}
            task={task}
          />
        ))}
      </div>
    </section>
  );
}
