/*
Developers:
Asier Sarasua Garmendia 2007
This is Free Software (GPL License)
asarasua@vitoria-gasteiz.org
*/

with (euskalbarLib) {

  euskalbar.stats = {

    /* Euskalbarren direktorioa sortzen du erabiltzailearen profilean eta
     * horren barruan stats.rdf fitxategia kopiatzen du (aurretik ez badago) */
    createStatsFile: function () {
      var ebProfileDir = euskalbar.profileURI;
      ebProfileDir.append("euskalbar");

      if (!ebProfileDir.exists()) {
        ebProfileDir.create(0x01, 0755);
      }

      var ebProfileStatsFile = ebProfileDir.clone();
      ebProfileStatsFile.append("stats.rdf");

      if (ebProfileStatsFile.exists()) {
        ebProfileStatsFile.remove(false);
      }

      try {
        var statsFileURL = "chrome://euskalbar/content/stats.rdf";
        var statsFile = FileIO.getLocalSystemURI(statsFileURL)
                              .QueryInterface(Ci.nsIFileURL).file;
        statsFile.copyTo(ebProfileDir, "stats.rdf");
      } catch (e) {
        console.log(e);
      }
    },

    //Funtzio honek stats.rdf fitxategiaren URLa pasatzen dio stats.xul fitxategian sortu den zuhaitzari
    setDS: function () {
      var ios = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
      var fileHandler = ios.getProtocolHandler("file").QueryInterface(Components.interfaces.nsIFileProtocolHandler);

      var URLStatsS = euskalbar.profileURI.clone();
      URLStatsS.append("euskalbar");
      URLStatsS.append("stats.rdf");
      var URL = fileHandler.getURLSpecFromFile(URLStatsS);
      var zuhaitza = document.getElementById("zuhaitza");
      zuhaitza.setAttribute("datasources", URL);
    },

    // Aldaketak idazten ditu stats.rdf fitxategian
    writeStats: function (dict) {
      var URLStatsW = euskalbar.profileURI.clone();
      URLStatsW.append("euskalbar");
      URLStatsW.append("stats.rdf");
      // Estatistiken fitxategia ireki eta irakurri
      var statfis = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);
      var statsis = Components.classes["@mozilla.org/scriptableinputstream;1"].createInstance(Components.interfaces.nsIScriptableInputStream);

      statfis.init(URLStatsW, -1, 0, 0);
      statsis.init(statfis);
      var txtStats = statsis.read(statfis.available());
      statsis.close();
      statfis.close();

      var statsArray = txtStats.split("<stats:localstat>");
      var txtStatsNew = statsArray.shift();
      //Fitxategia manipulatu
      if (dict == -1) {
        for (i in statsArray) {
          txtStatsNew = txtStatsNew + "<stats:localstat>0</stats:localstat>" + statsArray[i].split("<\/stats:localstat>")[1];
        }
        //RDF fitxategia birkargatu
        var tree = document.getElementById("zuhaitza");
        tree.setAttribute("datasources", "");
        this.setDS();
      } else {
        var elArray = statsArray[dict].split("<\/stats:localstat>");
        var element = (elArray[0] * 1 + 1) + "</stats:localstat>" + elArray[1];
        statsArray.splice(dict, 1, element);
        txtStatsNew = txtStatsNew + "<stats:localstat>" + statsArray.join("<stats:localstat>");
      }

      //Fitxategia idatzi
      var statout = Components.classes['@mozilla.org/network/file-output-stream;1'].createInstance(Components.interfaces.nsIFileOutputStream);

      /* Erroreak kudeatzeko egitura: erabiltzailearen profilean dagoen
       * stats.rdf fitxategian estatistikak ezin badira idatzi (normalean
       * fitxategia irakurtzeko soilik delako), try catch erabiliz ez da
       * Euskalbar blokeatzen */
      try {
        statout.init(URLStatsW, 0x04 | 0x08 | 0x20, 0664, 0);
        statout.write(txtStatsNew, txtStatsNew.length);
        statout.flush();
        statout.close();
      } catch (e) {}

    },

  };

}
