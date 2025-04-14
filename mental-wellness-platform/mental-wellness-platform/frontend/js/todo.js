document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const taskCategory = document.getElementById('taskCategory');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const tasksList = document.querySelector('.tasks-list');
    const categoryBtns = document.querySelectorAll('.category-btn');
    const benefitCards = document.querySelectorAll('.benefit-card');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all';

    // Initialize category counts
    updateCategoryCounts();

    // Add task event listeners
    addTaskBtn.addEventListener('click', () => {
        const text = taskInput.value.trim();
        const category = taskCategory.value;
        
        if (text) {
            addTask(text, category);
            taskInput.value = '';
        }
    });

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    // Category filter event listeners
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.category;
            renderTasks();
        });
    });

    // Quick add task cards click handler
    benefitCards.forEach(card => {
        card.addEventListener('click', () => {
            const taskText = card.dataset.task;
            const category = card.dataset.category;
            addTask(taskText, category);
        });
    });

    function addTask(taskText, category) {
        // Create task item
        const taskItem = document.createElement('div');
        taskItem.className = 'task-item';

        // Create checkbox
        const checkbox = document.createElement('div');
        checkbox.className = 'task-checkbox';
        checkbox.addEventListener('click', () => {
            checkbox.classList.toggle('checked');
            taskContent.classList.toggle('completed');
        });

        // Create task content
        const taskContent = document.createElement('div');
        taskContent.className = 'task-content';
        taskContent.textContent = taskText;

        // Create category tag
        const categoryTag = document.createElement('span');
        categoryTag.className = `task-category ${category}`;
        categoryTag.textContent = category;

        // Create actions
        const actions = document.createElement('div');
        actions.className = 'task-actions';
        actions.innerHTML = `
            <button class="btn-book edit-btn"><i class="fas fa-edit"></i></button>
            <button class="btn-book delete-btn"><i class="fas fa-trash"></i></button>
        `;

        // Add event listeners for edit and delete
        actions.querySelector('.edit-btn').addEventListener('click', () => {
            taskInput.value = taskContent.textContent;
            taskCategory.value = category;
            taskItem.remove();
            updateTaskCounts();
        });

        actions.querySelector('.delete-btn').addEventListener('click', () => {
            taskItem.remove();
            updateTaskCounts();
        });

        // Assemble task item
        taskItem.appendChild(checkbox);
        taskItem.appendChild(taskContent);
        taskItem.appendChild(categoryTag);
        taskItem.appendChild(actions);

        // Add to list
        tasksList.appendChild(taskItem);
        
        // Update counts
        updateTaskCounts();
    }

    function renderTasks() {
        const filteredTasks = currentFilter === 'all' 
            ? tasks 
            : tasks.filter(task => task.category === currentFilter);

        tasksList.innerHTML = '';
        
        filteredTasks.forEach((task, index) => {
            const taskElement = document.createElement('div');
            taskElement.className = 'task-item';
            taskElement.dataset.taskId = task.id;
            taskElement.style.animationDelay = `${index * 0.1}s`;
            
            taskElement.innerHTML = `
                <div class="task-checkbox ${task.completed ? 'checked' : ''}" 
                     onclick="toggleTask(${task.id})"></div>
                <div class="task-content ${task.completed ? 'completed' : ''}">
                    <div>${task.text}</div>
                    <span class="task-category">${task.category}</span>
                </div>
                <div class="task-actions">
                    <button onclick="editTask(${task.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteTask(${task.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            tasksList.appendChild(taskElement);
        });

        updateCategoryCounts();
    }

    function updateCategoryCounts() {
        const counts = {
            all: tasks.length,
            mindfulness: tasks.filter(t => t.category === 'mindfulness').length,
            exercise: tasks.filter(t => t.category === 'exercise').length,
            selfcare: tasks.filter(t => t.category === 'selfcare').length
        };

        categoryBtns.forEach(btn => {
            const category = btn.dataset.category;
            const countElement = btn.querySelector('.category-count');
            if (countElement) {
                countElement.textContent = counts[category] || 0;
            }
        });
    }

    function updateTaskCounts() {
        const tasks = tasksList.querySelectorAll('.task-item');
        
        // Reset counts
        taskCounts = {
            all: tasks.length,
            mindfulness: 0,
            exercise: 0,
            selfcare: 0
        };

        // Count tasks by category
        tasks.forEach(task => {
            const category = task.querySelector('.task-category').textContent;
            taskCounts[category]++;
        });

        // Update category buttons
        categoryBtns.forEach(btn => {
            const category = btn.dataset.category;
            const count = btn.querySelector('.category-count');
            count.textContent = category === 'all' ? taskCounts.all : taskCounts[category];
        });
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Global functions for task actions
    window.toggleTask = (id) => {
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            saveTasks();
            renderTasks();
        }
    };

    window.editTask = (id) => {
        const task = tasks.find(t => t.id === id);
        if (task) {
            const newText = prompt('Edit task:', task.text);
            if (newText !== null && newText.trim() !== '') {
                task.text = newText.trim();
                saveTasks();
                renderTasks();
            }
        }
    };

    window.deleteTask = (id) => {
        const taskElement = document.querySelector(`[data-task-id="${id}"]`);
        if (taskElement) {
            taskElement.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => {
                tasks = tasks.filter(t => t.id !== id);
                saveTasks();
                renderTasks();
            }, 300);
        }
    };

    // Initial render
    renderTasks();
}); 