var fs = require('fs'),
 mongoose = require('mongoose'),
 format = require('util').format,

make_connection = function(path,connFile,cb)
{
	var file = path + connFile;
	var error ={error:false,message:""};
	if(!fs.existsSync(file))file += ".conn";
	if(!fs.existsSync(file) || connFile.length === 0){error.message = "Connection File " + connFile + " does not exist";error.error = true};
	var connData = require(file);
	connData.host = connData.host || 'localhost';
	connData.port = connData.port || '27017';
	connData.options = connData.options || '';
	if(!connData.database){error.message = "No database Name given in Connection File " + connFile;error.error = true};
	var connString = format("mongodb://%s:%s/%s?%s",connData.host,connData.port,connData.database,connData.options);
	if(connData.user)connString = format("mongodb://%s:%s@%s:%s/%s?%s",connData.user,connData,password,connData.host,connData.port,connData.database,connData.options);
	//console.log(connString);
	if(error.error)return cb(null,error);
	var conn = mongoose.createConnection(connString);
	conn.on('error',function(er){
		console.log(er)
	});
	conn.once('open',function(){
		console.log('connected')
	});
	return cb(conn,false);
};

module.exports = make_connection;