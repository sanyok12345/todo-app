const search = document.getElementById("search");
const groups = document.getElementById("groups");
const records = document.getElementById("records");

const currentDate = document.getElementById("current-date");
const activeGroup = document.getElementById("active-group");
const createGroup = document.getElementById("create-group");

const createTask = document.getElementById("create-task");

const state = {
    activeGroup: null,
    groups: null
};
function displayWarning(message) {
    const warningWindow = document.createElement("div");
    warningWindow.classList.add("warning-window");
    warningWindow.innerHTML = message;
    document.body.appendChild(warningWindow);
    setTimeout(() => {
        document.body.removeChild(warningWindow);
    }, 2000);
}

search.addEventListener("input", (event) => {
    const value = event.target.value;
    const items = state.groups.filter(group => {
        return group.name.toLowerCase().includes(value.toLowerCase());
    });

    renderGroups(items);
});

createTask.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        const group = state.groups
            .find(group => {
                return (group.name) === state.activeGroup
            });
        if (event.target.value === "") {
            displayWarning("Please enter a task name");
            return;
        }
        group.tasks.push({
            name: event.target.value,
            description: "",
            completed: false
        });

        event.target.value = "";
        render();
    }
});

createGroup.addEventListener("click", () => {
    state.groups.push({
        name: "List #" + parseInt(state.groups.length + 1),
        tasks: []
    });

    renderGroups();
});

const renderGroups = (items = state.groups) => {
    groups.innerHTML = "";

    for (const group of items) {
        const groupElement = document.createElement("div");
        groupElement.classList.add("group-item");
        groupElement.innerHTML = group.name;

        groupElement.addEventListener("click", () => {
            if (state.activeGroup === (group.name)) {

                const input = document.createElement("input");
                input.value = group.name;
                input.addEventListener("blur", () => {
                    groupElement.innerHTML = input.value;
                });

                input.addEventListener("keydown", (event) => {
                    if (event.key === "Enter") {
                        if (input.value === "") {
                            displayWarning("Group name cant be empty!");
                            return;
                        }
                        group.name = input.value;
                        state.activeGroup = group.name;
                        render();
                    }

                    if (event.key === "Delete") {
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

                return;
            }

            state.activeGroup = group.name;
            render();
        });

        if (state.activeGroup === (group.name)) {
            groupElement.classList.add("active");
        }

        groups.appendChild(groupElement);
    }
};

const renderRecords = () => {
    records.innerHTML = "";

    const group = state.groups
        .find(group => {
            return (group.name) === state.activeGroup
        });

    if (group.tasks.length === 0) {
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
        descriptionElement.innerHTML = "Add new task by clicking on the button below"

        contentElement.appendChild(iconElement);
        contentElement.appendChild(titleElement);
        contentElement.appendChild(descriptionElement);
        emptyElement.appendChild(contentElement);

        records.appendChild(emptyElement);
        return;
    }

    for (const task of group.tasks) {
        const taskElement = document.createElement("div");
        taskElement.classList.add("record-item");
        const iconElement = document.createElement("img");
        iconElement.classList.add("icon");

        if (task.completed) {
            iconElement.src = "https://cdn-icons-png.flaticon.com/512/87/87932.png";
        } else {
            iconElement.src = "https://cdn-icons-png.flaticon.com/512/319/319248.png";
        }

        iconElement.onclick = () => {
            task.completed = !task.completed;
            render();
        };

        const contentElement = document.createElement("div");
        contentElement.classList.add("content");
        const titleElement = document.createElement("div");
        titleElement.classList.add("title");
        titleElement.innerHTML = task.name;

        titleElement.addEventListener("click", () => {
            const input = document.createElement("input");
            input.value = task.name;
            input.addEventListener("blur", () => {
                titleElement.innerHTML = input.value;
            });

            input.addEventListener("keydown", (event) => {
                if (event.key === "Enter") {
                    task.name = input.value;
                    render();
                }

                if (event.key === "Delete") {
                    group.tasks = group.tasks.filter(t => t !== task);
                    render();
                }
            });

            titleElement.innerHTML = "";
            titleElement.appendChild(input);
            input.focus();

        });

        if (task.completed) {
            titleElement.style.textDecoration = "line-through";
        }

        const descriptionElement = document.createElement("div");
        descriptionElement.classList.add("description");
        descriptionElement.innerHTML = task.description;

        descriptionElement.addEventListener("click", () => {
            const input = document.createElement("input");
            input.value = task.description;
            input.addEventListener("blur", () => {
                descriptionElement.innerHTML = input.value;
            });

            input.addEventListener("keydown", (event) => {
                if (event.key === "Enter") {
                    task.description = input.value;
                    render();
                }
            });

            descriptionElement.innerHTML = "";
            descriptionElement.appendChild(input);
            input.focus();
        });

        const rigthElement = document.createElement("div");
        rigthElement.classList.add("right");
        const deleteElement = document.createElement("img");
        deleteElement.classList.add("icon");
        deleteElement.src = "https://cdn-icons-png.flaticon.com/512/2907/2907762.png";
        deleteElement.onclick = () => {
            group.tasks = group.tasks.filter(t => t !== task);
            render();
        };

        rigthElement.appendChild(deleteElement);

        contentElement.appendChild(titleElement);
        contentElement.appendChild(descriptionElement);
        taskElement.appendChild(iconElement);
        taskElement.appendChild(contentElement);
        taskElement.appendChild(rigthElement);
        records.appendChild(taskElement);
    }


}

const render = () => {
    if (state.groups === null) {
        const storedGroups = window.localStorage.getItem("groups_data");
        if (storedGroups) {
            state.groups = JSON.parse(storedGroups);
        } else {
            state.groups = [];
        }
    }

    if (state.groups.length === 0) {
        console.log("create default group");
        const index = state.groups.push({
            name: "List #" + parseInt(state.groups.length + 1),
            tasks: []
        });

        state.activeGroup = state.groups[index - 1].name;
    } else {
        if (state.activeGroup === null) {
            const storedActiveGroup = window.localStorage.getItem("active_group");
            if (storedActiveGroup) {
                state.activeGroup = storedActiveGroup;
            } else {
                state.activeGroup = state.groups[0].name;
            }
        }
    }

    activeGroup.innerHTML = state.activeGroup;

    currentDate.innerHTML = new Date().toLocaleDateString("en", {
        weekday: "long",
        day: "numeric",
        month: "long"
    });

    renderGroups();
    renderRecords();

    window.localStorage.setItem("active_group", state.activeGroup);
    window.localStorage.setItem("groups_data", JSON.stringify(state.groups));
}

render();