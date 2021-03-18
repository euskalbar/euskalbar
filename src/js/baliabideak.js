/* Euskalbar-eko baliabideen datu guztiak gordetzen ditu:
   izena, URLa, metodoa, parametroak, kategoria...
   Baliabide bakoitzak parametro hauek izango ditu:
       - disabled: adierazten du ea badabilen eta botoia erakutsi behar den; bestela,
                   baliabideen zerrendan soilik erakusten du
       - name: kode-izena
       - displayName: botoietan-eta erakutsiko den testu laburra
       - description: deskribapenetan-eta erakutsiko den testu luzeagoa
       - category: zein kategoriakoa den baliabidea
       - homePage: baliabidearen orri nagusia
       - pairs: baliabidearen hizkuntza-pareen zerrenda (euskara hutsekoa bada, 'eu' soilik)
       - method: GET edo POST den
       - getUrl: kontsulta egiteko URLa
                 batzuetan, kontsultarako datuak bertan doaz
                 parametroak jasotzen ditu objektu batean, eremu hauekin:
                    - term: bilatzekoa
                    - source: jatorri-hizkuntza
                    - target: helburu-hizkuntza
       - getParams: kontsultan pasatzen zaizkion parametroak itzultzen dira objektu gisa
                    parametroak jasotzen ditu objektu batean, eremu hauekin:
                      - term: bilatzekoa
                      - source: jatorri-hizkuntza
                      - target: helburu-hizkuntza
                    POST bada, itzultzen duen objektuan, hau egon daiteke:
                      - frame_index: zenbatgarren frame-an dagoen formularioa (hautazkoa)
                      - form_name_or_index: parametroak dauden formularioaren izena edo indizea (derrigorrezkoa)
                      - form_url: formularioak exekutatu beharreko action-a
                      - form_method: formularioaren metodoa
                      - elements_to_delete: elementu batzuk ezabatu behr badira, horien indizearen zerrenda, goitik behera ordenatuta
                      - hidden_elements: hidden bihurtu behar diren elementuen zerrenda
                      - click_button: submit egin beharrean botoi batean klik egin behar bada (onpress duelako, adibidez), botoiaren izena
       - scrap: bilaketa konbinatuetan, XHRren emaitzako HTML orri dena pasatuta,
                zutabean erakutsi beharrekoa itzultzen du
       - title: URL edo izenburua konstanteak ez badira, fitxak berrerabiltzean detektatzeko,
                    izenburuaren zati identifikatibo bat
       - url: URL edo izenburua konstanteak ez badira, fitxak berrerabiltzean detektatzeko,
                    URLaren zati identifikatibo bat
       - berrerabiltzekoitxi: fitxak berrerabiltzean ixtea komneni bada (bestela gaizki egiten duelako)
    */

var baliabideendatuak={};

/* Euskalbar-eko baliabideetan dauden kategoriak, ordenatuta */

var baliabideenkategoriak=[
    'Hiztegi orokorrak',
    'Hiztegi orokor eleaniztunak',
    'Sinonimoen hiztegiak',
    'Hiztegi terminologiko/tekniko orokorrak',
    'Hiztegi terminologiko/tekniko espezializatuak',
    'Fraseologia hiztegiak',
    'Hiztegi entziklopedikoak',
    'Euskalkietako/Herrietako hiztegiak',
    'Corpus orokorrak',
    'Corpus eleaniztunak',
    'Corpus espezializatuak',
    'Posta-zerrendak',
    'Zuzentzaileak',
    'Estilo-liburuak',
    'Bilatzaileak'
];

baliabideendatuak.adorezsin=function()
{
  return {
    name: 'adorezsin',
    displayName: 'Adorez sin.',
    description: 'Adorez sinonimoen hiztegia',
    category: 'Sinonimoen hiztegiak',
    homePage: 'http://www.bostakbat.org/azkue/index.php?q=1',
    pairs: ['eu'],
    method: 'GET',
    getUrl: function (opts)
    {
      var hitza=opts.term.normalize('NFD').replace(/[\u0300-\u036f]/g,"");
      return 'http://www.bostakbat.org/azkue/index.php?q=1&t='+hitza;
    },
    getParams: function (opts)
    {
      return {};
    },
    scrap: function (data, opts)
    {
      var data = data.substring(data.indexOf('<div id="emaitza">'),
                                data.indexOf('<div id="oina">'));
      data = data.replace(/<img/g, "<img height='16' width='16'");
      return data;
    },
    url: ['http://www.bostakbat.org/azkue/index.php?q=1&t='],
  };
}();


//https://aunamendi.eusko-ikaskuntza.eus/eu/bilatu/bernardino/0/
baliabideendatuak.aunamendi = function ()
{
  /*return {
    name: 'aunamendiZAHARRA',
    displayName: 'AuñamendiZAHARRA',
    description: 'Auñamendi Entziklopedia',
    category: 'Hiztegi entziklopedikoak',
    homePage: 'http://www.euskomedia.org/aunamendi?idi=eu&op=1',
    pairs: ['eu-es', 'es-eu', 'eu-en', 'en-eu', 'eu-fr', 'fr-eu'],
    method: 'GET',
    encoding: 'latin-1',
    getUrl: function (opts)
    {
      return 'http://www.euskomedia.org/bilatu';
    },
    getParams: function (opts)
    {
      return {
        'q': opts.term,
        'partialfields': 'fondo:auñamendi'
      };
    },
  };*/
  return {
    name: 'aunamendi',
    displayName: 'Auñamendi',
    description: 'Auñamendi Entziklopedia',
    category: 'Hiztegi entziklopedikoak',
    berrerabiltzekoitxi: true,
    homePage: "https://aunamendi.eusko-ikaskuntza.eus/?idi=eu&op=1",
    pairs: ['eu-es', 'es-eu', 'eu-en', 'en-eu', 'eu-fr', 'fr-eu'],
    method: 'GET',
    //encoding: 'latin-1',
    getUrl: function (opts)
    {
      //alert(hitza);
      //alert('https://aunamendi.eusko-ikaskuntza.eus/eu/bilatu/'+hitza+'/0/')
      return 'https://aunamendi.eusko-ikaskuntza.eus/eu/bilatu/'+opts.term+'/0/';
    },
    getParams: function (opts)
    {
      
      return {};
    }
  };
}();



baliabideendatuak.automatikoak=function()
{
  return {
    name: 'automatikoak',
    displayName: 'Automatikoak',
    description: 'Elhuyarren Automatikoki Sortutako Hiztegiak',
    category: 'Hiztegi orokor eleaniztunak',
    homePage: "http://hiztegiautomatikoak.elhuyar.eus",
    pairs: ['eu-de', 'eu-zh', 'eu-hi', 'eu-sw', 'eu-ar', 'eu-oc',
            'de-eu', 'zh-eu', 'hi-eu', 'sw-eu', 'ar-eu', 'oc-eu'],
    method: 'POST',
    berrerabiltzekoitxi: true,
    getUrl: function (opts)
    {
      return 'http://hiztegiautomatikoak.elhuyar.eus/bilaketa/eu';
    },
    getParams: function (opts)
    {
      var mota;
      if (opts.source=='eu' && opts.target=='de')
      {
          mota='1';
      }
      else if (opts.source=='eu' && opts.target=='zh')
      {
          mota='2';
      }
      else if (opts.source=='eu' && opts.target=='hi')
      {
          mota='3';
      }
      else if (opts.source=='eu' && opts.target=='sw')
      {
          mota='4';
      }
      else if (opts.source=='eu' && opts.target=='ar')
      {
          mota='5';
      }
      else if (opts.source=='eu' && opts.target=='oc')
      {
          mota='11';
      }
      else if (opts.source=='de' && opts.target=='eu')
      {
          mota='6';
      }
      else if (opts.source=='zh' && opts.target=='eu')
      {
          mota='7';
      }
      else if (opts.source=='hi' && opts.target=='eu')
      {
          mota='8';
      }
      else if (opts.source=='sw' && opts.target=='eu')
      {
          mota='9';
      }
      else if (opts.source=='ar' && opts.target=='eu')
      {
          mota='10';
      }
      else if (opts.source=='oc' && opts.target=='eu')
      {
          mota='12';
      };
      return {
        'form_name_or_index':0,
      	'search_type':mota,
        'search_text':opts.term,
        'search':'Bilatu',
        'hidden_elements':{'search':''}
      };
    }
  };
}();

baliabideendatuak.automobilgintza = function ()
{
  return {
    name: 'automobilgintza',
    displayName: 'Automobilgintza',
    description: 'Automobilgintza Hiztegia',
    category: 'Hiztegi terminologiko/tekniko espezializatuak',
    homePage: "http://www.automotivedictionary.net",
    pairs: ['eu-es', 'eu-fr', 'eu-en', 'eu-de', 'eu-zh',
            'es-eu', 'fr-eu', 'en-eu', 'de-eu', 'zh-eu'],
    method: 'GET',
    title: ['Automotive Dictionary'],
    getUrl: function (opts)
    {
      return 'http://www.automotivedictionary.net/'+opts.source+'/'+opts.term;
    },
    getParams: function (opts)
    {
      return {};
    }
  };
}();

baliabideendatuak.batua = function ()
{
  return {
    name: 'batua',
    displayName: 'Euskaltzaindiaren Hizt.',
    description: 'Euskaltzaindiaren Hiztegia',
    category: 'Hiztegi orokorrak',
    title: ['Euskaltzaindia'],
    homePage: 'https://www.euskaltzaindia.eus/index.php?option=com_hiztegianbilatu&view=frontpage&Itemid=410&lang=eu',
    pairs: ['eu'],
    method: 'GET',
    getUrl: function (opts)
    {
      return 'https://www.euskaltzaindia.eus/index.php?sarrera='+opts.term+'&option=com_hiztegianbilatu&view=frontpage&lang=eu';
    },
    getParams: function (opts)
    {
      return {};
    },
    scrap: function (data, opts)
    { 
      return data.substring(data.indexOf('<div class="col-md-9 bil-edukia">'), 
                            data.indexOf('<script>'));
    },
  };
}();

baliabideendatuak.bergara = function ()
{
  return {
    name: 'bergara',
    displayName: 'Bergara',
    description: 'Bergaraldeko Hiztegia',
    category: 'Euskalkietako/Herrietako hiztegiak',
    berrerabiltzekoitxi: true,
    homePage: 'http://www.bergarakoeuskara.eus/hiztegia/',
    pairs: ['eu-es'],
    method: 'POST',
    getUrl: function (opts)
    {
      return 'http://www.bergarakoeuskara.eus/hiztegia';
    },
    getParams: function (opts)
    {
      return {
        'form_name_or_index':1,
        'berbaki':opts.term,
      };
    },
  };
}();

