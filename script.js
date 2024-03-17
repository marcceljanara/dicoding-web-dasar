const todos = [];
const RENDER_EVENT = "render-todo";
const SAVED_EVENT = "saved-todo";
const STORAGE_KEY = "TODO-APPS";

document.addEventListener(RENDER_EVENT, function () {
  // console.log(todos);
  const uncompletedTODOList = document.getElementById("todos");
  uncompletedTODOList.innerHTML = "";

  const completedTODOList = document.getElementById("completed-todos");
  completedTODOList.innerHTML = "";

  for (const todoItem of todos) {
    const todoElement = makeTodo(todoItem);
    if (!todoItem.isCompleted) {
      uncompletedTODOList.append(todoElement);
    } else {
      completedTODOList.append(todoElement);
    }
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("form");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addTodo();
    
  });
  if(isStorageExist()){
    loadFromDataStorage();
  }
});

// menambahkan todo
function addTodo() {
  const textTodo = document.getElementById("title").value;
  const timestamp = document.getElementById("date").value;

  const generateID = generateId();
  const todoObject = generateTodoObject(generateID, textTodo, timestamp, false);
  todos.push(todoObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// fungsi generate Id
const generateId = function () {
  return +new Date();
};

//fungsi generate todo object
const generateTodoObject = function (id, task, timestamp, isCompleted) {
  return {
    id,
    task,
    timestamp,
    isCompleted,
  };
};

//fungsi membuat todo
function makeTodo(todoObject) {
  const textTitle = document.createElement("h2");
  textTitle.innerText = todoObject.task;
  
  const textTimestamp = document.createElement("p");
  textTimestamp.innerText = todoObject.timestamp;
  
  const textContainer = document.createElement("div");
  textContainer.classList.add("inner");
  textContainer.append(textTitle, textTimestamp);
  
  const container = document.createElement("div");
  container.classList.add("item", "shadow");
  container.append(textContainer);
  container.setAttribute("id", `todo-${todoObject.id}`);
  
  if (todoObject.isCompleted) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("undo-button");
    
    undoButton.addEventListener("click", function () {
      undoTaskFromCompleted(todoObject.id);
    });
    
    const trashButton = document.createElement("button");
    trashButton.classList.add("trash-button");
    
    trashButton.addEventListener("click", function () {
      removeTaskFromCompleted(todoObject.id);
    });
    
    container.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("check-button");
    
    checkButton.addEventListener("click", function () {
      addTaskToCompleted(todoObject.id);
    });
    container.append(checkButton);
  }
  
  return container;
}

// fungsi menambahkan tugas ke selesai
function addTaskToCompleted(todoId) {
  const todoTarget = findTodo(todoId);
  
  if (todoTarget == null) return;
  
  todoTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// fungsi menghapus tugas yang telah selesai
function removeTaskFromCompleted(todoId){
  const todoTarget = findTodoIndex(todoId);
  
  if(todoTarget === -1) return;
  
  todos.splice(todoTarget,1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// fungsi mengembalikan task selesai ke belum selesai
function undoTaskFromCompleted(todoId){
  const todoTarget = findTodo(todoId);

  if(todoTarget == null) return;

  todoTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// Fungsi mencari todo dalam array
function findTodo(todoId) {
  for (const todoItem of todos) {
    if (todoItem.id === todoId) {
      return todoItem;
    }
  }
  return null;
}

// fungsi mencari index todo dalam array
function findTodoIndex(todoId){
  for(const index in todos){
    if(todos[index].id === todoId){
      return index;
    }
  }
  return -1;
}

// fungsi menyimpan data todo
function saveData(){
  if(isStorageExist()){
    const parsed = JSON.stringify(todos);
    localStorage.setItem(STORAGE_KEY,parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

// mengecek apakah storage ada di browser
function isStorageExist(){
  if(typeof (Storage) === undefined){
    alert("Browser yang Anda gunakan tidak mendukung Web Storage");
    return false;
  }else{
    return true;
  }
}

// Load data dari storage
function loadFromDataStorage(){
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if(data !== null){
    for(const todo of data){
      todos.push(todo);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
} 

document.addEventListener(SAVED_EVENT, function(){
  console.log(localStorage.getItem(STORAGE_KEY));
});