/* Parametrodun objektu bat URL moduan idazten du */

function serialize(obj,encoding)
{
    var serializatua;
    // Latin-1, ASCII eta UTF-8 kodeketentzako serializazioa
    if (encoding=='latin-1')
    {
        serializatua=encodeURIComponent(obj).replace(/%([0-9A-F]{2})/g,function(_match,p1)
        {
            return String.fromCharCode(parseInt(p1,16));
        });
    }
    else if (encoding=='ascii' || encoding=='utf-8')
    {
        serializatua=encodeURIComponent(obj).replace(/%([0-9A-F]{2})/g,function(_match,p1)
        {
            return String.fromCharCode(parseInt(p1,16));
        }
        ).replace(/[^\x20-\x7E]/g,function(match)
        {
            return '%'+match.charCodeAt(0).toString(16).toUpperCase();
        }
        );
    }
    else
    {
        serializatua=encodeURIComponent(obj);
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

                for (const baliabide of baliabideak)
                {   
                    baliabidea=baliabideendatuak[baliabide];
                    var url=baliabidea.getUrl(opts);
                    params=baliabidea.getParams(opts);
                    urlosoa='';
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
                    if (encodeURI(urlosoa).replace(/%25/g,'%').replace('https','http')==encodeURI(xhr.responseURL).replace(/%25/g,'%').replace('https','http'))
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

function KargatuBaliabideak(request,_sender,_sendResponse)
{

    // Orriari izenburua jarri

    document.title=request['izenburua'];

    // Baliabide bakoitzeko

    var baliabideak=request['baliabideak'];
    for (const baliabide of baliabideak)
    {
        var baliabidea=baliabideendatuak[baliabide];

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