const info = (...prams) => {
	console.log(...prams)
}

const error = (...prams) => {
	console.error(...prams)
}

module.exports = {
	info,
	error
}
