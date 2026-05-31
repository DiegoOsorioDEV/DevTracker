import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ projects }) {
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
        status: 'active',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('projects.store'), {
            onSuccess: () => {
                reset();
                setIsModalOpen(false);
            },
        });
    };

    // Filtrado interactivo en el cliente estilo barra de búsqueda de Jira
    const filteredProjects = projects.filter(project => 
        project.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center bg-white py-2">
                    <div>
                        <nav className="text-xs text-gray-500 flex gap-1 mb-1">
                            <span>Proyectos</span> / <span>Ver todos los proyectos</span>
                        </nav>
                        <h2 className="text-2xl font-semibold tracking-tight text-gray-900">Proyectos</h2>
                    </div>
                    {/* Botón clásico de Jira en la esquina superior derecha */}
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center justify-center rounded bg-[#0052CC] hover:bg-[#0747A6] px-3 py-1.5 text-sm font-medium text-white transition-colors shadow-xs"
                    >
                        Crear proyecto
                    </button>
                </div>
            }
        >
            <Head title="Proyectos - Jira Software" />

            <div className="py-6 bg-white min-h-[calc(100vh-65px)]">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Controles superiores: Buscador estilo Atlassian */}
                    <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                        <div className="relative w-72">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="block w-full rounded border-gray-300 bg-gray-50 py-1.5 pl-3 pr-8 text-sm focus:border-[#0052CC] focus:ring-1 focus:ring-[#0052CC] placeholder-gray-500"
                                placeholder="Buscar proyectos..."
                            />
                            <span className="absolute right-2.5 top-2 text-gray-400 text-xs">🔍</span>
                        </div>
                        <select className="text-xs border-transparent bg-gray-100 rounded py-1.5 px-3 text-gray-600 font-medium cursor-pointer hover:bg-gray-200 transition-colors">
                            <option>Todos los tipos de proyecto</option>
                        </select>
                    </div>

                    {/* --- TABLA CORPORATIVA DE JIRA --- */}
                    <div className="overflow-hidden border border-gray-200 rounded-sm">
                        <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                            <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                <tr>
                                    <th className="px-6 py-3 w-12">Icono</th>
                                    <th className="px-6 py-3">Nombre</th>
                                    <th className="px-6 py-3">Clave/Descripción</th>
                                    <th className="px-6 py-3">Tipo</th>
                                    <th className="px-6 py-3">Estado</th>
                                    <th className="px-6 py-3 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {filteredProjects.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                                            No se encontraron proyectos que coincidan con los criterios.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredProjects.map((project) => (
                                        <tr key={project.id} className="hover:bg-gray-50/80 transition-colors group">
                                            {/* Icono de carpeta color Jira */}
                                            <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
                                                <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs shadow-inner">
                                                    {project.title.substring(0, 2).toUpperCase()}
                                                </div>
                                            </td>
                                            {/* Enlace directo al tablero Kanban */}
                                            <td className="whitespace-nowrap px-6 py-4 font-medium text-[#0052CC] hover:underline">
                                                <Link href={route('projects.show', project.id)} className="font-semibold">
                                                    {project.title}
                                                </Link>
                                            </td>
                                            {/* Descripción truncada corta */}
                                            <td className="px-6 py-4 text-gray-500 max-w-xs truncate">
                                                {project.description || <span className="italic text-gray-300">Sin descripción</span>}
                                            </td>
                                            {/* Tipo de proyecto por defecto en Jira */}
                                            <td className="whitespace-nowrap px-6 py-4 text-gray-600 text-xs font-medium">
                                                Gestionado por el equipo
                                            </td>
                                            {/* Badge de Estado refinado */}
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <span className="inline-flex items-center rounded bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-700 ring-1 ring-inset ring-green-600/20 uppercase tracking-wider">
                                                    {project.status}
                                                </span>
                                            </td>
                                            {/* Acciones del menú flotante lateral */}
                                            <td className="whitespace-nowrap px-6 py-4 text-right text-xs">
                                                <div className="flex justify-end items-center gap-3">
                                                    <Link href={route('projects.show', project.id)} className="text-gray-500 hover:text-[#0052CC] font-medium">
                                                        Ir al tablero →
                                                    </Link>
                                                    <button
                                                        onClick={() => {
                                                            if (confirm(`¿Eliminar permanentemente el proyecto "${project.title}" y todas sus tareas del tablero?`)) {
                                                                router.delete(route('projects.destroy', project.id));
                                                            }
                                                        }}
                                                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 p-1 rounded transition-all"
                                                        title="Mover a la papelera"
                                                    >
                                                        🗑
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Leyenda inferior de volumen */}
                    <div className="text-xs text-gray-400 px-1">
                        Mostrando {filteredProjects.length} de {projects.length} proyectos activos.
                    </div>
                </div>
            </div>

            {/* --- MODAL FLOTANTE: El creador clásico de Jira --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-xs animate-fade-in">
                    <div className="w-full max-w-md rounded bg-white p-6 shadow-2xl border border-gray-200">
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Detalles del proyecto</h3>
                            <p className="text-xs text-gray-500 mt-0.5">Introduce los datos para inicializar el nuevo repositorio de software.</p>
                        </div>

                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Nombre</label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className="block w-full rounded border-gray-300 py-2 px-3 text-sm focus:border-[#0052CC] focus:ring-1 focus:ring-[#0052CC]"
                                    placeholder="Ej. Mi Próximo Gran Desarrollo"
                                    required
                                />
                                {errors.title && <div className="text-red-600 text-xs mt-1">{errors.title}</div>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Descripción corta</label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="block w-full rounded border-gray-300 py-2 px-3 text-sm focus:border-[#0052CC] focus:ring-1 focus:ring-[#0052CC] h-20 resize-none"
                                    placeholder="Escribe el alcance o notas del backend de este proyecto..."
                                />
                                {errors.description && <div className="text-red-600 text-xs mt-1">{errors.description}</div>}
                            </div>

                            <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="rounded hover:bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded bg-[#0052CC] hover:bg-[#0747A6] px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50"
                                >
                                    {processing ? 'Guardando...' : 'Guardar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}