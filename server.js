/*
Module initialising server with site and reatime socket.
2017. G. Szep
 */

// serve app with views and static files
console.log('[Node] Configuring Site')
const Site = require('./site'),
	site = new Site()

// setup realtime i/o on socket
const server = require('http').Server(site),
	socket = require('socket.io')(server)

server.listen(80)
console.log('[Node] Socket Established')