baliabideendatuak.berria = function ()
{
  return {
    name: 'berria',
    displayName: 'Berria',
    description: 'Berriaren estilo liburua',
    category: 'Estilo-liburuak',
    homePage: 'http://www.berria.eus/estiloliburua',
    pairs: ['eu'],
    method: 'GET',
    title: ['Berria Estilo Liburua'],
    getUrl: function (opts)
    {
      return 'http://www.berria.eus/estiloliburua/bilatu';
    },
    getParams: function (opts)
    {
      return {
        'd': 'all',
        's': opts.term,
      };
    }
  };
}();

baliabideendatuak.bfaterminologikoa = function ()
{
  return {
    disabled: true, /* Bi post eskaera egin behar dira, ezinezkoa da orain */
    name: 'bfaterminologikoa',
    displayName: 'BFA Term.',
    description: 'BFA Hiztegi Terminologikoa',
    category: 'Hiztegi terminologiko/tekniko espezializatuak',
    homePage: 'http://apps.bizkaia.net/TK00/servlet/webAgentTK00',
    pairs: ['eu-es',
            'es-eu'],
    method: 'POST',
    getUrl: function (opts)
    {
      return 'http://apps.bizkaia.net/TK00/index.jsp?Idioma=e';
    },
    getParams: function (opts)
    {
        var mota;
        if (opts.source=='eu' && opts.target=='es')
        {
            mota=1;
        }
        else if (opts.source=='es' && opts.target=='eu')
        {
            mota=2;
        }
        return {
          'form_name_or_index':'form1',
          'idioma':mota,
          'termino':opts.term,
        };
    },
    
  };
}();

baliabideendatuak.bizkaiera = function ()
{
  return {
    name: 'bizkaiera',
    displayName: 'Bizkaiera',
    description: 'Bizkaiera idatziaren corpusa',
    category: 'Corpus orokorrak',
    homePage: 'http://www.bizkaiera.biz/index.php?id=95',
    pairs: ['eu'],
    method: 'POST',
    getUrl: function (opts)
    {
      return 'http://www.bizkaiera.biz/index.php?id=95';
    },
    getParams: function (opts)
    {
        return {
          'form_name_or_index':0,
          'registro[testoa]': opts.term,
        };
    }
  };
}();

baliabideendatuak.bostmila = function ()
{
  return {
    name: 'bostmila',
    displayName: '5000',
    description: '5000 hiztegia',
    category: 'Hiztegi orokor eleaniztunak',
    homePage: 'http://www.bostakbat.org/azkue/index.php?q=3',
    pairs: ['eu-es',
            'es-eu'],
    method: 'GET',
    getUrl: function (opts)
    {
      var qa;
      if (opts.source === 'es') {
        qa = '3';
      } else {
        qa = '2';
      }
      var hitza=opts.term.normalize('NFD').replace(/[\u0300-\u036f]/g,"");
      return 'http://www.bostakbat.org/azkue/index.php?q='+qa+'&t='+hitza;
    },
    getParams: function (opts)
    {
      return {};
    },
    scrap: function (data, opts)
    {
      var data = data.substring(data.indexOf('<div id="emaitza">'),
                                data.indexOf('<div id="oina">'));
      data = data.replace(/<img/g, "<img height='16' width='16'");
      return data;
    },
    url: ['http://www.bostakbat.org/azkue/index.php?q=2&t=','http://www.bostakbat.org/azkue/index.php?q=3&t='],
  };
}();

baliabideendatuak.consumer = function ()
{
  return {
    name: 'consumer',
    displayName: 'Consumer',
    description: 'Consumer Corpusa',
    category: 'Corpus eleaniztunak',
    homePage: 'http://corpus.consumer.es/',
    pairs: ['eu-es', 'es-eu'],
    method: 'POST',
    getUrl: function (opts)
    {
      return 'http://corpus.consumer.es/corpus/kontsulta';
    },
    getParams: function (opts)
    {//lehen index 2 zekan
      return {
        'form_name_or_index':0,
        //'form_id':'formularioabera',
        'mota': 'arrunta',
        'hizkuntza': opts.source === 'es' ? 'es' : 'eu',
        'formalema': 'lema',
        'konparazioa': 'da',
        'testuhitza': opts.term,
        'kategoria': '',
        'hizkuntza2': opts.source === 'es' ? 'es' : 'eu',
        'formalema2': '',
        'konparazioa2': '',
        'testuhitza2': '',
        'kategoria2': '',
        'osagaietan': 'eu',
        'grafiko_aukerak': '1forma'
      };
    },
  };
}();

baliabideendatuak.corpeus = function ()
{
  return {
    disabled: true, /* CorpEus ez dago martxan une honetan */
    name: 'corpeus',
    displayName: 'CorpEus',
    description: 'CorpEus - Internet euskarazko corpus gisa',
    category: 'Corpus orokorrak',
    homePage: 'http://corpeus.elhuyar.eus/',
    pairs: ['eu'],
    method: 'POST',
    getUrl: function (opts)
    {
      return 'http://corpeus.elhuyar.eus/cgi-bin/kontsulta.py';
    },
    getParams: function (opts)
    {
      var params = {
        'form_name_or_index':0,
        'bilagaiid': ' ',
        'formalema': 'lema',
        'motorea': 'googleajax',
        'testu-hitza': opts.term,
      };
      if (opts.term.indexOf(' ') != -1) {
        params['testu-hitza'] = '"' + opts.term + '"';
      }
      return params;
    },
  };
}();

baliabideendatuak.danobat = function ()
{
  return {
    name: 'danobat',
    displayName: 'Danobat',
    description: 'Danobat hiztegia',
    category: 'Hiztegi terminologiko/tekniko espezializatuak',
    homePage: 'http://hiztegia.danobatgroup.eus/',
    pairs: ['eu-es', 'es-eu'],
    method: 'POST',
    getUrl: function (opts)
    {
      return 'http://hiztegia.danobatgroup.eus/eu/dictionary/search';
    },
    getParams: function (opts)
    {
      return {
        'form_name_or_index':0,
        'direction_filter': opts.source === 'es' ? 'es-eu' : 'eu-es',
        'term_filter': opts.term,
      };
    },
    /* bilaketa konbinatua kendu egin dut, bilaketa bi pausutan egiten duelako 
    scrap: function (data, opts)
    { console.log(data);
      console.log(data.indexOf('<div id="searchresult">'));
      console.log(data.indexOf('<div class="gallery modal'));
      data = data.substring(data.indexOf('<div id="searchresult">'),
                            data.indexOf('<div class="gallery modal'));
      console.log(data);
      return data;
    },*/
  };
}();

baliabideendatuak.drogomedia = function ()
{
  return {
    disabled: true,
    name: 'drogomedia',
    displayName: 'Drogomedia',
    description: 'Drogomenpekotasunen hiztegia',
    category: 'Hiztegi terminologiko/tekniko espezializatuak',
    homePage: 'http://www.drogomedia.com/eu/diccionarios/0-todos/',
    pairs: ['es-eu'],

  };
}();

baliabideendatuak.egamaster = function ()
{
  return {
    name: 'egamaster',
    displayName: 'Egamaster',
    description: 'Egamaster hiztegia',
    category: 'Hiztegi terminologiko/tekniko espezializatuak',
    title: ['EGAMaster Hiztegia'],
    homePage: 'http://egamaster.elhuyar.eus/',
    pairs: ['eu-es', 'eu-en', 'eu-fr', 'eu-de', 'eu-pt', 'eu-zh',
            'es-eu', 'fr-eu', 'en-eu', 'de-eu', 'pt-eu', 'zh-eu'],
    method: 'GET',
    getUrl: function (opts)
    {
      return 'http://egamaster.elhuyar.eus/'+opts.source+'/'+opts.term;
    },
    getParams: function (opts)
    {
      return {};
    },
  };
}();

baliabideendatuak.egungocorpusa = function ()
{
  return {
    name: 'egungocorpusa',
    displayName: 'ETC',
    description: 'Egungo Testuen Corpusa',
    category: 'Corpus orokorrak',
    homePage: 'http://www.ehu.eus/etc/',
    pairs: ['eu'],
    method: 'GET',
    getUrl: function (opts)
    {
      return 'http://www.ehu.eus/etc';
    },
    getParams: function (opts)
    {
      return {
        'bila': opts.term,
      };
    },
  };
}();

baliabideendatuak.egungo = function ()
{
  return {
    name: 'egungo',
    displayName: 'EEH',
    description: 'Egungo Euskararen Hiztegia',
    category: 'Hiztegi orokorrak',
    homePage: 'http://www.ehu.eus/eeh/',
    pairs: ['eu'],
    method: 'GET',
    getUrl: function (opts)
    {
      return 'http://www.ehu.eus/eeh/cgi/bila';
    },
    getParams: function (opts)
    {
      return {
        'z': opts.term,
      };
    },
  };
}();

baliabideendatuak.ehuskaratuak = function ()
{
  return {
    name: 'ehuskaratuak',
    displayName: 'EHUskaratuak',
    description: 'EHUskaratuak, EHUren itzulpen-memoriak',
    category: 'Corpus eleaniztunak',
    homePage: 'http://ehuskaratuak.ehu.eus/',
    pairs: ['eu-es', 'eu-en', 'eu-fr',
            'es-eu', 'fr-eu', 'en-eu'],
    method: 'POST',
    getUrl: function (opts)
    {
      return 'http://ehuskaratuak.ehu.eus/bilaketa/';
    },
    getParams: function (opts)
    {
      return {
        'form_name_or_index':0,
        'mota': 'arrunta',
        'hizkuntza': opts.source,
        'formalema': 'lema',
        'testuhitza': opts.term,
        'kategoria': '',
        'alor': 'guz',
        'azpialor': 'guz',
        'aurreratua': 'arrunta',
        'hizkuntza2': opts.source,
        'formalema2': 'forma',
        'testuhitza2': '',
        'kategoria2': '',
        'distantzia': '0',
        'osagaietan': [opts.source,opts.target],
        'grafauk': '1forma',
        'grafiko_aukerak': '1forma'
      };
    },
  };
}();

baliabideendatuak.eibar = function ()
{
  return {
    name: 'eibar',
    displayName: 'Eibar',
    description: 'Eibar aldeko hiztegia',
    category: 'Euskalkietako/Herrietako hiztegiak',
    homePage: 'http://www.eibarko-euskara.eus',
    pairs: ['eu-es'],
    method: 'POST',
    getUrl: function (opts)
    {
      return 'http://www.eibarko-euskara.eus/hiztegia/bilatu';
    },
    getParams: function (opts)
    {
      return {
        'form_name_or_index':1,
        'berbaki': opts.term,
        'bidali': 'Bilatu'
      };
    },
  };
}();

