var fs = require('fs'),
path = require("path"),
destName="",
args="";
//make sure there is source file arg.
//Use comma sep args. this allows for file names with spaces.
if(process.argv.length < 3)
{
	console.log("Usage: node csv2array.js source[,destination]");
	return;
}
//combine all args then split by comma
for(cnt=2;cnt<process.argv.length;cnt++)args+=process.argv[cnt]+" ";
var fnames=args.split(",");
var srcName=fnames[0].trim();
//if no dest file arg then use src file base name
fnames.length > 1 ? destName=fnames[1].trim():destName=path.basename(srcName,".csv")+".js";
//read csv file
fs.readFile(srcName,function(err,file)
{
	if(err) 
	{  
        console.log("open file error " + srcName); 
        return;  
    } 
	//split into lines of csv
	var lines=file.toString().split(String.fromCharCode(0x0d,0x0a));
	//split 1st line (column descriptions) to define  'partsCols' object 
	var cols=lines[0].split(",");
	var arrDef = "var partsCols={";
	for(cnt=1;cnt<cols.length;cnt++)arrDef += '"c' + cnt.toString() + '":"' + cols[cnt] + '",';
	arrDef = arrDef.substr(0,arrDef.length-1) + "};\n";
	//split remaining lines to def 'parts' object
	arrDef += "var parts={";
	for(cnt=1;cnt < lines.length;cnt++)
	{
		var vals=lines[cnt].split(",");
		if(vals.length > 1)
		{
			arrDef += '"'+vals[0]+'":{';
			for(cnt1=1;cnt1<vals.length;cnt1++)
			{
				arrDef += '"' + cols[cnt1] + '":"' + vals[cnt1] + '"';
				if(cnt1 < vals.length -1)arrDef+=",";
			}
			arrDef += "}";
			if(lines[cnt+1].length > 1)arrDef+=",";
		}
	}
	arrDef += "};";
	//create dest js file and write object defs
	fs.writeFile(destName,arrDef);
})