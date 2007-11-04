/* 
Developers:Asier Sarasua Garmendia 2007This is Free Software (GPL License)asarasua@vitoria-gasteiz.org
*/

//Hurrengo bi lerroek Euskalbarren direktorio nagusiaren URIa eskuratzen dute
const idStats = "euskalbar@interneteuskadi.org";
var extNonStats = Components.classes["@mozilla.org/extensions/manager;1"]
                    .getService(Components.interfaces.nsIExtensionManager)
                    .getInstallLocation(idStats)
                    .getItemLocation(idStats);

//Funtzio honek stats.rdf fitxategiaren URLa pasatzen dio stats.xul fitxategian sortu den zuhaitzari
function setDS() {
  var URLStats = extNonStats.clone();
  URLStats.append("stats.rdf");
  var ios = Components.classes["@mozilla.org/network/io-service;1"]
                    .getService(Components.interfaces.nsIIOService);
  var fileHandler = ios.getProtocolHandler("file")
                     .QueryInterface(Components.interfaces.nsIFileProtocolHandler);
  var URL = fileHandler.getURLSpecFromFile(URLStats);
  var zuhaitza = document.getElementById("zuhaitza");
  zuhaitza.setAttribute("datasources", URL);
}

//Aldaketak idazten ditu stats.rdf fitxategian
function writeStats(dict) {
  var URLStats = extNonStats.clone();
  URLStats.append("stats.rdf");
  //Estatistiken fitxategia ireki eta irakurri
  var statfis = Components.classes["@mozilla.org/network/file-input-stream;1"]
                        .createInstance(Components.interfaces.nsIFileInputStream);
  var statsis = Components.classes["@mozilla.org/scriptableinputstream;1"]
                        .createInstance(Components.interfaces.nsIScriptableInputStream);

  statfis.init(URLStats, -1, 0, 0);
  statsis.init(statfis);
  var txtStats = statsis.read(statfis.available());
  statsis.close();
  statfis.close();

  var statsArray = txtStats.split("<stats:localstat>");
  var txtStatsNew = statsArray.shift();
  //Fitxategia manipulatu
  if(dict == -1){
    for (i in statsArray){
      txtStatsNew = txtStatsNew+"<stats:localstat>0</stats:localstat>"+statsArray[i].split("<\/stats:localstat>")[1];
    }
  }else{
    var elArray = statsArray[dict].split("<\/stats:localstat>");
    var element = (elArray[0]*1+1)+"</stats:localstat>"+elArray[1];
    statsArray.splice(dict, 1, element);
    txtStatsNew = txtStatsNew+"<stats:localstat>"+statsArray.join("<stats:localstat>");
  }

  //Fitxategia idatzi
  var statout = Components.classes['@mozilla.org/network/file-output-stream;1']
						.createInstance(Components.interfaces.nsIFileOutputStream);
  statout.init(URLStats,0x02 | 0x08 | 0x20, 0664, 0);
  statout.write(txtStatsNew, txtStatsNew.length);
  statout.flush();
  statout.close();


  if(dict == -1){
    //Leihoko lerro guztietan zero zenbakia idatzi (estatistikak garbitu)
    var tree = document.getElementById("zuhaitza");
    var colstats = tree.columns.getNamedColumn("stats-count");
    for (f=0;f<20;f++){
      tree.view.setCellText(f,colstats,0);
    }
  }
}
