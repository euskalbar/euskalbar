/* Parametrodun objektu bat URL moduan idazten du */

function serialize(obj,encoding)
{
    var serializatua = '';
    if (Object.entries(obj).length > 0)
    {
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
    }
    return serializatua;
}

/* Baliabide baten XHR eskaera egiten du */

function makexhr(baliabidea,urlosoa,params,opts)
{

    // XHR eskaera sortu
    var xhr;
    if (window.XMLHttpRequest){
        xhr = new XMLHttpRequest();  
    }

    // XHR eskaera ireki

    xhr.open(baliabidea.method, urlosoa, true);

    if (baliabidea.method=='GET')
    {
        xhr.send();
    }
    else
    {
        xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        xhr.send(serialize(params,baliabidea.encoding));
    }

    xhr.addEventListener('load', function() {
        if (xhr.status == 200) {
            document.getElementById('Gorputza'+baliabidea.name).innerHTML=baliabidea.scrap(xhr.responseText,opts);
        }
    });    
}

/* Baliabideen zutabeak sortzen ditu */

function KargatuBaliabideak(request,_sender,_sendResponse)
{    
 
    // Orriari izenburua jarri

    document.title=request['izenburua'];

    // Baliabide bakoitzeko zutabeak sortu

    var baliabideak=request['baliabideak'];
    for (const baliabide of baliabideak)
    {
        var baliabidea=baliabideendatuak[baliabide];
        
        if (!document.getElementById('Name'+baliabidea.name)){
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
        }
        
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
        makexhr(baliabidea,urlosoa,params,opts);
    }
}

// Baliabideak kargatzeko mezua jasotzen denean, egin
browser.runtime.onMessage.addListener(KargatuBaliabideak);
