require('shelljs/global')

const folder 	= "sources"

var inputs = []

// const olympName = "olympName"//"a1b2c3"
// const taskNum 	= "taskNum"//"5"
// const userId	= "userId"//"25"


function atDir(dir, fun, ret) {
	cd(dir)
	var return_value = fun()
	if (!ret){
		var count = (dir.match(/[^\.]\//g) || []).length
		for (var i = 0; i < count; i++) {
			cd('../')
		}
	} else {
		cd(ret)
	}
	return return_value
}

function compile() {
	echo("Compiling...")
	var files = ls('*.cpp')
	console.log( ls().stdout )
	var compile_code = exec('g++ '+ files).code
	console.log( ls().stdout )
	echo("Compiling finished")
	return compile_code ? {"error":"Compile error"} : null
}

function run() {
	echo("Running...")
	inputs = atDir('../inputs/', () => {
		return ls('*.txt')
	}, '-').cat().stdout.split('\n')
	
	var error
	for(var key in inputs)
		if(inputs[key]){
			var err = exec('cat ../inputs/' + inputs[key] + ' | ./a.out > output' + (1+parseInt(key)) + '.txt')
			if(err.code){
				error = {"id":(parseInt(key)+1), "error": "Runtime error"};
				break
			}
		}
	
	echo("Running finished")
	return error || null
}

function check() {
	echo("Checking tests...")

	var outputs = atDir('../outputs/', () => {
		return ls('*.txt')
	}, '-').cat().stdout.split('\n')

	error = {"id":0, "error": "Incorrect answer"}
	
	for(var key in inputs)
		if(outputs[key])			
			if(exec('diff ../outputs/' + outputs[key] + ' output' + (1+parseInt(key)) + '.txt') != 0){
				// console.log((parseInt(key)+1) + " test error")
				error.id = parseInt(key)+1
				break
			}
	

	echo("Checking tests finished")
	return error.id ? error : null
}

module.exports = (olympName, taskNum, userId, _finally) => {
	var dir = [folder, olympName, taskNum, userId].join("/") + "/"

	let error = atDir(dir, compile)
	if(!error){
		error = atDir(dir, run)
		if(!error){
			error = atDir(dir, check)
		}
	}
	
	// console.log(error)
	_finally(error ? error : null)
}