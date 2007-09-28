/* 
Developers:Asier Sarasua Garmendia 2007This is Free Software (GPL License)asarasua@vitoria-gasteiz.org
*/

//Hurrengo bi lerroek Euskalbarren direktorio nagusiaren URIa eskuratzen dute
const idStats = "euskalbar@interneteuskadi.org";
var extNonStats = Components.classes["@mozilla.org/extensions/manager;1"]
                    .getService(Components.interfaces.nsIExtensionManager)
                    .getInstallLocation(idStats)
                    .getItemLocation(idStats);

//Estatistiken fitxategia idazten du
function writeStats(dict) {
  var URLStats = extNonStats.clone();
  URLStats.append("stats.txt");
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
  statsArray = txtStats.split(",");
  if(dict == -1){
    //Estatistikak garbitu
    for (n in statsArray){
      statsArray[n] = 0;
    }
  }else{
    //Estatistiken katea arrai batean sartu, aldatu hiztegiari dagokion balioa eta berriro katea bihurtu
    var zkia = statsArray[dict]*1;
    statsArray[dict] = zkia+1;
  }
  txtStats = statsArray.join(",");

  //Fitxategia idatzi
  var statout = Components.classes['@mozilla.org/network/file-output-stream;1']
						.createInstance(Components.interfaces.nsIFileOutputStream);
  statout.init(URLStats,0x02 | 0x08 | 0x20, 0664, 0);
  statout.write(txtStats, txtStats.length);
  statout.flush();
  statout.close();

  if(dict == -1){
    //Leihoko lerro guztietan zero zenbakia idatzi (estatistikak garbitu)
    var tree = document.getElementById("zuhaitza");
    var colstats = tree.columns.getNamedColumn("stats-count");
    for (f=0;f<=16;f++){
      tree.view.setCellText(f,colstats,0);
    }
  }
}

//Estatistikak leihoan erakusten ditu
function setBalioak() {
  var statsText = window.arguments[0];
  statsArray = statsText.split(",");
  var tree = document.getElementById("zuhaitza");
  var colstats = tree.columns.getNamedColumn("stats-count");
  for (f in statsArray){
    tree.view.setCellText(f,colstats,statsArray[f]);
  }
  window.sizeToContent();
}


/*/Estatistiken fitxategia idazten du
function writeStats(dict) {
  var RDF = Components.classes['@mozilla.org/rdf/rdf-service;1'].getService();
  RDF = RDF.QueryInterface(Components.interfaces.nsIRDFService);

  var dsource;
  var statstree=document.getElementById("zuhaitza");
  var sources=statstree.database.GetDataSources();

  if (sources.hasMoreElements()){
    dsource=sources.getNext();
  }
  dsource=dsource.QueryInterface(Components.interfaces.nsIRDFDataSource);

  var rstats = RDF.GetResource('http://www.euskalbar.org/stats');
  var reuskalterm = RDF.GetResource('http://www.euskalbar.org/stats/euskalterm');

var target = ds.GetTarget(rstats, reuskalterm, true);
target = target.QueryInterface(Components.interfaces.nsIRDFLiteral);
// expect 'tres cool'
alert('target is ' + target.Value + '!');

}*/


