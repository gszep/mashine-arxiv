function delayedLoop(delay,i,callback) {
	setTimeout( () => {

		callback(i-1)

		if (1<i) delayedLoop(delay,i-2,callback)
	}, delay)
}

export { delayedLoop as default }
