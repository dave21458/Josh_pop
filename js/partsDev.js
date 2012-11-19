var blockData ={}
, blockCnt = 0
, editing = false
, curBlockObj = ""
, partValid = false
, dfltClick = 'partsClick(this)'
, dfltJsDir = "./js/"
, dfltImgDir = "./images/"
, projectDir = "./"
, dfltProject = 'HS-R30'
;

function getFiles()
{
	var jq = document.createElement('script');
	$("#mainpic")[0].src = "";
	$("#partpic")[0].src =  "";
	blockData =[];
	jq.type = 'text/javascript';
	jq.async = true;
	jq.src = './js/_' + $("#files")[0].value + '.js';
	s=document.head.getElementsByTagName('script')[0];
	document.head.replaceChild(jq,s);
	$("#mainpic")[0].src = "./images/"+$("#files")[0].value+".jpg";
	$("#partpic")[0].src = "./images/"+$("#files")[0].value+" small.jpg";
	$("div.blocks").remove();
	blockCnt = 0;
	$( "#add" ).removeAttr("disabled");
	conn.fileName = "_" + $("#files")[0].value + '.js';
	wait("dispblockData()");
}

function makeBlock(X,Y)
{
	var mkBlocktxt="<div id='block"+blockCnt.toString()+"' class='blocks' ondblclick='blockClick(this)' value='0' style= 'width;23;height;23'></div>";
	$( "#blocks" ).after(mkBlocktxt);
	curBlockObj=document.getElementById("block"+blockCnt.toString());
	$( "#" + curBlockObj.id ).draggable({stop:function(e,ui){$("#balloon").focus();}});
	$( "#" + curBlockObj.id ).resizable({stop:function(e,ui){$("#balloon").focus();}});
	$( "#" + curBlockObj.id ).height(23)
	$( "#" + curBlockObj.id ).width(23)
	$("#" + curBlockObj.id ).offset({left:X,top:Y});
	blockCnt++;
	$( "#add" ).attr({disabled:"disabled"});
	$( "#remove" ).removeAttr("disabled");
	editing = true;
	$(".blocks").tooltip();
	$(".blocks").tooltip("disable");
	$( "#balloon" ).removeAttr("disabled");
	$("#balloon").focus();
}

function remakeBlocks()
{
	$(".blocks").remove();
	blockCnt=0;
	for(var a in blockData)
	{
		makeBlock(100,200);
		$( curBlockObj).offset({top:parseInt(blockData[blockCnt-1]["Y"]) + $("#mainpic").offset().top,left:parseInt(blockData[blockCnt-1]["X"]) + $("#mainpic").offset().left});
		$( curBlockObj).width(blockData[blockCnt-1]["W"]);
		$( curBlockObj).height(blockData[blockCnt-1]["H"]);
		$("#balloon")[0].value=blockData[blockCnt-1]["Balloon"];
		setBlock();
	}
}

function setBlock()
{
	if(editing)
	{
		$( "#add" ).removeAttr("disabled");
		editing = false;
		$(".blocks").tooltip("enable");
		curBlockObj.value=$("#balloon")[0].value;
		blockClick(curBlockObj);
		$("#balloon")[0].value="";
		$( "#setBlock" ).attr({disabled:"disabled"});
		var bl = $(curBlockObj);
		bl.attr("title",parts[curBlockObj.value][partsCols["desc"]] + "\n balloon #" + curBlockObj.value );
		blockData[curBlockObj.id.substr(5)]={"X": (bl.offset().left-$("#mainpic").offset().left).toString(),"Y":(bl.offset().top-$("#mainpic").offset().top).toString(),"H":bl.height(),"W":bl.width(),"Balloon":curBlockObj.value};
		if(typeof(blockData[curBlockObj.id.substr(5)].onclick) == 'undefined')blockData[curBlockObj.id.substr(5)].onclick= dfltClick;
		$( "#remove" ).attr({disabled:"disabled"});
		partValid=false;
		$("#balloon").attr({disabled:"disabled"});
	}
}

function removeBlock()
{
	var ind = curBlockObj.id.substr(5);
	$(curBlockObj).remove();
	blockCnt--;
	if(typeof(blockData[ind]) !== "undefined")
	{
		blockData.splice(ind,1);
		remakeBlocks();
	}
	$("#balloon")[0].value="";
	$( "#setBlock" ).attr({disabled:"disabled"});
	$( "#remove" ).attr({disabled:"disabled"});
	$( "#add" ).removeAttr("disabled");
	editing=false;
}

function blockClick(obj)
{
	if(!editing)
	{
		disabled=$(obj).resizable("option", "disabled");
		$(obj).resizable("option", "disabled", !disabled);
		disabled=$(obj).draggable("option", "disabled");
		$(obj).draggable("option", "disabled", !disabled);
		if(disabled)
		{
			curBlockObj=obj;
			$( "#balloon" ).removeAttr("disabled");
			$("#balloon")[0].value=obj.value;
			$( "#add" ).attr({disabled:"disabled"});
			$( "#remove" ).removeAttr("disabled");
			editing = true;
			$(".blocks").tooltip("disable");
			if(validatePart(obj))showData(true,obj);
		}
	}
}

