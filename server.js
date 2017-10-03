/*
Module initialising server with site and reatime socket.
2017. G. Szep
 */

// serve app with views and static files
console.log('[Node] Configuring Application')
const App = require('./app'),
	app = new App()

// setup realtime i/o on socket
const server = require('http').Server(app)
server.listen(8000)
console.log('[Node] HTTP Server Listening')
