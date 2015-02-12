var CONFIG_DIR,CONFIG_FILE,DEFAULT_ACCOUNT,DEFAULT_HOST,DEFAULT_PASSWD,DEFAULT_PORT,DEFAULT_PROTOCOL,Syno,execute,fs,nconf,os,path,program,syno,url,url_resolved,yaml;CONFIG_DIR=".syno",CONFIG_FILE="config.yaml",DEFAULT_PROTOCOL="https",DEFAULT_HOST="localhost",DEFAULT_PORT=5001,DEFAULT_ACCOUNT="admin",DEFAULT_PASSWD="password",program=require("commander"),fs=require("fs"),url=require("url"),nconf=require("nconf"),path=require("path-extra"),yaml=require("js-yaml"),Syno=require("../dist/syno"),os=require("os"),execute=function(a,b,c){var d,e;program.debug&&console.log("[DEBUG] : Method name configured : %s",b),c.payload&&program.debug&&console.log("[DEBUG] : JSON payload configured : %s",c.payload),c.pretty&&program.debug&&console.log("[DEBUG] : Prettify output detected");try{e=JSON.parse(c.payload||"{}")}catch(f){d=f,console.log("[ERROR] : JSON Exception : %s",d),process.exit(1)}return syno[a][b](e,function(a,b){return a&&console.log("[ERROR] : %s",a),b=c.pretty?JSON.stringify(b,void 0,2):JSON.stringify(b),b&&console.log(b),syno.auth.logout(),process.exit(0)})},program.version("1.0.1").description("Synology Rest API Command Line").option("-c, --config <path>","DSM Configuration file. Default to ~/"+CONFIG_DIR+"/"+CONFIG_FILE).option("-u, --url <url>","DSM URL. Default to "+DEFAULT_PROTOCOL+"://"+DEFAULT_ACCOUNT+":"+DEFAULT_PASSWD+"@"+DEFAULT_HOST+":"+DEFAULT_PORT).option("-d, --debug","Enabling Debugging Output").on("--help",function(){return console.log("  Commands:"),console.log(""),console.log("    filestation|fs [options] <method>  DSM File Station API"),console.log("    downloadstation|dl [options] <method>  DSM Download Station API"),console.log("")}).on("--help",function(){return console.log("  Examples:"),console.log(""),console.log("    $ syno filestation|fs getFileStationInfo"),console.log("    $ syno downloadstation|dl getDownloadStationInfo"),console.log("")}),program.parse(process.argv),0===program.args.length?program.help():program.args.length>0&&"filestation"!==program.args[0]&&"downloadstation"!==program.args[0]&&"fs"!==program.args[0]&&"dl"!==program.args[0]&&(console.log(""),console.log("  [ERROR] : "+program.args[0]+" is not a valid command !"),console.log(""),console.log("  Examples:"),console.log(""),console.log("    $ syno filestation|fs [options] <method> DSM File Station API"),console.log("    $ syno downloadstation|dl [options] <method> DSM Download Station API"),console.log(""),process.exit(1)),nconf.argv.env,program.url?(program.debug&&console.log("[DEBUG] : Params URL detected : %s.",program.url),url_resolved=url.parse(program.url),url_resolved.protocol||(url_resolved=url.parse(DEFAULT_PROTOCOL+"://"+program.url)),url_resolved.protocol=url_resolved.protocol.slice(0,-1),"http"!==url_resolved.protocol&&"https"!==url_resolved.protocol&&(console.log("[ERROR] : Invalid Protocol URL detected : %s.",url_resolved.protocol),process.exit(1)),nconf.overrides({url:{protocol:url_resolved.protocol,host:url_resolved.hostname||DEFAULT_HOST,port:url_resolved.port||DEFAULT_PORT,account:url_resolved.auth?url_resolved.auth.split(":")[0]:DEFAULT_ACCOUNT,passwd:url_resolved.auth?url_resolved.auth.split(":")[1]:DEFAULT_PASSWD}})):program.config?(program.debug&&console.log("[DEBUG] : Load config file : %s",program.config),fs.existsSync(program.config)?nconf.file({file:program.config,format:{stringify:function(a,b){return yaml.safeDump(a,b)},parse:function(a,b){return yaml.safeLoad(a,b)}}}):(console.log("[ERROR] : Config file : %s not found",program.config),process.exit(1))):(fs.existsSync(path.homedir()+("/"+CONFIG_DIR))||(program.debug&&console.log("[DEBUG] : Default configuration file doesn't exist : %s",path.homedir()+("/"+CONFIG_DIR+"/"+CONFIG_FILE)),fs.mkdir(path.homedir()+("/"+CONFIG_DIR),function(a){return a?console.log("[ERROR] : %s",a):(nconf.set("url:protocol",DEFAULT_PROTOCOL),nconf.set("url:host",DEFAULT_HOST),nconf.set("url:port",DEFAULT_PORT),nconf.set("url:account",DEFAULT_ACCOUNT),nconf.set("url:passwd",DEFAULT_PASSWD),program.debug&&console.log("[DEBUG] : Default configuration file created : %s",path.homedir()+("/"+CONFIG_DIR+"/"+CONFIG_FILE)),nconf.save())})),program.debug&&console.log("[DEBUG] : Default configuration file loaded : ~/"+CONFIG_DIR+"/"+CONFIG_FILE),nconf.file({file:path.homedir()+("/"+CONFIG_DIR+"/"+CONFIG_FILE),format:{stringify:function(a,b){return yaml.safeDump(a,b)},parse:function(a,b){return yaml.safeLoad(a,b)}}})),nconf.defaults({url:{protocol:DEFAULT_PROTOCOL,host:DEFAULT_HOST,port:DEFAULT_PORT,account:DEFAULT_ACCOUNT,passwd:DEFAULT_PASSWD}}),program.debug&&console.log("[DEBUG] : DSM Connection URL configured : %s://%s:%s@%s:%s",nconf.get("url:protocol"),nconf.get("url:account"),nconf.get("url:passwd"),nconf.get("url:host"),nconf.get("url:port")),syno=new Syno({protocol:nconf.get("url:protocol"),host:nconf.get("url:host"),port:nconf.get("url:port"),account:nconf.get("url:account"),passwd:nconf.get("url:passwd")}),program.command("filestation <method>").alias("fs").description("DSM File Station API").option("-c, --config <path>","DSM configuration file. Default to ~/"+CONFIG_DIR+"/"+CONFIG_FILE).option("-u, --url <url>","DSM URL. Default to "+DEFAULT_PROTOCOL+"://"+DEFAULT_ACCOUNT+":"+DEFAULT_PASSWD+"@"+DEFAULT_HOST+":"+DEFAULT_PORT).option("-p, --payload <payload>","JSON Payload").option("-P, --pretty","Prettyprint JSON Output").option("-d, --debug","Enabling Debugging Output").on("--help",function(){return console.log("  Examples:"),console.log(""),console.log("    $ syno filestation|fs listSharedFolders"),console.log('    $ syno filestation|fs listFiles --pretty --payload \'{"folder_path":"/path/to/folder"}\''),console.log("")}).action(function(a,b){return program.debug&&console.log("[DEBUG] : DSM File Station API command selected"),execute("fs",a,b)}),program.command("downloadstation <method>").alias("dl").description("DSM Download Station API").option("-c, --config <path>","DSM configuration file. Default to ~/"+CONFIG_DIR+"/"+CONFIG_FILE).option("-u, --url <url>","DSM URL. Default to "+DEFAULT_PROTOCOL+"://"+DEFAULT_ACCOUNT+":"+DEFAULT_PASSWD+"@"+DEFAULT_HOST+":"+DEFAULT_PORT).option("-p, --payload <payload>","JSON Payload").option("-P, --pretty","Prettyprint JSON Output").option("-d, --debug","Enabling Debugging Output").on("--help",function(){return console.log("  Examples:"),console.log(""),console.log('    $ syno downloadstation|dl createTask --payload \'{"uri":"magnet|ed2k|ftp(s)|http(s)://link"}\''),console.log("    $ syno downloadstation|dl listTasks"),console.log("    $ syno downloadstation|dl listTasks --payload '{\"limit\":1}'"),console.log('    $ syno downloadstation|dl getTasksInfo --pretty --payload \'{"id":"task_id"}\''),console.log("")}).action(function(a,b){return program.debug&&console.log("[DEBUG] : DSM Download Station API command selected"),execute("dl",a,b)}),program.parse(process.argv);