baliabideendatuak.elebila = function ()
{
  return {
    disabled: true, /* Elebila ez dago martxan une honetan */
    name: 'elebila',
    displayName: 'Elebila',
    description: 'Elebila euskarazko bilatzailea',
    category: 'Bilatzaileak',
    homePage: 'http://elebila.elhuyar.eus',
    pairs: ['eu'],
    method: 'GET',
    getUrl: function (opts)
    {
      return 'http://elebila.elhuyar.eus/search/';
    },
    getParams: function (opts)
    {
      var params = {
        'bilatu': opts.term,
        'optNon': '1'
      };
      if (opts.term.indexOf(' ') != -1) {
        params['bilatu'] = '"' + opts.term + '"';
      }
      return params;
    },
  };
}();

baliabideendatuak.elhuyar = function ()
{
  return {
    name: 'elhuyar',
    displayName: 'Elhuyar',
    description: 'Elhuyar Hiztegia',
    category: 'Hiztegi orokor eleaniztunak',
    title: ['Elhuyar hiztegiak'],
    homePage: "https://hiztegiak.elhuyar.eus",
    pairs: ['eu-es', 'eu-fr', 'eu-en',
            'es-eu', 'fr-eu', 'en-eu'],
    method: 'GET',
    getUrl: function (opts)
    {
      return [
        'https://hiztegiak.elhuyar.eus/', opts.source, '_', opts.target, '/', opts.term
      ].join('');
    },
    getParams: function (opts)
    {
      return {};
    },
    scrap: function (data, opts)
    {  
      if (data.indexOf('Ez da emaitzarik aurkitu') != -1 || data.indexOf('hitza ez dago hiztegian') != -1) 
      {
        data = data.substring(data.indexOf('<div class="didyoumean">'),
                              data.indexOf('<div class="column bat">'));
        data = data.replace('/proposamenak/',
                            this.homePage + '/proposamenak/');
        return data;
      } 
      else 
      {
        var domSerializer = new XMLSerializer();
        var parser = new DOMParser();
        var dataWord = data.substring(data.indexOf('<div class="boxHitza fLeft">'),
                                     data.indexOf('<div class="boxiconsHitza">'));
        var dataOne = data.substring(data.indexOf('<div class="innerDef">'),
                                     data.indexOf('<div class="innerRelac">'));
        var dataOneDOM = parser.parseFromString(dataOne, "text/html");
        var oneNodes = dataOneDOM.getElementsByTagName('a');
        for (var i in oneNodes) {
          try {
            oneNodes[i].href = [
              this.homePage, '/', opts.target, '_', opts.source, '/',
              oneNodes[i].childNodes[0].innerHTML
            ].join('');
          } catch (e) {
          }
        }
        dataOne = domSerializer.serializeToString(dataOneDOM);
        var dataTwo = data.substring(data.indexOf('<div class="innerRelac">'),
                                     data.indexOf('<div class="column bat">'));
        dataTwo = dataTwo.replace(/<a/g, '<strong');
        dataTwo = dataTwo.replace(/<\/a/g, '</strong');
        var dataThree = data.substring(data.indexOf('<div class="boxEzker">'),
                                       data.indexOf('<div id="corpusa_edukia">'));
        var dataThreeDOM = parser.parseFromString(dataThree, "text/html");
        var threeNodes = dataThreeDOM.getElementsByTagName('a');
        for (var i in threeNodes) {
          try {
            threeNodes[i].href = [
              this.homePage, '/', opts.source, '_', opts.target, '/',
              threeNodes[i].innerHTML
            ].join('');
          } catch (e) {
          }
        }
        dataThree = domSerializer.serializeToString(dataThreeDOM);
        return dataWord + dataOne + dataTwo + dataThree;
      }
    }
  };
}();

baliabideendatuak.elhuyarwebcorpusaeues = function ()
{
  return {
    name: 'elhuyarwebcorpusaeues',
    displayName: 'ElhWebCorp eu-es',
    description: 'Elhuyar Web Corpusa - Paraleloa (eu-es)',
    category: 'Corpus eleaniztunak',
    homePage: 'http://webcorpusak.elhuyar.eus',
    pairs: ['eu-es', 'es-eu'],
    method: 'GET',
    getUrl: function (opts)
    {
      return 'http://webcorpusak.elhuyar.eus/cgi-bin/kontsulta2.py';
    },
    getParams: function (opts)
    {
      return {
        'testuhitza': opts.term,
        'hizkuntza': opts.source,
        'formalema': 'lema',
        'konparazioa': 'da',
      };
    },
  };
}();

baliabideendatuak.elhuyarwebcorpusaeu = function ()
{
  return {
    name: 'elhuyarwebcorpusaeu',
    displayName: 'ElhWebCorp eu',
    description: 'Elhuyar Web Corpusa - Euskarazkoa',
    category: 'Corpus orokorrak',
    homePage: 'http://webcorpusak.elhuyar.eus/sarrera_elebakarra.html',
    pairs: ['eu'],
    method: 'GET',
    getUrl: function (opts)
    {
      return 'http://webcorpusak.elhuyar.eus/cgi-bin/kontsulta.py';
    },
    getParams: function (opts)
    {
      return {
        'testu-hitza1': opts.term,
        'formalema1': 'lema',
        'konparazioa1': 'da',
        'ordenatu': 'ordenadok',
      };
    },
  };
}();

baliabideendatuak.elhuyarwebcorpusakonbinazioak = function ()
{
  return {
    name: 'elhuyarwebcorpusakonbinazioak',
    displayName: 'ElhWebCorp konb.',
    description: 'Elhuyar Web Corpusa - Konbinazioak',
    category: 'Fraseologia hiztegiak',
    homePage: 'http://webcorpusak.elhuyar.eus/sarrera_konbinazioak.html',
    pairs: ['eu'],
    method: 'GET',
    getUrl: function (opts)
    {
      return 'http://webcorpusak.elhuyar.eus/cgi-bin/kolokatuak.py';
    },
    getParams: function (opts)
    {
      return {
        'testuhitza': opts.term,
        'ordenatu': 't',
      };
    },
  };
}();

baliabideendatuak.energia = function ()
{
  return {
    name: 'energia',
    displayName: 'Energia',
    description: 'EEEren Energia Hiztegia',
    category: 'Hiztegi terminologiko/tekniko espezializatuak',
    homePage: 'https://www.eve.eus/Hiztegia.aspx',
    pairs: ['eu-es', 'eu-en', 'eu-fr',
            'es-eu', 'en-eu', 'fr-eu'],
    method: 'POST',
    title: ['EVE - Energiaren Euskal Erakundea'],
    alert: true,
    getUrl: function (opts)
    {
      return (
        'https://www.eve.eus/Hiztegia.aspx'
      );
    },
    getParams: function (opts)
    {
      return {
        'form_name_or_index':0,
        'form_method':'POST',
        'hidden_elements': {'p$lt$ctl04$pageplaceholder$p$lt$ctl00$Hiztegia$btnBilatu': 'Bilatu'},
        'lng': 'eu-ES',
        'p$lt$ctl03$MenuSuperior$buscador': '',
        'p$lt$ctl03$MenuSuperior$buscador_responsive': '',
        'p$lt$ctl04$pageplaceholder$p$lt$ctl00$Hiztegia$txtTerminoa': opts.term,
        'p$lt$ctl04$pageplaceholder$p$lt$ctl00$Hiztegia$cbAmaiera': 'on',
        'p$lt$ctl04$pageplaceholder$p$lt$ctl00$Hiztegia$ddlHizkuntza': opts.source,
        'p$lt$ctl04$pageplaceholder$p$lt$ctl00$Hiztegia$ddlArloa': 'edozein',
        'p$lt$ctl04$pageplaceholder$p$lt$ctl00$Hiztegia$gnRadios': 'rbTerminoetan',
        'p$lt$ctl04$pageplaceholder$p$lt$ctl00$Hiztegia$ddlArloaIrudientzako': 'edozein',
        'p$lt$ctl04$pageplaceholder$p$lt$ctl00$Hiztegia$ddlArtikuluenArloa': 'edozein'
      };
    }
  };
}();

//https://www.euskaltzaindia.eus/index.php?option=com_ecoeoda&task=bilaketa&Itemid=472&lang=eu&query=zegama&mota=bateratua
baliabideendatuak.eoda = function ()
{
  return {
    name: 'eoda',
    displayName: 'EODA',
    description: 'EODA - Euskal Onomastikaren Datutegia',
    category: 'Hiztegi terminologiko/tekniko espezializatuak',
    title: ['Euskaltzaindia'],
    berrerabiltzekoitxi: true,
    homePage: "https://www.euskaltzaindia.eus/index.php?option=com_ecoeoda&task=bilaketaPortada&Itemid=472&lang=eu",
    pairs: ['eu-es', 'es-eu'],
    method: 'GET',
    getUrl: function (opts)
    {
      var term = opts.term.trim();
      return 'https://www.euskaltzaindia.eus/index.php?option=com_ecoeoda&task=bilaketa&view=bilaketa&Itemid=472&lang=eu&query='+term+'&mota=bateratua';
    },
    getParams: function (opts)
    {
      return {};
    },
  };
}();


baliabideendatuak.ereduzkodinamikoa = function ()
{
  return {
    name: 'ereduzkodinamikoa',
    displayName: 'EPD',
    description: 'Ereduzko Prosa Dinamikoa',
    category: 'Corpus orokorrak',
    homePage: 'http://www.ehu.eus/ehg/epd/',
    pairs: ['eu'],
    method: 'GET',
    getUrl: function (opts)
    {
      return 'http://www.ehu.eus/ehg/cgi/epd/bilatu10.pl';
    },
    getParams: function (opts)
    {
      return {
        'o': '1',
        'c-04-08': '04-08',
        'c-09-13': '09-13',
        'm1': 'lema',
        'n': 'bietan',
        'k1': '1',
        'd2': '1',
        'h1': opts.term,
      };
    },
  };
}();

baliabideendatuak.ereduzkoa = function ()
{
  return {
    name: 'ereduzkoa',
    displayName: 'EPG',
    description: 'Ereduzko Prosa Gaur',
    category: 'Corpus orokorrak',
    homePage: 'http://www.ehu.eus/cgi-bin/ereduzkoa/bilatu09.pl',
    pairs: ['eu'],
    method: 'GET',
    getUrl: function (opts)
    {
      return 'http://www.ehu.eus/cgi-bin/ereduzkoa/bilatu09.pl';
    },
    getParams: function (opts)
    {
      return {
        'o': '1',
        'h': '1',
        'n': 'bietan',
        'k1': '1',
        'm1': 'hitza',
        'h1': opts.term,
      };
    },
  };
}();

