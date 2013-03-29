var fs = require('fs'),
mongoose = require('mongoose'),

get_schema = function get_schema(path,fileName,cb)
{
	//if(!path || !fileName)return ;
	var error ={error:false,message:""};
	file = path + fileName;
	if(!fs.existsSync(file))file += ".schema";
	if(!fs.existsSync(file) || fileName.length===0){error.message = "SchemaFile " + file + " does not exist";error.error = true}
	if(error.error)return cb(null,error);
	return cb(new mongoose.Schema(require(file)),false);
};
module.exports = get_schema;