// Developers: Juanan Pereira, Asier Sarasua Garmendia 2006
//             Julen Ruiz Aizpuru, Asier Sarasua Garmendia 2007
//             Igor Leturia Azkarate 2008
//             Chetan Thapliyal 2009
// This is Free Software (GPL License)
// juanan@diariolinux.com
// asarasua@vitoria-gasteiz.org
// julenx@gmail.com
// ileturia@gmail.com
// chetan.thapliyal@discreteguidepost.in

    // *************************************
    //  Hiztegien bilaketak
    // *************************************

var euskalbardicts = {

    // Euskaltermen bilaketak egiteko
    goEuskalBarEuskalterm: function(source, term, sub) {
      // Begiratu kutxa hutsik dagoen 
      if (euskalbar.alertEmptyBox(term)){
        return;
      }
      strRes = document.getElementById('leuskal');
      const h = strRes.getString("hizk");
      // interfazearen hizkuntza zehaztu
      if (h.match('euskara')) {
        hiztegiarenhizkuntza = 'eu';
      } else if (h.match('english')) {
        hiztegiarenhizkuntza = 'en';
      } else if (h.match('français')) {
        hiztegiarenhizkuntza = 'fr';
      } else {
        hiztegiarenhizkuntza = 'es';
      }
      // bilaketaren hizkuntza zehaztu
      if (source == 'es') {
        idioma = 'G';
      } else if (source == 'en') {
        idioma = 'I';
      } else if (source == 'fr') {
        idioma = 'F';
      } else if (source == 'la') {
        idioma = 'L';
      } else {
        idioma = 'E';
      }
      //Hitz zatiak erabiltzen direnean, * komodina erabiliko bailitzan egin ditzala bilaketak
      if (escape(term).charAt(escape(term).length - 1) != "*"){
        term = term+"*";
      }
      var url = 'http://www1.euskadi.net/euskalterm/cgibila7.exe';
      var params = [];
      params.push(new euskalbar.QueryParameter('hizkun1', idioma));
      params.push(new euskalbar.QueryParameter('hitz1', escape(term)));
      params.push(new euskalbar.QueryParameter('gaiak', sub));
      params.push(new euskalbar.QueryParameter('hizkuntza', hiztegiarenhizkuntza));
      var zein = 'euskalterm';
      euskalbar.openURL(url, zein, 'GET', params);
      //Estatistika lokalak idatzi
      euskalbarstats.writeStats(0);
    },


    // Elhuyar hiztegiko bilaketak
    goEuskalBarElhuyar: function(source,dest,term) {
      // Begiratu kutxa hutsik dagoen 
      if (euskalbar.alertEmptyBox(term)){
        return;
      }
      // interfazearen hizkuntza zehaztu
      strRes = document.getElementById('leuskal');
      const h = strRes.getString("hizk");
      if (h.match('euskara')) {
        var urlElhuyar =  'http://www.elhuyar.org/hizkuntza-zerbitzuak/EU/Hiztegi-kontsulta';
        hiztegiarenhizkuntza = 'eu';
      } else if (h.match('english')) {
        var urlElhuyar =  'http://www.elhuyar.org/hizkuntza-zerbitzuak/EN/Dictionary-search';
        hiztegiarenhizkuntza = 'en';
      } else if (h.match('français')) {
        var urlElhuyar =  'http://www.elhuyar.org/hizkuntza-zerbitzuak/FR/Dictionnaire-recherche';
        hiztegiarenhizkuntza = 'fr';
      } else {
        var urlElhuyar =  'http://www.elhuyar.org/hizkuntza-zerbitzuak/ES/Consulta-de-diccionarios';
        hiztegiarenhizkuntza = 'es';
      }
      switch (source) {
        case 'es':
          var source2 = 'gazt';
        break;
        case 'fr':
          var source2 = 'fran';
        break;
        case 'en':
          var source2 = 'ing';
        break;
        case 'eu':
          var source2 = 'eusk';
        break;
      }
      switch (dest) {
        case 'es':
          var chkHizkuntza = 'chkHizkuntzaG';
          var dest2 = 'gazt';
        break;
        case 'fr':
          var chkHizkuntza = 'chkHizkuntzaF';
          var dest2 = 'fran';
        break;
        case 'en':
          var chkHizkuntza = 'chkHizkuntzaI';
          var dest2 = 'ing';
        break;
        case 'eu':
          var chkHizkuntza = '';
          var dest2 = '';
        break;
      }
      var zein = 'elhuyar.org';
      //Azentu markak, eñeak eta dieresiak aldatu
      term = encodeURI(term); //honekin eñeak eta dieresiak konpontzen dira
      var params = [];
      params.push(new euskalbar.QueryParameter('txtHitza', term));
      params.push(new euskalbar.QueryParameter('edozer', 'ehunekoa'));
      params.push(new euskalbar.QueryParameter('nondik', source2));
      if (chkHizkuntza!='') {
	      params.push(new euskalbar.QueryParameter(chkHizkuntza, dest2));
      }
      params.push(new euskalbar.QueryParameter('bot_kon', '%3E'));
      euskalbar.openURL(urlElhuyar, zein, 'POST', params);
      //Estatistika lokalak idatzi
      euskalbarstats.writeStats(1);
    },


    // Bilaketak 3000 hiztegian
    goEuskalBarAsk: function(source, term) {
      // Begiratu kutxa hutsik dagoen 
      if (euskalbar.alertEmptyBox(term)){
        return;
      }
      var params = [];
      if (source == 'es') {
        source = 'CAS';
        idioma = 'Castellano';
      } else {
        source = 'EUS';
        idioma = 'Euskera';
      }
      var url = 'http://www1.euskadi.net/cgi-bin_m33/DicioIe.exe';
      params.push(new euskalbar.QueryParameter('Diccionario', source));
      params.push(new euskalbar.QueryParameter('Idioma', source))
      params.push(new euskalbar.QueryParameter('Txt_'+idioma, escape(term)));
      var zein = 'cgi-bin_m33';
      euskalbar.openURL(url, zein, 'GET', params);
      //Estatistika lokalak idatzi
      euskalbarstats.writeStats(2);
    },


    // Bilaketak Labayru hiztegian
    goEuskalBarLabayru: function(source, term) {
      // Begiratu kutxa hutsik dagoen 
      if (euskalbar.alertEmptyBox(term)){
        return;
      }
      var params = [];
      if (source == 'es') {
        source = 'CAS';
        idioma = 'Castellano';
        var url = 'http://zerbitzuak.labayru.org/diccionario/CargaListaPalabras.asp'
      } else {
        source = 'EUS';
        idioma = 'Euskera';
        var url = 'http://zerbitzuak.labayru.org/diccionario/CargaListaPalabrasEU.asp'
      }
      params.push(new euskalbar.QueryParameter('opc', '1'));
      params.push(new euskalbar.QueryParameter('txtPalabra', escape(term)));
      var zein = 'labayru';
      euskalbar.openURL(url, zein, 'POST', params);
      //Estatistika lokalak idatzi .  Labayru dict = 22
      euskalbarstats.writeStats(22);
    },


    // Bilaketak Zehazki hiztegian
    goEuskalBarZehazki: function(source, term) {
      // Begiratu kutxa hutsik dagoen 
      if (euskalbar.alertEmptyBox(term)){
        return;
      }
      var params = []; //hutsik
      var url = 'http://ehu.es/ehg/cgi/zehazki/bila?m=has&z='+escape(term);
      var zein = 'zehazki';
      euskalbar.openURL(url, zein, 'GET', params);
      //Estatistika lokalak idatzi
      euskalbarstats.writeStats(24);
    },


    // Morrisen bilaketak egiteko
    goEuskalBarMorris: function(source, term) {
      // Begiratu kutxa hutsik dagoen 
      if (euskalbar.alertEmptyBox(term)){
        return;
      }
      if (source == 'en') {
        var hizk = 'txtIngles';
      } else {
        var hizk = 'txtEuskera';
      }
      var url = 'http://www1.euskadi.net/morris/resultado.asp';
      var params = [];
      params.push(new euskalbar.QueryParameter(hizk, escape(term)));
      var zein = 'morris';
      euskalbar.openURL(url, zein, 'POST', params);
      //Estatistika lokalak idatzi
      euskalbarstats.writeStats(3);
    },


    // eu.open-tran.eu itzulpen datu-basean bilaketak
    goEuskalBarOpentran: function(term) {
      // Begiratu kutxa hutsik dagoen 
      if (euskalbar.alertEmptyBox(term)){
        return;
      }
      var url = 'http://eu.open-tran.eu/suggest/'+escape(term);
      var zein = 'open-tran';
      euskalbar.openURL(url, zein, null, null);
      //Estatistika lokalak idatzi
      euskalbarstats.writeStats(4);
    },


    // Goihata hiztegiko bilaketak
    goEuskalBarGoihata: function(source,dest,term) {
      // Begiratu kutxa hutsik dagoen 
      if (euskalbar.alertEmptyBox(term)){
        return;
      }
      
      var urlGoihata = 'http://www.goihata.com/eu/japoniera-hiztegia/?tx_ghdictionary_pi1[cmd]=2';
      
      var zein = 'goihata.com';
      //Azentu markak, eñeak eta dieresiak aldatu
      term = encodeURI(term); //honekin eñeak eta dieresiak konpontzen dira
      var params = [];
      params.push(new euskalbar.QueryParameter('tx_ghdictionary_pi1[q]', term));
      params.push(new euskalbar.QueryParameter('tx_ghdictionary_pi1[l]', 'basque'));
      params.push(new euskalbar.QueryParameter('tx_ghdictionary_pi1[t]', 1));
      euskalbar.openURL(urlGoihata, zein, 'POST', params);
      
      // Update search stats; 21 = Index of Goihata in stats file
      euskalbarstats.writeStats(21);
    },


    // Euskaltzaindiaren hiztegi batuan bilaketa burutzen du
    goEuskalBarEuskaltzaindia: function(term) {
      // Begiratu kutxa hutsik dagoen 
      if (euskalbar.alertEmptyBox(term)){
        return;
      }
      var params = [];
      var url = 'http://www.euskaltzaindia.net/hiztegibatua/index.php?option=com_hiztegianbilatu&amp;Itemid=189&amp;lang=eu&amp;view=frontpage';
      params.push(new euskalbar.QueryParameter('sarrera', escape(term)));
      params.push(new euskalbar.QueryParameter('bila', "bai"));
      var zein = 'hiztegibatua';
      euskalbar.openURL(url, zein, 'POST', params);
      //Estatistika lokalak idatzi
      euskalbarstats.writeStats(5);
    },

    // Euskaltzaindiaren OEHn bilaketa burutzen du
    goEuskalBarOEH: function(term) {
      // Begiratu kutxa hutsik dagoen 
      if (euskalbar.alertEmptyBox(term)){
        return;
      }
      var params = [];
      var url = 'http://www.euskaltzaindia.net/index.php?option=com_oeh&amp;view=frontpage&amp;Itemid=340&amp;lang=eu';
      params.push(new euskalbar.QueryParameter('sarrera', escape(term)));
      var zein = 'com_oeh';
      euskalbar.openURL(url, zein, 'POST', params);
      //Estatistika lokalak idatzi
      euskalbarstats.writeStats(23);
    },


    // UZEIren sinonimoen hiztegia
    goEuskalBarUZEI: function(term) {
      // Begiratu kutxa hutsik dagoen 
      if (euskalbar.alertEmptyBox(term)){
        return;
      }
      strRes = document.getElementById('leuskal');
      const h = strRes.getString("hizk");
      // interfazearen hizkuntza zehaztu
      if (h.match('euskara')) {
        hiztegiarenhizkuntza = '14';
      } else if (h.match('english')) {
        hiztegiarenhizkuntza = '1347';
      } else if (h.match('français')) {
        hiztegiarenhizkuntza = '1348';
      } else {
        hiztegiarenhizkuntza = '1';
      }
      var params = [];
      var url = 'http://www.uzei.com/estatico/sinonimos.asp';
      params.push(new euskalbar.QueryParameter('sesion', hiztegiarenhizkuntza));
      params.push(new euskalbar.QueryParameter('sarrera', escape(term)));
      params.push(new euskalbar.QueryParameter('eragiketa', 'bilatu'));
      var zein = 'uzei';
      euskalbar.openURL(url, zein, 'GET', params);
      //Estatistika lokalak idatzi
      euskalbarstats.writeStats(6);
    },


    // Adorez sinonimoen hiztegia
    goEuskalBarAdorez: function(term) {
      // Begiratu kutxa hutsik dagoen 
      if (euskalbar.alertEmptyBox(term)){
        return;
      }
      var params = [];
      strRes = document.getElementById('leuskal');
      const h = strRes.getString("hizk");
      var url = 'http://www1.euskadi.net/cgi-bin_m32/sinonimoak.exe';
      if (h.match('euskara')) {
        params.push(new euskalbar.QueryParameter('Palabra', 'Introducida'));
        params.push(new euskalbar.QueryParameter('Idioma', 'EUS'));
        params.push(new euskalbar.QueryParameter('txtpalabra', escape(term)));
      } else {
        params.push(new euskalbar.QueryParameter('Palabra', 'Introducida'));
        params.push(new euskalbar.QueryParameter('Idioma', 'CAS'));
        params.push(new euskalbar.QueryParameter('txtpalabra', escape(term)));
      }
      var zein = 'cgi-bin_m32';
      euskalbar.openURL(url, zein, 'GET', params);
      //Estatistika lokalak idatzi
      euskalbarstats.writeStats(7);
    },


    // ItzuL posta-zerrendan bilaketak
    goEuskalBarItzuL: function(term) {
      // Begiratu kutxa hutsik dagoen 
      if (euskalbar.alertEmptyBox(term)){
        return;
      }
      var params = [];
      var url = 'http://www.google.es/search';
      params.push(new euskalbar.QueryParameter('hl', 'eu'));
      params.push(new euskalbar.QueryParameter('btnG', 'Google+Bilaketa'));
      params.push(new euskalbar.QueryParameter('q', encodeURI(term)+" site:http://postaria.com/pipermail/itzul/"));
      var zein = 'postaria.com';
      euskalbar.openURL(url, zein, 'GET', params);
      //Estatistika lokalak idatzi
      euskalbarstats.writeStats(8);
    },


    // Harluxet hiztegi entziklopedikoa
    goEuskalBarHarluxet: function(term) {
      // Begiratu kutxa hutsik dagoen 
      if (euskalbar.alertEmptyBox(term)){
        return;
      }
      var params = [];
      var url = 'http://www1.euskadi.net/harluxet/emaitza.asp';
      params.push(new euskalbar.QueryParameter('sarrera', escape(term)));
      var zein = 'harluxet';
      euskalbar.openURL(url, zein, 'GET', params);
      //Estatistika lokalak idatzi
      euskalbarstats.writeStats(9);
    },


    // eu.wikipedia.org
    goEuskalBarWikipedia: function(term) {
      // Begiratu kutxa hutsik dagoen 
      if (euskalbar.alertEmptyBox(term)){
        return;
      }
      var params = [];
      var url = 'http://eu.wikipedia.org/wiki/Aparteko:Search';
      params.push(new euskalbar.QueryParameter('search', escape(term)));
      var zein = 'eu.wikipedia.org';
      euskalbar.openURL(url, zein, 'GET', params);
      //Estatistika lokalak idatzi
      euskalbarstats.writeStats(10);
    },


    // Mokoroan bilaketak
    goEuskalBarMokoroa: function(source, term) {
      // Begiratu kutxa hutsik dagoen 
      if (euskalbar.alertEmptyBox(term)){
        return;
      }
      var params = [];
      var zein = 'mokoroa';
      var url = 'http://www.hiru.com/hiztegiak/mokoroa/';
      if (source == 'es') {
        params.push(new euskalbar.QueryParameter('gazt', escape(term)));
        params.push(new euskalbar.QueryParameter('bidali', 'Bilatu'));
      } else {
        params.push(new euskalbar.QueryParameter('eusk', escape(term)));
        params.push(new euskalbar.QueryParameter('bidali', 'Bilatu'));
      }
      euskalbar.openURL(url, zein, 'GET', params);
      //Estatistika lokalak idatzi
      euskalbarstats.writeStats(11);
    },


    // Intzaren bilaketak
    goEuskalBarIntza: function(source, term) {
      // Begiratu kutxa hutsik dagoen 
      if (euskalbar.alertEmptyBox(term)){
        return;
      }
      var params = [];
      var zein = 'intza';
      var url = 'http://intza.armiarma.com/cgi-bin/bilatu2.pl'; 
      if (source == 'es') {
        params.push(new euskalbar.QueryParameter('hitza1', escape(term)));
        params.push(new euskalbar.QueryParameter('eremu3', '1'));
        params.push(new euskalbar.QueryParameter('eremu1', 'eeki'));
      } else {
        params.push(new euskalbar.QueryParameter('eremu1', 'giltzarriak'));
        params.push(new euskalbar.QueryParameter('hitza1', escape(term)));
        params.push(new euskalbar.QueryParameter('eremu3','1'));
      }
      euskalbar.openURL(url, zein, 'GET', params);
      //Estatistika lokalak idatzi, hau aldatu egin behar da
      euskalbarstats.writeStats(12);
    },


    // Eurovoc Tesaurusa
    goEuskalBarEurovoc: function(term) {
      // Begiratu kutxa hutsik dagoen 
      if (euskalbar.alertEmptyBox(term)){
        return;
      }
      var params = [];
      strRes = document.getElementById('leuskal');
      const h = strRes.getString("hizk");
      if (h.match('euskara')) {
        hizk = 'EU';
      } else {
        hizk = 'CA';
      }
      var url = 'http://www.bizkaia.net/kultura/eurovoc/busqueda.asp';
      params.push(new euskalbar.QueryParameter('txtBuscar', 'S'));
      params.push(new euskalbar.QueryParameter('query', term));
      params.push(new euskalbar.QueryParameter('idioma', hizk));
      var zein = 'eurovoc';
      euskalbar.openURL(url, zein, 'POST', params);
      //Estatistika lokalak idatzi
      euskalbarstats.writeStats(13);
    },


    // Bergara aldeko hiztegia
    goEuskalBarBergara: function(term) {
      // Begiratu kutxa hutsik dagoen 
      if (euskalbar.alertEmptyBox(term)){
        return;
      }
      var params = [];
      var zein = 'bergarakoeuskara';
      var url = 'http://www.bergarakoeuskara.net/hiztegia/bilatu';
      params.push(new euskalbar.QueryParameter('berbaki', escape(term)));
      params.push(new euskalbar.QueryParameter('form_id', 'berba_bilatu'));
      euskalbar.openURL(url, zein, 'POST', params);
      euskalbarstats.writeStats(14);
    },


    // Ereduzko Prosa
    goEuskalBarEreduzko: function(term) {
      // Begiratu kutxa hutsik dagoen 
      if (euskalbar.alertEmptyBox(term)){
        return;
      }
      var params = [];
      var zein = 'ereduzkoa';
      var url = 'http://www.ehu.es/cgi-bin/ereduzkoa/bilatu09.pl'; 
      params.push(new euskalbar.QueryParameter('o', '1'));
      params.push(new euskalbar.QueryParameter('h', '1'));
      params.push(new euskalbar.QueryParameter('n', 'bietan'));
      params.push(new euskalbar.QueryParameter('k1', '1'));
      params.push(new euskalbar.QueryParameter('m1', 'hitza'));
      params.push(new euskalbar.QueryParameter('h1',escape(term)));
      euskalbar.openURL(url, zein, 'GET', params);
      //Estatistika lokalak idatzi, hau aldatu egin behar da
      euskalbarstats.writeStats(15);
    },


    // Klasikoen gordailua
    goEuskalBarKlasikoak: function(term) {
      // Begiratu kutxa hutsik dagoen 
      if (euskalbar.alertEmptyBox(term)){
        return;
      }
      var params = [];
      var zein = 'klasikoak';
      var url = 'http://klasikoak.armiarma.com/cgi-bin/corpusBila.pl'; 
      params.push(new euskalbar.QueryParameter('check1', '1'));
      params.push(new euskalbar.QueryParameter('hitza1', escape(term)));
      params.push(new euskalbar.QueryParameter('mota1', 'hasi'));
      params.push(new euskalbar.QueryParameter('alda', '1'));
      params.push(new euskalbar.QueryParameter('idazlea', ''));
      params.push(new euskalbar.QueryParameter('generoa', '0'));
      params.push(new euskalbar.QueryParameter('garaia', '0'));
      params.push(new euskalbar.QueryParameter('euskalkia', '0'));
      euskalbar.openURL(url, zein, 'GET', params);
      //Estatistika lokalak idatzi, hau aldatu egin behar da
      euskalbarstats.writeStats(16);
    },


    // ZT Corpusa
    goEuskalBarZTCorpusa: function(term) {
      // Begiratu kutxa hutsik dagoen 
      if (euskalbar.alertEmptyBox(term)){
        return;
      }
      var params = [];
      var url = 'http://www.ztcorpusa.net/cgi-bin/kontsulta.py';
      params.push(new euskalbar.QueryParameter('testu-hitza1', escape(term)));
      var zein = 'ztcorpusa';
      euskalbar.openURL(url, zein, 'GET', params);
      //Estatistika lokalak idatzi
      euskalbarstats.writeStats(17);
    },


    // CorpEus
    goEuskalBarCorpEus: function(term) {
      // Begiratu kutxa hutsik dagoen 
      if (euskalbar.alertEmptyBox(term)){
        return;
      }
      var params = [];
      var url = 'http://www.corpeus.org/cgi-bin/kontsulta.py';
      params.push(new euskalbar.QueryParameter('bilagaiid', ' '));
      params.push(new euskalbar.QueryParameter('formalema', 'lema'));
      params.push(new euskalbar.QueryParameter('motorea', 'googleajax'));
      if (term.indexOf(' ') != -1) {
        params.push(new euskalbar.QueryParameter('testu-hitza', escape('"'+term+'"')));
      } else {
        params.push(new euskalbar.QueryParameter('testu-hitza', escape(term)));
      };
      var zein = 'corpeus';
      euskalbar.openURL(url, zein, 'POST', params);
      //Estatistika lokalak idatzi
      euskalbarstats.writeStats(18);
    },


    // XUXENweb
    goEuskalBarXUXENweb: function(term) {
      // Begiratu kutxa hutsik dagoen 
      if (euskalbar.alertEmptyBox(term)){
        return;
      }
      var params = [];
      var url = 'http://www.xuxen.com/socketBezero.php';
      params.push(new euskalbar.QueryParameter('idatzArea', term));
      var zein = 'xuxen';
      euskalbar.openURL(url, zein, 'GET', params);
      //Estatistika lokalak idatzi
      euskalbarstats.writeStats(19);
    },


    // Elebila
    goEuskalBarElebila: function(term) {
      // Begiratu kutxa hutsik dagoen 
      if (euskalbar.alertEmptyBox(term)){
        return;
      }
      var params = [];
      var url = 'http://www.elebila.eu/search/';
      if (term.indexOf(' ') != -1) {
        params.push(new euskalbar.QueryParameter('bilatu', encodeURI('"'+term+'"')));
      } else {
        params.push(new euskalbar.QueryParameter('bilatu', encodeURI(term)));
      };
      var zein = 'elebila';
      euskalbar.openURL(url, zein, 'GET', params);
      //Estatistika lokalak idatzi
      euskalbarstats.writeStats(20);
    },


    // Zenbait hiztegi atzitzen ditu
    goEuskalBarOthers: function(zein) {
      switch (zein) {
        case 'SAunamendi':
          var url = 'http://www.euskomedia.org/euskomedia/SAunamendi?idi=eu&op=1';
        break;
        case 'kapsula':
          var url = 'http://tresnak.kapsula.com/cgi-bin-jo/HTMODFOR?ActionField=getmodel&$BaseNumber=02&$Modelo=01&CmdGetModel=KAPSULA.HTMLMOD.JOMODBIL';
        break;
        case 'oeegunea':
          var url = 'http://www.oeegunea.org/hiztegia';
        break;
      }
      euskalbar.openURL(url, zein, null, null);
    },


    // Aukeratutako testua itzultzen du
    selectionText: function() {
      var focusedWindow = document.commandDispatcher.focusedWindow;
      var winWrapper = new XPCNativeWrapper(focusedWindow, 'getSelection()');
      return winWrapper.getSelection();
    },


    // Testu kutxan sartzen den katea zenbakia dela balidatzen du
    numField: function(event) {
      if (event.which >= 48 && event.which <= 57 ||
          (event.which==46 && this.input.value.search('\\.')== -1)  ||
          8 == event.which || 13 == event.which || 0 == event.which) {
        return;
      } else {
        event.preventDefault();
        return;
      }
    },

}
