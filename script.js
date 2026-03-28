const sendButton = document.querySelector('input[type="submit"]')
const inputTask = document.querySelector('#task')
const taskList = document.querySelector('.task-list')


// Salvar tarefas no local storage
const savedData = localStorage.getItem('tasks'); 
let tasks;
if (savedData) {
  tasks = JSON.parse(savedData) 
} else {
  tasks = [] 
};

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks)); 
}


// Função para exibir tarefas salvas na lista
function displayTasks() {
  taskList.innerHTML = '';
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    const p = document.createElement('p');
    p.setAttribute('class', 'task-text')
    p.innerHTML = `<span>${task.text}</span> • ${task.data} às ${task.hora}`;
    if (task.completed) {
      p.classList.add('task-completed');
    }

    const btnDeleteTask = document.createElement('button');
    btnDeleteTask.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    btnDeleteTask.setAttribute('class', 'delete');
    btnDeleteTask.addEventListener('click', () => removeTask(index));

    const btnEditTask = document.createElement('button');
    btnEditTask.innerHTML = '<i class="fa-solid fa-pen"></i>'
    btnEditTask.setAttribute('class', 'edit');
    btnEditTask.addEventListener('click', () => editTask(index))

    const btnCompletedTask = document.createElement('button');
    btnCompletedTask.innerHTML = '<i class="fa-solid fa-check"></i>'
    btnCompletedTask.setAttribute('class', 'check')
    btnCompletedTask.addEventListener('click', () => completedTask(index))
   
    const btnContainer = document.createElement('div')
    btnContainer.setAttribute('class', 'btn-container')

    li.appendChild(p);
    li.appendChild(btnContainer);
    btnContainer.appendChild(btnCompletedTask)
    btnContainer.appendChild(btnEditTask);
    btnContainer.appendChild(btnDeleteTask);

    taskList.appendChild(li);
  })
}


// Função que remove tarefas, atualizando a lista no local storage
function removeTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  displayTasks();
}

// Função que edita tarefas, atualizando a lista no local storage
function editTask(index) {
  const li = taskList.children[index];
  const p = li.querySelector('.task-text');

  const input = document.createElement('input');
  input.setAttribute('class', 'input-edit-task')
  input.type = 'text';
  input.value = tasks[index].text;

  li.replaceChild(input, p);
  input.focus();

  function saveEdit() {
    tasks[index].text = input.value;
    saveTasks();
    displayTasks();
  }

  // Eventos para quando clicamos enter, esc e quando clicamos fora do campo de input
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      saveEdit()
    } else if (e.key === 'Escape') {
      displayTasks()
    }
  })
  input.addEventListener('blur', saveEdit);
}

// Função que adiciona classe de 'completed' ao li
function completedTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks()
  displayTasks()
}

// Função para adicionar nova tarefa
function addNewTask(event) {
  event.preventDefault();
  const newTask = {
    text: inputTask.value,
    data: new Date().toLocaleDateString('pt-BR'),
    hora: new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'}),
    completed: false
  };
  if (newTask.text.trim() !== '') { 
    tasks.unshift(newTask);  
    saveTasks(); 
    displayTasks(); 
    inputTask.value = '';
  }
}

// Eventos
sendButton.addEventListener('click', addNewTask)

// Executar função para exibir tarefas ao carregar página:
displayTasks();