var fs = require('fs'),
 mongoose = require('mongoose'),
 format = require('util').format,
 _ = require('underscore'),
 get_schema = require('./getSchema'),
 make_model = require('./makeModel'),
 make_connection = require('./makeConnection'),
 makedb =function makedb(collectionName,connectionFile,schemaFile,filePath)
 {
	collectionName = collectionName || makedb.CollectionName;
	connectionFile = connectionFile || makedb.ConnectionFile;
	schemaFile = schemaFile || makedb.SchemaFile;
	filePath = filePath || makedb.FilePath;
	if(!collectionName || !connectionFile || !schemaFile || !filePath)return makedb;
	
	makedb.connection = make_connection(filePath,connectionFile,function(conn,er)
	{
		if(er.error)return er.message;
		return conn;
	});
	if(!_.isObject(makedb.connection)){makedb.error=true;makedb.message=makedb.connection;makedb.connection=null;return null}
	
	makedb.schema = get_schema(filePath,schemaFile,function(schema,er)
	{
		if(er.error)return er.message;
		return schema;
	});
	if(!_.isObject(makedb.schema)){makedb.error=true;makedb.message=makedb.schema;makedb.schema=null;return null}
	
	makedb.model = make_model(makedb.connection,collectionName,makedb.schema,function(model,er)
	{
		if(er.error)return er.message;
		return (model);
	});
	if(!_.isObject(makedb.model)){makedb.error=true;makedb.message=makedb.model;makedb.model=null;return null}
	return _.clone(makedb);
};	

makedb.prototype.error =false;
makedb.prototype.message = "";
makedb.CollectionName = "";
makedb.ConnectionFile ="";
makedb.SchemaFile = "";
makedb.FilePath = './models/';
makedb.prototype.connection ={};
makedb.prototype.schema={};
makedb.prototype.model={};

module.exports = makedb;
//db = require('./opendb');db.SchemaFile='cabs';db.CollectionName = 'cabinets';db.ConnectionFile = 'paperless';
//db1 = require('./opendb');db1.SchemaFile='draws';db1.CollectionName = 'drawers';db1.ConnectionFile = 'paperless';
//db2 = require('./opendb');db2.schemaFile='tags';db1.collectionName = 'company';db1.connectionFile = 'company';