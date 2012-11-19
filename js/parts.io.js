var conn = {
	server : 'localhost'
	, timeoutCnt : 0
	, timeoutCntMax : 10 //-- Time out stuff-->
	, connected : false //-- data flags -->
	, fnameSent : false
	, dnameSent : false
	, dataSent : false
	, doneSent : false 
	, dataToSend : [] //-- prep of data to send --->
	, dataNamesToSend : []
	, dataSentCnt : 0
	, fileName : ""
	, sendFname : function(fname){
		conn.chit_chat.emit('fname',{message:fname});
		conn.chit_chat.on('fname',function(message){message['message']=='ack' ? conn.fnameSent = true:conn.fnameSent = false;});}
	, sendDname : function(dname){
		conn.chit_chat.emit('dname',{message:dname});
		console.log(dname + " *");
		conn.chit_chat.on('dname',function(message){message['message']=='ack' ? conn.dnameSent = true:conn.dnameSent = false;});}
	, sendData : function(data){
		conn.chit_chat.emit('data',{message:data});
		console.log(data);
		conn.chit_chat.on('data',function(message){message['message']=='ack' ? conn.dataSent = true:conn.dataSent = false;});}
	, sendWrite : function(){
		conn.chit_chat.emit('done',{message:'write'});
		console.log("doneSent");
		conn.chit_chat.on('done',function(message){message['message']=='ack' ? conn.doneSent = true:conn.doneSent = false;});}
	, sendToServer:function(data,dataNames,fname,cnt){
		if(conn.connected && !conn.fnameSent && cnt == 0)conn.sendFname(fname); //-- filename to write objects to-->
		if(cnt >= 0) //--if cnt -1 all objects sent -->
		{
			if(conn.fnameSent && !conn.dnameSent)conn.sendDname(dataNames[cnt]); //-- array of object var names -->
			if(conn.dnameSent && !conn.dataSent)conn.sendData(data[cnt]);		  //-- array of objects -->
		}
		if(conn.dataSent && !conn.doneSent)conn.sendWrite(); //-- all data sent  do write file -->
	}
	, resetConn:function (){
		conn.fnameSent = false;
		conn.dnameSent = false;
		conn.dataSent = false;
		conn.doneSent = false;
		conn.dataSentCnt = 0;
		conn.timeoutCnt = 0;
		//connected = false;
	}
	, sendServerLoop:function(){
		var t=setTimeout(function(){ //-- give time for server to send ack -->
			if(conn.dataSent && conn.dataSentCnt >= 0)conn.dataSentCnt++; //-- if obj var and object sent send next ones-->
			if(conn.dataSentCnt === conn.dataToSend.length)conn.dataSentCnt = -1; //-- if all objects sent send -1 flag to sender via cnt -->
			if(conn.dataSentCnt >= 0 && conn.dataSent)
			{
				conn.dataSent=false; //-- clear flags to send next object -->
				conn.dnameSent=false;
			}
			if(!conn.doneSent){ //-- if not finished after time out call sender -->
				conn.sendToServer(conn.dataToSend,conn.dataNamesToSend,conn.fileName,conn.dataSentCnt);
				if(conn.timeoutCnt++ > conn.timeoutCntMax) //-- if more than max timeouts sender failed -->
				{
					alert("timeout");
					conn.resetConn();
					}else{
						conn.sendServerLoop(); //-- keep trying -->
					}
			}else{
				alert("data sent and written"); //-- Hey it worked! -->
				conn.resetConn();
			}
		},50);
	}
	, connect:function(pipe,port){
		conn.chit_chat = io.connect(conn.server + pipe,{port:port});
		conn.chit_chat.on('hello',function(message){if(message.message == 'hello')conn.connected=true;conn.chit_chat.emit('hello',{message:'hello'});});
	}
};