baliabideendatuak.eurovoc = function ()
{
  return {
    name: 'eurovoc',
    displayName: 'Eurovoc',
    description: 'Eurovoc Thesaurusa',
    category: 'Hiztegi terminologiko/tekniko espezializatuak',
    title: ['Bizkaia.Eus: Sailak','Bizkaia.Eus: Temas'],
    homePage: 'http://www.bizkaia.eus/kultura/eurovoc/index.asp?Tem_Codigo=2861&idioma=EU&dpto_biz=4&codpath_biz=4|292|2861',
    pairs: ['eu-es', 'es-eu'],
    method: 'POST',
    berrerabiltzekoitxi:true,
    getUrl: function (opts)
    {
      return 'http://www.bizkaia.eus/kultura/eurovoc/busqueda.asp';
    },
    getParams: function (opts)
    {
      return {
        'form_name_or_index':1,
        'txtBuscar': 'S',
        'query': opts.term,
        'idioma': opts.source === 'es' ? 'CA' : 'EU',
      };
    },
  };
}();





baliabideendatuak.euskalklasikoak = function ()
{
  return {
    name: 'euskalklasikoak',
    displayName: 'EKC',
    description: 'Euskal Klasikoen Corpusa',
    category: 'Corpus orokorrak',
    homePage: 'http://www.ehu.eus/ehg/kc/',
    pairs: ['eu'],
    method: 'GET',
    getUrl: function (opts)
    {
      return 'http://www.ehu.eus/ehg/cgi/kc/bilatu.pl';
    },
    getParams: function (opts)
    {
      return {
        'o': '1',
        'm1': 'lema',
        'k1': '1',
        'd2': '1',
        'garaia': '0',
        'euskalkia': '0',
        'generoa': '0',
        'h1': opts.term,
      };
    },
  };
}();

baliabideendatuak.euskalterm = function ()
{
  return {
    name: 'euskalterm',
    displayName: 'Euskalterm',
    description: 'Euskalterm Terminologia Banku Publikoa',
    category: 'Hiztegi terminologiko/tekniko orokorrak',
    berrerabiltzekoitxi: true,
    homePage: "https://www.euskadi.eus/euskalterm/",
    pairs: ['eu-es', 'eu-fr', 'eu-en', 'eu-de', 'eu-la',
            'es-eu', 'fr-eu', 'en-eu', 'de-eu', 'la-eu'],
    method: 'GET',
    getUrl: function (opts)
    {
      var term = opts.term.trim();
      
      // Hitz zatiak erabiltzen direnean, * komodina erabiliko bailitzan
      // egin ditzala bilaketak
      if (term.charAt(term.length - 1) != "%") {
        term = term + "%25";
      }
      var langMap = {
        'es': 'es',
        'en': 'en',
        'fr': 'fr',
        'la': 'la',
        'de': 'de',
      },
      lang = langMap[opts.source] || 'eu';
      return 'https://www.euskadi.eus/app/euskal-terminologia-banku-publikoa/'+term+'/kontsultatermino/'+term+'/non-du/hizk-'+lang+'/ter-on';
    },
    getParams: function (opts)
    {
      
      return {};
    },
    scrap: function (data, opts)
    { //responsearen gainean eval bat bota
      //https://stackoverflow.com/questions/8260355/jquery-get-doesnt-execute-javascript/8279719
      data= eval(data);
      return data.substring(data.indexOf('<div id="taulaEmaitzak" class="mt-4 ml-1 mr-1">'), 
                            data.indexOf('<ul id="zenbakitzea" class="pagination list-unstyled mt-5">'));
    },
  };
}();

baliabideendatuak.ebe = function ()
{
  return {
    name: 'ebe',
    displayName: 'EBE',
    description: 'EBE - Euskara Batuaren Eskuliburua',
    category: 'Hiztegi orokorrak',
    title: ['Euskaltzaindia'],
    berrerabiltzekoitxi: true,
    homePage: "https://www.euskaltzaindia.eus/index.php?option=com_ebe&view=bilaketa&task=sarrera&Itemid=1161",
    pairs: ['eu'],
    method: 'GET',
    getUrl: function (opts)
    {
      var term = opts.term.trim();
      return 'https://www.euskaltzaindia.eus/index.php?option=com_ebe&task=bilaketa&view=bilaketa&Itemid=1161&lang=eu-ES&query='+term+'&mota=';
    },
    getParams: function (opts)
    {
      return {};
    },
  };
}();

baliabideendatuak.farmazia = function ()
{
  return {
    name: 'farmazia',
    displayName: 'Farmazia',
    description: 'Farmazia hiztegia',
    category: 'Hiztegi terminologiko/tekniko espezializatuak',
    homePage: 'http://www.feuse.eus/hiztegia/',
    pairs: ['eu-es', 'es-eu'],
    method: 'POST',
    getUrl: function (opts)
    {
      return 'http://www.feuse.eus/diccionario/index.php';
    },
    getParams: function (opts)
    {
      return {
        'form_name_or_index':0,
        'form_url':'./index.php',
        'form_method':'POST',
        'data': opts.term.normalize('NFD').replace(/[\u0300-\u036f]/g,""),
        'sailkapena': ''
      };
    }
  };
}();

baliabideendatuak.freelang = function ()
{
  return {
    name: 'freelang',
    displayName: 'Freelang',
    description: 'Freelang hiztegia',
    category: 'Hiztegi orokor eleaniztunak',
    title: ['FREELANG'],
    homePage: 'http://www.freelang.com/enligne/basque.php?lg=fr',
    pairs: ['eu-fr', 'fr-eu'],
    method: 'POST',
    getUrl: function (opts)
    {
      return 'http://www.freelang.com/enligne/basque.php?lg=fr';
    },
    getParams: function (opts)
    {
      if (opts.source=='eu')
      {
          return {
            'form_name_or_index':'myform',
            'dico': 'fr_bas_fra',
            'mot1': opts.term,
            'mot2':''
          }
      }
      else
      {
          return {
            'form_name_or_index':'myform',
            'dico': 'fr_bas_fra',
            'mot2': opts.term,
            'mot1':''
          }
      }
    },
  };
}();

baliabideendatuak.garate = function ()
{
  return {
    name: 'garate',
    displayName: 'Garate',
    description: 'Gotzon Garate - Atsotitzak',
    category: 'Fraseologia hiztegiak',
    berrerabiltzekoitxi: true,
    title: ['Gotzon Garate - Atsotitzak'],
    homePage: 'http://www.ametza.com/bbk/htdocs/garate.htm',
    pairs: ['eu'],
    method: 'POST',
    getUrl: function (opts)
    {
      return 'http://www.ametza.com/cgi-bin-bb/HTMODFOR?ActionField=getmodel&$SetAplicacion=BBK&$ModelBila=/bbk/htdocs/bilaketl.htm&$ModelBurua=/bbk/htdocs/emaiburu.htm&$ModelEmaitza=/bbk/htdocs/emaitza.htm&$ModelBalioki=/bbk/htdocs/balioki.htm&$ModelFrame=/bbk/htdocs/emaifram.htm&$Hizkuntza=E&CmdGetModel=/bbk/htdocs/bilaketl.htm';
    },
    getParams: function (opts)
    {
      return {
        'form_name_or_index':0,
        'ActionField':'exemodel',
        '$Hizkuntza':'E',
        '$ModelFSarrera':'',  
        '$ModelSarrera':'',  
        '$ModelFBila':'',  
        '$ModelFBila':'/bbk/htdocs/bilaketl.htm',
        '$ModelBurua':'/bbk/htdocs/emaiburu.htm',
        '$ModelEmaitza':'/bbk/htdocs/emaitza.htm',
        '$ModelBalioki':'/bbk/htdocs/balioki.htm',
        '$ModelFrame':'/bbk/htdocs/emaifram.htm',
        '$SetAplicacion':'BBK',
        '$CmdGetModel':'',
        '@20':'',
        '@1':'',
        '@01xmt^,11':opts.term,
        '@01,12':'&',
        '@01xmt^,12':'',  
        '@01,13':'&',
        '@01xmt^,13':'',
        '@01,14':'&',
        '@01xmt^,14':'',  
      };
    },
  };
}();

//garaterm TODO
//http://garaterm-corpusa.ixa.eus/search_API?query=indar&type=lemma&comparation=is&search_box_type=combined&result=kwicCount&order=sortDoc&chart=form
baliabideendatuak.garaterm = function ()
{
  return {
    name: 'garaterm',
    displayName: 'Garaterm',
    description: 'Garaterm corpusa',
    category: 'Corpus orokorrak',
    title: ['Garaterm corpusa'],
    homePage: 'http://garaterm-corpusa.ixa.eus/search',
    pairs: ['eu'],
    method: 'GET',
    getUrl: function (opts)
    {
      return 'http://garaterm-corpusa.ixa.eus/search_API?query='+opts.term+'&type=lemma&comparation=is&search_box_type=combined&result=kwicCount&order=sortDoc&chart=form'
    },
    getParams: function (opts)
    {
      return {};
    },
  };
}();

baliabideendatuak.gemet = function ()
{
  return {
    name: 'gemet',
    displayName: 'GEMET',
    description: 'GEMET ingurumen thesaurus-a',
    category: 'Hiztegi terminologiko/tekniko espezializatuak',
    title: ['Search thesaurus'],
    homePage: 'http://www.eionet.europa.eu/gemet/eu/themes/',
    pairs: ['eu-es', 'eu-en', 'eu-fr', 'eu-de', 'eu-pt', 'eu-ar', 'eu-zh',
            'es-eu', 'fr-eu', 'en-eu', 'de-eu', 'pt-eu', 'ar-eu', 'zh-eu'],
    method: 'GET',
    getUrl: function (opts)
    {
      var hizkuntzak={
          'eu':'eu',
          'ar':'ar',
          'zh':'zh-CN',
          'en':'en',
          'fr':'fr',
          'de':'de',
          'pt':'pt',
          'es':'es',
      };
      return 'http://www.eionet.europa.eu/gemet/'+hizkuntzak[opts.source]+'/search/?query='+opts.term;
    },
    getParams: function (opts)
    {
      return {};
    },
    url: ['http://www.eionet.europa.eu/gemet/'],
  };
}();

baliabideendatuak.gizarte = function ()
{
  return {
    name: 'gizarte',
    displayName: 'Gizarte Zerbitzuak',
    description: 'Gizarte Zerbitzuen hiztegia',
    category: 'Hiztegi terminologiko/tekniko espezializatuak',
    title: ['GZ Hiztegia'],
    homePage: 'http://gizartezerbitzuenhiztegia.eus',
    pairs: ['eu-es', 'es-eu'],
    method: 'GET',
    getUrl: function (opts)
    {
      return 'http://gizartezerbitzuenhiztegia.eus/'+opts.source+'/'+opts.term;
    },
    getParams: function (opts)
    {
      return {};
    },
  };
}();

