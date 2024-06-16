
const storage = window.localStorage;
console.log(storage)
document.addEventListener('DOMContentLoaded', function () {
    const settingsIcon = document.querySelector('.app .content .input img');
    const settingsPanel = document.querySelector('.app .content .settings');

    settingsIcon.addEventListener('click', function () {
        if (settingsPanel.classList.contains('visible')) {
            settingsPanel.style.maxHeight = null;
            settingsPanel.classList.remove('visible');
        } else {
            const scrollHeight = settingsPanel.scrollHeight + "px";
            settingsPanel.style.maxHeight = scrollHeight;
            settingsPanel.classList.add('visible');
        }
    });

    showTasks();

});
function addTaskToLocalStorage() {
    let tasks = storage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
    const inputText = document.getElementsByName('task')[0].value;

    if (inputText === '') {
        alert('Please enter a task');
        return;
    }
    let task = { 'done': false, 'task': inputText };

    tasks.push(task);
    storage.setItem('tasks', JSON.stringify(tasks));
    document.getElementsByName('task')[0].value = '';
    addTask(task);
}
function addTask(task) {
    const taskContainer = document.getElementById('taskList');
    const taskElement = document.createElement('div');
    taskElement.classList.add('element');
    if (task.done) {
        taskElement.classList.add('bg-warning');
    }


    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.addEventListener('change', checkTaskDone);
    checkbox.checked = task.done;
    taskElement.appendChild(checkbox);

    const textDiv = document.createElement('div');
    textDiv.classList.add('text');

    const taskInput = document.createElement('input');
    taskInput.type = 'text';
    taskInput.value = task.task;
    textDiv.appendChild(taskInput);

    taskElement.appendChild(textDiv);

    const actionsDiv = document.createElement('div');
    actionsDiv.classList.add('actions');

    const editButton = document.createElement('button');
    editButton.type = 'button';
    editButton.addEventListener('click', editTask);
    editButton.textContent = 'Edit';
    editButton.classList.add('bg-primary', 'btn', 'btn-sm');
    actionsDiv.appendChild(editButton);

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.addEventListener('click', deleteTask);
    deleteButton.classList.add('bg-danger', 'btn', 'btn-sm');
    deleteButton.textContent = 'Delete';
    actionsDiv.appendChild(deleteButton);

    taskElement.appendChild(actionsDiv);

    taskContainer.appendChild(taskElement);
}

function showTasks() {
    const tasks = storage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];

    tasks.forEach(addTask);

}

function deleteTask() {
    const tasks = storage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];

    const taskElement = this.parentElement.parentElement;
    const taskIndex = Array.from(taskElement.parentElement.children).indexOf(taskElement);

    tasks.splice(taskIndex, 1);
    storage.setItem('tasks', JSON.stringify(tasks));

    taskElement.remove();
}

function editTask() {
    const tasks = storage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];

    const taskElement = this.parentElement.parentElement;
    const taskIndex = Array.from(taskElement.parentElement.children).indexOf(taskElement);

    const task = tasks[taskIndex];
    task.task = taskElement.querySelector('.text input').value;

    storage.setItem('tasks', JSON.stringify(tasks));
}

function checkTaskDone() {
    const tasks = storage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];

    const taskElement = this.parentElement;
    const taskIndex = Array.from(taskElement.parentElement.children).indexOf(taskElement);

    const task = tasks[taskIndex];
    task.done = this.checked;
    if (task.done) {
        taskElement.classList.add('bg-warning');
    } else {
        taskElement.classList.remove('bg-warning');
    }

    storage.setItem('tasks', JSON.stringify(tasks));

}