// Developers: Juanan Pereira, Asier Sarasua Garmendia 2006
//             Julen Ruiz Aizpuru, Asier Sarasua Garmendia 2007
//             Igor Leturia Azkarate 2008
// This is Free Software (GPL License)
// juanan@diariolinux.com
// asarasua@vitoria-gasteiz.org
// julenx@gmail.com
// ileturia@gmail.com

    // *************************************
    //  Hiztegien bilaketak
    // *************************************


    // Euskaltermen bilaketak egiteko
    function goEuskalBarEuskalterm(source, term, sub) {
      // Begiratu kutxa hutsik dagoen 
      if (alertEmptyBox(term)){
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
      params.push(new QueryParameter('hizkun1', idioma));
      params.push(new QueryParameter('hitz1', escape(term)));
      params.push(new QueryParameter('gaiak', sub));
      params.push(new QueryParameter('hizkuntza', hiztegiarenhizkuntza));
      var zein = 'euskalterm';
      openURL(url, zein, 'GET', params);
      //Estatistika lokalak idatzi
      writeStats(0);
    }


    // Elhuyar hiztegiko bilaketak
    function goEuskalBarElhuyar(source,dest,term) {
      // Begiratu kutxa hutsik dagoen 
      if (alertEmptyBox(term)){
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
      params.push(new QueryParameter('txtHitza', term));
      params.push(new QueryParameter('edozer', 'ehunekoa'));
      params.push(new QueryParameter('nondik', source2));
      if (chkHizkuntza!='') {
	      params.push(new QueryParameter(chkHizkuntza, dest2));
      }
      params.push(new QueryParameter('bot_kon', '%3E'));
      openURL(urlElhuyar, zein, 'POST', params);
      //Estatistika lokalak idatzi
      writeStats(1);
    }


    // Bilaketak 3000 hiztegian
    function goEuskalBarAsk(source, term) {
      // Begiratu kutxa hutsik dagoen 
      if (alertEmptyBox(term)){
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
      params.push(new QueryParameter('Diccionario', source));
      params.push(new QueryParameter('Idioma', source))
      params.push(new QueryParameter('Txt_'+idioma, escape(term)));
      var zein = 'cgi-bin_m33';
      openURL(url, zein, 'GET', params);
      //Estatistika lokalak idatzi
      writeStats(2);
    }


    // Morrisen bilaketak egiteko
    function goEuskalBarMorris(source, term) {
      // Begiratu kutxa hutsik dagoen 
      if (alertEmptyBox(term)){
        return;
      }
      if (source == 'en') {
        var hizk = 'txtIngles';
      } else {
        var hizk = 'txtEuskera';
      }
      var url = 'http://www1.euskadi.net/morris/resultado.asp';
      var params = [];
      params.push(new QueryParameter(hizk, escape(term)));
      var zein = 'morris';
      openURL(url, zein, 'POST', params);
      //Estatistika lokalak idatzi
      writeStats(3);
    }


    // eu.open-tran.eu itzulpen datu-basean bilaketak
    function goEuskalBarOpentran(term) {
      // Begiratu kutxa hutsik dagoen 
      if (alertEmptyBox(term)){
        return;
      }
      var url = 'http://eu.open-tran.eu/suggest/'+escape(term);
      var zein = 'open-tran';
      openURL(url, zein, null, null);
      //Estatistika lokalak idatzi
      writeStats(4);
    }


    // Euskaltzaindiaren hiztegi batuan bilaketa burutzen du
    function goEuskalBarEuskaltzaindia(term) {
      // Begiratu kutxa hutsik dagoen 
      if (alertEmptyBox(term)){
        return;
      }
      var params = [];
      var url = 'http://www.euskaltzaindia.net/hiztegibatua/bilatu.asp';
      params.push(new QueryParameter('sarrera', escape(term)));
      var zein = 'hiztegibatua';
      openURL(url, zein, 'GET', params);
      //Estatistika lokalak idatzi
      writeStats(5);
    }


    // UZEIren sinonimoen hiztegia
    function goEuskalBarUZEI(term) {
      // Begiratu kutxa hutsik dagoen 
      if (alertEmptyBox(term)){
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
      params.push(new QueryParameter('sesion', hiztegiarenhizkuntza));
      params.push(new QueryParameter('sarrera', escape(term)));
      params.push(new QueryParameter('eragiketa', 'bilatu'));
      var zein = 'uzei';
      openURL(url, zein, 'GET', params);
      //Estatistika lokalak idatzi
      writeStats(6);
    }


    // Adorez sinonimoen hiztegia
    function goEuskalBarAdorez(term) {
      // Begiratu kutxa hutsik dagoen 
      if (alertEmptyBox(term)){
        return;
      }
      var params = [];
      strRes = document.getElementById('leuskal');
      const h = strRes.getString("hizk");
      var url = 'http://www1.euskadi.net/cgi-bin_m32/sinonimoak.exe';
      if (h.match('euskara')) {
        params.push(new QueryParameter('Palabra', 'Introducida'));
        params.push(new QueryParameter('Idioma', 'EUS'));
        params.push(new QueryParameter('txtpalabra', escape(term)));
      } else {
        params.push(new QueryParameter('Palabra', 'Introducida'));
        params.push(new QueryParameter('Idioma', 'CAS'));
        params.push(new QueryParameter('txtpalabra', escape(term)));
      }
      var zein = 'cgi-bin_m32';
      openURL(url, zein, 'GET', params);
      //Estatistika lokalak idatzi
      writeStats(7);
    }


    // ItzuL posta-zerrendan bilaketak
    function goEuskalBarItzuL(term) {
      // Begiratu kutxa hutsik dagoen 
      if (alertEmptyBox(term)){
        return;
      }
      var params = [];
      var url = 'http://search.gmane.org/search.php';
      params.push(new QueryParameter('group', 'gmane.culture.language.basque.itzul'));
      params.push(new QueryParameter('query', encodeURI(term)));
      var zein = 'gmane.culture.language.basque.itzul';
      openURL(url, zein, 'GET', params);
      //Estatistika lokalak idatzi
      writeStats(8);
    }


    // Harluxet hiztegi entziklopedikoa
    function goEuskalBarHarluxet(term) {
      // Begiratu kutxa hutsik dagoen 
      if (alertEmptyBox(term)){
        return;
      }
      var params = [];
      var url = 'http://www1.euskadi.net/harluxet/emaitza.asp';
      params.push(new QueryParameter('sarrera', escape(term)));
      var zein = 'harluxet';
      openURL(url, zein, 'GET', params);
      //Estatistika lokalak idatzi
      writeStats(9);
    }


    // eu.wikipedia.org
    function goEuskalBarWikipedia(term) {
      // Begiratu kutxa hutsik dagoen 
      if (alertEmptyBox(term)){
        return;
      }
      var params = [];
      var url = 'http://eu.wikipedia.org/wiki/Aparteko:Search';
      params.push(new QueryParameter('search', escape(term)));
      var zein = 'eu.wikipedia.org';
      openURL(url, zein, 'GET', params);
      //Estatistika lokalak idatzi
      writeStats(10);
    }


    // Mokoroan bilaketak
    function goEuskalBarMokoroa(source, term) {
      // Begiratu kutxa hutsik dagoen 
      if (alertEmptyBox(term)){
        return;
      }
      var params = [];
      var zein = 'mokoroa';
      var url = 'http://www.hiru.com/hiztegiak/mokoroa/';
      if (source == 'es') {
        params.push(new QueryParameter('gazt', escape(term)));
        params.push(new QueryParameter('bidali', 'Bilatu'));
      } else {
        params.push(new QueryParameter('eusk', escape(term)));
        params.push(new QueryParameter('bidali', 'Bilatu'));
      }
      openURL(url, zein, 'GET', params);
      //Estatistika lokalak idatzi
      writeStats(11);
    }

    // Intzaren bilaketak
    function goEuskalBarIntza(source, term) {
      // Begiratu kutxa hutsik dagoen 
      if (alertEmptyBox(term)){
        return;
      }
      var params = [];
      var zein = 'intza';
      var url = 'http://intza.armiarma.com/cgi-bin/bilatu2.pl'; 
      if (source == 'es') {
        params.push(new QueryParameter('hitza1', escape(term)));
        params.push(new QueryParameter('eremu3', '1'));
        params.push(new QueryParameter('eremu1', 'eeki'));
      } else {
        params.push(new QueryParameter('eremu1', 'giltzarriak'));
        params.push(new QueryParameter('hitza1', escape(term)));
        params.push(new QueryParameter('eremu3','1'));
      }
      openURL(url, zein, 'GET', params);
      //Estatistika lokalak idatzi, hau aldatu egin behar da
      writeStats(12);
    }

    // Eurovoc Tesaurusa
    function goEuskalBarEurovoc(term) {
      // Begiratu kutxa hutsik dagoen 
      if (alertEmptyBox(term)){
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
      params.push(new QueryParameter('txtBuscar', 'S'));
      params.push(new QueryParameter('query', term));
      params.push(new QueryParameter('idioma', hizk));
      var zein = 'eurovoc';
      openURL(url, zein, 'POST', params);
      //Estatistika lokalak idatzi
      writeStats(13);
    }


    // Bergara aldeko hiztegia
    function goEuskalBarBergara(term) {
      // Begiratu kutxa hutsik dagoen 
      if (alertEmptyBox(term)){
        return;
      }
      var params = [];
      var url = 'http://www.netkam.com/i/bergara/hiztegia/bilatu';
      params.push(new QueryParameter('berbaki', escape(term)));
      var zein = 'netkam';
      openURL(url, zein, 'POST', params);
      writeStats(14);
    }


    // Ereduzko Prosa
    function goEuskalBarEreduzko(term) {
      // Begiratu kutxa hutsik dagoen 
      if (alertEmptyBox(term)){
        return;
      }
      var params = [];
      var zein = 'ereduzkoa';
      var url = 'http://www.ehu.es/cgi-bin/ereduzkoa/bilatu.pl'; 
      params.push(new QueryParameter('oso', '1'));
      params.push(new QueryParameter('check0', '1'));
      params.push(new QueryParameter('non', 'bietan'));
      params.push(new QueryParameter('check1', '1'));
      params.push(new QueryParameter('mota1', 'hitza'));
      params.push(new QueryParameter('hitza1',escape(term)));
      openURL(url, zein, 'GET', params);
      //Estatistika lokalak idatzi, hau aldatu egin behar da
      writeStats(15);
    }

    // Klasikoen gordailua
    function goEuskalBarKlasikoak(term) {
      // Begiratu kutxa hutsik dagoen 
      if (alertEmptyBox(term)){
        return;
      }
      var params = [];
      var zein = 'klasikoak';
      var url = 'http://klasikoak.armiarma.com/cgi-bin/corpusBila.pl'; 
      params.push(new QueryParameter('check1', '1'));
      params.push(new QueryParameter('hitza1', escape(term)));
      params.push(new QueryParameter('mota1', 'hasi'));
      params.push(new QueryParameter('alda', '1'));
      params.push(new QueryParameter('idazlea', ''));
      params.push(new QueryParameter('generoa', '0'));
      params.push(new QueryParameter('garaia', '0'));
      params.push(new QueryParameter('euskalkia', '0'));
      openURL(url, zein, 'GET', params);
      //Estatistika lokalak idatzi, hau aldatu egin behar da
      writeStats(16);
    }

    // ZT Corpusa
    function goEuskalBarZTCorpusa(term) {
      // Begiratu kutxa hutsik dagoen 
      if (alertEmptyBox(term)){
        return;
      }
      var params = [];
      var url = 'http://www.ztcorpusa.net/cgi-bin/kontsulta.py';
      params.push(new QueryParameter('testu-hitza1', escape(term)));
      var zein = 'ztcorpusa';
      openURL(url, zein, 'GET', params);
      //Estatistika lokalak idatzi
      writeStats(17);
    }


    // CorpEus
    function goEuskalBarCorpEus(term) {
      // Begiratu kutxa hutsik dagoen 
      if (alertEmptyBox(term)){
        return;
      }
      var params = [];
      var url = 'http://www.corpeus.org/cgi-bin/kontsulta.py';
      params.push(new QueryParameter('bilagaiid', ' '));
      params.push(new QueryParameter('formalema', 'lema'));
      if (term.indexOf(' ') != -1) {
        params.push(new QueryParameter('testu-hitza', escape('"'+term+'"')));
      } else {
        params.push(new QueryParameter('testu-hitza', escape(term)));
      };
      var zein = 'corpeus';
      openURL(url, zein, 'POST', params);
      //Estatistika lokalak idatzi
      writeStats(18);
    }

    // XUXENweb
    function goEuskalBarXUXENweb(term) {
      // Begiratu kutxa hutsik dagoen 
      if (alertEmptyBox(term)){
        return;
      }
      var params = [];
      var url = 'http://www.xuxen.com/socketBezero.php';
      params.push(new QueryParameter('idatzArea', term));
      var zein = 'xuxen';
      openURL(url, zein, 'GET', params);
      //Estatistika lokalak idatzi
      writeStats(19);
    }


    // Elebila
    function goEuskalBarElebila(term) {
      // Begiratu kutxa hutsik dagoen 
      if (alertEmptyBox(term)){
        return;
      }
      var params = [];
      var url = 'http://www.elebila.eu/search/';
      if (term.indexOf(' ') != -1) {
        params.push(new QueryParameter('bilatu', encodeURI('"'+term+'"')));
      } else {
        params.push(new QueryParameter('bilatu', encodeURI(term)));
      };
      var zein = 'elebila';
      openURL(url, zein, 'GET', params);
      //Estatistika lokalak idatzi
      writeStats(20);
    }

    // Zenbait hiztegi atzitzen ditu
    function goEuskalBarOthers(zein) {
      switch (zein) {
        case 'SAunamendi':
          var url = 'http://www.euskomedia.org/euskomedia/SAunamendi?idi=eu&op=1';
        break;
        case 'kapsula':
          var url = 'http://tresnak.kapsula.com/cgi-bin-jo/HTMODFOR?ActionField=getmodel&$BaseNumber=02&$Modelo=01&CmdGetModel=KAPSULA.HTMLMOD.JOMODBIL';
        break;
        case 'oeegunea':
          var url = 'http://www.oeegunea.org/default.cfm?atala=hiztegia';
        break;
      }
      openURL(url, zein, null, null);
    }


    // Aukeratutako testua itzultzen du
    function selectionText () {
      var focusedWindow = document.commandDispatcher.focusedWindow;
      var winWrapper = new XPCNativeWrapper(focusedWindow, 'getSelection()');
      return winWrapper.getSelection();
    }


    // Testu kutxan sartzen den katea zenbakia dela balidatzen du
    function numField(event){
      if (event.which >= 48 && event.which <= 57 ||
          (event.which==46 && this.input.value.search('\\.')== -1)  ||
          8 == event.which || 13 == event.which || 0 == event.which) {
        return;
      } else {
        event.preventDefault();
        return;
      }
    }