baliabideendatuak.glosbe=function()
{
  return {
    name: 'glosbe',
    displayName: 'Glosbe',
    description: 'Glosbe hiztegia',
    category: 'Hiztegi orokor eleaniztunak',
    homePage: "https://glosbe.com/",
    pairs: ['eu-hi', 'eu-ar', 'eu-en', 'eu-es', 'eu-zh', 'eu-pt', 'eu-de', 'eu-fr', 'eu-jp', 'eu-la', 'eu-pt', 'eu-sw', 'eu-oc',
            'hi-eu', 'ar-eu', 'en-eu', 'es-eu', 'zh-eu', 'pt-eu', 'de-eu', 'fr-eu', 'jp-eu', 'la-eu', 'pt-eu', 'sw-eu', 'oc-eu'],
    method: 'GET',
    getUrl: function (opts)
    {
      var hizkuntzak={
          'eu': 'eu',
          'ar': 'ar',
          'en': 'en',
          'hi': 'hi',
          'es': 'es',
          'zh': 'zh',
          'pt': 'pt',
          'de': 'de',
          'fr': 'fr',
          'jp': 'ja',
          'la': 'la',
          'sw': 'sw',
          'oc': 'oc',
      }
      return 'https://glosbe.com/'+hizkuntzak[opts.source]+'/'+hizkuntzak[opts.target]+'/'+opts.term;
    },
    getParams: function (opts)
    {
      return {};
    },
    title: ['Glosbe']
  };
}();

baliabideendatuak.goihata = function ()
{
  return {
    name: 'goihata',
    displayName: 'Goihata',
    description: 'Goihata hiztegia',
    category: 'Hiztegi orokor eleaniztunak',
    title: ['kotobai'],
    homePage: 'http://www.kotobai.com/',
    pairs: ['eu-jp', 'jp-eu'],
    method: 'POST',
    getUrl: function (opts)
    {
      return 'http://dic.kotobai.com/dictionary.php?lang=eu';
    },
    getParams: function (opts)
    {
      return {
        'form_name_or_index':0,
        'search':opts.term,
        'searchpart':'start',
        'searchfrom':opts.source,
      };
    },
  };
}();

baliabideendatuak.harluxet = function ()
{
  return {
    name: 'harluxet',
    displayName: 'Harluxet',
    description: 'Harluxet Hiztegi Entziklopedikoa',
    category: 'Hiztegi entziklopedikoak',
    berrerabiltzekoitxi: true,
    homePage: 'http://www1.euskadi.net/harluxet/',
    pairs: ['eu'],
    method: 'POST',
    getUrl: function (opts)
    {
      return 'http://www1.euskadi.net/harluxet/emaitza.asp';
    },
    getParams: function (opts)
    {
      return {
        'form_name_or_index':0,
        'form_url':'./emaitza.asp',
        'form_method':'POST',
        'bilaketamota': 'testua',
        'sarrera': opts.term,
        'B1': 'Bilatu'
      };
    },
  };
}();

/*
//onlinekoa ez dabil, zerrendatik kendu egin dut.

baliabideendatuak.hautalan = function ()
{
  return {
    name: 'hautalan',
    displayName: 'Hauta Lana',
    description: 'Hauta Lanerako Euskal Hiztegia',
    category: 'Hiztegi orokorrak',
    title: ['Sarasola Euskal Hiztegia'],
    homePage: 'http://www.euskara.euskadi.net/r59-15172x/eu/sarasola/sarasola.apl',
    pairs: ['eu'],
    berrerabiltzekoitxi: true,
    method: 'POST',
    getUrl: function (opts)
    {
      return 'http://www.euskara.euskadi.net/r59-15172x/eu/sarasola/sarasola.apl';
    },
    getParams: function (opts)
    {
      return {
        'form_name_or_index':0,
        'hitza': opts.term,
        'click_button':'bilatu'
      };
    },
  };
}();
*/

baliabideendatuak.hbep = function ()
{
  return {
    name: 'hbep',
    displayName: 'HBEP',
    description: 'Hiztegi Batua Euskal Prosan',
    category: 'Corpus orokorrak',
    homePage: 'http://www.ehu.eus/ehg',
    pairs: ['eu'],
    method: 'GET',
    getUrl: function (opts)
    {
      return 'http://www.ehu.eus/ehg/cgi/bila';
    },
    getParams: function (opts)
    {
      return {
        'z': opts.term
      };
    }
  };
}();

baliabideendatuak.hikea = function ()
{
  return {
    name: 'hikea',
    displayName: 'HIKEA',
    description: 'HIKEA EITBren hiztegia',
    category: 'Estilo-liburuak',
    homepage: 'http://www.eitb.eus/eu/kultura/euskara/kontsultak/',
    pairs: ['eu-es', 'eu-en', 'eu-fr', 'eu-la',
            'es-eu', 'en-eu', 'fr-eu', 'la-eu'],
    method: 'GET',
    getUrl: function (opts)
    {
      return 'http://www.eitb.eus/eu/kultura/euskara/kontsultak';
    },
    getParams: function (opts)
    {
      return {
        'busqueda_hikea': opts.term,
        'hizkuntza': opts.source,
      };
    },
  };
}();

baliabideendatuak.hobelex = function ()
{
  return {
    name: 'hobelex',
    displayName: 'Hobelex',
    description: 'Hobelex zuzentzaile ortografikoa eta lexikoa',
    category: 'Zuzentzaileak',
    title: ['Hobelex'],
    homePage: 'http://www.uzei.eus/online/hobelex/',
    pairs: ['eu'],
    method: 'POST',
    getUrl: function (opts)
    {
      return 'http://www.uzei.eus/online/hobelex/';
    },
    getParams: function (opts)
    {
      return {
        'form_name_or_index':0,
        'idite_text': opts.term,
      };
    }
  };
}();

baliabideendatuak.imemoriak = function ()
{
  return {
    disabled: true, /* frame-ak ditu eta barruko frame-a irekitzeko klik egin behar da, eta frame-a soilik irekitzen ez du uzten referer gabe */
    name: 'imemoriak',
    displayName: 'iMemoriak',
    description: 'GFAren itzulpen-memoriak',
    category: 'Corpus eleaniztunak',
    homePage: 'http://www.gipuzkoa.eus/imemoriak/',
    pairs: ['eu-es', 'es-eu'],
    method: 'POST',
    getUrl: function (opts)
    {
      return 'http://82.116.160.151/egfab/egfakontsulta_kanpServlet';
    },
    getParams: function (opts)
    {
      return {
        ERAGIKETA: 'Bilatu',
        hizkuntza: opts.source.toUpperCase(),
        galdera: opts.term,
      };
    },
  };
}();

baliabideendatuak.intza = function ()
{
  return {
    name: 'intza',
    displayName: 'Intza',
    description: 'Intza proiektuaren lokuzioak',
    category: 'Fraseologia hiztegiak',
    homePage: 'http://intza.armiarma.eus/',
    pairs: ['eu-es', 'eu-fr',
            'es-eu', 'fr-eu'],
    method: 'GET',
    encoding: 'ascii',
    getUrl: function (opts)
    {
      return 'http://intza.armiarma.eus/cgi-bin/bilatu2.pl';
    },
    getParams: function (opts)
    {
      var params = {
        'hitza1': opts.term,
        'eremu3': '1'
      };
      if (opts.source === 'es') {
        params['eremu1'] = 'eeki';
      } else if (opts.source === 'fr') {
        params['eremu1'] = 'feki';
      } else {
        params['eremu1'] = 'giltzarriak';
      }
      return params;
    },
    scrap: function (data, opts)
    {
      var output = data;
      var output2 = output.split("Bilaketaren emaitza")[2];
      output = '<strong><font face="bitstream vera sans, verdana, arial" size="3">'
        + opts.term + '</font></strong>' + output2;
      var output3 = output.split("<form")[0];
      output = output3.replace(
          /<font size=5>/g,
          '<font size="3">'
      );
      output = output.replace(
          /\/cgi-bin/g,
          "http:\/\/intza.armiarma.com\/cgi-bin"
      );
      output = output.replace(
          /\/intza\/kon/g,
          "http:\/\/intza.armiarma.com\/intza\/kon"
      );
      return output;
    },
  };
}();

baliabideendatuak.itzul = function ()
{
  return {
    name: 'itzul',
    displayName: 'ItzuL',
    description: 'ItzuL posta-zerrendako artxiboa',
    category: 'Posta-zerrendak',
    title: ['pipermail/itzul'],
    homePage: 'http://postaria.com/pipermail/itzul/',
    pairs: ['eu'],
    method: 'GET',
    getUrl: function (opts)
    {
      return 'https://www.google.com/search';
    },
    getParams: function (opts)
    {
      return {
        'q': opts.term + ' site:http://postaria.com/pipermail/itzul/'
      };
    },
  };
}();

baliabideendatuak.jakinbai = function ()
{
  return {
    name: 'jakinbai',
    displayName: 'Jakinbai',
    description: 'Jakinbai lanbide heziketarako hiztegia',
    category: 'Hiztegi terminologiko/tekniko espezializatuak',
    title: ['Laneki hiztegia'],
    homePage: 'http://hiztegia.jakinbai.eus/',
    pairs: ['eu-es', 'es-eu'],
    method: 'GET',
    getUrl: function (opts)
    {
      return 'http://hiztegia.jakinbai.eus/term/'+opts.source+'/'+opts.term;
    },
    getParams: function (opts)
    {
      return {};
    },
  };
}();

baliabideendatuak.justizia = function ()
{
  return {
    name: 'justizia',
    displayName: 'Justizia',
    description: 'Justizia Hiztegia',
    category: 'Hiztegi terminologiko/tekniko espezializatuak',
    homePage: 'http://www.justizia.eus/euskara-justizian',
    pairs: ['eu-es', 'es-eu'],
    method: 'GET',
    title: ['Euskara justizian'],
    getUrl: function (opts)
    {
      return 'http://www.justizia.eus/euskara-justizian';
    },
    getParams: function (opts)
    {
      var hizkuntza;
      if (opts.source=='eu')
      {
      	hizkuntza='EU';
      }
      else
     {
      	hizkuntza='ES';
      };
      return {
        'cjterm': opts.term.normalize('NFD').replace(/[\u0300-\u036f]/g,""),
        'bjterm': 'Bilatu',
        'idiomaBusq': hizkuntza
      };
    },
  };
}();

