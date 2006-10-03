// Developers: Asier Sarasua Garmendia 2006
// This is Free Software (GPL License)
// asarasua@vitoria-gasteiz.org

// Euskalterm kargatu
function getShiftEuskalterm(source, target, term){
  if (euskalbar_language=='es')
    idioma='G';
    else idioma='E';
  var urlEuskalterm='http://www1.euskadi.net/euskalterm/cgibila7.exe?hizkun1='+idioma+'&hitz1='+escape(term)+'&gaiak=0&hizkuntza='+source;
  var xmlHttpReq = new XMLHttpRequest();
  xmlHttpReq.overrideMimeType('text/xml; charset=ISO-8859-1');
  if (!xmlHttpReq) {
    alert('Ezin da Euskalterm kargatu');
    return false;
  }
  xmlHttpReq.onreadystatechange = function() {
  if (xmlHttpReq.readyState == 4) {
    var txtEuskalterm = xmlHttpReq.responseText;
    txtEuskalterm = txtEuskalterm.replace(/<HTML>/, " ");
    txtEuskalterm = txtEuskalterm.replace(/<HEAD><TITLE>Fitxak<\/TITLE><\/HEAD>/, " ");
    txtEuskalterm = txtEuskalterm.replace(/<BODY  bgcolor=lavender leftmargin="10">/, "<strong><font face=\"bitstream vera sans, verdana, arial\" size=\"3\">"+term+"</font></strong>");
    txtEuskalterm = txtEuskalterm.replace(/<\/body><\/html>/, " ");
    txtEuskalterm = txtEuskalterm.replace(/steelblue/g, "black");
    txtEuskalterm = txtEuskalterm.replace(/Verdana/g, "bitstream vera sans, verdana, arial");
    getBrowser().contentDocument.getElementById('aEuskalterm').innerHTML = txtEuskalterm;
    }
  }
  xmlHttpReq.open('GET', urlEuskalterm, true);
  xmlHttpReq.send(null);
}


// Elhuyar kargatu
function getShiftElhuyar(source, target, term){
  term = term.replace(/ /g, "_");
  term = term.replace(/á/g, "a");
  term = term.replace(/é/g, "e");
  term = term.replace(/í/g, "i");
  term = term.replace(/ó/g, "o");
  term = term.replace(/ú/g, "u");
  term = term.replace(/ñ/g, "nzz");
  term = term.replace(/ü/g, "u");
  if (source=='es') {
    var urlElhuyar = 'http://www1.euskadi.net/hizt_el/gazt_c.asp?Sarrera='+escape(term);
  }else{
    var urlElhuyar = 'http://www1.euskadi.net/hizt_el/eusk_c.asp?Sarrera='+escape(term);
  }
  var xmlHttpReq = new XMLHttpRequest();
  xmlHttpReq.overrideMimeType('text/xml; charset=ISO-8859-1');
  if (!xmlHttpReq) {
    alert('Ezin da Elhuyar kargatu');
    return false;
  }
  xmlHttpReq.onreadystatechange = function() {
  if (xmlHttpReq.readyState == 4) {
    var txtElhuyar = xmlHttpReq.responseText;
    var txtElhuyartable1array = txtElhuyar.split("<table");
    txtElhuyar = txtElhuyartable1array[1].substring(txtElhuyartable1array[1].lenght - 1);
    txtElhuyar = '<table'+txtElhuyar;
    var txtElhuyartr1array = txtElhuyar.split("<tr");
    txtElhuyar = txtElhuyartr1array[2].substring(txtElhuyartr1array[2].lenght - 1);
    txtElhuyar = '<p><tr'+txtElhuyar;
    txtElhuyar = txtElhuyar.replace(/<\/table>/, " ");
    txtElhuyar = txtElhuyar.replace(/009999/g, "  ");
    txtElhuyar = txtElhuyar.replace(/FFFFFF/g, "000000");
    txtElhuyar = txtElhuyar.replace(/003399/g, "000000");
    txtElhuyar = txtElhuyar.replace(/Arial, Helvetica, sans-serif/g, "bitstream vera sans, verdana, arial");
    txtElhuyar = txtElhuyar.replace(/Times New Roman, Times, serif/g, "bitstream vera sans, verdana, arial");
    getBrowser().contentDocument.getElementById('aElhuyar').innerHTML = txtElhuyar;
    }
  }
  xmlHttpReq.open('GET', urlElhuyar, true);
  xmlHttpReq.send(null);
}


// 3000 kargatu
function getShift3000(source, target, term){
  if (source=='es') {
    source='CAS'; idioma='Castellano';
  }else{
    source='EUS'; idioma='Euskera';
  }
  var url3000='http://www1.euskadi.net/cgi-bin_m33/DicioIe.exe?Diccionario='+source+'&Idioma='+source+'&Txt_'+idioma+'='+escape(term);
  var xmlHttpReq = new XMLHttpRequest();
  xmlHttpReq.overrideMimeType('text/xml; charset=ISO-8859-1');
  if (!xmlHttpReq) {
    alert('Ezin da 3000 kargatu');
    return false;
  }
  xmlHttpReq.onreadystatechange = function() {
  if (xmlHttpReq.readyState == 4) {
    var txt3000 = xmlHttpReq.responseText;
    var wtable = 3;
    if(txt3000.match("No se ha encontrado")){
      wtable = 2;
      txt3000 = "No se ha encontrado la palabra "+term+".";
    }
    else if (txt3000.match("ez da aurkitu")){
      wtable = 2;
      txt3000 = term +" hitza ez da aurkitu.";
    }
    else{
      var txt3000table1array = txt3000.split("<TABLE");
      txt3000 = txt3000table1array[wtable].substring(txt3000table1array[wtable].lenght - 1);
      var txt3000table2array = txt3000.split("<\/TABLE>");;
      txt3000 = txt3000table2array[0].substring(txt3000table2array[0].lenght - 1);
      txt3000 = '<TABLE'+txt3000+'<\/TABLE>';
      txt3000 = txt3000.replace(/FFFFCC/g, " ");
      txt3000 = txt3000.replace(/font-size: 20pt/, "font-size: 12pt");
      txt3000 = txt3000.replace(/0000A0/g, "000000");
      txt3000 = txt3000.replace(/center/g, "left");
    }
    getBrowser().contentDocument.getElementById('a3000').innerHTML = txt3000;
    }
    }
    xmlHttpReq.open('GET', url3000, true);
    xmlHttpReq.send(null);
}
