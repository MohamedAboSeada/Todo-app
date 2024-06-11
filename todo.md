TODO : Make the top of the app
    [ ] define it as header with p for day date
    [ ] write the date of the day

TODO : Make Input and it's features
    [ ] Input Bar for task title
    [ ] text Area for task Discription
        a. has min-height and grow by user input
    [ ] priority list
        a. list contains [`high`,`medium`,`low`]
    [ ] Date choose
        a. list contains [`today`,`tomorrow`,`specifi date`,`no date`]

TODO : Make tasks area
    [ ] Make the area as Queue (FIFO)
        a. handle state if it's empty
    [ ] define task struture
        [ ] has a button for edit
        [ ] has check box for complete
        [ ] has trash button to delete
        [ ] has h2 for task title
        [ ] has p for task discription
        [ ] priority and completion date

TODO : Edit panel
    [ ] the same as input and it's features


task object
{
    task_title: "",
    task_disc: "",
    task_priority:"",
    task_date: dateObj
}

class task{
    constructor(task_title,task_disc,task_prio,task_date){
        this.id = "t" + Math.floor((Math.random() * 2231));
        this.tasks_cont = document.getElementById('');
        this.task = {
                task_title: task_title,
                task_disc: task_disc,
                task_priority:task_prio,
                task_date: task_date
            }
        return this.task;       
    }
    
    createTask(){
        let task = document.createElement('div');
        task.className = 'task';
        task.id = this.id;
        task_structure = `
            
        `       
        task.innerHTML = task_structure;
        this.task_cont.append(task);
    }

    addToMemory(){
        // know that later
    }

    taskDel(){
        if(document.getElementById(this.id)){
            document.getElementById(this.id).remove();
        }       
    }
}

class TasksArea{
    constructor(){
        this.tasks = [];
        this.cont = document.getElementById('');
    }
    enqueue(task){
        this.tasks.push(task);
    }
}