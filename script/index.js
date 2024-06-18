// Get DOM elements
const search = document.getElementById("search");
const groups = document.getElementById("groups");
const records = document.getElementById("records");
const currentDate = document.getElementById("current-date");
const activeGroup = document.getElementById("active-group");
const createGroup = document.getElementById("create-group");
const createTask = document.getElementById("create-task");

// Initialize state
const state = {
    activeGroup: null,
    groups: []
};

// Display warning message
function displayWarning(message) {
    const warningWindow = document.createElement("div");
    warningWindow.classList.add("warning-window");
    warningWindow.innerHTML = message;
    document.body.appendChild(warningWindow);
    setTimeout(() => {
        document.body.removeChild(warningWindow);
    }, 2000);
}

// Event listener for search input
search.addEventListener("input", (event) => {
    const value = event.target.value.toLowerCase();
    const filteredGroups = state.groups.filter(group => group.name.toLowerCase().includes(value));
    renderGroups(filteredGroups);
});

// Event listener for creating a task
createTask.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        const group = state.groups.find(group => group.name === state.activeGroup);
        const taskName = event.target.value.trim();

        if (!taskName) {
            displayWarning("Please enter a task name");
            return;
        }

        group.tasks.push({
            name: taskName,
            description: "",
            completed: false
        });

        event.target.value = "";
        render();
    }
});

// Event listener for creating a group
createGroup.addEventListener("click", () => {
    state.groups.push({
        name: `List #${state.groups.length + 1}`,
        tasks: []
    });

    renderGroups();
});

// Render groups
const renderGroups = (items = state.groups) => {
    groups.innerHTML = "";

    items.forEach(group => {
        const groupElement = document.createElement("div");
        groupElement.classList.add("group-item");
        groupElement.innerHTML = group.name;

        groupElement.addEventListener("click", () => {
            if (state.activeGroup === group.name) {
                handleGroupEdit(group, groupElement);
                return;
            }

            state.activeGroup = group.name;
            render();
        });

        if (state.activeGroup === group.name) {
            groupElement.classList.add("active");
        }

        groups.appendChild(groupElement);
    });
};

// Handle group edit
const handleGroupEdit = (group, groupElement) => {
    const input = document.createElement("input");
    input.value = group.name;

    input.addEventListener("blur", () => {
        groupElement.innerHTML = input.value;
    });

    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            if (!input.value.trim()) {
                displayWarning("Group name can't be empty!");
                return;
            }
            group.name = input.value;
            state.activeGroup = group.name;
            render();
        } else if (event.key === "Delete") {
            if (state.groups.length === 1) {
                return;
            }

            state.groups = state.groups.filter(g => g !== group);
            state.activeGroup = state.groups[0].name;
            render();
        }
    });

    groupElement.innerHTML = "";
    groupElement.appendChild(input);
    input.focus();
};

// Render records
const renderRecords = () => {
    records.innerHTML = "";
    const group = state.groups.find(group => group.name === state.activeGroup);

    if (group.tasks.length === 0) {
        renderEmptyMessage();
        return;
    }

    group.tasks.forEach(task => {
        const taskElement = createTaskElement(task, group);
        records.appendChild(taskElement);
    });
};

// Render empty message
const renderEmptyMessage = () => {
    const emptyElement = document.createElement("div");
    emptyElement.classList.add("info");

    const contentElement = document.createElement("div");
    contentElement.classList.add("content");

    const iconElement = document.createElement("img");
    iconElement.classList.add("icon");
    iconElement.src = "https://cdn-icons-png.flaticon.com/512/4076/4076478.png";

    const titleElement = document.createElement("div");
    titleElement.classList.add("title");
    titleElement.innerHTML = "Empty!";

    const descriptionElement = document.createElement("div");
    descriptionElement.classList.add("description");
    descriptionElement.innerHTML = "Add new task by clicking on the button below";

    contentElement.append(iconElement, titleElement, descriptionElement);
    emptyElement.appendChild(contentElement);
    records.appendChild(emptyElement);
};

// Create task element
const createTaskElement = (task, group) => {
    const taskElement = document.createElement("div");
    taskElement.classList.add("record-item");

    const iconElement = document.createElement("img");
    iconElement.classList.add("icon");
    iconElement.src = task.completed ? "https://cdn-icons-png.flaticon.com/512/87/87932.png" : "https://cdn-icons-png.flaticon.com/512/319/319248.png";
    iconElement.onclick = () => {
        task.completed = !task.completed;
        render();
    };

    const contentElement = document.createElement("div");
    contentElement.classList.add("content");

    const titleElement = document.createElement("div");
    titleElement.classList.add("title");
    titleElement.innerHTML = task.name;
    titleElement.addEventListener("click", () => handleTaskEdit(task, titleElement, "name"));

    if (task.completed) {
        titleElement.style.textDecoration = "line-through";
    }

    const descriptionElement = document.createElement("div");
    descriptionElement.classList.add("description");
    descriptionElement.innerHTML = task.description;
    descriptionElement.addEventListener("click", () => handleTaskEdit(task, descriptionElement, "description"));

    const rightElement = document.createElement("div");
    rightElement.classList.add("right");

    const deleteElement = document.createElement("img");
    deleteElement.classList.add("icon");
    deleteElement.src = "https://cdn-icons-png.flaticon.com/512/2907/2907762.png";
    deleteElement.onclick = () => {
        group.tasks = group.tasks.filter(t => t !== task);
        render();
    };

    rightElement.appendChild(deleteElement);
    contentElement.append(titleElement, descriptionElement);
    taskElement.append(iconElement, contentElement, rightElement);

    return taskElement;
};

// Handle task edit
const handleTaskEdit = (task, element, key) => {
    const input = document.createElement("input");
    input.value = task[key];

    input.addEventListener("blur", () => {
        element.innerHTML = input.value;
    });

    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            if (!input.value.trim()) {
                displayWarning("Task name can't be empty!");
                return;
            }
            task[key] = input.value;
            render();
        } else if (event.key === "Delete" && key === "name") {
            group.tasks = group.tasks.filter(t => t !== task);
            render();
        }
    });

    element.innerHTML = "";
    element.appendChild(input);
    input.focus();
};

const render = () => {
    if (!state.groups.length) {
        const storedGroups = JSON.parse(localStorage.getItem("groups_data")) || [];
        state.groups = storedGroups.length ? storedGroups : [{ name: "List #1", tasks: [] }];
        state.activeGroup = state.activeGroup || localStorage.getItem("active_group") || state.groups[0].name;
    }

    activeGroup.innerHTML = state.activeGroup;
    currentDate.innerHTML = new Date().toLocaleDateString("en", {
        weekday: "long",
        day: "numeric",
        month: "long"
    });

    renderGroups();
    renderRecords();

    localStorage.setItem("active_group", state.activeGroup);
    localStorage.setItem("groups_data", JSON.stringify(state.groups));
};

render();
