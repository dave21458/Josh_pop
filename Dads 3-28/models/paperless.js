
module.exports =
{
	connection:{
		"host": "localhost"
		, "db" : "db_Import"
		, "user" : null
		, "pass" : null		
	}
	,schema:{
		docs:{name : "documents" , props :{ "fileDesc" : String, "clipped" : Object, "fileLocation":String, "fileDate" : Date, "ref":String , "docDate" : Date, "tree":Array } }
		,folds:{name: 'folders' , props : {'ref' : String, 'label' : String, 'tree':Array, 'files':Array}}
		,draws:{name : 'drawers' , props : {'ref' : String, 'label' : String, 'folders' : Array}}
		,cabs:{name : 'cabinets' , props : {'ref' : String, 'label' : String, 'drawers' : Array}}
		,tag :{  name : 'tags' , props : [ { prop : String, label : String, value : String }] } 
	}
}