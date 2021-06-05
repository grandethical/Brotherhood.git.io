// ITEM CONTROLLER
const itemCtrl = (function(){
    //item constructor
    const Item = function(id, task){
        this.id = id;
        this.task = task;
    }
    //data structure
    const data = {
        items:[],
        currentTask: null
    }
    //public methods
    return{
        logData: function(){
            return data;
        },
        addTask: function(taskName){
            //create random id
            let ID = itemCtrl.createID();
            //create a new item
            newItem = new Item(ID, taskName);
            //push it into the array
            data.items.push(newItem);

            return newItem
        },
        createID: function(){
            //create random id number between 0 and 10000
            const idNum = Math.floor(Math.random() * 10000)
            return idNum;
        },
        getIdNumber: function(element){
            //get item id
            const taskId = element.parentNode.parentNode.parentNode.id
            //break the id into an array
            const taskArr = taskId.split('-')
            //get the id number
            const id = parseInt(taskArr[1]);
            
            return id;
        },
        deleteTaskArr: function(id){
            //get all the id's
            const ids = data.items.map(function(item){
                //return item with the id we want
                return item.id
            });
            //get index
            const index = ids.indexOf(id);
            //remove item
            data.items.splice(index,1);
        },
        getItemById: function(id){
            let found = null;
            //loop through items
            data.items.forEach(function(item){
                if(item.id === id){
                    found = item
                }
            })
            return found;
        },
        setCurrentTask: function(task){
            data.currentTask = task
            
            return data.currentTask;
        },
        getCurrentTask: function(){
            return data.currentTask;
        },
        updateItem: function(link){
            let found = null;
            //find in the data the item we are going to edit
            data.items.forEach(function(item){
                if(item.id === data.currentTask.id){
                    item.task = link;
                    found = item
                }
            })
            return found;
        }
    }
})();

// UI CONTROLLER
const UICtrl = (function(){
    //ui selectors
    const UISelectors = {
        addTaskBtn: '#add__task--btn',
        updateTaskBtn: '#update__task--btn',
        taskInput: '#task__input',
        taskList: '.task__list',
        importantBtn: '.fa-exclamation',
        editBtn: '.fa-pencil-alt',
        deleteBtn: '.fa-times',
        task: '.task',
        listTasks: '.task__list .task'
    }

    //public methods
    return{
        //UI Selectors
        getSelectors: function(){
            return UISelectors;
        },
        //get task input
        getTaskInput: function(){
            return{
                taskName: document.querySelector(UISelectors.taskInput).value
            }
        },
        //add new task to the list
        addTaskList: function(item){
            //create new div
            const div = document.createElement('div');
            //add class
            div.classList = 'task'
            //add id to the div
            div.id = `link-${item.id}`
            //add html
            div.innerHTML = `
            <div class="important"><i class="fas fa-flag"></i>Important</div>
            <div class="task__body">
                <div class="task__info">
                        <div class="checkmark"></div>
                            <span class="task__name">${item.task}</span>
                </div>
                <div class="task__icons">
                            <i class="fas fa-exclamation"></i>
                            <i class="fas fa-pencil-alt"></i>
                            <i class="fas fa-times"></i>
                </div>
            </div>
            `;
            //insert taks
            document.querySelector(UISelectors.taskList).insertAdjacentElement('beforeend', div)
        },
        clearInput: function(){
            document.querySelector(UISelectors.taskInput).value = ''
        },
        markImportant: function(exclamation){
            exclamation.parentElement.parentElement.parentElement.firstElementChild.classList.toggle('marked');
        },
        deleteTask: function(id){
            //build the id we need to find
            const taskId = `#link-${id}`
            //select the task with the id we passed
            const task = document.querySelector(taskId)
            //remove it from the list
            task.remove();
        },
        doneTask: function(task){
            task.parentElement.parentElement.classList.toggle('done')
        }, 
        addTaskToForm: function(){
            document.querySelector(UISelectors.taskInput).value = itemCtrl.getCurrentTask().task
            //show edit button
            UICtrl.showEditState()
        },
        showEditState: function(){
            document.querySelector(UISelectors.addTaskBtn).style.display = 'none'
            document.querySelector(UISelectors.updateTaskBtn).style.display = 'block'
        },
        updateTaskItem: function(item){
            let listItems = document.querySelectorAll(UISelectors.listTasks);
            //turn the node list into an array
            listItems = Array.from(listItems)

            listItems.forEach(function(listItem){
                const itemID = listItem.getAttribute('id')
                if(itemID === `link-${item.id}`){
                    document.querySelector(`#${itemID}`).innerHTML=
                    `
                    <div class="important"><i class="fas fa-flag"></i>Important</div>
                    <div class="task__body">
                        <div class="task__info">
                            <div class="checkmark"></div>
                            <span class="task__name">${item.task}</span>
                        </div>
                        <div class="task__icons">
                            <i class="fas fa-exclamation"></i>
                            <i class="fas fa-pencil-alt"></i>
                            <i class="fas fa-times"></i>
                        </div>
                    </div>
                    `
                }
            })
        },
        clearEditState: function(){
            document.querySelector(UISelectors.addTaskBtn).style.display = 'block'
            document.querySelector(UISelectors.updateTaskBtn).style.display = 'none'
        }
    }
})();

