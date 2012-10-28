var myport = 3000
, fs = require('fs')
, socket = require('socket.io').listen(myport + 1)// must have '+ 1' or throws error
, http = require('http')
, fs_get = function(file, complete) {fs.readFile(file,'utf8',complete); console.log(file)}
, server = http.createServer()
, chit_chat = socket.of('/chitChat')
, connected = false
, fname = ''
, dataCnt = 0
, dname = ''
, objData = []
, str = ''
, objToString = function(obj,varname){    //changes ojects sent by client to string for writing to file
     str = "var " + varname + "={";
	 for (var p in obj) 
	{
        if (obj.hasOwnProperty(p)) 
		{
            str += p + ':{' ;
			if(typeof(obj[p])== "object")
			{
				for (var r in obj[p])
				{
					str += r + ":\"" + obj[p][r] + "\",";
				}
				str = str.substr(0,str.length-1);
			}
			str += "},";
        }
    }
	str = str.substr(0,str.length-1);
	str += "};";
    return str;
}
// reset vars for op complete or abort
, resetConn = function(){
	dataCnt=0;
	objData=[];
	dname = '';
	//connected = false;
	console.log("data reset");
}
;
socket.set('log level', 1);
chit_chat.on('connection', function(cli){
	var _socket = this; //whats this?
	cli.emit('hello',{message:"hello"});
	//wait for client to confirm connection then return message "hello" to client so that it can initiate
	cli.on('hello', function(message){if(message["message"] == "ack"  || message["message"] == "hello"){
		resetConn();
		
		connected=true;
		}
		
	});
	// gets info from client so that it can write file. "file name" "obj var name" "obj data" (may be multiple objs for same file) finally "write" needs error checking
	if(connected){
		cli.on('fname',function(message){fname= message["message"];cli.emit('fname',{message:"ack"});console.log("fname Sent");});
		cli.on('dname',function(message){dname= message["message"];cli.emit('dname',{message:"ack"});console.log("dname Sent");});
		cli.on('data',function(message){objData[dataCnt] = objToString(message["message"],dname);cli.emit('data',{message:"ack"});console.log("data# " + dataCnt.toString())+ " sent";dataCnt++});
		cli.on('done',function(message){
			if(message["message"] == "write")fs.writeFile(fname,objData.join("\n"));
			cli.emit('done',{message:"ack"});
			console.log("done Sent------------");
			resetConn();
		});
	}
});


server.listen(myport, function(){
  //console.log("number chat on port %p",myport);
})



