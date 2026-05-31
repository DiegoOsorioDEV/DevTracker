<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::create('tasks', function (Blueprint $table) {
        $table->id();
        // Ahora sí se enlazará bien porque correrá después de proyectos
        $table->foreignId('project_id')->constrained()->cascadeOnDelete();
        $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
        
        $table->string('title');
        $table->text('description')->nullable();
        $table->enum('status', ['backlog', 'in_progress', 'done'])->default('backlog');
        $table->enum('priority', ['low', 'medium', 'high'])->default('medium');
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
