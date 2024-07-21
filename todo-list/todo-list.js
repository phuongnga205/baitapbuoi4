document.getElementById("formTask").onsubmit = function(event) {
    event.preventDefault();
    const inputTask = document.getElementById("inputTask").value.trim();
    const inputCategory = document.getElementById("inputCategory").value.trim();
    const taskStatus = document.getElementById("selectStatus").value;

    if (inputTask !== "" && inputCategory !== "") {
        const task = {
            text: inputTask,
            category: inputCategory,
            status: taskStatus,
            completed: false
        }
        addTask(task);
        saveTasksToLocalStorage();
    } else {
        alert("Please enter both task description and category.");
    }
}

document.getElementById("saveBtn").addEventListener("click", function(event) {
    event.preventDefault();
    saveTasksToLocalStorage();
});

function saveTasksToLocalStorage() {
    const taskList = document.getElementById("tasks");
    const tasks = [];
    for (let taskItem of taskList.getElementsByTagName("li")) {
        const task = {
            text: taskItem.childNodes[0].textContent,
            category: taskItem.getAttribute("data-category"),
            status: taskItem.getAttribute("data-status"),
            completed: taskItem.classList.contains("completed")
        }
        tasks.push(task);
    }
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    if (tasks) {
        for (let task of tasks) {
            addTask(task);
        }
    }
}

loadTasksFromLocalStorage();

function addTask(task) {
    const taskList = document.getElementById("tasks");
    const taskItem = document.createElement("li");
    taskItem.textContent = task.text;
    taskItem.setAttribute("data-category", task.category);
    taskItem.setAttribute("data-status", task.status);
    if (task.completed) taskItem.classList.toggle("completed");

    taskItem.addEventListener("click", function() {
        taskItem.classList.toggle("completed");
        saveTasksToLocalStorage();
    });

    const categorySpan = document.createElement("span");
    categorySpan.textContent = task.category;
    categorySpan.style.marginLeft = "10px";
    categorySpan.style.fontStyle = "italic";
    categorySpan.style.cursor = "pointer";
    categorySpan.addEventListener("click", function() {
        const newCategory = prompt("Enter new category:");
        if (newCategory && newCategory.trim() !== "") {
            categorySpan.textContent = newCategory.trim();
            taskItem.setAttribute("data-category", newCategory.trim());
            saveTasksToLocalStorage();
        }
    });
    taskItem.appendChild(categorySpan);

    const statusSelect = document.createElement("select");
    statusSelect.innerHTML = `
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
    `;
    statusSelect.value = task.status;
    statusSelect.addEventListener("change", function() {
        taskItem.setAttribute("data-status", statusSelect.value);
        saveTasksToLocalStorage();
    });
    taskItem.appendChild(statusSelect);

    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", function() {
        taskList.removeChild(taskItem);
        saveTasksToLocalStorage();
    });
    taskItem.appendChild(removeButton);

    taskList.appendChild(taskItem);
}
