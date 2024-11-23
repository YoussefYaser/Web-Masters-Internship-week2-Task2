//getting all the elements we need to build our script
const form = document.querySelector('.page form');
const inputs = document.querySelectorAll('.page form input');
const required = document.querySelectorAll('.page form span');
const textArea = document.querySelector('.page form textarea');
const row = document.querySelector('.page .tasks .row');
const modalEditing = document.querySelector('.modal-editing');
const add = document.querySelector('.page .add');
const remove = document.querySelector('.page .remove');
const edit = document.querySelector('.page .edit');
//--------------------------------------------------------------------------------------

// temporary object to save the the value of input(name) and textarea(description) during adding task or edit it
let inititalValues = {
    id: '',
    marked: false,
    name: '',
    description: ''
};

const keys = Object.keys(inititalValues);
//------------------------------------------------------------------------------------------

//the array that contains all the data about tasks
let tasks;

//check the localstorage to get the updated data in each loading
if (localStorage.getItem('tasks') == null) {
    tasks = [];
}
else {
    tasks = JSON.parse(localStorage.getItem('tasks'));
}
//-------------------------------------------------------------------------------------------

// display the tasks after the page is loaded
displayAllTasks();
//------------------------------------------------------------------------------------------



// start display tasks

//just display the last added task
function displayTask(values) {

    if (tasks.length) {
        const rowInner = document.querySelectorAll('.page .tasks .row .inner');
        for (let i = 0; i < rowInner.length; i++) {
            rowInner[i].classList.remove('new');
        }
    }


    row.innerHTML += `<div>
                        <div class="inner new">
                            ${values.marked ? `<span class="pointer">
                                <i class="fa-solid fa-bookmark"></i>
                            </span>`: ''}
                            
                            <div>
                                <h2>${values.name}</h2>
                                <p>
                                    ${values.description}    
                                </p>
                            </div>
                            <div>
                                <button class="text-capitalize pointer" onclick=removeTask('${values.id}')>
                                    remove
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                                <button class="text-capitalize pointer" onclick=openModalEditing('${values.id}')>
                                    edit
                                    <i class="fa-solid fa-pen-to-square"></i>
                                </button>
                                <button class="text-capitalize pointer" onclick=markTask('${values.id}')>
                                    mark
                                    <i class="fa-solid fa-bookmark"></i>
                                </button>
                            </div>
                        </div>
                    </div>`;
}
//display all the tasks that added successfuly
function displayAllTasks() {
    row.innerHTML = '';
    for (let i = 0; i < tasks.length; i++) {
        row.innerHTML += `<div>
                        <div class="inner">
                            ${tasks[i].marked ? `<span class="pointer">
                                <i class="fa-solid fa-bookmark"></i>
                            </span>`: ''}
                            
                            <div>
                                <h2>${tasks[i].name}</h2>
                                <p>
                                    ${tasks[i].description}    
                                </p>
                            </div>
                            <div>
                                <button class="text-capitalize pointer" onclick=removeTask('${tasks[i].id}')>
                                    remove
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                                <button class="text-capitalize pointer" onclick=openModalEditing('${tasks[i].id}')>
                                    edit
                                    <i class="fa-solid fa-pen-to-square"></i>
                                </button>
                                ${tasks[i].marked ? `<button class="text-capitalize pointer" onclick=unMarkTask('${tasks[i].id}')>
                                    unmark
                                    <i class="fa-solid fa-bookmark"></i>
                                </button>` : `<button class="text-capitalize pointer" onclick=markTask('${tasks[i].id}')>
                                    mark
                                    <i class="fa-solid fa-bookmark"></i>
                                </button>`}
                                
                            </div>
                        </div>
                    </div>`
    }
}

//-------------------------------------------------------------------------------------

// start remove task

