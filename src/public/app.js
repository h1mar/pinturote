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

	//Get window height & width
	const width = canvas.width;
	const height = canvas.height;

	// Possible way to get coordinates inside element without jquery
	// var rect = e.target.getBoundingClientRect();
	// var x = e.clientX - rect.left; //x position within the element.
	// var y = e.clientY - rect.top;  //y position within the element.

	//Connecting to socket
	const socket = io();

	canvas.addEventListener('mousedown', (e) => {
		mouse.click = true;
		console.log('CLICKING!!!!!!!');
	});

	canvas.addEventListener('mouseup', (e) => {
		mouse.click = false;
		console.log('NO LONGER CLICKING!!!!!!!');
	});

	let rect = canvas.getBoundingClientRect();

	canvas.addEventListener('mousemove', (e) => {
		mouse.pos.x = e.pageX - rect.left - scrollX;
		mouse.pos.y = e.pageY - rect.top - scrollY;

		// console.log(mouse);
		mouse.pos.x /= rect.width;
		mouse.pos.y /= rect.height;

		mouse.pos.x *= canvas.width;
		mouse.pos.y *= canvas.height;

		mouse.moving = true;
		console.log(mouse.pos.x, mouse.pos.y);
	});

	//Getting data sent from server to client
	socket.on('draw_line', (data) => {
		//Saving data
		const line = data.line;
		context.fillStyle = '#FF0000';
		context.beginPath();
		context.lineWidth = 2;
		context.moveTo(line[0].x, line[0].y);
		context.lineTo(line[1].x, line[1].y);
		context.stroke();

		// console.log(data.line);
	});

	function mainLoop() {
		if (mouse.click && mouse.moving && mouse.last_pos) {
			//Send data to server
			socket.emit('draw_line', { line: [mouse.pos, mouse.last_pos] });
			console.log('Sending data to server');
			mouse.move = false;
		}
		mouse.last_pos = { x: mouse.pos.x, y: mouse.pos.y };
		setTimeout(mainLoop, 25);
	}
	mainLoop();
}

document.addEventListener('DOMContentLoaded', init);
