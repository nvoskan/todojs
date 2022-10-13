//1.Добавление задачи в список дел
//Нужно найти форму и инпут для извлечения текста задачи 

const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');
const submButtn = document.querySelector('#addbtn')

let tasks = [];
let edited = true;

if (localStorage.getItem('tasks')) {
    let j = 0;
    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach((task) => {
        j++
        renderTask(task, j)}
        );
} 

checkEmptylist()

form.addEventListener('submit', addTask)
tasksList.addEventListener('click', deleteTask)
tasksList.addEventListener('click', doneTask)
tasksList.addEventListener('click', editTask)


function addTask(e){
    e.preventDefault(); //предотвращение отправки формы
    const taskTxt = taskInput.value  

    const newTask = {
        id: Date.now(),
        text: taskTxt,
        done: false
    }

    tasks.push(newTask);
    let i = tasks.length;
    saveToLocal();

    renderTask(newTask, i);
    taskInput.value = ""
    taskInput.focus()
    checkEmptylist()
}

function deleteTask(e){
    if (e.target.dataset.action !== 'delete') return;
    const taskItem = e.target.closest('li');
    const id = taskItem.id 
    const index = tasks.findIndex((task) => task.id == id); //стрелочная функция состоящая только из возвращаемого значения может быть сокращена до такого вида
    tasks.splice(index, 1);
    taskItem.remove()
    saveToLocal();
    location.reload();
    checkEmptylist()
}

function editTask(e){
    if (e.target.dataset.action !== 'edit') return;
    const taskItem = e.target.closest('li');  //Элемент списка
    const id = taskItem.id      //
    const index = tasks.findIndex((task) => task.id == id);
    let task = tasks[index];
    e.preventDefault(); //предотвращение отправки формы
    if (edited){
        edited = false;
        console.log(taskItem)
        taskItem.style.background = "#81c98d93"
        taskInput.value = task.text; 
        taskInput.focus()
        submButtn.setAttribute('disabled', true) //disabled
    } else {
        edited = true;
        submButtn.setAttribute('disabled', false) //disabled
        task.text = taskInput.value;
        console.log(task.text)
        tasks.slice(index, 1, task)
        saveToLocal();
        //console.log(tasks[index])
        location.reload();
    }

}

function doneTask(e){
    if (e.target.dataset.action !== 'done'){
        return
    } 
    const taskItem = e.target.closest('li');
    const id = taskItem.id;
    const findTask = tasks.find((task)=> task.id == id) //возвращает элемент
    findTask.done = !findTask.done;
    saveToLocal();
    const task = taskItem.querySelector('span')
    task.classList.toggle('task-done')
}

function checkEmptylist(){
    if (tasks.length == 0){
        const emptyListHTML = `
        <li id="emptyList" class="empty-list">
            <img src="./image/leaf2.svg" alt="Empty" width="48" class="">
            <div class="empty-list-title">Список пуст</div>
        </li>`
        tasksList.insertAdjacentHTML('afterbegin', emptyListHTML)
    } else {
        const emplyListEl = document.querySelector('#emptyList')
        emplyListEl ? emplyListEl.remove() : null;
    }
}

function saveToLocal(){
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

function renderTask(task, i){
    const cssClass = task.done ? 'task-title task-done':'task-title';
    const taskHTML = `
        <li id = "${task.id}" class="displ-f">
            <span class="${cssClass}">${i})  ${task.text}</span>
            <div class="task-buttons">
                <button type="button" data-action="edit" class="btn-action">
                    <img src="./image/edit.svg" alt="Edit" width="18" height="18">
                </button>
                <button type="button" data-action="done" class="btn-action">
                    <img src="./image/tick.svg" alt="Done" width="18" height="18">
                </button>
                <button type="button" data-action="delete" class="btn-action">
                    <img src="./image/cross.svg" alt="Done" width="18" height="18">
                </button>
            </div>
        </li>
    `
    tasksList.insertAdjacentHTML('beforeend', taskHTML);
}