function removeTask(id) {
    let [removedTask] = tasks.filter((elem) => elem.id == id);

    tasks = tasks.filter((elem) => elem.id != id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    displayAllTasks();
    remove.innerHTML = `<span class="d-block">${removedTask.name} just been removed successfully</span>`
}

//-------------------------------------------------------------------------------------

// start mark task

function markTask(id) {
    tasks = tasks.map((elem) => {
        if (elem.id == id) {
            elem = { ...elem, marked: true };
        }
        return elem;
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    displayAllTasks();
}

//-------------------------------------------------------------------------------------

// start unmark task

function unMarkTask(id) {
    tasks = tasks.map((elem) => {
        if (elem.id == id) {
            elem = { ...elem, marked: false };
        }
        return elem;
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    displayAllTasks();
}

//-------------------------------------------------------------------------------------

// open modal editing

function openModalEditing(id) {

    const [task] = tasks.filter((elem, i) => elem.id == id);

    modalEditing.innerHTML = '';
    modalEditing.innerHTML = `
                <span class="close">
                    <i class="fa-solid fa-x"></i>
                </span>
                <div class="container xy-center">
                <div>
                    <h2>${task.name}</h2>
                    <p>${task.description}</p>
                    <form action="" class="text-capitalize">
                        <div>
                            <label for="name" class="d-block w-fit">Task Name</label>
                            <div class="relative">
                                <input id="name" name="name" value=${task.name} type="text">
                                <span class="absolute">Required</span>
                            </div>
                        </div>
                        <div>
                            <label for="description" class="d-block w-fit">description</label>
                            <div class="relative">
                                <textarea name="description" id="description" rows="4"}></textarea>
                                <span class="absolute">Required</span>
                            </div>
                        </div>
                        <button type="submit" class="text-capitalize pointer">
                            edit
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                    </form>
                </div>
            </div>`;

    //class show added opacity transition
    modalEditing.classList.add('show');

    const modalEditingForm = document.querySelector('.modal-editing .container form');
    const modalTextArea = document.querySelector('.modal-editing .container form textarea');
    modalTextArea.value = task.description;
    const modalClose = document.querySelector('.modal-editing .close');
    modalEditingForm.addEventListener('submit', function (e) {
        e.preventDefault();

        let [submit, inititalValues] = formValidation(this);

        if (submit) {
            editTask(id, inititalValues);
            modalClose.click();
        }

    });

    modalClose.addEventListener('click', function () {
        modalEditing.classList.remove('show');
    })
}

//searching the task with the same id to edit
function editTask(id, values) {
    tasks = tasks.map((elem, i) => {
        if (elem.id == id) {
            edit.innerHTML = `<span class="d-block">you just edited ${elem.name} to ${values.name}</span>`;
            return {
                ...elem,
                name: values.name,
                description: values.description
            }
        }
        return elem;
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    displayAllTasks();
}

//-------------------------------------------------------------------------------------


// start form validation

function formValidation(form) {
    let submit = true;
    for (let i = 2; i < keys.length; i++) {
        if (form[keys[i]].value) {
            inititalValues[keys[i]] = form[keys[i]].value;
        }
        else {
            form[keys[i]].style.setProperty('border-color', '#d50000');
            required[i - 2].style.setProperty('display', 'block');
            submit = false;
        }
    }

    return [submit, inititalValues];
}

form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (formValidation(form)[0]) {
        inititalValues.id = String(new Date()).split(' ').join('');
        add.innerHTML = `<span class="d-block">${inititalValues.name} just been added successfuly</span>`
        tasks.push(structuredClone(inititalValues));
        localStorage.setItem('tasks', JSON.stringify(tasks));
        displayTask(inititalValues);
        for (let i = 2; i < keys.length; i++) {
            form[keys[i]].value = '';
        }
    }
});


//reset the style of the fields
function resetField(e) {
    if (!e.target.value) {
        e.target.nextElementSibling.style.setProperty('display', 'none');
        e.target.style.setProperty('border-color', '#1e272e');
    }
}

inputs.forEach((input, i) => {
    input.addEventListener('focus', function (e) {
        resetField(e);
    })
});

textArea.addEventListener('focus', function (e) {
    resetField(e);
});

//-------------------------------------------------------------------------------------