/* Baliabideen pantailan zerrendak sortzen ditu
   baliabideak.js fitxategian dagoenaren arabera */

function KargatuBaliabideak()
{

    // baliabideak.js-n dagoen kategoria bakoitzeko

    for (var i=0;i<baliabideenkategoriak.length;i++)
    {
        var kategoria=baliabideenkategoriak[i];

        // Bere izenburua sortu

        var ha=document.createElement('h4');
        ha.id='Kategoria'+kategoria;
        document.getElementById('Zerrenda').appendChild(ha);
        var testuakat=document.createTextNode(kategoria);
        ha.appendChild(testuakat);
        var ula=document.createElement('ul');
        ula.id='Zerrenda'+kategoria;
        document.getElementById('Zerrenda').appendChild(ula);

        // Kategoria horretakoa den baliabide bakoitzeko

        var gehitutakoak=0;
        for (var baliabidearenizena in baliabideendatuak)
        {
            var baliabidea=baliabideendatuak[baliabidearenizena];
            if (baliabidea.category==kategoria)
            {

                // Zerrendako elementua sortu

                var lia=document.createElement('li');
                lia.id='Baliabidea_'+baliabidea.name;
                document.getElementById('Zerrenda'+kategoria).appendChild(lia);
                var aa=document.createElement('a');
                aa.id='Esteka_'+baliabidea.name;
                aa.setAttribute('href',baliabidea.homePage);
                aa.setAttribute('target','_blank');
                document.getElementById('Baliabidea_'+baliabidea.name).appendChild(aa);
                var testua=document.createTextNode(baliabidea.description);
                aa.appendChild(testua);
                gehitutakoak=gehitutakoak+1;
            }
        }

        // Kategoriak ez badu baliabiderik, ezabatu izenburua

        if (gehitutakoak==0)
        {
            ha.parentNode.removeChild(ha);
        }
    }
}

/* Orria kargatzen denean, baliabideak kargatzen jartzen dira */ 

document.addEventListener('DOMContentLoaded', function ()
{
    KargatuBaliabideak();
});
