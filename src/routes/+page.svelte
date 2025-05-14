<script lang="ts">
  import { onMount } from 'svelte';
  import type { Task, Filter } from '$lib/types';

  let tasks: Task[] = [];
  let newTask = '';
  let currentFilter: Filter = 'all';

  // Загрузка задач
  onMount(() => {
    const savedTasks = localStorage.getItem('sveltekit-todo');
    tasks = savedTasks ? JSON.parse(savedTasks) : [];
  });

  // Добавление задачи
  function addTask(): void {
    if (!newTask.trim()) return;

    tasks = [
      ...tasks,
      {
        text: newTask,
        done: false,
        createdAt: Date.now()
      }
    ];
    newTask = '';
    saveTasks();
  }

  // Фильтрация задач
  function filteredTasks(): Task[] {
    return tasks.filter((task) => {
      if (currentFilter === 'active') return !task.done;
      if (currentFilter === 'completed') return task.done;
      return true;
    });
  }

  // Изменение статуса
  function toggleDone(index: number): void {
    tasks[index].done = !tasks[index].done;
    saveTasks();
  }

  // Удаление задачи
  function deleteTask(index: number): void {
    tasks.splice(index, 1);
    tasks = tasks;
    saveTasks();
  }

  // Сохранение в localStorage
  function saveTasks(): void {
    localStorage.setItem('sveltekit-todo', JSON.stringify(tasks));
  }
</script>

<main>
  <h1>To-Do List</h1>

  <div class="input-group">
    <input
      type="text"
      bind:value={newTask}
      placeholder="Добавить задачу..."
      on:keydown={(e) => e.key === 'Enter' && addTask()}
    />
    <button on:click={addTask}>Добавить</button>
  </div>

  <div class="filters">
    <button
      class:active={currentFilter === 'all'}
      on:click={() => (currentFilter = 'all')}
    >
      Все ({tasks.length})
    </button>
    <button
      class:active={currentFilter === 'active'}
      on:click={() => (currentFilter = 'active')}
    >
      Активные ({tasks.filter((t) => !t.done).length})
    </button>
    <button
      class:active={currentFilter === 'completed'}
      on:click={() => (currentFilter = 'completed')}
    >
      Завершенные ({tasks.filter((t) => t.done).length})
    </button>
  </div>

  <ul>
    {#each filteredTasks() as task, index}
      <li class:done={task.done}>
        <input
          type="checkbox"
          checked={task.done}
          on:change={() => toggleDone(index)}
        />
        <span>{task.text}</span>
        <button on:click={() => deleteTask(index)} title="Удалить">
          ×
        </button>
      </li>
    {:else}
      <li class="empty">Нет задач</li>
    {/each}
  </ul>
</main>

<style>
  :global(body) {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #f5f5f5;
    margin: 0;
    padding: 20px;
    color: #333;
  }

  main {
    max-width: 600px;
    margin: 0 auto;
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  h1 {
    color: #3a86ff;
    text-align: center;
    margin-bottom: 20px;
  }

  .input-group {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
  }

  input {
    flex: 1;
    padding: 10px;
    border: 2px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
  }

  button {
    background: #3a86ff;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.2s;
  }

  button:hover {
    background: #2667cc;
  }

  .filters {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
  }

  .filters button {
    flex: 1;
    background: #e9ecef;
    color: #495057;
  }

  .filters button.active {
    background: #3a86ff;
    color: white;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    display: flex;
    align-items: center;
    padding: 12px;
    border-bottom: 1px solid #eee;
    gap: 10px;
  }

  li.done span {
    text-decoration: line-through;
    color: #adb5bd;
  }

  li input[type='checkbox'] {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }

  li button {
    margin-left: auto;
    background: #ff6b6b;
    padding: 5px 10px;
  }

  li button:hover {
    background: #ff5252;
  }

  .empty {
    justify-content: center;
    color: #adb5bd;
    font-style: italic;
  }
</style>