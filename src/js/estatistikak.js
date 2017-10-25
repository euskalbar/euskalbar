/* Estatistiken pantailan estatistikak kargatzen dira
   baliabideak.js fitxategian dagoenaren arabera
   eta balioak "storage" objektutik */

function KargatuEstatistikak()
{

    // Storage objektua kargatu

    var storagealortu=browser.storage.local.get();
    storagealortu.then(function(itemak)
    {

        // baliabideak.js-n dagoen kategoria bakoitzeko

        for (var i=0;i<baliabideenkategoriak.length;i++)
        {
            var kategoria=baliabideenkategoriak[i];

            // Bere izenburua sortu

            var trakat=document.createElement('tr');
            document.getElementById('EstatistikakTaulaBody').appendChild(trakat);
            var tda1=document.createElement('td');
            tda1.setAttribute('colspan','2');
            trakat.appendChild(tda1);
            var testua1=document.createTextNode(kategoria);
            tda1.appendChild(testua1);

            // Kategoria horretakoa den baliabide bakoitzeko

            var gehitutakoak=0;
            for (var baliabidearenizena in baliabideendatuak)
            {
                var baliabidea=baliabideendatuak[baliabidearenizena];
                if ((baliabidea.category==kategoria) && (baliabidea.disabled === undefined || baliabidea.disabled === false))
                {

                    // Taulan lerroa sortu

                    var tra=document.createElement('tr');
                    document.getElementById('EstatistikakTaulaBody').appendChild(tra);
                    var tda1=document.createElement('td');
                    tra.appendChild(tda1);
                    var testua1=document.createTextNode('\u00a0\u00a0\u00a0\u00a0'+baliabidea.description);
                    tda1.appendChild(testua1);
                    var tda2=document.createElement('td');
                    tda2.setAttribute('class','kopurua');
                    tra.appendChild(tda2);
                    var kopurua='0';

                    // Erabili den kopurua kargatu eta idatzi

                    if (itemak['Estatistikak'+baliabidea.name]!==undefined)
                    {
                        kopurua=itemak['Estatistikak'+baliabidea.name].toString();
                    }
                    var testua2=document.createTextNode(kopurua);
                    tda2.appendChild(testua2);
                    gehitutakoak=gehitutakoak+1;
                }
            }

            // Kategoriak ez badu baliabiderik, ezabatu izenburua

            if (gehitutakoak===0)
            {
                trakat.parentNode.removeChild(trakat);
            }
        }

    // Kargatzean errorea ematen badu, mezua idatzi

    },function(errorea)
    {
        console.log('Errorea storage kargatzean');
    });
}

/* Orria kargatzen denean, estatistikak kargatzen jartzen dira */ 

document.addEventListener('DOMContentLoaded',function()
{
    KargatuEstatistikak();
});