baliabideendatuak.kamusi=function()
{
  return {
    name: 'kamusi',
    displayName: 'Kamusi',
    description: 'Kamusi project hiztegia',
    category: 'Hiztegi orokor eleaniztunak',
    homePage: "https://kamusi.org",
    pairs: ['eu-hi', 'eu-ar', 'eu-en', 'eu-es', 'eu-zh', 'eu-pt',
            'hi-eu', 'ar-eu', 'en-eu', 'es-eu', 'zh-eu', 'pt-eu'],
    method: 'GET',
    getUrl: function (opts)
    {
      var hizkuntzak={
          'eu': 'eus',
          'ar': 'ara',
          'en': 'eng_3_0',
          'hi': 'hin',
          'es': 'spa',
          'zh': 'cmn',
          'pt': 'por_pt',
      }
      return 'https://kamusi.org/search?from='+hizkuntzak[opts.source]+'&to='+hizkuntzak[opts.target]+'&term='+opts.term;
    },
    getParams: function (opts)
    {
      return {};
    },
    title: ['Kamusi GOLD']
  };
}();

baliabideendatuak.katalogazioa = function ()
{
  return {
    name: 'katalogazioa',
    displayName: 'Katalogazioa',
    description: 'Joana Albret Katalogazioko Terminologia',
    category: 'Hiztegi terminologiko/tekniko espezializatuak',
    homePage: 'http://joana-albret.iametza.com/',
    pairs: ['eu'],
    method: 'GET',
    getUrl: function (opts)
    {
      return 'http://joana-albret.iametza.com/index.php';
    },
    getParams: function (opts)
    {
      return {
        'Hitza': opts.term,
        'act': 'bilaketa'
      };
    },
  };
}();

baliabideendatuak.klasikoak = function ()
{
  return {
    name: 'klasikoak',
    displayName: 'Klasikoak',
    description: 'Klasikoen Gordailua',
    category: 'Corpus orokorrak',
    homePage: 'http://klasikoak.armiarma.eus/',
    pairs: ['eu'],
    method: 'GET',
    getUrl: function (opts)
    {
      return 'http://klasikoak.armiarma.eus/cgi-bin/bila.pl';
    },
    getParams: function (opts)
    {
      return {
        'testua': opts.term
      };
    },
  };
}();

baliabideendatuak.labayru = function ()
{
  return {
    name: 'labayru',
    displayName: 'Labayru',
    description: 'Labayru Hiztegia',
    category: 'Hiztegi orokor eleaniztunak',
    title: ['Labayru Hiztegia'],
    homePage: 'http://hiztegia.labayru.eus',
    pairs: ['eu-es', 'es-eu'],
    method: 'GET',
    getUrl: function (opts)
    {
      return 'http://hiztegia.labayru.eus/bilatu/LH/'+ opts.source +'/' + opts.term;
    },
    getParams: function (opts)
    {
      return {};
    },
    /* Ezin da egin scrap, ez du CORS onartzen webguneak
    scrap: function (data, opts)
    {
      var output = '';
      var startSpan = '<span class="euskalbar-start"></span>';
      output = data.split(startSpan);
      output = output[1];
      var endSpan = '<span class="euskalbar-end"></span>';
      output = output.split(endSpan);
      output = output[0];
      output = output.replace(
              /<span class=["']significado["']>([^\<]*)\<\/span\>/gi,
              '<em>$1</em>'
      );
      output = output.replace(
              /<span class=["']equivalencia-word["']>([^\<]*)\<\/span\>/gi,
              '<strong>$1</strong>'
      );
      output = output.replace(
              /<span class=["']explicacionNotaSemantica["']>([^\<]*)\<\/span\>/gi,
              '<em>$1</em>'
      );
      output = output.replace(
              /<span class=["']nota-equivalencia["']>([^\<]*)\<\/span\>/gi,
              '<em>$1</em>'
      );
      output = output.replace(
              /(<div class=["']blockEjemplos["']>)/gi,
              '<br>$1'
      );
      output = output.replace(
              /<span class=["']ejemploFirst["']>([^\<]*)\<\/span\>/gi,
              '<em>$1</em>'
      );
      return output;
    },*/
  };
}();

//https://www.legebiltzarra.eus/portal/eu/web/eusko-legebiltzarra/servicios-administrativos/buscador-hiztegi#_48_INSTANCE_VgApmF7SsNEE_%253Dhttps%25253A%25252F%25252Fwww.legebiltzarra.eus%25252Fords%25252Ff%25253Fp%25253DCTP%25253AHIZTEGI_FILTRO%25253A%25253A%25253A%25253A%25253ARESETBRCRMB%25253AY%252526%252526p_lang%25253Deu%3D%26_48_INSTANCE_VgApmF7SsNEE_%3Dhttps%253A%252F%252Fwww.legebiltzarra.eus%252Fords%252Ff%253Fp%253D120%253A44%253A104506754150759%253A%253ANO%253ARP%252CRIR%253AP43_BALIOKIDEA%252CP43_TERMINO%253A%25255Czaintza%25255C%252C%25255C%25255C
baliabideendatuak.legebiltzarra = function ()
{
  return {
    name: 'legebiltzarra',
    displayName: 'Legebiltzarra',
    description: 'Eusko Legebiltzarreko Hiztegia',
    category: 'Hiztegi terminologiko/tekniko espezializatuak',
    title: ['Eusko Legebiltzarra'],
    homePage: 'http://www.legebiltzarra.eus/portal/eu/web/eusko-legebiltzarra/servicios-administrativos/diccionario-parlamentario',
    pairs: ['eu-es', 'es-eu'],
    method: 'GET',
    getUrl: function (opts)
    {
      var bilahizk='E';
      if (opts.source=='es')
      {
          bilahizk='C';
      }
      return 'http://www.legebiltzarra.eus/cm_hiztegie/SDW?W=HIZ_TERM'+bilahizk+'+PH+IS+"'+opts.term.normalize('NFD').replace(/[\u0300-\u036f]/g,"")+'"&M=1';
    },
    
    getParams: function (opts)
    {
      return {};
    },
  };
}();

baliabideendatuak.lexikoarenbehatokia = function ()
{
  return {
    name: 'lexikoarenbehatokia',
    displayName: 'Lexikoaren B.',
    description: 'Lexikoaren Behatokiaren corpusa',
    category: 'Corpus orokorrak',
    homePage: 'http://lexikoarenbehatokia.euskaltzaindia.eus',
    pairs: ['eu'],
    method: 'GET',
    getUrl: function (opts)
    {
      return 'http://lexikoarenbehatokia.euskaltzaindia.eus/cgi-bin/kontsulta.py';
    },
    getParams: function (opts)
    {
      return {
        'testu-hitza1': opts.term,
      };
    },
  };
}();

baliabideendatuak.librezale = function ()
{
  return {
    name: 'librezale',
    displayName: 'Librezale',
    description: 'Librezale posta-zerrendako artxiboa',
    category: 'Posta-zerrendak',
    title: ['pipermail/librezale'],
    homePage: 'http://librezale.eus/pipermail/librezale/',
    pairs: ['eu'],
    method: 'GET',
    getUrl: function (opts)
    {
      return 'https://www.google.com/search';
    },
    getParams: function (opts)
    {
      return {
        'q': opts.term + ' site:http://librezale.eus/pipermail/librezale/'
      };
    },
  };
}();

baliabideendatuak.literatura = function ()
{
  return {
    name: 'literatura',
    displayName: 'Literatura',
    description: 'Literatura Terminoen Hiztegia',
    category: 'Hiztegi terminologiko/tekniko espezializatuak',
    homePage: 'http://www.euskaltzaindia.eus/index.php?option=com_xslt&lang=eu&layout=lth_list&search=1&view=frontpage%20&Itemid=414',
    pairs: ['eu'],
    method: 'GET',
    getUrl: function (opts)
    {
      return 'http://www.euskaltzaindia.eus/index.php?option=com_xslt&lang=eu&layout=lth_detail&view=frontpage&Itemid=474&search='+opts.term;

    },
    getParams: function (opts)
    {
      return {};
    },
    url: ['http://www.euskaltzaindia.eus/index.php?option=com_xslt&lang=eu&layout=lth_detail&view=frontpage&Itemid=474&search='],
  };
}();

baliabideendatuak.luret = function ()
{
  return {
    name: 'luret',
    displayName: 'Lur ET',
    description: 'Lur Entziklopedia Tematikoa',
    category: 'Hiztegi entziklopedikoak',
    homePage: 'http://www.euskara.euskadi.eus/r59-lursubhe/eu/contenidos/informacion/lursubhe/eu_lursubhe/lursubhe.html',
    pairs: ['eu'],
    method: 'GET',
    getUrl: function (opts)
    {
      return 'http://www.euskara.euskadi.eus/r59-lursresu/eu';
    },
    getParams: function (opts)
    {
      return {
        'r01kQry': 'tC:euskadi;tF:diccionario_enciclopedia;tT:articulo;m:documentLanguage.EQ.eu;m:documentDescription.LIKE.' + opts.term
      };
    },
  };
}();

baliabideendatuak.lurhe = function ()
{
  return {
    name: 'lurhe',
    displayName: 'Lur HE',
    description: 'Lur Hiztegi Entziklopedikoa',
    category: 'Hiztegi entziklopedikoak',
    homePage: 'http://www.euskara.euskadi.eus/r59-lursubhd/eu/contenidos/informacion/lursubhd/eu_lursubhd/lursubhd.html',
    pairs: ['eu'],
    method: 'GET',
    getUrl: function (opts)
    {
      return 'http://www.euskara.euskadi.eus/r59-lursresd/eu';
    },
    getParams: function (opts)
    {
      return {
        'r01kQry': 'tC:euskadi;tF:diccionario_enciclopedia;tT:termino;m:documentLanguage.EQ.eu;m:documentName.BEGINNING.' + opts.term
      };
    },
  };
}();

baliabideendatuak.microsoft = function ()
{
  return {
    disabled: true,  //ez du uzten bigarren hizkuntza aukeratzen 
    name: 'microsoft',
    displayName: 'Microsoft',
    description: 'Microsoft Language Portal',
    category: 'Hiztegi terminologiko/tekniko espezializatuak',
    homePage: 'https://www.microsoft.com/en-us/language',
    pairs: ['en-eu'],
    method: 'GET',
    getUrl: function (opts)
    {
      return 'https://www.microsoft.com/en-us/language/Search';
    },
    getParams: function (opts)
    {
      var hizkuntzak={
          'eu':'Basque',
          'es':'Spanish',
          'en':'English'
      }
      return {
        'searchTerm':opts.term,
        'langID':hizkuntzak[opts.source],
        'Source':'false',
        'productid':'All Products'
      };
    }
  };
}();

