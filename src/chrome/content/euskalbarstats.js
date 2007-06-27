/* 
Developers:Asier Sarasua Garmendia 2007This is Free Software (GPL License)asarasua@vitoria-gasteiz.org
*/


/*Estatistiken fitxategia idazten du*/function writeStats(dict) {  var URLStats = extNon.clone();  URLStats.append("html");  URLStats.append("stats.txt");	    /*Estatistiken fitxategia ireki eta irakurri*/  var statfis = Components.classes["@mozilla.org/network/file-input-stream;1"]                        .createInstance(Components.interfaces.nsIFileInputStream);  var statsis = Components.classes["@mozilla.org/scriptableinputstream;1"]                        .createInstance(Components.interfaces.nsIScriptableInputStream);  statfis.init(URLStats, -1, 0, 0);  statsis.init(statfis);  var txtStats = statsis.read(statfis.available());  statsis.close();  statfis.close();
  /*Estatistiken katea arrai batean sartu, aldatu hiztegiari dagokion balioa eta berriro katea bihurtu*/
  statsArray = txtStats.split(",");
  var zkia = statsArray[dict]*1;
  statsArray[dict] = zkia+1;
  txtStats = statsArray.join(",");

  /*Fitxategia idatzi*/
  var statout = Components.classes['@mozilla.org/network/file-output-stream;1']
						.createInstance(Components.interfaces.nsIFileOutputStream);
  statout.init(URLStats,0x02 | 0x08 | 0x20, 0664, 0);
  statout.write(txtStats, txtStats.length);
  statout.flush();
  statout.close();}	
