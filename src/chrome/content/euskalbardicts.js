// Developers: Juanan Pereira, Asier Sarasua Garmendia 2006
//             Julen Ruiz Aizpuru, Asier Sarasua Garmendia 2007
// This is Free Software (GPL License)
// juanan@diariolinux.com
// asarasua@vitoria-gasteiz.org
// julenx@gmail.com

    // *************************************
    //  Hiztegien bilaketak
    // *************************************


    // Euskaltermen bilaketak egiteko
    function goEuskalBarEuskalterm(source, term, sub) {
      strRes = document.getElementById('leuskal');
      const h = strRes.getString("hizk");
      // interfazearen hizkuntza zehaztu
      if (h.match('euskara')) {
        hiztegiarenhizkuntza = 'eu';
      } else if (h.match('english')) {
        hiztegiarenhizkuntza = 'en';
      } else {
        hiztegiarenhizkuntza = 'es';
      }
      // bilaketaren hizkuntza zehaztu
      if (source == 'es') {
        idioma = 'G';
      } else if (source == 'en') {
        idioma = 'I';
      } else {
        idioma = 'E';
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


    // Bilaketak 3000 hiztegian
    function goEuskalBarAsk(source, term) {
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
      writeStats(1);
    }


    // Elhuyar hiztegiko bilaketak
    function goEuskalBarElhuyar(source, term) {
      var params = [];
      (source == 'es') ? source = 'gazt' : source = 'eusk';
      // Hitzen arteko zuriuneen ordez beheko barrak idazten ditu, Elhuyarrentzako
      term = term.replace(/ /g, "%20");
      var url = 'http://www.euskara.euskadi.net/r59-15172x/eu/hizt_el/index.asp';
      params.push(new QueryParameter('aplik_hizkuntza_ezkutua', null));
      params.push(new QueryParameter('optHizkuntza', source));
      params.push(new QueryParameter('txtHitza', term));
      params.push(new QueryParameter('bot_bilatu', '%3E'));
      params.push(new QueryParameter('edozer', 'ehunekoa'));
      var zein = 'hizt_el';
      openURL(url, zein, 'POST', params);
      //Estatistika lokalak idatzi
      writeStats(2);
    }


    // Morrisen bilaketak egiteko
    function goEuskalBarMorris(source, term) {
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
      var url = 'http://eu.open-tran.eu/suggest/'+escape(term);
      var zein = 'open-tran';
      openURL(url, zein, null, null);
      //Estatistika lokalak idatzi
      writeStats(4);
    }


    // Euskaltzaindiaren hiztegi batuan bilaketa burutzen du
    function goEuskalBarEuskaltzaindia(term) {
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
      var params = [];
      var url = 'http://www.uzei.com/estatico/sinonimos.asp';
      params.push(new QueryParameter('sarrera', escape(term)));
      params.push(new QueryParameter('eragiketa', 'bilatu'));
      var zein = 'uzei';
      openURL(url, zein, 'GET', params);
      //Estatistika lokalak idatzi
      writeStats(6);
    }


    // Adorez sinonimoen hiztegia
    function goEuskalBarAdorez(term) {
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
      var params = [];
      var url = 'http://www1.euskadi.net/harluxet/emaitza.asp';
      params.push(new QueryParameter('sarrera', escape(term)));
      var zein = 'harluxet';
      openURL(url, zein, 'GET', params);
      //Estatistika lokalak idatzi
      writeStats(9);
    }


    // Mokoroan bilaketak
    function goEuskalBarMokoroa(source, term) {
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
      writeStats(10);
    }

    // Intzaren bilaketak
    function goEuskalBarIntza(source, term) {
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
      writeStats(11);
    }

    // Eurovoc Tesaurusa
    function goEuskalBarEurovoc(term) {
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
      writeStats(12);
    }


    // Bergara aldeko hiztegia
    function goEuskalBarBergara(term) {
      var params = [];
      var url = 'http://www.netkam.com/i/bergara/hiztegia/bilatu';
      params.push(new QueryParameter('berbaki', escape(term)));
      var zein = 'netkam';
      openURL(url, zein, 'POST', params);
      writeStats(13);
    }


    // Ereduzko Prosa
    function goEuskalBarEreduzko(term) {
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
      writeStats(14);
    }

    // Klasikoen gordailua
    function goEuskalBarKlasikoak(term) {
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
      writeStats(15);
    }

    // ZT Corpusa
    function goEuskalBarZTCorpusa(term) {
      var params = [];
      var url = 'http://www.ztcorpusa.net/cgi-bin/kontsulta.py';
      params.push(new QueryParameter('testu-hitza1', escape(term)));
      var zein = 'ztcorpusa';
      openURL(url, zein, 'GET', params);
      //Estatistika lokalak idatzi
      writeStats(16);
    }


    // CorpEus
    function goEuskalBarCorpEus(term) {
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
      writeStats(17);
    }

    // Aukeratutako testua itzultzen du opentrad erabiliz edo xuxenweb kontsultatzen du
    function goEuskalBarSelection(term, action) {
      var params = [];
      switch (action) {
        case 'opentrad' :
          var url = 'http://www.interneteuskadi.org/euskalbar/opentrad.php';
          params.push(new QueryParameter('testukutxa', escape(term))); 
          var zein = 'opentrad';
          //Estatistika lokalak idatzi
          writeStats(18);
        break;
        case 'xuxenweb' :
          var url = 'http://www.xuxen.com/socketBezero.php';
          params.push(new QueryParameter('idatzArea', term)); 
          var zein = 'xuxen';
          //Estatistika lokalak idatzi
          writeStats(19);
        break;
      }
      openURL(url, zein, 'GET', params);
    }


    // Opentrad
    function goEuskalBarOpentrad(source, term) {
      var params = [];
      var url = 'http://www.opentrad.org/demo/libs/nabigatzailea.php';
      params.push(new QueryParameter('language', 'eu'));
      params.push(new QueryParameter('inurl', escape(window.content.document.location.href)));
      params.push(new QueryParameter('norantza', 'es-eu'));
      var zein = 'opentrad';
      openURL(url, zein, 'GET', params);
      //Estatistika lokalak idatzi
      writeStats(18);
    }

    // XUXENweb
    function goEuskalBarXUXENweb(term) {
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
      var params = [];
      var url = 'http://www.elebila.eu/search/';
      if (term.indexOf(' ') != -1) {
        params.push(new QueryParameter('bilatu', escape('"'+term+'"')));
      } else {
        params.push(new QueryParameter('bilatu', escape(term)));
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
