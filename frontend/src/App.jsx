import { useAuth } from './hooks/useAuth.jsx'
import { AuthScreen } from './screens/AuthScreen.jsx'
import { DashboardScreen } from './screens/DashboardScreen.jsx'

function App() {
  const { isBootstrapping, token, user } = useAuth()

  if (isBootstrapping) {
    return (
      <main className="app-shell">
        <section className="status-card">
          <span className="status-card__eyebrow">Encuba Tasks</span>
          <h1>Validando sesion</h1>
          <p>Comprobando el token guardado para recuperar tu espacio de trabajo.</p>
        </section>
      </main>
    )
  }

  if (!token || !user) {
    return <AuthScreen />
  }

  return <DashboardScreen />
}

export default App
