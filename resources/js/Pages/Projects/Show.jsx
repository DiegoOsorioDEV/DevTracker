import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link, router } from '@inertiajs/react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useState } from 'react';

export default function Show({ project, tasks, users }) {
    const [filterPriority, setFilterPriority] = useState('all');
    const [filterAssignee, setFilterAssignee] = useState('all');

    const { data, setData, post, processing, reset } = useForm({
        title: '',
        description: '',
        status: 'backlog',
        priority: 'medium',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('projects.tasks.store', project.id), {
            onSuccess: () => reset(),
        });
    };

    const getPriorityBadge = (priority) => {
        const styles = {
            high: 'bg-red-100 text-red-700 border-red-200',
            medium: 'bg-amber-100 text-amber-700 border-amber-200',
            low: 'bg-green-100 text-green-700 border-green-200',
        };
        return styles[priority] || styles.medium;
    };

    const onDragEnd = (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const newStatus = destination.droppableId;

        router.patch(route('tasks.update', draggableId), {
            status: newStatus,
        }, {
            preserveScroll: true,
        });
    };

    const columns = [
        { id: 'backlog', title: 'Backlog', color: 'bg-gray-400', panelColor: 'bg-gray-100/70 border-gray-200/60 text-gray-700' },
        { id: 'in_progress', title: 'En Progreso', color: 'bg-blue-500 animate-pulse', panelColor: 'bg-blue-50/40 border-blue-100/60 text-blue-800' },
        { id: 'done', title: 'Terminado', color: 'bg-green-500', panelColor: 'bg-green-50/40 border-green-100/60 text-green-800' },
    ];

    const getFilteredColumnTasks = (columnStatus) => {
        let filtered = tasks.filter((task) => task.status === columnStatus);

        if (filterPriority !== 'all') {
            filtered = filtered.filter((task) => task.priority === filterPriority);
        }

        if (filterAssignee !== 'all') {
            if (filterAssignee === 'unassigned') {
                filtered = filtered.filter((task) => !task.assigned_to);
            } else {
                filtered = filtered.filter((task) => task.assigned_to?.toString() === filterAssignee);
            }
        }

        return filtered;
    };

    const renderColumnTasks = (columnStatus, snapshot) => {
        const filtered = getFilteredColumnTasks(columnStatus);
        const hasActiveFilters = filterPriority !== 'all' || filterAssignee !== 'all';

        if (filtered.length === 0 && !snapshot.isDraggingOver) {
            return (
                <div className="flex items-center justify-center h-24 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                    <p className="text-xs text-gray-400 font-medium">
                        {hasActiveFilters ? 'No hay tareas con estos filtros' : 'Suelte tareas aquí'}
                    </p>
                </div>
            );
        }

        return filtered.map((task, index) => (
            <Draggable key={task.id.toString()} draggableId={task.id.toString()} index={index}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`p-4 bg-white rounded-xl border border-gray-200 flex flex-col gap-3 group select-none transition-all duration-150 ${snapshot.isDragging ? 'shadow-2xl border-indigo-500 ring-2 ring-indigo-500/20 scale-[1.02]' : 'shadow-xs hover:shadow-md'}`}
                    >
                        <div
                            {...provided.dragHandleProps}
                            className="flex justify-between items-start gap-2 cursor-grab active:cursor-grabbing"
                        >
                            <h4 className="font-semibold text-gray-800 text-sm leading-snug">
                                {task.title}
                            </h4>
                            <button
                                type="button"
                                onClick={() => { if (confirm('¿Eliminar tarea?')) router.delete(route('tasks.destroy', task.id)); }}
                                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 text-xs transition-opacity"
                            >
                                🗑
                            </button>
                        </div>
                        <div className="flex flex-col gap-2 mt-1 border-t border-gray-50 pt-2">
                            <div className="flex justify-between items-center">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border border-gray-200 uppercase tracking-wider ${getPriorityBadge(task.priority)}`}>
                                    {task.priority}
                                </span>

                                <select
                                    value={task.status}
                                    onChange={(e) => router.patch(route('tasks.update', task.id), { status: e.target.value }, { preserveScroll: true })}
                                    className="text-xs border-gray-200 rounded-lg py-0.5 pl-2 pr-7 text-gray-600 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 cursor-pointer"
                                >
                                    <option value="backlog">📋 Backlog</option>
                                    <option value="in_progress">⚡ En Progreso</option>
                                    <option value="done">✅ Terminado</option>
                                </select>
                            </div>

                            <div className="flex items-center justify-between gap-1 text-xs border-t border-gray-100/60 pt-2 mt-0.5">
                                <span className="text-[11px] text-gray-400 font-medium">Responsable:</span>
                                <select
                                    value={task.assigned_to || ''}
                                    onChange={(e) => router.patch(route('tasks.update', task.id), { assigned_to: e.target.value || null }, { preserveScroll: true })}
                                    className="text-xs border-transparent bg-transparent py-0.5 pl-1 pr-6 text-gray-700 font-semibold focus:ring-0 focus:border-transparent hover:bg-gray-100 rounded-md cursor-pointer transition-colors max-w-[140px] truncate"
                                >
                                    <option value="">👤 Sin asignar</option>
                                    {users.map((user) => (
                                        <option key={user.id} value={user.id}>
                                            👤 {user.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                )}
            </Draggable>
        ));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Tablero Kanban</span>
                        <h2 className="text-2xl font-bold leading-tight text-gray-900">{project.title}</h2>
                    </div>
                    <Link href={route('projects.index')} className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-xs">
                        ← Volver
                    </Link>
                </div>
            }
        >
            <Head title={`Tablero - ${project.title}`} />

            <div className="py-8 bg-gray-50/50 min-h-[calc(100vh-65px)]">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">

                    <div className="bg-white p-4 shadow-xs border border-gray-200/80 sm:rounded-xl">
                        <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3 items-center">
                            <div className="w-full sm:flex-1">
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className="block w-full rounded-xl border-gray-200 text-sm shadow-inner focus:border-indigo-500 focus:ring-indigo-500 placeholder-gray-400"
                                    placeholder="⚡ Añadir nueva tarea al tablero..."
                                />
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto justify-end">
                                <select
                                    value={data.priority}
                                    onChange={(e) => setData('priority', e.target.value)}
                                    className="rounded-xl border-gray-200 text-sm text-gray-600 bg-white focus:border-indigo-500"
                                >
                                    <option value="low">Prio: Baja</option>
                                    <option value="medium">Prio: Media</option>
                                    <option value="high">Prio: Alta</option>
                                </select>
                                <button type="submit" disabled={processing} className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-25 transition-all">
                                    {processing ? '...' : 'Crear Tarea'}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 bg-white p-4 shadow-xs border border-gray-200/80 sm:rounded-xl">
                        <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mr-2">Filtros rápidos:</div>

                        <div className="flex items-center gap-1.5">
                            <span className="text-xs text-gray-500 font-medium">Responsable:</span>
                            <select
                                value={filterAssignee}
                                onChange={(e) => setFilterAssignee(e.target.value)}
                                className="text-xs border-gray-200 rounded-lg py-1 pl-2 pr-7 text-gray-600 bg-gray-50 font-medium focus:ring-indigo-500 cursor-pointer"
                            >
                                <option value="all">👥 Todos los miembros</option>
                                <option value="unassigned">👤 Sin asignar</option>
                                {users.map((u) => (
                                    <option key={u.id} value={u.id.toString()}>👤 {u.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center gap-1.5">
                            <span className="text-xs text-gray-500 font-medium">Prioridad:</span>
                            <select
                                value={filterPriority}
                                onChange={(e) => setFilterPriority(e.target.value)}
                                className="text-xs border-gray-200 rounded-lg py-1 pl-2 pr-7 text-gray-600 bg-gray-50 font-medium focus:ring-indigo-500 cursor-pointer"
                            >
                                <option value="all">🔥 Todas las prioridades</option>
                                <option value="high">🔴 Alta</option>
                                <option value="medium">🟡 Media</option>
                                <option value="low">🟢 Baja</option>
                            </select>
                        </div>

                        {(filterPriority !== 'all' || filterAssignee !== 'all') && (
                            <button
                                type="button"
                                onClick={() => { setFilterPriority('all'); setFilterAssignee('all'); }}
                                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold underline transition-colors"
                            >
                                Limpiar filtros
                            </button>
                        )}
                    </div>

                    <DragDropContext onDragEnd={onDragEnd}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">

                            {columns.map((col) => {
                                const columnTasks = getFilteredColumnTasks(col.id);

                                return (
                                    <div key={col.id} className={`${col.panelColor} border p-4 rounded-2xl flex flex-col gap-4 min-h-[500px]`}>
                                        <div className="flex justify-between items-center px-1">
                                            <div className="flex items-center gap-2">
                                                <span className={`w-2.5 h-2.5 rounded-full ${col.color}`}></span>
                                                <h3 className="text-sm font-bold uppercase tracking-wider">{col.title}</h3>
                                            </div>
                                            <span className="bg-white/80 border text-gray-600 text-xs font-bold px-2 py-0.5 rounded-md shadow-xs">
                                                {columnTasks.length}
                                            </span>
                                        </div>

                                        <Droppable droppableId={col.id}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.droppableProps}
                                                    className={`flex-1 space-y-3 rounded-xl transition-colors duration-200 ${snapshot.isDraggingOver ? 'bg-indigo-50/50 border border-dashed border-indigo-200 p-2' : ''}`}
                                                >
                                                    {renderColumnTasks(col.id, snapshot)}
                                                    {provided.placeholder}
                                                </div>
                                            )}
                                        </Droppable>
                                    </div>
                                );
                            })}

                        </div>
                    </DragDropContext>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
