import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ metrics, myTasks }) {
    const { totalProjects, totalTasks, stats } = metrics;

    const completedPercentage = totalTasks > 0
        ? Math.round((stats.done / totalTasks) * 100)
        : 0;

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <nav className="text-xs text-gray-500 flex gap-1 mb-1">
                        <span>Dashboards</span> / <span>Resumen del espacio de trabajo</span>
                    </nav>
                    <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
                        Centro de Control de Ingeniería
                    </h2>
                </div>
            }
        >
            <Head title="Dashboard - Jira Software" />

            <div className="py-6 bg-white min-h-[calc(100vh-65px)]">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">

                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded p-4 flex justify-between items-center">
                        <div>
                            <h3 className="text-sm font-semibold text-blue-900">¡Hola de nuevo!</h3>
                            <p className="text-xs text-blue-700/80 mt-0.5">Aquí tienes el estado actual de tus sprints, proyectos y carga de trabajo distribuida.</p>
                        </div>
                        <Link href={route('projects.index')} className="text-xs font-semibold bg-[#0052CC] hover:bg-[#0747A6] text-white px-3 py-1.5 rounded transition-colors shadow-xs">
                            Ver Proyectos
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                        <div className="border border-gray-200 rounded p-4 flex flex-col justify-between bg-white shadow-2xs">
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Proyectos Activos</span>
                            <div className="flex items-baseline gap-2 mt-2">
                                <span className="text-3xl font-bold text-gray-900">{totalProjects}</span>
                                <span className="text-xs text-gray-400">repositorios</span>
                            </div>
                        </div>

                        <div className="border border-gray-200 rounded p-4 flex flex-col justify-between bg-white shadow-2xs">
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Tareas en Sprints</span>
                            <div className="flex items-baseline gap-2 mt-2">
                                <span className="text-3xl font-bold text-gray-900">{totalTasks}</span>
                                <span className="text-xs text-gray-400">registros totales</span>
                            </div>
                        </div>

                        <div className="border border-gray-200 rounded p-4 flex flex-col justify-between bg-white shadow-2xs border-l-4 border-l-blue-500">
                            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">En Desarrollo (WIP)</span>
                            <div className="flex items-baseline gap-2 mt-2">
                                <span className="text-3xl font-bold text-blue-900">{stats.in_progress}</span>
                                <span className="text-xs text-gray-400">ejecutándose</span>
                            </div>
                        </div>

                        <div className="border border-gray-200 rounded p-4 flex flex-col justify-between bg-white shadow-2xs border-l-4 border-l-green-500">
                            <span className="text-xs font-bold uppercase tracking-wider text-green-600">Eficiencia de Entrega</span>
                            <div className="flex items-baseline gap-2 mt-2">
                                <span className="text-3xl font-bold text-green-900">{completedPercentage}%</span>
                                <span className="text-xs text-gray-400">completado</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

                        <div className="border border-gray-200 rounded bg-white p-5 lg:col-span-1 space-y-4">
                            <h3 className="text-sm font-semibold text-gray-800 border-b border-gray-100 pb-2">Estado de la Carga de Trabajo</h3>

                            <div className="space-y-3 pt-1">
                                <div>
                                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                                        <span>📋 Backlog</span>
                                        <span className="font-bold">{stats.backlog}</span>
                                    </div>
                                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                        <div className="bg-gray-400 h-full" style={{ width: `${totalTasks > 0 ? (stats.backlog / totalTasks) * 100 : 0}%` }}></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-xs text-blue-700 mb-1">
                                        <span>⚡ En Progreso</span>
                                        <span className="font-bold">{stats.in_progress}</span>
                                    </div>
                                    <div className="w-full bg-blue-50 h-2 rounded-full overflow-hidden">
                                        <div className="bg-blue-500 h-full animate-pulse" style={{ width: `${totalTasks > 0 ? (stats.in_progress / totalTasks) * 100 : 0}%` }}></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-xs text-green-700 mb-1">
                                        <span>✅ Terminado</span>
                                        <span className="font-bold">{stats.done}</span>
                                    </div>
                                    <div className="w-full bg-green-50 h-2 rounded-full overflow-hidden">
                                        <div className="bg-green-500 h-full" style={{ width: `${totalTasks > 0 ? (stats.done / totalTasks) * 100 : 0}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border border-gray-200 rounded bg-white p-5 lg:col-span-2 space-y-4">
                            <h3 className="text-sm font-semibold text-gray-800 border-b border-gray-100 pb-2">🎯 Tareas prioritarias asignadas a mi nombre</h3>

                            {myTasks.length === 0 ? (
                                <div className="py-8 text-center text-xs text-gray-400 italic">
                                    No tienes tareas pendientes asignadas en ningún tablero activo actualmente.
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {myTasks.map((task) => (
                                        <div key={task.id} className="py-3 flex justify-between items-center hover:bg-gray-50/60 px-1 rounded transition-colors group">
                                            <div className="space-y-0.5">
                                                <h4 className="text-sm font-medium text-gray-900 leading-tight">
                                                    {task.title}
                                                </h4>
                                                <div className="flex items-center gap-2 text-[11px] text-gray-400">
                                                    <span className="font-semibold text-indigo-600">📁 {task.project.title}</span>
                                                    <span>•</span>
                                                    <span>ID: #{task.id}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded border tracking-wider uppercase ${
                                                    task.priority === 'high' ? 'bg-red-50 text-red-700 border-red-100' :
                                                    task.priority === 'medium' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-green-50 text-green-700 border-green-100'
                                                }`}>
                                                    {task.priority}
                                                </span>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                                                    task.status === 'done' ? 'bg-green-100 text-green-800' :
                                                    task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {task.status}
                                                </span>
                                                <Link href={route('projects.show', task.project_id)} className="opacity-0 group-hover:opacity-100 text-xs text-[#0052CC] font-semibold hover:underline pl-2 transition-opacity">
                                                    Ir →
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
