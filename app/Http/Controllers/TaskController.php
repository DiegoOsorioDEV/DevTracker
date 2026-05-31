<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\Rule;

class TaskController extends Controller
{
    /**
     * Almacenar una nueva tarea dentro de un proyecto específico.
     */
    public function store(Request $request, Project $project): RedirectResponse
    {
        if ($project->user_id !== auth()->id()) {
            abort(403);
        }

        // Validamos que la tarea tenga los datos correctos antes de guardarla
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:backlog,in_progress,done',
            'priority' => 'required|in:low,medium,high',
        ]);

        // Creamos la tarea usando la relación del proyecto padre
        $project->tasks()->create($validated);

        // Refrescamos la página actual para mostrar los nuevos datos de inmediato
        return back();
    }

    /**
     * Actualizar el estado o el responsable de una tarea.
     */
    public function update(Request $request, Task $task): RedirectResponse
    {
        if ($task->project->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'status' => ['nullable', Rule::in(['backlog', 'in_progress', 'done'])],
            'assigned_to' => ['nullable', 'exists:users,id'],
        ]);

        $task->update($validated);

        return back();
    }

    /**
     * Eliminar una tarea por completo.
     */
    public function destroy(Task $task): RedirectResponse
    {
        if ($task->project->user_id !== auth()->id()) {
            abort(403);
        }

        $task->delete();

        return back();
    }
}