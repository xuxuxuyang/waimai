function obJect(body){
	let arr = Object.keys(body)
	let obj = JSON.parse(arr[0])
	return obj
}

module.exports = {obJect}