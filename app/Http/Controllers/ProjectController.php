<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class ProjectController extends Controller
{
    /**
     * Mostrar la lista de proyectos del usuario autenticado.
     */
    public function index(): Response
    {
        $projects = auth()->user()->projects()->latest()->get();

        return Inertia::render('Projects/Index', [
            'projects' => $projects
        ]);
    }

    /**
     * Almacenar un nuevo proyecto en la base de datos.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        auth()->user()->projects()->create($validated);

        return redirect()->route('projects.index');
    }

    /**
     * Mostrar un proyecto específico con todas sus tareas y usuarios asignables.
     */
    public function show(Project $project): Response
    {
        if ($project->user_id !== auth()->id()) {
            abort(403);
        }

        $tasks = $project->tasks()->latest()->get();
        $users = User::select('id', 'name')->get();

        return Inertia::render('Projects/Show', [
            'project' => $project,
            'tasks' => $tasks,
            'users' => $users,
        ]);
    }
}