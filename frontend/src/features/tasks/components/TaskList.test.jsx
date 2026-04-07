import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { TaskList } from './TaskList.jsx'

const tasks = [
  { id: 1, title: 'Preparar demo', completed: false },
  { id: 2, title: 'Revisar backend', completed: true },
]

describe('TaskList', () => {
  it('renderiza la lista y permite entrar en modo edicion', () => {
    render(
      <TaskList
        onDelete={vi.fn()}
        onRename={vi.fn().mockResolvedValue({ ok: true })}
        onToggle={vi.fn()}
        pendingTaskIds={[]}
        tasks={tasks}
      />,
    )

    expect(screen.getByText('2 registradas')).toBeInTheDocument()
    expect(screen.getByText('Preparar demo')).toBeInTheDocument()
    expect(screen.getByText('Revisar backend')).toBeInTheDocument()

    fireEvent.click(screen.getAllByRole('button', { name: 'Editar' })[0])

    expect(screen.getByDisplayValue('Preparar demo')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Guardar' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument()
  })
})