function showData(show,obj)
{
	$("#descItem").text("Item: ");
	$("#descNumber").text("Part #: ");
	$("#descDesc").text("Description: ");
	$("#descQty").text("Quantity: ");
	$("#partpic")[0].src = "";
	if(show)
	{
		$("#descItem").text($("#descItem").text() + obj.value);
		$("#descNumber").text($("#descNumber").text() + parts[obj.value][partsCols["number"]]);
		$("#descDesc").text($("#descDesc").text() + parts[obj.value][partsCols["desc"]]);
		$("#descQty").text($("#descQty").text() + parts[obj.value][partsCols["qty"]]);
		typeof(parts[obj.value]["img"])=="undefined"?$("#partpic")[0].src = "./images/" + parts[obj.value][partsCols["number"]] + ".jpg":$("#partpic")[0].src = "./images/" + parts[obj.value]["img"];
	}
}

function validatePart(obj,e)
{
	//if(editing)
	{
		var valid=!(typeof(parts[obj.value])=="undefined");
		valid ? $( "#setBlock" ).removeAttr("disabled"):$( "#setBlock" ).attr({disabled:"disabled"});
		partValid=valid;
		if(typeof(e) !== "undefined")if(e.keyIdentifier=="Enter" && valid)setBlock();
		return valid;
	}
}

function quickBlock(e)
{
	if(editing && validateInput(document.getElementById("balloon")))setBlock();
	if(!editing)makeBlock(e.pageX - 12,e.pageY - 12);
}

function validateInput(obj,e)
{
	var valid=validatePart(obj,e);
	showData(valid,obj);
	return valid;
}

function loadDiaValues()
{
	$("#diaNumber")[0].value= parts[$("#balloon")[0].value][partsCols["number"]];
	$("#diaDesc")[0].value= parts[$("#balloon")[0].value][partsCols["desc"]];
	$("#diaQty")[0].value= parts[$("#balloon")[0].value][partsCols["qty"]];
	if(typeof(blockData[curBlockObj.id.substr(5)]) !== "undefined")if(typeof(blockData[curBlockObj.id.substring(5)]["onclick"])!=="undefined")$("#diaClick")[0].value=blockData[curBlockObj.id.substring(5)]["onclick"];
}

function editButt()
{
	if(partValid)$( "#editPartDialog" ).dialog("open");
	if(!partValid)$( "#addPartDialog").dialog("open");
}

function diaAccept()
{
	var balloon = $("#balloon")[0].value;
	if($("#diaFile")[0].value.substr($("#diaFile")[0].value.lastIndexOf("\\")+1)!=="")parts[$("#balloon")[0].value]["img"]=$("#diaFile")[0].value.substr($("#diaFile")[0].value.lastIndexOf("\\")+1);
	parts[$("#balloon")[0].value][partsCols["number"]]=$("#diaNumber")[0].value;
	parts[$("#balloon")[0].value][partsCols["desc"]]=$("#diaDesc")[0].value;
	parts[$("#balloon")[0].value][partsCols["qty"]]=$("#diaQty")[0].value;
	setBlock();
	$("#balloon")[0].value = balloon;
	blockData[curBlockObj.id.substring(5)]["onclick"]=$("#diaClick")[0].value;
	showData(true,document.getElementById("balloon"));
	$("#diaFile")[0].value="";
	$("#diaNumber")[0].value="";
	$("#diaDesc")[0].value="";
	$("#diaQty")[0].value="";
	$("#balloon")[0].value = "";
	$( "#editPartDialog" ).dialog("close");
	
}

function newAddLoad()
{
	$(".newDia").attr({disabled:"disabled"});
	$("#newItem").removeAttr("disabled");
}

function itemInput(obj)
{
	$(".newDia").attr({disabled:"disabled"});
	if(!validatePart(obj))$(".newDia").removeAttr("disabled");
}

function newAdd()
{
	parts[$("#newItem")[0].value]={};
	parts[$("#newItem")[0].value][partsCols["desc"]]=$("#newDesc")[0].value;
	parts[$("#newItem")[0].value][partsCols["number"]]=$("#newNumber")[0].value;
	parts[$("#newItem")[0].value][partsCols["qty"]]=$("#newQty")[0].value;
	if($("#diaFile")[0].value.length > 0)parts[$("#newItem")[0].value]["img"]=$("#diaFile")[0].value.substr($("#diaFile")[0].value.lastIndexOf("\\")+1);
	$( "#addPartDialog").dialog("close");
}

function wait(func)
{
var t=setTimeout(func,200)
};

function dispblockData()
{
	var cnt=0;
	for(var a in blockData)cnt++;
	if(cnt>0)remakeBlocks();
}
