module.exports = (io) => {
	//Store past pos
	let line_log = [];

	//Receive data from client
	io.on('connection', (socket) => {
		console.log('New user connected');

		for (let i in line_log) {
			socket.emit('draw_line', { line: line_log[i] });
		}

		socket.on('draw_line', (data) => {
			//Save data sent from client in array
			line_log.push(data.line);
			//Sent data sent in Array
			io.emit('draw_line', { line: data.line });
		});
	});
};
