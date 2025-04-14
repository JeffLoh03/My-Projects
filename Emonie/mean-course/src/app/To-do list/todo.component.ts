import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService } from './todo.service';
import { Todo } from './todo.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faSave, faTimes, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

type Category = 'Mindfulness' | 'Exercise' | 'Self Care';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  providers: [TodoService],
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {
  // Font Awesome icons
  faPlus = faPlus;
  faSave = faSave;
  faTimes = faTimes;
  faEdit = faEdit;
  faTrash = faTrash;

  todos: Todo[] = [];
  filteredTodos: Todo[] = [];
  showCreateForm = false;
  selectedFilter = '';
  errorMessage = '';
  editingTodo: Todo | null = null;

  categories = ['Mindfulness', 'Exercise', 'Self Care'];

  newTodo: Todo = {
    title: '',
    category: 'Mindfulness',
    completed: false,
    dueDate: new Date()
  };

  quickActions = [
    {
      category: 'Mindfulness',
      tasks: ['5 minutes meditation', 'Deep breathing exercise', 'Mindful walking']
    },
    {
      category: 'Self-Care',
      tasks: ['Take a relaxing bath', 'Read a book', 'Listen to calming music']
    },
    {
      category: 'Exercise',
      tasks: ['10 minute stretching', '20 minute walk', 'Quick yoga session']
    }
  ];

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void {
    this.todoService.getTodos().subscribe({
      next: (todos) => {
        this.todos = todos;
        this.filterTodos();
        this.errorMessage = '';
      },
      error: (error) => {
        console.error('Error loading todos:', error);
        this.errorMessage = 'Failed to load todos. Please try again.';
      }
    });
  }

  filterTodos(): void {
    this.filteredTodos = this.selectedFilter
      ? this.todos.filter(todo => todo.category === this.selectedFilter)
      : this.todos;
  }

  addTodo(): void {
    if (!this.newTodo.title.trim()) {
      this.errorMessage = 'Please enter a task description';
      return;
    }

    // Ensure the date is valid
    if (!this.newTodo.dueDate) {
      this.errorMessage = 'Please select a due date';
      return;
    }

    // Create a copy of the todo with the date properly formatted
    const todoToAdd = {
      title: this.newTodo.title.trim(),
      category: this.newTodo.category,
      completed: false,
      dueDate: new Date(this.newTodo.dueDate)
    };

    console.log('Sending todo:', todoToAdd);

    this.todoService.addTodo(todoToAdd).subscribe({
      next: (todo) => {
        this.todos.unshift(todo);
        this.filterTodos();
        this.resetForm();
        this.errorMessage = '';
      },
      error: (error) => {
        console.error('Error adding todo:', error);
        if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Failed to add todo. Please try again.';
        }
      }
    });
  }

  addQuickAction(task: string, category: string): void {
    const quickTodo = {
      title: task.trim(),
      category: category as Category,
      completed: false,
      dueDate: new Date()
    };

    this.todoService.addTodo(quickTodo).subscribe({
      next: (todo) => {
        this.todos.unshift(todo);
        this.filterTodos();
        this.errorMessage = '';
      },
      error: (error) => {
        console.error('Error adding quick action:', error);
        if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Failed to add quick action. Please try again.';
        }
      }
    });
  }

  startEdit(todo: Todo): void {
    this.editingTodo = { ...todo };
    this.showCreateForm = false;
  }

  saveEdit(): void {
    if (!this.editingTodo || !this.editingTodo.title.trim()) {
      this.errorMessage = 'Please enter a task description';
      return;
    }

    this.todoService.updateTodo(this.editingTodo._id!, this.editingTodo).subscribe({
      next: (updatedTodo) => {
        const index = this.todos.findIndex(t => t._id === updatedTodo._id);
        if (index !== -1) {
          this.todos[index] = updatedTodo;
          this.filterTodos();
        }
        this.cancelEdit();
        this.errorMessage = '';
      },
      error: (error) => {
        console.error('Error updating todo:', error);
        this.errorMessage = 'Failed to update todo. Please try again.';
      }
    });
  }

  cancelEdit(): void {
    this.editingTodo = null;
    this.errorMessage = '';
  }

  toggleComplete(todo: Todo): void {
    const updatedTodo = { ...todo, completed: !todo.completed };
    this.todoService.updateTodo(updatedTodo._id!, updatedTodo).subscribe({
      next: (updated) => {
        const index = this.todos.findIndex(t => t._id === updated._id);
        if (index !== -1) {
          this.todos[index] = updated;
          this.filterTodos();
        }
        this.errorMessage = '';
      },
      error: (error) => {
        console.error('Error updating todo status:', error);
        this.errorMessage = 'Failed to update todo status. Please try again.';
      }
    });
  }

  deleteTodo(id: string): void {
    this.todoService.deleteTodo(id).subscribe({
      next: () => {
        this.todos = this.todos.filter(todo => todo._id !== id);
        this.filterTodos();
        this.errorMessage = '';
      },
      error: (error) => {
        console.error('Error deleting todo:', error);
        this.errorMessage = 'Failed to delete todo. Please try again.';
      }
    });
  }

  private resetForm(): void {
    this.newTodo = {
      title: '',
      category: 'Mindfulness',
      completed: false,
      dueDate: new Date()
    };
    this.showCreateForm = false;
  }
}
