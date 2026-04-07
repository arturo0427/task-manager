import { useEffect, useState } from 'react'
import {
  createTaskRequest,
  deleteTaskRequest,
  getTasksRequest,
  updateTaskRequest,
} from '../../../services/api/tasks.service.js'
import { extractErrorMessage } from '../../../utils/api.js'

function addPendingTask(taskIds, taskId) {
  return taskIds.includes(taskId) ? taskIds : [...taskIds, taskId]
}

function removePendingTask(taskIds, taskId) {
  return taskIds.filter((currentId) => currentId !== taskId)
}

export function useTasks() {
  const [tasks, setTasks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [pendingTaskIds, setPendingTaskIds] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadTasks() {
      try {
        const { data } = await getTasksRequest()

        if (!isMounted) {
          return
        }

        setTasks(data)
      } catch (requestError) {
        if (!isMounted) {
          return
        }

        setError(extractErrorMessage(requestError, 'No se pudieron cargar las tareas.'))
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadTasks()

    return () => {
      isMounted = false
    }
  }, [])

  async function createTask(title) {
    const normalizedTitle = title.trim()

    if (!normalizedTitle) {
      return {
        ok: false,
        message: 'La tarea no puede estar vacia.',
      }
    }

    setError('')
    setIsCreating(true)

    try {
      const { data } = await createTaskRequest({ title: normalizedTitle })

      setTasks((currentTasks) => [data, ...currentTasks])

      return { ok: true }
    } catch (requestError) {
      return {
        ok: false,
        message: extractErrorMessage(requestError, 'No se pudo crear la tarea.'),
      }
    } finally {
      setIsCreating(false)
    }
  }

  async function toggleTask(task) {
    setError('')
    setPendingTaskIds((currentIds) => addPendingTask(currentIds, task.id))

    try {
      const { data } = await updateTaskRequest(task.id, {
        completed: !task.completed,
      })

      setTasks((currentTasks) =>
        currentTasks.map((currentTask) =>
          currentTask.id === task.id ? data : currentTask,
        ),
      )
    } catch (requestError) {
      setError(extractErrorMessage(requestError, 'No se pudo actualizar la tarea.'))
    } finally {
      setPendingTaskIds((currentIds) => removePendingTask(currentIds, task.id))
    }
  }

  async function renameTask(taskId, title) {
    const normalizedTitle = title.trim()

    if (!normalizedTitle) {
      return {
        ok: false,
        message: 'El titulo no puede estar vacio.',
      }
    }

    setError('')
    setPendingTaskIds((currentIds) => addPendingTask(currentIds, taskId))

    try {
      const { data } = await updateTaskRequest(taskId, {
        title: normalizedTitle,
      })

      setTasks((currentTasks) =>
        currentTasks.map((task) => (task.id === taskId ? data : task)),
      )

      return { ok: true }
    } catch (requestError) {
      return {
        ok: false,
        message: extractErrorMessage(requestError, 'No se pudo actualizar el titulo.'),
      }
    } finally {
      setPendingTaskIds((currentIds) => removePendingTask(currentIds, taskId))
    }
  }

  async function deleteTask(taskId) {
    setError('')
    setPendingTaskIds((currentIds) => addPendingTask(currentIds, taskId))

    try {
      await deleteTaskRequest(taskId)

      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== taskId),
      )
    } catch (requestError) {
      setError(extractErrorMessage(requestError, 'No se pudo eliminar la tarea.'))
    } finally {
      setPendingTaskIds((currentIds) => removePendingTask(currentIds, taskId))
    }
  }

  return {
    tasks,
    isLoading,
    isCreating,
    pendingTaskIds,
    error,
    createTask,
    renameTask,
    toggleTask,
    deleteTask,
  }
}
