document.addEventListener('DOMContentLoaded', () => {
	const modal = document.querySelector('.modal');
	const addBtn = document.getElementById('addTask');
	const add = modal.querySelector('#add');
	const deleteAll = document.querySelector('#delete');
	const cancel = modal.querySelector('#cancel');
	const todoTasks = document.querySelector('.todo .tasks');
	const doneTasks = document.querySelector('.done .tasks');

	let tasks = [];

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
		document.querySelector('.done .tasks').innerHTML = '';
		tasks = JSON.parse(localStorage.getItem('tasks'));

		[...tasks].forEach((task, index) => {
			if (task.status === 'completed') {
				tasks.splice(index, 1);
			}
		});

		localStorage.setItem('tasks', tasks);
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
			todoTasks.innerHTML = '';
			doneTasks.innerHTML = '';
			for (let i of tasks) {
				console.log(i.status);
				if (i.status === 'completed') {
					cardCreate(
						i.title,
						i.category,
						i.day,
						i.priority,
						i.level,
						doneTasks
					);
				} else if (i.status === 'todo') {
					cardCreate(
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

	function cardCreate(title, cat, date, priority, level, parent) {
		let card = document.createElement('div');

		card.classList.add('card');

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

	function updateState(text, newState) {
		let tasks = JSON.parse(localStorage.getItem('tasks'));
		console.log(
			JSON.stringify(tasks[0].id),
			JSON.stringify(CryptoJS.SHA1(text))
		);
		for (let i of tasks) {
			if (JSON.stringify(i.id) === JSON.stringify(CryptoJS.SHA1(text))) {
				i.status = newState;
			}
		}
		localStorage.setItem('tasks', JSON.stringify(tasks));
	}

	add.addEventListener('click', (_) => {
		modal.classList.remove('popUp');

		let title = modal.querySelector('#ttitle');
		let cat = modal.querySelector('#tag');
		let date = modal.querySelector('#day');
		let priority = modal.querySelector('#prioripty');
		let level = modal.querySelector('#level');

		let task = {
			id: CryptoJS.SHA1(title.value),
			title: title.value,
			category: cat.value,
			day: date.value,
			priority: priority.value,
			level: level.value,
			status: 'todo',
		};

		savetask(task);

		cardCreate(
			title.value,
			cat.value,
			date.value,
			priority.value,
			level.value,
			todoTasks
		);
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
				updateState(
					event.relatedTarget.children[0].textContent,
					'completed'
				);
			} else {
				event.relatedTarget.classList.remove('completed');
				updateState(
					event.relatedTarget.children[0].textContent,
					'todo'
				);
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