// APP CONTROLLER
const App = (function(){
    //event listeners
    const loadEventListeners = function(){
        //get ui selectors
        const UISelectors = UICtrl.getSelectors();
        //add new task
        document.querySelector(UISelectors.addTaskBtn).addEventListener('click', addTask);
        // edit task(mark as important, delete and mark as done)
        document.querySelector(UISelectors.taskList).addEventListener('click', changeTask);
        //update taks
        document.querySelector(UISelectors.updateTaskBtn).addEventListener('click', taskUpdate);
    }

    //add new task
    const addTask = function(e){
        //get form input value
        const input = UICtrl.getTaskInput();
        // if input is not empty
        if(input.taskName !== ''){
            //add new item
            const newTask = itemCtrl.addTask(input.taskName)
            //add task to the list
            UICtrl.addTaskList(newTask)
            //clear input
            UICtrl.clearInput();

            // const TestData = itemCtrl.logData();
            // console.log(TestData);
        }
        e.preventDefault();
    }

    // edit task(mark as important, delete and mark as done)
    const changeTask = function(e){
        if(e.target.classList.contains('fa-exclamation')){
            //mark as important
            UICtrl.markImportant(e.target);
        } else if(e.target.classList.contains('fa-times')){
            //get id number
            const id = itemCtrl.getIdNumber(e.target)
            //delete task from list UI
            UICtrl.deleteTask(id)
            //delete task from data array
            itemCtrl.deleteTaskArr(id)
        } else if( e.target.classList.contains('checkmark')){
            UICtrl.doneTask(e.target)
        } else if( e.target.classList.contains('fa-pencil-alt')){
            //get id number
            const id = itemCtrl.getIdNumber(e.target)
            //get item to edit
            const taskToEdit = itemCtrl.getItemById(id)
            //set current item
            itemCtrl.setCurrentTask(taskToEdit)
            //add task to form
            UICtrl.addTaskToForm(id)
        }

        e.preventDefault();
    }

    const taskUpdate = function(e){
        //get input value
        const input = UICtrl.getTaskInput();
        //update item in the itemCtrl
        const updatedItem =  itemCtrl.updateItem(input.taskName);
        //update the Ui
        UICtrl.updateTaskItem(updatedItem)
        //clear inputs
        UICtrl.clearInput()
        //hide edit button
        UICtrl.clearEditState() 

        e.preventDefault()
    }

    //init function
    return{
        init: function(){
            loadEventListeners();
        }
    }

})(itemCtrl, UICtrl)

App.init();