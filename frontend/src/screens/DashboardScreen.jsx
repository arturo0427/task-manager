import { TaskComposer } from "../features/tasks/components/TaskComposer.jsx";
import { TaskList } from "../features/tasks/components/TaskList.jsx";
import { useTasks } from "../features/tasks/hooks/useTasks.js";
import { useAuth } from "../hooks/useAuth.jsx";

function buildStats(tasks) {
  const completed = tasks.filter((task) => task.completed).length;
  const pending = tasks.length - completed;

  return [
    { label: "Total", value: tasks.length },
    { label: "Pendientes", value: pending },
    { label: "Completadas", value: completed },
  ];
}

export function DashboardScreen() {
  const { logout, user } = useAuth();
  const {
    createTask,
    deleteTask,
    error,
    isCreating,
    isLoading,
    pendingTaskIds,
    renameTask,
    tasks,
    toggleTask,
  } = useTasks();

  const stats = buildStats(tasks);

  return (
    <main className="app-shell">
      <section className="dashboard-shell">
        <header className="dashboard-header panel">
          <div className="stack-sm">
            <p className="eyebrow">Sesion activa</p>
            <h1>Hola, {user.name}</h1>
            <p className="muted">{user.email}</p>
          </div>

          <div className="dashboard-header__actions">
            <div className="stats-row">
              {stats.map((stat) => (
                <div className="stat-card" key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>

            <button
              className="button button-ghost"
              onClick={logout}
              type="button"
            >
              Cerrar sesion
            </button>
          </div>
        </header>

        {error ? <p className="form-feedback is-error">{error}</p> : null}

        <div className="dashboard-grid">
          <TaskComposer isCreating={isCreating} onCreate={createTask} />

          {isLoading ? (
            <section className="panel empty-state">
              <p className="eyebrow">Cargando</p>
              <h2>Obteniendo tareas</h2>
              <p className="muted">
                Consultando `GET /tasks` con el token actual.
              </p>
            </section>
          ) : (
            <TaskList
              onDelete={deleteTask}
              onRename={renameTask}
              onToggle={toggleTask}
              pendingTaskIds={pendingTaskIds}
              tasks={tasks}
            />
          )}
        </div>
      </section>
    </main>
  );
}