//https://www.hiru.eus/es/hirupedia?p_auth=B5jRhOgC&p_p_id=w25cIndexWAR_WAR_w25cIndexWARportlet_INSTANCE_nso6ubZEK4v0&p_p_lifecycle=1&p_p_state=normal&p_p_mode=view&p_p_col_id=column-1&p_p_col_count=1&_w25cIndexWAR_WAR_w25cIndexWARportlet_INSTANCE_nso6ubZEK4v0_actionBuscar=buscarMokoroa
//https://www.hiru.eus/eu/hirupedia?p_auth=B5jRhOgC&p_p_id=w25cIndexWAR_WAR_w25cIndexWARportlet_INSTANCE_nso6ubZEK4v0&p_p_lifecycle=1&p_p_state=normal&p_p_mode=view&p_p_col_id=column-1&p_p_col_count=1&_w25cIndexWAR_WAR_w25cIndexWARportlet_INSTANCE_nso6ubZEK4v0_actionBuscar=buscarMokoroa
baliabideendatuak.mokoroa = function ()
{
  return {
    name: 'mokoroa',
    displayName: 'Mokoroa',
    description: 'Mokoroaren datu-basea',
    category: 'Fraseologia hiztegiak',
    title: ['hiru.eus'],
    homePage: 'http://www.hiru.eus/hirupedia',
    pairs: ['eu-es', 'es-eu'],
    method: 'POST',
    encoding: 'ascii',
    getUrl: function (opts)
    {
      return 'https://www.hiru.eus/eu/hirupedia?p_p_id=indice_WAR_w25cIndexWAR_INSTANCE_zPs2&p_p_lifecycle=0&p_p_state=normal&p_p_mode=view&p_p_col_id=column-1&p_p_col_pos=1&p_p_col_count=2&_indice_WAR_w25cIndexWAR_INSTANCE_zPs2_action=entrarMokoroa'
    },
    getParams: function (opts)
    {
      var params = {
          'form_name_or_index':'_w25cIndexWAR_WAR_w25cIndexWARportlet_INSTANCE_nso6ubZEK4v0_ff',
        }
      if (opts.source === 'eu')
      { 
        params['_w25cIndexWAR_WAR_w25cIndexWARportlet_INSTANCE_nso6ubZEK4v0_mokoroaTextoEuskera'] = opts.term;
      }
      else
      {
        params['_w25cIndexWAR_WAR_w25cIndexWARportlet_INSTANCE_nso6ubZEK4v0_mokoroaTextoCastellano'] = opts.term;
      }
      return params;
    },
    /*
    //Mokoroa kendu egin dut bilaketa konbinatutik, POST deia ez duelako uzten hiru.eus-etik kanpo egiten.
    scrap: function (data, opts)
    {  console.log(data);
      return data.substring(data.indexOf('<font color'),
                            data.indexOf('<div id="justo_mokoroa">'));
    },*/
  }
}();

baliabideendatuak.morris = function ()
{
  return {
    name: 'morris',
    displayName: 'Morris',
    description: 'Morris Hiztegia',
    category: 'Hiztegi orokor eleaniztunak',
    homePage: 'http://www1.euskadi.net/morris/',
    pairs: ['eu-en', 'en-eu'],
    method: 'POST',
    encoding: 'ascii',
    getUrl: function (opts)
    {
      return 'http://www1.euskadi.net/morris/resultado.asp';
    },
    getParams: function (opts)
    {
      var lang;
      var forma;
      var params={};
      if (opts.source === 'en')
      {
        lang = 'txtIngles';
        forma='frmIngles';
      }
      else
      {
        lang = 'txtEuskera';
        forma='frmEuskera';
      }
      params[lang] = opts.term.normalize('NFD').replace(/[\u0300-\u036f]/g,"");
      params['form_name_or_index']=forma;
      return params;
    },
    scrap: function (data, opts)
    {
      if (data.match("Barkatu, baina sarrera hau ez dago hiztegian")) {
        // FIXME: L10n
        return "Ez da aurkitu " + opts.term + " hitza.";
      }
      var output = data;
      var table = output.split("<hr>");
      output = table[1].slice(0, table[1].lastIndexOf("<table"));
      output = output.split("<td class=\"titularMaior\"")[0];
      output = output.replace(
          /images/g,
          "http://www1.euskadi.net/morris/images"
      );
      output = output.replace(
          /datuak/g,
          "http://www1.euskadi.net/morris/datuak"
      );
      output = output.replace(
          /font-size: 8pt/g,
          "font-size: 10pt"
      );
      output = output.replace(
          /font-size:11ptl/g,
          "font-size: 12pt<br>"
      );
      output = output.replace(
          /color:green/g,
          "color: #000000"
      );
      output = output.replace(
          /Arial, Helvetica, sans-serif/g,
          "bitstream vera sans, verdana, arial"
      );
      output = output.replace(
          /width="550"/g,
          ""
      );
      output = output.replace(
          /width="150"/g,
          ""
      );
      return output;
    }
  };
}();

baliabideendatuak.nafarroa = function ()
{
  return {
    name: 'nafarroa',
    displayName: 'Nafarroako euskalkiak',
    description: 'Nafarroako euskalkien hiztegia',
    category: 'Euskalkietako/Herrietako hiztegiak',
    title: ['Euskarabidea :: Euskararen Nafar Institutua'],
    homePage: 'http://www.euskarabidea.es/euskara/nafar-hitz',
    pairs: ['eu'],
    method: 'GET',
    getUrl: function (opts)
    {
      return 'http://www.euskarabidea.es/euskara/nafar-hitz';
    },
    getParams: function (opts)
    {
      return {
        'q': opts.term,
      };
    },
  };
}();

baliabideendatuak.nolaerran = function ()
{
  return {
    name: 'nolaerran',
    displayName: 'Nola Erran',
    description: 'Nola Erran hiztegia',
    category: 'Hiztegi orokor eleaniztunak',
    homePage: 'http://www.nolaerran.org/',
    pairs: ['fr-eu'],
    method: 'GET',
    getUrl: function (opts)
    {
      return 'http://www.nolaerran.org/';
    },
    getParams: function (opts)
    {
      return {
        'z': 'lit',
        'h': opts.term,
      };
    },
  };
}();

baliabideendatuak.oeh = function ()
{
  return {
    name: 'oeh',
    displayName: 'Orotarikoa',
    description: 'Orotariko Euskal Hiztegia',
    category: 'Hiztegi orokorrak',
    homePage: 'https://www.euskaltzaindia.eus/index.php?option=com_oehberria&task=bilaketa&Itemid=413&lang=eu',
    pairs: ['eu'],
    berrerabiltzekoitxi:true,
    //method: 'POST',
    method: 'GET',
    getUrl: function (opts)
    {
      return 'https://www.euskaltzaindia.eus/index.php?option=com_oehberria&task=bilaketa&Itemid=413&lang=eu&query=&sarrera='+opts.term
    },
    getParams: function (opts)
    {
      return {};
    },
    scrap: function (data, opts)
    {  
      data = data.substring(data.indexOf('<div class="col-md-9 oeh-sarrera-blokea">'),
                            data.indexOf('<section id="sp-nabarmenduak">'));
      data = data.replace(
            '/css/uzeiEstiloa.css',
            "https://www.euskaltzaindia.eus/components/com_oehberria/css/uzeiEstiloa.css"
      );
      return data;
    },
  };
}();

baliabideendatuak.ostadar = function ()
{
  return {
    name: 'ostadar',
    displayName: 'Mendizale',
    description: 'Mendizalearen Hiztegia',
    category: 'Hiztegi terminologiko/tekniko espezializatuak',
    homePage: "http://www.ostadar.org/hiztegia/",
    pairs: ['eu-es', 'es-eu'],
    method: 'GET',
    encoding: 'ascii',
    title: ['Ostadar Mendi Taldea'],
    getUrl: function (opts)
    {
      return [
        'http://www.ostadar.org/hiztegia/display_',
        opts.source.toUpperCase() , '_', opts.target.toUpperCase(), '_bilaketa'
      ].join('');
    },
    getParams: function (opts)
    {
      return {
        katea: opts.term,
        eTag: '',
        eTag_sg: 'sarrera_gorputza'
      };
    }
  };
}();

baliabideendatuak.pentsamenduarenklasikoak = function ()
{
  return {
    name: 'pentsamenduarenklasikoak',
    displayName: 'PKC',
    description: 'Pentsamenduaren Klasikoak Corpusa',
    category: 'Corpus espezializatuak',
    homePage: 'http://www.ehu.eus/ehg/pkc/',
    pairs: ['eu'],
    method: 'GET',
    getUrl: function (opts)
    {
      return 'http://www.ehu.eus/ehg/cgi/pkc/bilatuPkc.pl';
    },
    getParams: function (opts)
    {
      return {
        'o': '1',
        'n': 'liburuak',
        'k1': '1',
        'm1': 'lema',
        'd1': '1',
        'h1': opts.term,
      };
    },
  };
}();

//https://hiztegia.petronor.eus/eu/gas
baliabideendatuak.petrolio = function ()
{
  return {
    name: 'petrolio',
    displayName: 'Petrolio',
    description: 'Petrolio Hiztegia',
    category: 'Hiztegi terminologiko/tekniko espezializatuak',
    berrerabiltzekoitxi: true,
    homePage: "https://hiztegia.petronor.eus",
    pairs: ['eu-es', 'eu-en', 'eu-fr',
            'es-eu', 'en-eu', 'fr-eu'],
    method: 'GET',
    getUrl: function (opts)
    {
      var term = opts.term.trim();
      return 'https://hiztegia.petronor.eus/'+opts.source+'/'+term;
    },
    getParams: function (opts)
    {
      return {};
    },
  };
}();

baliabideendatuak.telekomunikazioak = function ()
{
  return {
    name: 'telekomunikazioak',
    displayName: 'Telekom.',
    description: 'Telekomunikazio Hiztegia',
    category: 'Hiztegi terminologiko/tekniko espezializatuak',
    berrerabiltzekoitxi: true,
    homePage: 'http://www.telekomunikaziohiztegia.org/',
    pairs: ['eu-es', 'eu-en', 'eu-fr',
            'es-eu', 'en-eu', 'fr-eu'],
    method: 'POST',
    getUrl: function (opts)
    {
      return 'http://www.telekomunikaziohiztegia.org/';
    },
    getParams: function (opts)
    {
      var hizkuntzak={
          'eu':'E',
          'es':'G',
          'fr':'F',
          'en':'I'
      };
      return {
        'frame_index':0,
        'form_name_or_index':'form1',
        'txtHitza':opts.term,
        'selectHizkuntza':hizkuntzak[opts.source]
      };
    },
  };
}();

//http://www.textreference.com/en/eu-es/?q=etxe
baliabideendatuak.textreference = function ()
{
  return {
    name: 'textreference',
    displayName: 'TextReference',
    description: 'Text Reference Corpusa',
    category: 'Corpus orokorrak',
    title: ['Text Reference Corpusa'],
    homePage: 'http://www.textreference.com',
    pairs: ['eu-es', 'es-eu'],
    method: 'GET',
    getUrl: function (opts)
    {
      return 'http://www.textreference.com/'+opts.source+'/'+opts.source+'-'+opts.target+'/?q='+opts.term;
    },
    getParams: function (opts)
    {
      return {};
    },
  };
}();

