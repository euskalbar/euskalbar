(function() {

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

/* Baliabide bat aukeratuta dagoen hizkuntza bikotean sartzen den esaten du */

function hizkuntzekinbat(baliabidea,hizkuntzabikotea)
{
    var pareak=baliabidea.pairs;

    return !!(pareak.indexOf(hizkuntzabikotea)>=0 || pareak.indexOf(hizkuntzabikotea.substring(0,2))>=0 || pareak.indexOf(hizkuntzabikotea.substring(3))>=0);
}

/* Botoiak sortzen ditu baliabideak.js fitxategian dagoenaren arabera */

function KargatuBotoiak()
{

    // baliabideak.js-n dagoen kategoria bakoitzeko

    for (const kategoria of baliabideenkategoriak)
    {

        // Kategoria horretakoa den eta ezgaituta ez dagoen baliabide bakoitzeko

        for (var baliabidearenizena in baliabideendatuak)
        {
            var baliabidea=baliabideendatuak[baliabidearenizena];
            if ((baliabidea.category==kategoria) && (baliabidea.disabled === undefined || baliabidea.disabled === false))
            {

                // Botoia sortu

                var inputa=document.createElement('input');
                inputa.id='btn'+baliabidea.name;
                inputa.name=baliabidea.name;
                inputa.type='button';
                inputa.title=baliabidea.description;
                inputa.className='btn';
                inputa.value=baliabidea.displayName;
                document.getElementById('EuskalbarForm').appendChild(inputa);

                // Sakatzen denean, baliabidea irekiko da

                inputa.addEventListener('click',function()
                {
                    BaliabideBatIreki(this.name);
                },false);
            }
        }
    }
}

// Hizkuntza bikotea jarri eta horren arabera botoiak bistaratu edo ezkutatu

function BistaratuBotoiak()
{

    // Storage objektua kargatu eta aldaketak gordetzeko prestatu

    var storagealortu=browser.storage.local.get();
    storagealortu.then(function(itemak)
    {

        var itemberriak={};

        // Hizkuntza bikotea kargatu (azkena aukeratu zena, edo hobespenetakoa, edo hasierako hobespenetakoa)

        var indexa=0;
        if (itemak['HizkuntzaBikotea']!==undefined)
        {
            indexa=itemak['HizkuntzaBikotea'];
        }
        else if (itemak['HizkuntzaBikoteaHobespena']!==undefined)
        {
            indexa=itemak['HizkuntzaBikoteaHobespena'];
        }
        else if ('HizkuntzaBikoteaHobespena' in HasierakoHobespenak)
        {
            indexa=HasierakoHobespenak['HizkuntzaBikoteaHobespena'];
        }
        document.getElementById('HizkuntzaBikoteaSelect').selectedIndex=indexa;
        var hizkuntzabikotea=document.getElementById('HizkuntzaBikoteaSelect').options[indexa].value;

        // Bilatzeko testua kargatu (azkena idatzi zena)

        if (itemak['Bilatzekoa']!==undefined)
        {
            document.getElementById('BilatzekoaText').value=itemak['Bilatzekoa'];
        }

        // Kontrol bakoitzeko

        var form=document.getElementById('EuskalbarForm');
        for (var i=0;i<form.length;i++)
        {
            var ctrl=form.elements[i];

            // Botoia bada

            if (ctrl.type=="button")
            {
                var izena=ctrl.name.replace('btn','');
                ctrl.style='display:none;';

                // Hobespenetan aukeratuta badago edo hizkuntza bikotearekin bat badator, botoia bistaratu

                if (itemak['Baliabideak'+izena]!==undefined && itemak['Baliabideak'+izena] == "1" && hizkuntzekinbat(baliabideendatuak[izena],hizkuntzabikotea))
                {
                    ctrl.style='display:visible;';
                }

                // Hasierako hobespenetan badago, botoia bistaratu eta storage-an gorde

                else if ('Baliabideak'+izena in HasierakoHobespenak && HasierakoHobespenak['Baliabideak'+izena] == "1")
                {
                    ctrl.style='display:visible;';
                    itemberriak['Baliabideak'+izena]="1";
                }

                // Hobespenetan edo hasierako hobespenetan ez badago, botoia ezkutatu eta storage-an gorde

                else
                {
                    itemberriak['Baliabideak'+izena]="0";
                }
            }
        }

        // Balioak gorde storage objektuan

        var storageagorde=browser.storage.local.set(itemberriak);

        // Gordetzean errorea ematen badu, kontsolan idatzi

        storageagorde.then(null,function(_errorea)
        {
            console.log('Errorea storage gordetzean');
        });

    // Kargatzean errorea ematen badu, mezua idatzi

    },function(_errorea)
    {
        console.log('Errorea storage kargatzean');
    });
}

/* Ireki behar den baliabide bakoitzaren fitxaren indizea gordetzeko */

var fitxenbaliabideak;
var azkenbaliabidea;
var azkenarenindizea;
var azkenarenidentifikadorea;

/* Pasatzen zaion baliabidea irekitzen du pasatzen zaion indizedun eta identifikadoredun fitxan (undefined badira, fitxa berri batean) */

function baliabideaireki(baliabidearenizena)
{

    // Storage objektua kargatu eta aldaketak gordetzeko prestatu

    var storagealortu=browser.storage.local.get();
    storagealortu.then(function(itemak)
    {
        var itemberriak={};

        // Kargatu fitxen hobespenak

        var FitxakBerrerabili=false;
        var FitxakAtzean=false;
        if (itemak['FitxakBerrerabiliHobespena']!==undefined && itemak['FitxakBerrerabiliHobespena']=="1"
            || 'FitxakBerrerabiliHobespena' in HasierakoHobespenak && HasierakoHobespenak['FitxakBerrerabiliHobespena']=="1")
        {
            FitxakBerrerabili=true;
        }

        if (itemak['FitxakAtzeanHobespena']!==undefined && itemak['FitxakAtzeanHobespena']=="1"
            || 'FitxakAtzeanHobespena' in HasierakoHobespenak && HasierakoHobespenak['FitxakAtzeanHobespena']=="1")
        {
            FitxakAtzean=true;
        }

        // Baliabidearen estatistiketan gehitu eta gorde

        var hitza=document.getElementById('BilatzekoaText').value;
        var baliabidea=baliabideendatuak[baliabidearenizena];
        if (itemak['Estatistikak'+baliabidea.name]!==undefined)
        {
            itemberriak['Estatistikak'+baliabidea.name]=itemak['Estatistikak'+baliabidea.name]+1;
        }
        else
        {
            itemberriak['Estatistikak'+baliabidea.name]=1;
        }
        var storageagorde=browser.storage.local.set(itemberriak);
        storageagorde.then(null,function(_errorea)
        {
            console.log('Errorea estatistikak gordetzean');
        });

        // Baliabidearen parametroak kargatu
    
        var iturburuhizkuntza=document.getElementById('HizkuntzaBikoteaSelect').value.substring(0,2);
        var helburuhizkuntza;
        if (document.getElementById('HizkuntzaBikoteaSelect').value.length>2)
        {
            helburuhizkuntza=document.getElementById('HizkuntzaBikoteaSelect').value.substring(3);
        }
        else
        {
            helburuhizkuntza=document.getElementById('HizkuntzaBikoteaSelect').value.substring(0,2);
        }
        var url=baliabidea.getUrl({
            term:hitza,
            source:iturburuhizkuntza,
            target:helburuhizkuntza,
        });
        var params=baliabidea.getParams({
            term:hitza,
            source:iturburuhizkuntza,
            target:helburuhizkuntza,
        });
        var metodoa=baliabidea.method;
        var titulua=baliabidea.izenburua;
        var matchurl=baliabidea.url;
        var urlosoa='';
        if (metodoa=='GET')
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
        var args={
            'url':urlosoa,
            'active':!FitxakAtzean
        };
    
        // Irekita dauden fitxak kargatu
    
        var tabaklortu=browser.tabs.query({currentWindow:true});
        tabaklortu.then(function(tabak)
        {
    
            // Fitxa kopurua kontatu
    
            var kopurua=tabak.length;
            var tabaurkitua;
            var tabaurkituaindizea;
    
            // Begiratu ea fitxa irekita dagoen (URL edo izenburua kointzidituta)
            for (let tab of tabak)
            {
                if (FitxakBerrerabili)
                {
                    if (tab.url.indexOf(url)>=0 || tab.url.indexOf(urlosoa)>=0 || (titulua!==undefined && tab.title.indexOf(titulua)>=0))
                    {
                        tabaurkitua=tab.id;
                        tabaurkituaindizea=tab.index;
                        break;
                    }
                    else
                    {
                        if (baliabidea.title!==undefined)
                        {
                            for (const izenburua of baliabidea.title)
                            {
                                if (tab.title.indexOf(izenburua)>=0)
                                {
                                    tabaurkitua=tab.id;
                                    tabaurkituaindizea=tab.index;
                                    break;
                                }
                            }
                        }                    
                        if (matchurl!==undefined)
                        {
                            for (const urla of matchurl)
                            {
                                if (tab.url.indexOf(urla)>=0)
                                {
                                    tabaurkitua=tab.id;
                                    tabaurkituaindizea=tab.index;
                                    break;
                                }
                            }
                        }                    
                    }
                }
            }
    
            // Baliabidea ireki dagokion fitxan
    
            if (tabaurkitua===undefined)
            {
                tabaurkituaindizea=kopurua;
            }
            azkenbaliabidea=baliabidearenizena;
            var tabasortu;
        
            // Irekita bazegoen
        
            if (tabaurkitua!==undefined)
            {

                // Berrerabiltzeko fitxa itxi behar den baliabideetakoa bada, itxi fitxa eta toki berean ireki berria
        
                if (baliabidea.berrerabiltzekoitxi)
                {
                    browser.tabs.remove(tabaurkitua);
                      args.index=tabaurkituaindizea;
                    tabasortu=browser.tabs.create(args);
                }
        
                // Bestela, fitxa eguneratu
        
                else
                {
                    tabasortu=browser.tabs.update(tabaurkitua,args);
                }
            }
    
            // Ez bazegoen irekita
        
            else
            {
        
                // Fitxa berria ireki
        
                tabasortu=browser.tabs.create(args);
            }
            
            // Fitxa ireki ondoren
            
            tabasortu.then(function(fitxa)
            {     
    
                // Lokalizatu zein zen fitxaren baliabidea
        
                var fitxarenbaliabidea=baliabideendatuak[azkenbaliabidea];
                azkenarenidentifikadorea=fitxa.id;
    
                // Izenburua gorde gero kointzidentzian bilatzeko
            
                fitxarenbaliabidea.izenburua=fitxa.title;
            
                // POST motako baliabidea bada
            
                if (metodoa=='POST')
                {
            
                    // Parametroak kargatu eta POST egingo duen script-a kargatu
            
                    var scriptasartu=browser.tabs.executeScript(fitxa.id,{file:"js/postdeiak.js"});
        
                    // Kargatu duenean
            
                    scriptasartu.then(function(_result){
            
                        // Mezua bidali hasi dedin, parametroekin
            
                        params=fitxarenbaliabidea.getParams({
                            term:hitza,
                            source:iturburuhizkuntza,
                            target:helburuhizkuntza,
                        });
                        browser.tabs.sendMessage(azkenarenidentifikadorea,params);
        
                        // Hurrengo fitxa sortu

                        HurrengoFitxaSortu();
        
                    // Errorea ematen badu, hurrengo fitxa sortu
        
                    },function(_result){
                        HurrengoFitxaSortu();
                    });
                }
            
                // GET motako baliabidea bada
            
                else
                {
        
                    // Hurrengo fitxa sortu
        
                    HurrengoFitxaSortu();
                }
    
            // Errorea ematen badu, hurrengo fitxa sortu
        
            },function(_fitxa)
            {
                HurrengoFitxaSortu();
            });
        });
    });
}

/* Hurrengo fitxa sortzen du */
function HurrengoFitxaSortu()
{
    fitxenbaliabideak.splice(fitxenbaliabideak.indexOf(azkenbaliabidea),1);
    if (fitxenbaliabideak.length>0)
    {
        baliabideaireki(fitxenbaliabideak[0]);
    }
}

/* Pasatzen zaion baliabidea irekitzen du tab berri batean */

function BaliabideBatIreki(baliabidearenizena)
{

    // Kutxan ezer idatzi ez bada, mezua erakutsi 

    var hitza=document.getElementById('BilatzekoaText').value;
    if (hitza==='')
    {
        alert('Ez duzu testurik sartu!');
    }

    // Zerbait idatzi bada

    else
    {

        // Baliabidea irekitzekoen zerrendan sartu eta irekitzeko kodeari deitu 

        fitxenbaliabideak=[];
        fitxenbaliabideak.push(baliabidearenizena);
        baliabideaireki(baliabidearenizena);
    }
}

/* Enter sakatzen denean baliabide anitz irekitzeko */

function BaliabideakIrekiEnter(eve)
{

    // Sakatutako tekla Enter bada

    if(eve.keyCode==13)
    {
    
        // Kutxan ezer idatzi ez bada, mezua erakutsi 
    
        var hitza=document.getElementById('BilatzekoaText').value;
        if (hitza==='')
        {
            alert('Ez duzu testurik sartu!');
        }
    
        // Zerbait idatzi bada
    
        else
        {
    
            // Storage objektua kargatu eta aldaketak gordetzeko prestatu
    
            var storagealortu=browser.storage.local.get();
            storagealortu.then(function(itemak)
            {
                var itemberriak={};
    
                // Kargatu fitxen hobespenak
    
                var FitxakBerrerabili=false;
                var FitxakAtzean=false;
                if (itemak['FitxakBerrerabiliHobespena']!==undefined && itemak['FitxakBerrerabiliHobespena']=="1"
                    || 'FitxakBerrerabiliHobespena' in HasierakoHobespenak && HasierakoHobespenak['FitxakBerrerabiliHobespena']=="1")
                {
                    FitxakBerrerabili=true;
                }
                
                if (itemak['FitxakAtzeanHobespena']!==undefined && itemak['FitxakAtzeanHobespena']=="1"
                    || 'FitxakAtzeanHobespena' in HasierakoHobespenak && HasierakoHobespenak['FitxakAtzeanHobespena']=="1")
                {
                    FitxakAtzean=true;
                }
    
                // Irekita dauden fitxak kargatu
    
                var tabaklortu=browser.tabs.query({currentWindow:true});
                tabaklortu.then(function(tabak)
                {
                    var tabasortu;
                    var tabaurkitua;
                    var tabaurkituaindizea;
    
                    // Ktrl edo Shift sakatuta bazeuden
    
                    if (eve.ctrlKey || eve.shiftKey)
                    {
                        var tekla;
                        if (eve.ctrlKey)
                        {
                            tekla='Ctrl';
                        }
                        else
                        {
                            tekla='Shift';
                        }
                        var izenburua='Euskalbar - '+tekla+' + Enter bilaketa konbinatua';            
                        var args={
                            'url':'konbinatua.html',
                            'active':!FitxakAtzean
                        };
    
                        // Hobespenetan fitxak berrerabiltzea badago
    
                        if (FitxakBerrerabili)
                        {
    
                            // Begiratu ea fitxa irekita dagoen (izenburua kointzidituta)
    
                            for (let tab of tabak)
                            {
                                if (tab.title==izenburua)
                                {
                                    tabaurkitua=tab.id;
                                    break;
                                }
                            }
    
                            // Irekita bazegoen
    
                            if (tabaurkitua!==undefined)
                            {
    
                                // Fitxa eguneratu
    
                                tabasortu=browser.tabs.update(tabaurkitua,args);
                            }
    
                            // Ez bazegoen irekita
    
                            else
                            {
    
                            // Fitxa berria ireki
    
                                tabasortu=browser.tabs.create(args);
                            }
                        }
    
                        // Hobespenetan fitxak berrerabiltzea ez badago
    
                        else
                        {
    
                            // Fitxa berria ireki
    
                            tabasortu=browser.tabs.create(args);
                        }
    
                        // Fitxa ireki ondoren
    
                        tabasortu.then(function(tab)
                        {
    
                            // Baliabideen parametroak kargatu
    
                            hitza=document.getElementById('BilatzekoaText').value;
                            var iturburuhizkuntza=document.getElementById('HizkuntzaBikoteaSelect').value.substring(0,2);
                            var helburuhizkuntza;
                            if (document.getElementById('HizkuntzaBikoteaSelect').value.length>2)
                            {
                                helburuhizkuntza=document.getElementById('HizkuntzaBikoteaSelect').value.substring(3);
                            }
                            else
                            {
                                helburuhizkuntza=document.getElementById('HizkuntzaBikoteaSelect').value.substring(0,2);
                            }
    
                            // Ikusi hobespenetan eta hizkuntza bikotean zein baliabide ireki behar diren, eta horien estatistika handitu 
    
                            var baliabideak=[];
                            for (var baliabideizena in baliabideendatuak)
                            {
                                baliabidea=baliabideendatuak[baliabideizena];
                                izena=baliabidea.name;
                                hizkuntzabikotea=document.getElementById('HizkuntzaBikoteaSelect').value;
                                if (itemak['Aurreratua'+tekla+'Enter'+izena]!==undefined)
                                {
                                    if (itemak['Aurreratua'+tekla+'Enter'+izena]=="1")
                                    {
                                        if (hizkuntzekinbat(baliabidea,hizkuntzabikotea))
                                        {
                                            baliabideak.push(izena);
                                            if (itemak['Estatistikak'+baliabidea.name]!==undefined)
                                            {
                                                itemberriak['Estatistikak'+baliabidea.name]=itemak['Estatistikak'+baliabidea.name]+1;
                                            }
                                            else
                                            {
                                                itemberriak['Estatistikak'+baliabidea.name]=1;
                                            }
                                        }
                                    }
                                }
                                else
                                {
                                    if (HasierakoHobespenak['Aurreratua'+tekla+'Enter'+izena]!==undefined && HasierakoHobespenak['Aurreratua'+tekla+'Enter'+izena]=="1")
                                    {
                                        if (hizkuntzekinbat(baliabidea,hizkuntzabikotea))
                                        {
                                            baliabideak.push(izena);
                                            if (itemak['Estatistikak'+baliabidea.name]!==undefined)
                                            {
                                                itemberriak['Estatistikak'+baliabidea.name]=itemak['Estatistikak'+baliabidea.name]+1;
                                            }
                                            else
                                            {
                                                itemberriak['Estatistikak'+baliabidea.name]=1;
                                            }
                                        }
                                    }
                                }
                            }
                            var storageagorde=browser.storage.local.set(itemberriak);
                            storageagorde.then(null,function(_errorea)
                            {
                                console.log('Errorea estatistikak gordetzean');
                            });
    
                            // Baliabideak XHR bidez irekiko dituen script-a kargatu
    
                            var params={
                                'izenburua':izenburua,
                                'baliabideak':baliabideak,
                                'term':hitza,
                                'source':iturburuhizkuntza,
                                'target':helburuhizkuntza,
                            };
                            var scriptasartu=browser.tabs.executeScript(tab.id,{file:"js/konbinatua.js"});
    
                            // Kargatu duenean
    
                            scriptasartu.then(function(_result){
    
                                // Mezua bidali hasi dadin, parametroekin
   
                                browser.tabs.sendMessage(tab.id,params);
                            },null);
                        },null);
                    }
    
                    // Ktrl edo Shift sakatuta ez bazeuden
    
                    else
                    {
    
                        // Ikusi hobespenetan eta hizkuntza bikotean zein baliabide ireki behar diren 
    
                        fitxenbaliabideak=[];
                        for (const kategoria of baliabideenkategoriak)
                        {
                            for (var baliabidearenizena in baliabideendatuak)
                            {
                                baliabidea=baliabideendatuak[baliabidearenizena];
                                if (baliabidea.category==kategoria && (baliabidea.disabled === undefined || baliabidea.disabled === false))
                                {
                                    izena=baliabidea.name;
                                    hizkuntzabikotea=document.getElementById('HizkuntzaBikoteaSelect').value;
                                    if (itemak['AurreratuaEnter'+izena]!==undefined)
                                    {
                                        if (itemak['AurreratuaEnter'+izena]=="1")
                                        {
                                            if (hizkuntzekinbat(baliabidea,hizkuntzabikotea))
                                            {
                                                fitxenbaliabideak.push(izena);
                                            }
                                        }
                                    }
                                    else
                                    {
                                        if (HasierakoHobespenak['AurreratuaEnter'+izena]!==undefined && HasierakoHobespenak['AurreratuaEnter'+izena]=="1")
                                        {
                                            if (hizkuntzekinbat(baliabidea,hizkuntzabikotea))
                                            {
                                                fitxenbaliabideak.push(izena);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if (fitxenbaliabideak.length>0)
                        {
                            baliabideaireki(fitxenbaliabideak[0]);
                        }
                    }
                },null);
    
            // Kargatzean errorea ematen badu, mezua idatzi
    
            },function(_errorea)
            {
                console.log('Errorea storage kargatzean');
            });
    
            // Enter bazen, ez segi defektuzko portaerarekin
    
            eve.preventDefault();
        }
    }
}

function KeyPress(e) {
      var evtobj = window.event? event : e
      if (evtobj.keyCode == 190 && evtobj.ctrlKey) HizkuntzakAldatu();
}

/* Hizkuntza bikotea trukatzeko */

function HizkuntzakAldatu()
{
    var hizkuntzabikotea= document.getElementById('HizkuntzaBikoteaSelect');
    var iturburuhizkuntza=document.getElementById('HizkuntzaBikoteaSelect').value.substring(0,2);
    var helburuhizkuntza;
    if (document.getElementById('HizkuntzaBikoteaSelect').value.length>2)
        {
            helburuhizkuntza=document.getElementById('HizkuntzaBikoteaSelect').value.substring(3);
        }
    else
        {
            helburuhizkuntza=document.getElementById('HizkuntzaBikoteaSelect').value.substring(0,2);
        }
    hizkuntzabikotea.value=helburuhizkuntza+'-'+iturburuhizkuntza;
}


/* Barra kargatzen denean, aukerak irakurri eta botoiak jartzen dira */ 

document.addEventListener('DOMContentLoaded',function()
{

    // Botoiak sortu eta behar direnak bistaratu

    KargatuBotoiak();
    BistaratuBotoiak();
    
    // Kutxan tekla sakatzen denean, Enter den begiratu
    document.getElementById('BilatzekoaText').addEventListener('keypress',BaliabideakIrekiEnter);
    
	// Hizkuntza bikotea aldatzen denean, gorde hurrengorako

    document.getElementById("HizkuntzaBikoteaSelect").addEventListener('change',function()
    {
        var itemberriak={};
        itemberriak['HizkuntzaBikotea']=document.getElementById('HizkuntzaBikoteaSelect').selectedIndex;
        var storageagorde=browser.storage.local.set(itemberriak);
        storageagorde.then(null,function(_errorea)
        {
            console.log('Errorea storage gordetzean');
        });
        BistaratuBotoiak();
    }, false);

    // Bilatzekoa aldatzen denean, gorde hurrengorako

    document.getElementById("BilatzekoaText").addEventListener('change',function()
    {
        var itemberriak={};
        itemberriak['Bilatzekoa']=document.getElementById('BilatzekoaText').value;
        var storageagorde=browser.storage.local.set(itemberriak);
        storageagorde.then(null,function(_errorea)
        {
            console.log('Errorea storage gordetzean');
        });
    }, false);

    // Laguntzaren estekan klik egiten bada, fitxa ireki

    document.getElementById("LaguntzaEsteka").addEventListener('click',function()
    {
        var args={
            'url':'laguntza.html',
        };
        var tabasortu=browser.tabs.create(args);
        tabasortu.then(null,null);
    }, false);

    // Hobespenen estekan klik egiten bada, fitxa ireki

    document.getElementById("HobespenakEsteka").addEventListener('click',function()
    {
        var hobespenaklortu=browser.runtime.openOptionsPage();
        hobespenaklortu.then(null,null);
    }, false);

    // Baliabideen estekan klik egiten bada, fitxa ireki

    document.getElementById("ZerrendaEsteka").addEventListener('click',function()
    {
        var args={
            'url':'zerrenda.html',
        };
        var tabasortu=browser.tabs.create(args);
        tabasortu.then(null,null);
    }, false);

    // Estatistiken estekan klik egiten bada, fitxa ireki

    document.getElementById("EstatistikakEsteka").addEventListener('click',function()
    {
        var args={
            'url':'estatistikak.html',
        };
        var tabasortu=browser.tabs.create(args);
        tabasortu.then(null,null);
    }, false);

    // Kutxari eman fokua

    document.getElementById('BilatzekoaText').focus();
    var denborak=[50,100,200,500,1000];
    for (var denbora in denborak)
    {
        setTimeout(() => {
            document.getElementById('BilatzekoaText').focus();
        },denborak[denbora]);
    }

    document.onkeydown = KeyPress; //beste teklaren bat sakatu den begiratzen du, hizkuntzak aldatzeko adibidez

});
})();
