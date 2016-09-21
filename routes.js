const render 			= require('./render')
const task_run			= require('./task_run')

const bodyParser 		= require('body-parser')
const fileUpload 		= require('express-fileupload');

const jsonParser 		= bodyParser.json()
const urlencodedParser	= bodyParser.urlencoded({ extended: false })

const folder 			= "sources"

require('shelljs/global')

module.exports = (app) => {
	app.get('/', render('index') )

	app.post('/', urlencodedParser, fileUpload(), function(req, res) {
	    var sampleFile
	 
	    if (!req.files) {
	        res.send('No files were uploaded.')
	        return
	    }
	 
	    sampleFile = req.files.sampleFile
	    // console.log( sampleFile )
	    
	    // TODO: check req.body.olympName, req.body.taskName


	    if (test('-d', [folder, req.body.olympName, req.body.taskName].join("/"))){
		    let user_folder = [folder, req.body.olympName, req.body.taskName, req.body.id].join("/") + "/"
	    	// console.log( user_folder )
			rm("-r", user_folder)
		    mkdir(user_folder)
		    var dir = user_folder + "/" + sampleFile.name


		    sampleFile.mv(dir, function(err) {
		        if (err) {
		            res.status(500).send(err)
		        }
		        else {
		        	task_run(req.body.olympName, req.body.taskName, req.body.id, (err) => {
		            	if(err){
		            		if(err['id'])
		            			res.write(err['id']+": ")
		            		res.write(err['error'])
		            		res.end()
		            	} else
		            		res.send('Great!')
		        	})
		        }
		    });
		} else {
			res.send('Incorrect olympName or/and taskName!')
		}
	});
}