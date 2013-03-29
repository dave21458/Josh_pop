//usage 
//Init 1st db
db = require('./opendb');//or db = require('./opendb')('cabinets','paperless','cabs') and skip next 3 lines of code
// set properties for a collection in mongo
db.SchemaFile='cabs';
db.CollectionName = 'cabinets';
db.ConnectionFile = 'paperless';
// create new obj containing db connection,schema and model for cabinets
cabs = db(); // or cabs = db('cabinets','paperless','cabs') and skip last 3 lines of code
// create obj for new document in cabinets
cab = new cabs.model; //or cab = new cabs.model({ref:'1',label:'cab1',...}); and go right to cabs.save()
// set properties for document 
cab.ref = '1';
cab.label = 'cab1';
// save document
cab.save();

// set properties for another collection in mongo
db.SchemaFile='draws';
db.CollectionName = 'drawers';
db.ConnectionFile = 'paperless';
// create new obj containing db connection,schema and model for drawers
draws = db();
// create obj for new document in drawers
draw = new draws.model;
// set properties for document 
draw.ref = '1';
draw.label = 'draw1';
// save document
draw.save();

//Init 2nd db
db.SchemaFile='company';
db.CollectionName = 'companyDb';
db.ConnectionFile = 'company';
comps = db();
comp = new comps.model;
comp.ref = "1";
comp.label = 'DB Importers'
comp.dbName = 'dbimporters'
comp.save();

//all done
cabs.connection.close();
draws.connection.close();
comps.connection.close();