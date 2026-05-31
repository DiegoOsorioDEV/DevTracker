<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    $userId = auth()->id();

    $totalProjects = Project::where('user_id', $userId)->count();

    $totalTasks = Task::whereHas('project', function ($query) use ($userId) {
        $query->where('user_id', $userId);
    })->count();

    $taskStats = Task::whereHas('project', function ($query) use ($userId) {
        $query->where('user_id', $userId);
    })
        ->selectRaw('status, count(*) as count')
        ->groupBy('status')
        ->pluck('count', 'status')
        ->toArray();

    $stats = [
        'backlog' => $taskStats['backlog'] ?? 0,
        'in_progress' => $taskStats['in_progress'] ?? 0,
        'done' => $taskStats['done'] ?? 0,
    ];

    $myTasks = Task::where('assigned_to', $userId)
        ->with('project:id,title')
        ->latest()
        ->take(5)
        ->get();

    return Inertia::render('Dashboard', [
        'metrics' => [
            'totalProjects' => $totalProjects,
            'totalTasks' => $totalTasks,
            'stats' => $stats,
        ],
        'myTasks' => $myTasks,
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('projects', ProjectController::class)->only(['index', 'store', 'show']);

    Route::post('projects/{project}/tasks', [TaskController::class, 'store'])->name('projects.tasks.store');
    Route::patch('tasks/{task}', [TaskController::class, 'update'])->name('tasks.update');
    Route::delete('tasks/{task}', [TaskController::class, 'destroy'])->name('tasks.destroy');
});

require __DIR__.'/auth.php';