baliabideendatuak.transvision = function ()
{
  // Some of the language codes that transvision uses
  // are not equal to the language codes used by euskalbar
  // and need to be changed.
  function adaptLanguageCode(lang_code) {
    switch (lang_code) {
      case 'hi':
        lang_code = 'hi-IN';
        break;
      case 'jp':
        lang_code = 'ja';
        break;
      case 'zh':
        lang_code = 'zh-CN';
        break;
    }
    return lang_code;
  }
  return {
    name: 'transvision',
    displayName: 'Transvision',
    description: 'Transvision',
    category: 'Hiztegi terminologiko/tekniko espezializatuak',
    homePage: 'https://transvision.mozfr.org/',
    pairs: ['eu-ar', 'eu-de', 'eu-en', 'eu-es', 'eu-fr', 'eu-hi', 'eu-jp', 'eu-zh',
            'ar-eu', 'de-eu', 'en-eu', 'es-eu', 'fr-eu', 'hi-eu', 'jp-eu', 'zh-eu'],
    method: 'GET',
    getUrl: function (opts)
    {
      return 'https://transvision.mozfr.org/';
    },
    getParams: function (opts)
    {
      opts.source = adaptLanguageCode(opts.source);
      opts.target = adaptLanguageCode(opts.target);
      return {
        'repo': 'global',
        'recherche': opts.term,
        'sourcelocale': opts.source,
        'locale': opts.target
      };
    }
  };
}();

baliabideendatuak.trengintza = function ()
{
  return {
    name: 'trengintza',
    displayName: 'Trengintza',
    description: 'Trengintza hiztegia',
    category: 'Hiztegi terminologiko/tekniko espezializatuak',
    title: ['Trengintza Hiztegia'],
    homePage: 'http://trenhiztegia.eus',
    pairs: ['eu-es', 'eu-en', 'eu-fr',
            'es-eu', 'en-eu', 'fr-eu'],
    method: 'GET',
    getUrl: function (opts)
    {
      return 'http://trenhiztegia.eus/'+opts.source+'/'+opts.term;
    },
    getParams: function (opts)
    {
      return {};
    },
  };
}();

//https://tzos.ehu.eus/search/?q=zatiki&lang=eu&submit=Bilatu
baliabideendatuak.tzos = function ()
{
  return {
    name: 'tzos',
    displayName: 'TZOS',
    description: 'TZOS - Terminologia Zerbitzurako Online Sistema (EHU)',
    category: 'Hiztegi terminologiko/tekniko espezializatuak',
    title: ['TZOS - Terminologia Zerbitzurako Online Sistema'],
    homePage: 'https://tzos.ehu.eus',
    pairs: ['eu-es', 'eu-en', 'eu-fr', 'eu-la',
            'es-eu', 'en-eu', 'fr-eu', 'la-eu'],
    method: 'GET',
    getUrl: function (opts)
    {
      return 'http://tzos.ehu.eus/search/?q='+opts.term+'&lang=eu&submit=Bilatu';
    },
    getParams: function (opts)
    {
      return {};
    },
  };
}();

baliabideendatuak.uzei = function ()
{
  return {
    name: 'uzei',
    displayName: 'UZEI sin.',
    description: 'UZEI Sinonimoen Hiztegia',
    category: 'Sinonimoen hiztegiak',
    homePage: 'http://www.uzei.eus/zerbitzuak-eta-produktuak/produktuen-katalogoa/sinonimoen-hiztegia/',
    pairs: ['eu'],
    method: 'POST',
    getUrl: function (opts)
    {
      return 'https://www.uzei.eus/online/sinonimoen-hiztegia-iruzkinak';
    },
    getParams: function (opts)
    {
      return {
        'form_name_or_index':0,
        'w':opts.term
      };
    },
    scrap: function (data, opts)
    {
      data = data.substring(data.indexOf('<div class="column_inner uzei_sinonimoak_body">'),
                                data.indexOf('<div class="comment_holder" id="comments">'));
      data = data.replace(/<img/g, "<img height='16' width='16'");
      return data;
    }
  };
}();

baliabideendatuak.wikipedia = function ()
{
  return {
    name: 'wikipedia',
    displayName: 'Wikipedia',
    description: 'Euskarazko Wikipedia',
    category: 'Hiztegi entziklopedikoak',
    title: ['Wikipedia, entziklopedia askea'],
    homePage: 'https://eu.wikipedia.org/',
    pairs: ['eu'],
    method: 'GET',
    getUrl: function (opts)
    {
      return 'https://eu.wikipedia.org/wiki/Aparteko:Search';
    },
    getParams: function (opts)
    {
      return {
        'search': opts.term,
      };
    },
  };
}();

baliabideendatuak.xuxenweb = function ()
{
  return {
    name: 'xuxenweb',
    displayName: 'Xuxen.eus',
    description: 'Xuxen zuzentzaile ortografikoa',
    category: 'Zuzentzaileak',
    title: ['Xuxen.eus'],
    homePage: 'http://xuxen.eus',
    pairs: ['eu'],
    method: 'GET',
    alert: true,
    getUrl: function (opts)
    {
      return [
        'http://xuxen.eus/xuxen/', opts.term
      ].join('');
    },
    getParams: function (opts)
    {
      return {};
    },
  };
}();

baliabideendatuak.xxmendea = function ()
{
  return {
    name: 'xxmendea',
    displayName: 'XX. mendekoa',
    description: 'XX. mendeko Euskararen Corpus estatistikoa',
    category: 'Corpus orokorrak',
    homePage: 'http://xxmendea.euskaltzaindia.eus/Corpus/aurkezpena.html',
    pairs: ['eu'],
    method: 'GET',
    getUrl: function (opts)
    {
      return 'http://xxmendea.euskaltzaindia.eus/Corpus/index.jsp';
    },
    getParams: function (opts)
    {
      var hizkuntza;
      if (opts.source=='eu')
      {
      	hizkuntza='Eu';
      }
      else
     {
      	hizkuntza='ES';
      };
      return {
      	'hasiera': 'true',
      	'aurreratua': 'false',
      	'atala': '',
      	'epea': '0',
      	'euskalkia': '0',
      	'testu_mota': '0',
      	'formalema1': 'lema',
      	'testu_hitza1': opts.term,
      	'non1': '0',
      	'galdera_mota1': '0',
      	'btn_bilatu': 'Bilatu'
      };
    },
  };
}();

baliabideendatuak.zehazki = function ()
{
  return {
    name: 'zehazki',
    displayName: 'Zehazki',
    description: 'Zehazki Hiztegia',
    category: 'Hiztegi orokor eleaniztunak',
    homePage: 'http://ehu.eus/ehg/cgi/zehazki/bila',
    pairs: ['es-eu'],
    method: 'GET',
    encoding: 'latin-1',
    getUrl: function (opts)
    {
      return 'http://ehu.eus/ehg/cgi/zehazki/bila';
    },
    getParams: function (opts)
    {
      return {
        'm': 'has',
        'z': opts.term,
      };
    },
    scrap: function (data, opts)
    {
      data = data.substring(data.indexOf('adibideak</label')+16,
                            data.indexOf('</td></tr></table>'));
      data = data.replace(
            /<img/g,
            "<span"
        );
      return data;
    },
  };
}();

baliabideendatuak.zientziacorpusa = function ()
{
  return {
    name: 'zientziacorpusa',
    displayName: 'ZIO',
    description: 'Zientzia Corpusa',
    category: 'Corpus espezializatuak',
    homePage: 'http://www.ehu.eus/ehg/zio/',
    pairs: ['eu'],
    method: 'GET',
    getUrl: function (opts)
    {
      return 'http://www.ehu.eus/ehg/cgi/zio/bilatuZio.pl';
    },
    getParams: function (opts)
    {
      return {
        'o': '1',
        'n': 'liburuak',
        'k1': '1',
        'm1': 'lema',
        'd1': '1',
        'h1': opts.term,
      };
    },
  };
}();

baliabideendatuak.ztcorpusa = function ()
{
  return {
    name: 'ztcorpusa',
    displayName: 'ZT corpusa',
    description: 'Zientzia eta Teknologiaren corpusa',
    category: 'Corpus espezializatuak',
    homePage: 'http://www.ztcorpusa.eus/',
    pairs: ['eu'],
    method: 'GET',
    getUrl: function (opts)
    {
      return 'http://www.ztcorpusa.eus/cgi-bin/kontsulta.py';
    },
    getParams: function (opts)
    {
      return {
        'testu-hitza1': opts.term,
      };
    },
  };
}();

baliabideendatuak.zthiztegia = function ()
{
  return {
    name: 'zthiztegia',
    displayName: 'ZT Hiztegia',
    description: 'Zientzia eta Teknologiaren hiztegi entziklopedikoa',
    category: 'Hiztegi terminologiko/tekniko orokorrak',
    title: ['ZT Hiztegi Berria'],
    homePage: 'https://zthiztegia.elhuyar.eus',
    pairs: ['eu-es', 'eu-fr', 'eu-en', 'eu-la',
            'es-eu', 'fr-eu', 'en-eu', 'la-eu'],
    method: 'GET',
    getUrl: function (opts)
    {
      return 'https://zthiztegia.elhuyar.eus/terminoa/'+opts.source+'/'+opts.term;
    },
    getParams: function (opts)
    {
      return {};
    },

  };
}();

baliabideendatuak.zurgintza = function ()
{
  return {
    name: 'zurgintza',
    displayName: 'Zurgintza',
    description: 'Zurgintza hiztegia',
    category: 'Hiztegi terminologiko/tekniko espezializatuak',
    title: ['Zurgintza Hiztegia'],
    homePage: 'http://zurgintza.jakinbai.eus',
    pairs: ['eu-es', 'es-eu'],
    method: 'GET',
    getUrl: function (opts)
    {
      return 'http://zurgintza.jakinbai.eus/'+opts.source+'/'+opts.term;
    },
    getParams: function (opts)
    {
      return {};
    },
  };
}();

baliabideendatuak.zuzenbidecorpusa = function ()
{
  return {
    name: 'zuzenbidecorpusa',
    displayName: 'ZCP',
    description: 'Zuzenbide Corpusa',
    category: 'Corpus espezializatuak',
    homePage: 'http://www.ehu.eus/ehg/zuzenbidea/',
    pairs: ['eu'],
    method: 'GET',
    getUrl: function (opts)
    {
      return 'http://www.ehu.eus/ehg/cgi/zuzenbidea/bilatu.pl';
    },
    getParams: function (opts)
    {
      return {
        'o': '1',
        'k1': '1',
        'm1': 'lema',
        'd2': '1',
        'h1': opts.term,
      };
    },
  };
}();

