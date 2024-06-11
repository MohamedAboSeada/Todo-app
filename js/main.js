document.addEventListener('DOMContentLoaded', () => {
	const modal = document.querySelector('.modal');
	const addBtn = document.getElementById('addTask');
	const cancel = modal.querySelector('#cancel');
	const add = modal.querySelector('#add');
	const deleteAll = document.querySelector('#delete');
	deleteAll.addEventListener('click', (_) => {
		document.querySelector('.done .tasks').innerHTML = '';
	});
	tippy(deleteAll,{
		content: "delete completed"
	});
	tippy(addBtn, {
		content: 'add a task',
	});

	addBtn.addEventListener('click', (_) => {
		modal.classList.add('popUp');
	});
	cancel.addEventListener('click', (_) => {
		modal.classList.remove('popUp');
	});

	function cardCreate() {
		let title = modal.querySelector('#ttitle');
		let cat = modal.querySelector('#tag');
		let date = modal.querySelector('#day');
		let priority = modal.querySelector('#prioripty');
		let level = modal.querySelector('#level');

		let card = document.createElement('div');
		card.classList.add('card');
		card.innerHTML = `
        <h2>${title.value}</h2>
        <div class="info">
        <div class="prio">
                            <h3 class="${priority.value}">${date.value}</h3>
                            <div class="prioripty">
                            <div class="circle"></div>
                                <div class="circle"></div>
                                <div class="circle"></div>
                                </div>
                                </div>
                                <h3>${cat.value}</h3>
                                </div>`;

		document.querySelector('.todo .tasks').appendChild(card);
		console.log('it works');
		let priportyLevel = card.querySelector('.prioripty').children;

		// adding level
		if (level.value === 'easy') {
			priportyLevel[0].classList.add(priority.value);
		} else if (level.value === 'moderate') {
			priportyLevel[0].classList.add(priority.value);
			priportyLevel[1].classList.add(priority.value);
		} else {
			priportyLevel[0].classList.add(priority.value);
			priportyLevel[1].classList.add(priority.value);
			priportyLevel[2].classList.add(priority.value);
		}
	}
	add.addEventListener('click', (_) => {
		modal.classList.remove('popUp');
		cardCreate();
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
