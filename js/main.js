document.addEventListener('DOMContentLoaded', () => {
	const modal = document.querySelector('.modal');
	const addBtn = document.getElementById('addTask');
	const add = modal.querySelector('#add');
	const deleteAll = document.querySelector('#delete');
	const cancel = modal.querySelector('#cancel');
	const todoTasks = document.querySelector('.todo .tasks');
	const doneTasks = document.querySelector('.done .tasks');

	let tasks = [];
	let id = 0;

	// the button used to popup the modal
	addBtn.addEventListener('click', (_) => {
		modal.classList.add('popUp');
	});

	// to hide the modal
	cancel.addEventListener('click', (_) => {
		modal.classList.remove('popUp');
	});

	// delete all completed tasks
	deleteAll.addEventListener('click', (_) => {
		if (doneTasks.hasChildNodes()) {
			id -= doneTasks.children.length;
			doneTasks.innerHTML = '';
			tasks = tasks.filter((x) => x.status === 'todo');
			localStorage.setItem('tasks', JSON.stringify(tasks));
			localStorage.setItem('id', id);
		}
	});

	tippy(deleteAll, {
		content: 'delete completed',
	});

	tippy(addBtn, {
		content: 'add a task',
	});

	function loadTasks() {
		if (localStorage.getItem('tasks')) {
			tasks = JSON.parse(localStorage.getItem('tasks'));

			// clear all app ui
			todoTasks.innerHTML = '';
			doneTasks.innerHTML = '';

			for (let i of tasks) {
				console.log(i.status);
				if (i.status === 'completed') {
					cardCreate(
						i.id,
						i.title,
						i.category,
						i.day,
						i.priority,
						i.level,
						doneTasks
					);
				} else if (i.status === 'todo') {
					cardCreate(
						i.id,
						i.title,
						i.category,
						i.day,
						i.priority,
						i.level,
						todoTasks
					);
				}
			}
		}
	}

	loadTasks();

	function savetask(task) {
		tasks.push(task);
		localStorage.setItem('tasks', JSON.stringify(tasks));
	}

	function cardCreate(id, title, cat, date, priority, level, parent) {
		let card = document.createElement('div');

		card.classList.add('card');
		card.id = id;

		card.innerHTML = `
        <h2>${title}</h2>
        <div class="info">
        <div class="prio">
                            <h3 class="${priority}">${date}</h3>
                            <div class="prioripty">
                            <div class="circle"></div>
                                <div class="circle"></div>
                                <div class="circle"></div>
                                </div>
                                </div>
                                <h3>${cat}</h3>
                                </div>`;

		parent.appendChild(card);

		let priportyLevel = card.querySelector('.prioripty').children;

		// adding level
		if (level === 'easy') {
			priportyLevel[0].classList.add(priority);
		} else if (level === 'moderate') {
			priportyLevel[0].classList.add(priority);
			priportyLevel[1].classList.add(priority);
		} else {
			priportyLevel[0].classList.add(priority);
			priportyLevel[1].classList.add(priority);
			priportyLevel[2].classList.add(priority);
		}
	}

	function updateState(id, newState) {
		let taskss = JSON.parse(localStorage.getItem('tasks'));

		for (let i of taskss) {
			if (i.id === +id) {
				i.status = newState;
			}
		}

		tasks = taskss;
		localStorage.setItem('tasks', JSON.stringify(taskss));
	}

	add.addEventListener('click', (_) => {
		modal.classList.remove('popUp');

		let title = modal.querySelector('#ttitle');
		let cat = modal.querySelector('#tag');
		let date = modal.querySelector('#day');
		let priority = modal.querySelector('#prioripty');
		let level = modal.querySelector('#level');

		let task = {
			id: id,
			title: title.value,
			category: cat.value,
			day: date.value,
			priority: priority.value,
			level: level.value,
			status: 'todo',
		};
		savetask(task);

		cardCreate(
			id,
			title.value,
			cat.value,
			date.value,
			priority.value,
			level.value,
			todoTasks
		);

		id++;
		localStorage.setItem('id', id);
	});

	// Enable draggable functionality on task cards
	interact('.card').draggable({
		autoScroll: true,
		onmove: dragMoveListener,
	});

	// Enable dropzone functionality for todo and done containers
	interact('.tasks').dropzone({
		accept: '.card',
		overlap: 0.5,
		ondrop: function (event) {
			event.target.appendChild(event.relatedTarget);
			if (event.target.parentNode === document.querySelector('.done')) {
				event.relatedTarget.classList.add('completed');
				updateState(event.relatedTarget.id, 'completed');
			} else {
				event.relatedTarget.classList.remove('completed');
				updateState(event.relatedTarget.id, 'todo');
			}
		},
	});

	function dragMoveListener(event) {
		var target = event.target;
		var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
		var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

		// Translate the element
		target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';

		// Update the position attributes
		target.setAttribute('data-x', x);
		target.setAttribute('data-y', y);
	}

	// Reset position after drop
	interact('.card').on('dragend', function (event) {
		var target = event.target;
		target.classList.remove('onTop', 'drag');
		target.style.transform = 'translate(0px, 0px)';
		target.removeAttribute('data-x');
		target.removeAttribute('data-y');
	});

	interact('.card').on('dragstart', function (event) {
		let target = event.target;
		target.classList.add('onTop', 'drag');
	});
});
