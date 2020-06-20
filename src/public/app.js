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
	const width = window.innerWidth;
	const height = window.innerHeight;

	//Setting canvas to full windows height & width
	canvas.width = width;
	canvas.height = height;

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

	canvas.addEventListener('mousemove', (e) => {
		mouse.pos.x = e.clientX / width;
		mouse.pos.y = e.clientY / height;
		mouse.moving = true;
		console.log(e.clientX, e.clientY);
	});

	//Getting data sent from server to client
	socket.on('draw_line', (data) => {
		//Saving data
		const line = data.line;
		context.beginPath();
		context.lineWidth = 2;
		context.moveTo(line[0].x * width, line[0].y * height);
		context.lineTo(line[1].x * width, line[1].y * height);
		context.stroke();
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
