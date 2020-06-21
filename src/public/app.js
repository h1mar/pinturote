function init() {
	let mouse = {
		click: false,
		moving: false,
		pos: {
			x: 0,
			y: 0,
		},
		last_pos: false,
	};

	//Setting up canvas
	const canvas = document.getElementById('drawing');
	const context = canvas.getContext('2d');
	let strokeColor = 'black';
	const clearButton = document.getElementById('clear');

	//Get window height & width
	// const width = canvas.width;
	// const height = canvas.height;
	// canvas.width = 400;
	// canvas.height = 400;

	// Possible way to get coordinates inside element without jquery
	// var rect = e.target.getBoundingClientRect();
	// var x = e.clientX - rect.left; //x position within the element.
	// var y = e.clientY - rect.top;  //y position within the element.

	//Set color from select
	function getSelectColor() {
		let select = document.getElementById('colorSelect');
		select.addEventListener('change', (e) => {
			strokeColor = document.getElementById('colorSelect').value;
			console.log(strokeColor);
		});
	}
	getSelectColor();
	//Connecting to socket
	const socket = io();

	clearButton.addEventListener('click', (e) => {
		context.clearRect(0, 0, canvas.width, canvas.height);

		socket.emit('clear_canvas');
	});

	//CLICK DOWN / TOUCH DOWN

	canvas.addEventListener('mousedown', (e) => {
		mouse.click = true;
		console.log('CLICKING!!!!!!!');
	});

	//STOP CLICK / STOP TOUCH

	canvas.addEventListener('mouseup', (e) => {
		mouse.click = false;
		console.log('NO LONGER CLICKING!!!!!!!');
	});

	let rect = canvas.getBoundingClientRect();

	//MOUSE MOVE / TOUCH MOVE

	canvas.addEventListener('mousemove', (e) => {
		mouse.pos.x = e.pageX - rect.left - scrollX;
		mouse.pos.y = e.pageY - rect.top - scrollY;

		// console.log(mouse);
		mouse.pos.x /= rect.width;
		mouse.pos.y /= rect.height;

		mouse.pos.x *= canvas.width;
		mouse.pos.y *= canvas.height;

		mouse.moving = true;
		// console.log(mouse.pos.x, mouse.pos.y);
	});

	//CLEAR THE CANVAS

	socket.on('clear_canvas', () => {
		console.log('Received Clear');
		context.clearRect(0, 0, canvas.width, canvas.height);
		location.reload();
	});

	//Getting data sent from server to client
	socket.on('draw_line', (data) => {
		//Saving data
		const line = data.line;
		context.beginPath();
		context.strokeStyle = line[2];
		context.lineJoin = 'round';
		context.lineCap = 'round';
		context.lineWidth = 5;
		context.moveTo(line[0].x, line[0].y);
		context.lineTo(line[1].x, line[1].y);
		context.stroke();

		console.log(data.line);
	});

	function mainLoop() {
		if (mouse.click && mouse.moving && mouse.last_pos) {
			//Send data to server
			socket.emit('draw_line', {
				line: [mouse.pos, mouse.last_pos, strokeColor],
			});

			console.log('Sending data to server');
			mouse.move = false;
		}
		mouse.last_pos = { x: mouse.pos.x, y: mouse.pos.y };
		setTimeout(mainLoop, 10);
	}
	mainLoop();
}

document.addEventListener('DOMContentLoaded', init);
