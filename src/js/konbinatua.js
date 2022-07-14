/* Parametrodun objektu bat URL moduan idazten du */

function serialize(obj,encoding)
{
    let serializatua = '';
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
    let xhr;
    if (window.XMLHttpRequest){
        xhr = new XMLHttpRequest();  
    }

    // XHR eskaera ireki

    let metodoa = baliabidea.methodKonbinatua || baliabidea.method;

    xhr.open(metodoa, urlosoa, true);

    if (metodoa == 'GET')
    {
        xhr.send();
    }
    else
    {   
        let header = baliabidea.contentType || 'application/x-www-form-urlencoded';
        if (baliabidea.methodKonbinatua && baliabidea.contentType)
        {
            xhr.setRequestHeader("Content-type", header);
        }
        xhr.setRequestHeader("X-Requested-With", 'XMLHttpRequest');
        
        if (header == 'application/x-www-form-urlencoded') {
            xhr.send(serialize(params,baliabidea.encoding));
        }
        else if (header == 'application/json') 
        {
            xhr.send(JSON.stringify(params));
        }
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

    let baliabideak=request['baliabideak'];
    for (const baliabide of baliabideak)
    {
        let baliabidea=baliabideendatuak[baliabide];
        
        if (!document.getElementById('Name'+baliabidea.name)){
            let tha=document.createElement('th');
            tha.setAttribute('id','Name'+baliabidea.name);
            document.getElementById('buruak').appendChild(tha);
            let texta=document.createTextNode(baliabidea.description);
            tha.appendChild(texta);
            let tdo=document.createElement('td');
            tdo.setAttribute('id','Oina'+baliabidea.name);
            tdo.setAttribute('class','gorputza oharra');
            document.getElementById('oinak').appendChild(tdo);
            let aa=document.createElement('a');
            aa.setAttribute('href',baliabidea.homePage);
            aa.setAttribute('target','_blank');
            tdo.appendChild(aa);
            let atexta=document.createTextNode(baliabidea.description);
            aa.appendChild(atexta);
            let tdg=document.createElement('td');
            tdg.setAttribute('id','Gorputza'+baliabidea.name);
            tdg.setAttribute('class','gorputza');
            document.getElementById('gorputzak').appendChild(tdg);
        }
        
        // Baliabidearen parametroak irakurri

        let opts={
            'term':request['term'],
            'source':request['source'],
            'target':request['target']
        };
        
        // Baliabidearen URLa irakurri
        let url = '';
        if (typeof baliabidea.getUrlKonbinatua !== 'undefined'){
            url = baliabidea.getUrlKonbinatua(opts);
        } else{
            url = baliabidea.getUrl(opts);
        }

        let params=baliabidea.getParams(opts);
        let urlosoa='';

        // Baliabidearen metodoa lortu
        let metodoa = baliabidea.methodKonbinatua || baliabidea.method;
        
        if (metodoa == 'GET')
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

    let dt = new Date();
    document.getElementById("datetime").innerHTML = dt.toLocaleString([],  {hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

// Baliabideak kargatzeko mezua jasotzen denean, egin
browser.runtime.onMessage.addListener(KargatuBaliabideak);
