/* Parametrodun objektu bat URL moduan idazten du */

function serialize(obj,encoding)
{
    var serializatua;
    if (encoding=='latin-1')
    {
        serializatua=''+Object.keys(obj).reduce(function(a,k){a.push(k+'='+escape(obj[k]));return a},[]).join('&')
    }
    else if (encoding=='ascii')
    {
        serializatua=''+Object.keys(obj).reduce(function(a,k){a.push(k+'='+obj[k].normalize('NFD').replace(/[\u0300-\u036f]/g,""));return a},[]).join('&')
    }
    else
    {
        serializatua=''+Object.keys(obj).reduce(function(a,k){a.push(k+'='+encodeURIComponent(obj[k]));return a},[]).join('&')
    }
    return serializatua;
}

/* Baliabide baten XHR eskaera egiten du */

function makexhr(baliabidea,urlosoa,params,opts,baliabideak)
{

    // XHR eskaera sortu

    var xhr=new XMLHttpRequest();

    // Erantzuna datorrenean

    xhr.onreadystatechange=function()
    {
        if (xhr.readyState==XMLHttpRequest.DONE)
        {
            if (xhr.status==200)
            {

                // Ikusi zein baliabidetakoa zen, URLa begiratuta

                for (var i=0;i<baliabideak.length;i++)
                {
                    var baliabidea=baliabideendatuak[baliabideak[i]];
                    var url=baliabidea.getUrl(opts);
                    var params=baliabidea.getParams(opts);
                    var urlosoa='';
                    if (baliabidea.method=='GET')
                    {
                        if (serialize(params,baliabidea.encoding)!=='')
                        {
                            urlosoa=url+'?'+serialize(params,baliabidea.encoding);
                        }
                        else
                        {
                            urlosoa=url;
                        }
                    }
                    else
                    {
                        urlosoa=url;
                    }
                    if (encodeURI(urlosoa).replace(/%25/g,'%')==encodeURI(xhr.responseURL).replace(/%25/g,'%'))
                    {

                        // Dagokion zutabean idatzi emaitza

                        document.getElementById('Gorputza'+baliabidea.name).innerHTML=baliabidea.scrap(xhr.responseText,opts);
                    }
                }
            }
        }
    };

    // XHR eskaera ireki

    xhr.open(baliabidea.method,urlosoa,true);

    // GET bada

    if (baliabidea.method=='GET')
    {

        // XHR eskaera bidali

        xhr.send();
    }

    // POST bada

    else
    {

        // Parametroak bidali

        xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");

        // XHR eskaera bidali

        xhr.send(serialize(params,baliabidea.encoding));
    }
    
}

/* Baliabideen zutabeak sortzen ditu */

function KargatuBaliabideak(request,sender,sendResponse)
{

    // Orriari izenburua jarri

    document.title=request['izenburua'];

    // Baliabide bakoitzeko

    var baliabideak=request['baliabideak'];
    for (var i=0;i<baliabideak.length;i++)
    {
        var baliabidea=baliabideendatuak[baliabideak[i]];

        // Zutabea sortu

        var tha=document.createElement('th');
        tha.setAttribute('id','Name'+baliabidea.name);
        document.getElementById('buruak').appendChild(tha);
        var texta=document.createTextNode(baliabidea.description);
        tha.appendChild(texta);
        var tdo=document.createElement('td');
        tdo.setAttribute('id','Oina'+baliabidea.name);
        tdo.setAttribute('class','gorputza oharra');
        document.getElementById('oinak').appendChild(tdo);
        var aa=document.createElement('a');
        aa.setAttribute('href',baliabidea.homePage);
        aa.setAttribute('target','_blank');
        tdo.appendChild(aa);
        var atexta=document.createTextNode(baliabidea.description);
        aa.appendChild(atexta);
        var tdg=document.createElement('td');
        tdg.setAttribute('id','Gorputza'+baliabidea.name);
        tdg.setAttribute('class','gorputza');
        document.getElementById('gorputzak').appendChild(tdg);

        // Baliabidearen parametroak irakurri

        var opts={
            'term':request['term'],
            'source':request['source'],
            'target':request['target']
        };
        var url=baliabidea.getUrl(opts);
        var params=baliabidea.getParams(opts);
        var urlosoa='';
        if (baliabidea.method=='GET')
        {
            if (serialize(params,baliabidea.encoding)!=='')
            {
                urlosoa=url+'?'+serialize(params,baliabidea.encoding);
            }
            else
            {
                urlosoa=url;
            }
        }
        else
        {
            urlosoa=url;
        }

        // XHR eskaera egin

        makexhr(baliabidea,urlosoa,params,opts,baliabideak);
    }
}

// Baliabideak kargatzeko mezua jasotzen denean, egin

browser.runtime.onMessage.addListener(KargatuBaliabideak);