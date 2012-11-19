var curBlockObj = new Object;

function loadFile(obj)
{
	var file = parts[obj.value][partsCols['number']];
	var jq = document.createElement('script');
	$("#mainpic")[0].src = "";
	$("#partPic")[0].src =  "";
	blockData =[];
	jq.type = 'text/javascript';
	jq.async = true;
	jq.src = './js/_' + file + '.js';
	s=document.head.getElementsByTagName('script')[0];
	document.head.replaceChild(jq,s);
	$("#mainpic")[0].src = "./images/"+file+".jpg";
	$("#partPic")[0].src = "./images/"+file+" small.jpg";
	$("div.blocks").remove();
	wait("loadParts()");
}

function loadParts()
{
	if(typeof(blockData)=="object")
	{
		var blockCnt = 0;
		var mkBlocktxt="";
		for(var block in blockData)
		{
			b = blockData[block];
			mkBlocktxt="<div id='block"+blockCnt.toString()+"' class='blocks' onclick='" + b.onclick + "'></div>";
			$( "#blocks" ).after(mkBlocktxt);
			curBlockObj =document.getElementById("block"+blockCnt.toString());
			curBlockObj.value = b.Balloon;
			$( "#" + curBlockObj.id ).attr("title",parts[curBlockObj.value][partsCols["desc"]] + "\n" + parts[curBlockObj.value][partsCols["number"]]);
			$( "#" + curBlockObj.id ).height(b.H);
			$( "#" + curBlockObj.id ).width(b.W);
			$( "#" + curBlockObj.id ).offset({left:$("#mainpic").offset().left + parseInt(b.X),top:$("#mainpic").offset().top + parseInt( b.Y)});
			$( "#" + curBlockObj.id ).tooltip();
			blockCnt++;
		}
	}
}

function partsClick(obj)
{
	if(typeof(parts[obj.value]['img']) == "undefined")parts[obj.value]['img']= parts[obj.value][partsCols['number']] + ".jpg";
	showDesc(parts[obj.value][partsCols['number']],parts[obj.value][partsCols['desc']],parts[obj.value][partsCols['qty']],parts[obj.value]['img']);
}

function showDesc(number,desc,qty,img)
{
	$("#descNumber").text('Part#: ' + number);
	$("#descDesc").text('Description; ' + desc);
	$("#descQty").text('Quantity: ' + qty);
	$("#partPic")[0].src= "./images/"+ img;
}

function showList()
{
document.location="ShowList.htm"
}

function ordList()
{
document.location="OrderList.htm"
}

function addList(cname)
{
	partI=document.getElementById('part#').value.split("\n")
	cValue="HSR30."+partI[1].substr(partI[1].indexOf(":")+1)+"."+partI[3].substr(partI[3].indexOf(":")+1)
	var b=-1;
	var cookExp=new Date()
	cookAll=document.cookie.split("^")
	cookExp.setDate(cookExp.getDate()+9999)
	cookPath="/service/HS-R30/parts"
	for(a in cookAll){
		if(cookAll[a].search(cname+"=")>-1)b=a
	}
	c=a
	if(b!=-1){
		cook=cookAll[b].substring(cookAll[b].indexOf("=")+1)
		cook=unescape(cook)
		parts=cook.split(",")
		dup=0
			for(a in parts){
				data=parts[a].split(".")
				if(partI[1].substr(partI[1].indexOf(":")+1)==data[1]) dup=1
			}
		if(dup==0)parts.push(cValue)
		cValue=parts.join(",")
	}else{
		cookAll.join("").indexOf("=")==-1?b=0:b=++c
	}
	cookAll[b]=cname+"="+escape(cValue)
	var cookFinal=cookAll.join("^")
	//alert(cookFinal)
	document.cookie=cookFinal//+";path="+cookPath+";expires="+cookExp+"secure=0"
}

function wait(func)
{
var t=setTimeout(func,200)
};


