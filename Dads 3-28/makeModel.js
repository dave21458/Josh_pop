var mongoose = require('mongoose'),

make_model = function(conn,name,schema,cb)
{
	var error ={error:false,message:""};
	if(!name){error.message = "schema Name required";error.error=true}
	if(error.error)return cb(null,error);
	return cb(conn.model(name,schema),false);
};

module.exports = make_model;