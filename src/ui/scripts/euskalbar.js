import Hiztegia from '../../dictionaries/Hiztegia.js';

const dictionaries = [];
const categories = [];

(function() {
// List of dictionary JSON files
const dictionaryFiles = [
    '../../dictionaries/azkue/adorezsinonimoak.json',
    '../../dictionaries/azkue/bostmila.json',
    '../../dictionaries/berria/berria.json',
    '../../dictionaries/bfa/bfaterminologikoa.json',
    '../../dictionaries/bfa/eurovoc.json',
    '../../dictionaries/caf/trenhiztegia.json',
    '../../dictionaries/consumer/consumer.json',
    '../../dictionaries/eaa/gemet.json',
    '../../dictionaries/eep/nolaerran.json',
    '../../dictionaries/ehu/eeh.json',
    '../../dictionaries/ehu/ehuskaratuak.json',
    '../../dictionaries/ehu/ekc.json',
    '../../dictionaries/ehu/epd.json',
    '../../dictionaries/ehu/epg.json',
    '../../dictionaries/ehu/etc.json',
    '../../dictionaries/ehu/hbep.json',
    '../../dictionaries/ehu/pkc.json',
    '../../dictionaries/ehu/tzos.json',
    '../../dictionaries/ehu/zcp.json',
    '../../dictionaries/ehu/zehazki.json',
    '../../dictionaries/ehu/zio.json',
    '../../dictionaries/eitb/eitb.json',
    '../../dictionaries/elhuyar/corpus/corpeus.json',
    '../../dictionaries/elhuyar/corpus/dabilena.json',
    '../../dictionaries/elhuyar/corpus/dabilenaitzul.json',
    '../../dictionaries/elhuyar/corpus/garaterm.json',
    '../../dictionaries/elhuyar/corpus/ztc.json',
    '../../dictionaries/elhuyar/dictionaries/automobilgintza.json',
    '../../dictionaries/elhuyar/dictionaries/egamaster.json',
    '../../dictionaries/elhuyar/dictionaries/elhuyar.json',
    '../../dictionaries/elhuyar/dictionaries/jakinbai.json',
    '../../dictionaries/elhuyar/dictionaries/xuxen.json',
    '../../dictionaries/elhuyar/dictionaries/zth.json',
    '../../dictionaries/euskaltzaindia/ebe.json',
    '../../dictionaries/euskaltzaindia/eoda.json',
    '../../dictionaries/euskaltzaindia/euskaltzaindia.json',
    '../../dictionaries/euskaltzaindia/lexikoa.json',
    '../../dictionaries/euskaltzaindia/literatura.json',
    '../../dictionaries/euskaltzaindia/oeh.json',
    '../../dictionaries/euskaltzaindia/xxmendea.json',
    '../../dictionaries/euskarabidea/nafarhitz.json',
    '../../dictionaries/euskoikaskuntza/aunamendi.json',
    '../../dictionaries/euskojaurlaritza/drogomedia.json',
    '../../dictionaries/euskojaurlaritza/euskalterm.json',
    '../../dictionaries/euskojaurlaritza/eve.json',
    '../../dictionaries/euskojaurlaritza/gzh.json',
    '../../dictionaries/euskojaurlaritza/harluxet.json',
    '../../dictionaries/euskojaurlaritza/justizia.json',
    '../../dictionaries/euskojaurlaritza/legebiltzarra.json',
    '../../dictionaries/euskojaurlaritza/luret.json',
    '../../dictionaries/euskojaurlaritza/lurhe.json',
    '../../dictionaries/euskojaurlaritza/mokoroa.json',
    '../../dictionaries/euskojaurlaritza/morris.json',
    '../../dictionaries/euskojaurlaritza/zurgintza.json',
    '../../dictionaries/feuse/feuse.json',
    '../../dictionaries/freelang/freelang.json',
    '../../dictionaries/gfa/imemoriak.json',
    '../../dictionaries/glosbe/glosbe.json',
    '../../dictionaries/herrikoak/bergara.json',
    '../../dictionaries/herrikoak/eibar.json',
    '../../dictionaries/kotobai/kotobai.json',
    '../../dictionaries/kutxabank/garate.json',
    '../../dictionaries/labayru/labayru.json',
    '../../dictionaries/microsoft/msterm.json',
    '../../dictionaries/mondragon/danobat.json',
    '../../dictionaries/mozilla/transvision.json',
    '../../dictionaries/ostadar/mendizale.json',
    '../../dictionaries/petronor/oilgas.json',
    '../../dictionaries/postazerrendak/itzul.json',
    '../../dictionaries/postazerrendak/librezale.json',
    '../../dictionaries/textreference/textreference.json',
    '../../dictionaries/uzei/hobelex.json',
    '../../dictionaries/uzei/idite.json',
    '../../dictionaries/uzei/uzeisin.json',
    '../../dictionaries/wikimedia/wikipedia.json'
];

// Function to load a single dictionary
async function loadDictionary(path) {
    try {
        const response = await fetch(path);
        const config = await response.json();
        return new Hiztegia(config);
    } catch (error) {
        console.error(`Failed to load dictionary from ${path}`, error);
    }
}

// Load all dictionaries
async function loadAllDictionaries() {
    for (const path of dictionaryFiles) {
        const dictionary = await loadDictionary(path);
        if (dictionary) {
            dictionaries.push(dictionary);
        }
    }
}

// Functionn to load the categories list
async function loadCategories() {
    for (const dictionary of dictionaries) {
        if (!categories.includes(dictionary.category)) {
            categories.push(dictionary.category);
        }
    }
}

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
    for (const kategoria of categories)
    {
        // Kategoria horretakoa den eta ezgaituta ez dagoen baliabide bakoitzeko

        for (var baliabidearenizena in dictionaries)
        {
            var baliabidea=dictionaries[baliabidearenizena];
            if ((baliabidea.category==kategoria) && (baliabidea.disabled === undefined || baliabidea.disabled === false))
            {
                console.log(baliabidea);
                // Botoia sortu
                var inputa=document.createElement('input');
                inputa.id='btn'+baliabidea.name;
                inputa.name=baliabidea.name;
                inputa.type='button';
                inputa.title=baliabidea.description;
                inputa.className='btn';
                inputa.value=baliabidea.display_name;
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
                console.log("izena value " + izena)
                console.log("Showing dictionaries " + dictionaries)
                let hiztegia = dictionaries.find(function(d) { console.log(d.name); return d.name === izena; })
                if (itemak['Baliabideak'+izena]!==undefined && itemak['Baliabideak'+izena] == "1" && hizkuntzekinbat(hiztegia,hizkuntzabikotea))
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
    var storagealortu = browser.storage.local.get();
    storagealortu.then(function(itemak) {
        var itemberriak = {};

        // Kargatu fitxen hobespenak
        var FitxakBerrerabili = false;
        var FitxakAtzean = false;
        if (itemak['FitxakBerrerabiliHobespena'] !== undefined && itemak['FitxakBerrerabiliHobespena'] == "1" ||
            'FitxakBerrerabiliHobespena' in HasierakoHobespenak && HasierakoHobespenak['FitxakBerrerabiliHobespena'] == "1") {
            FitxakBerrerabili = true;
        }

        if (itemak['FitxakAtzeanHobespena'] !== undefined && itemak['FitxakAtzeanHobespena'] == "1" ||
            'FitxakAtzeanHobespena' in HasierakoHobespenak && HasierakoHobespenak['FitxakAtzeanHobespena'] == "1") {
            FitxakAtzean = true;
        }

        // Baliabidearen estatistiketan gehitu eta gorde
        var hitza = document.getElementById('BilatzekoaText').value;
        var baliabidea = dictionaries.find(function(d) { return d.name === baliabidearenizena; });

        if (itemak['Estatistikak' + baliabidea.name] !== undefined) {
            itemberriak['Estatistikak' + baliabidea.name] = itemak['Estatistikak' + baliabidea.name] + 1;
        } else {
            itemberriak['Estatistikak' + baliabidea.name] = 1;
        }

        var storageagorde = browser.storage.local.set(itemberriak);
        storageagorde.then(null, function(_errorea) {
            console.log('Errorea estatistikak gordetzean');
        });

        // Baliabidearen parametroak kargatu
        var iturburuhizkuntza = document.getElementById('HizkuntzaBikoteaSelect').value.substring(0, 2);
        var helburuhizkuntza;
        if (document.getElementById('HizkuntzaBikoteaSelect').value.length > 2) {
            helburuhizkuntza = document.getElementById('HizkuntzaBikoteaSelect').value.substring(3);
        } else {
            helburuhizkuntza = document.getElementById('HizkuntzaBikoteaSelect').value.substring(0, 2);
        }

        // Construct the URL using the Hiztegia class
        var url = baliabidea.buildUrl(hitza, iturburuhizkuntza, helburuhizkuntza);

        // Check currently open tabs
        browser.tabs.query({ currentWindow: true }).then(function(tabs) {
            var existingTabId;

            for (let tab of tabs) {
                let tabBaseURL = new URL(tab.url).hostname;
                let currentBaseURL = new URL(url).hostname;
                
                if (tabBaseURL === currentBaseURL) {
                    existingTabId = tab.id;
                    break;
                }
            }
            
            if (baliabidea.method === 'POST') {
                // Fetch the data first for POST requests
                baliabidea.fetchData(hitza, iturburuhizkuntza, helburuhizkuntza).then(data => {
                    // Handle the fetched data here. For example, display it in the tab.
                    // This will depend on how you want to present the data.
                    // For simplicity, let's assume you have a function `displayDataInTab` that takes a tabId and data.
                    if (existingTabId && FitxakBerrerabili) {
                        displayDataInTab(existingTabId, data);
                    } else {
                        browser.tabs.create({ 'active': !FitxakAtzean }).then(tab => {
                            displayDataInTab(tab.id, data);
                        });
                    }
                });
            } else {
                // For GET requests, directly open or update the tab with the URL
                if (existingTabId && FitxakBerrerabili) {
                    browser.tabs.update(existingTabId, { 'url': url, 'active': !FitxakAtzean });
                } else {
                    browser.tabs.create({ 'url': url, 'active': !FitxakAtzean });
                }
            }
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
                                OrriaKargatu(tabaurkitua, itemak, itemberriak, tekla, izenburua);
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
    
                            // Fitxa berria sortu
                            OrriaKargatu(tab.id, itemak, itemberriak, tekla, izenburua);
                        },null);
                    }
    
                    // Ktrl edo Shift sakatuta ez bazeuden
    
                    else
                    {
    
                        // Ikusi hobespenetan eta hizkuntza bikotean zein baliabide ireki behar diren 
    
                        fitxenbaliabideak=[];
                        for (const kategoria of categories)
                        {
                            for (var baliabidearenizena in dictionaries)
                            {
                                var baliabidea =dictionaries[baliabidearenizena];
                                if (baliabidea.category==kategoria && (baliabidea.disabled === undefined || baliabidea.disabled === false))
                                {
                                    var izena = baliabidea.name;
                                    var hizkuntzabikotea = document.getElementById('HizkuntzaBikoteaSelect').value;
                                    if (itemak['AurreratuaEnter'+izena] !== undefined)
                                    {
                                        if (itemak['AurreratuaEnter'+izena] == "1")
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

function OrriaKargatu(tab, itemak, itemberriak, tekla, izenburua ){
    // Baliabideen parametroak kargatu
    
    const hitza = document.getElementById('BilatzekoaText').value;
    var iturburuhizkuntza = document.getElementById('HizkuntzaBikoteaSelect').value.substring(0,2);
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
    for (var baliabideizena in dictionaries)
    {
        const baliabidea = dictionaries[baliabideizena];
        const izena = baliabidea.name;
        const hizkuntzabikotea = document.getElementById('HizkuntzaBikoteaSelect').value;
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
    
    var scriptasartu=browser.tabs.executeScript(tab,{file:"js/konbinatua.js"});

    // Kargatu duenean

    scriptasartu.then(function(_result){

        // Mezua bidali hasi dadin, parametroekin

        browser.tabs.sendMessage(tab,params);
    },null);
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
    loadAllDictionaries().then(() => {
        loadCategories().then(() => {
            KargatuBotoiak();
            BistaratuBotoiak();
        });
    });    
    
    
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

    // Bilatzekoa idazten ari garen bitartean, sarrera kontrolatu
    document.getElementById("BilatzekoaText").addEventListener('keydown', (event) => 
    {
        // Idazten ari garen bitartean sarrerak alfanumerikoak badira egiaztatzen da XSS saihesteko
        if (event.key.match(/[a-zA-Z\ç\ñ\ ]+/g)) 
        {
            return event;
        }
        else
        {
            event.preventDefault();
        }
    })
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

export { categories, dictionaries };