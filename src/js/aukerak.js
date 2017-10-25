/* Hobespenetako pantailan aukerak sortzen ditu formulario batentzat
   baliabideak.js fitxategian dagoenaren arabera */

function KargatuBaliabideakFormularioa(formularioa,aurrizkia)
{

    // baliabideak.js-n dagoen kategoria bakoitzeko

    for (var i=0;i<baliabideenkategoriak.length;i++)
    {
        var kategoria=baliabideenkategoriak[i];

        // Bere izenburua sortu

        var ha=document.createElement('h4');
        ha.id=aurrizkia+'_'+kategoria;
        document.getElementById(formularioa+'Baliabideak').appendChild(ha);
        var testuakat=document.createTextNode(kategoria);
        ha.appendChild(testuakat);

        // Kategoria horretakoa den eta ezgaituta ez dagoen baliabide bakoitzeko (eta, Konbinatuen kasuan, scrap badauka soilik)

        var gehitutakoak=0;
        for (var baliabidearenizena in baliabideendatuak)
        {
            var baliabidea=baliabideendatuak[baliabidearenizena];
            if (baliabidea.category==kategoria && (baliabidea.disabled === undefined || baliabidea.disabled === false) && ((aurrizkia!=='AurreratuaCtrlEnter' && aurrizkia!=='AurreratuaShiftEnter') || 'scrap' in baliabidea))
            {

                // Checkbox-a sortu

                var inputa=document.createElement('input');
                inputa.id=formularioa+'Checkbox'+baliabidea.name;
                inputa.name=baliabidea.name;
                inputa.type='checkbox';
                inputa.className=formularioa+'Checkbox';

                // Aldatzen denean, balioak gordeko dira 

                inputa.addEventListener('change',function()
                {
                    GordeHobespenakFormularioa(formularioa+'HobespenakForm',aurrizkia);
                },false);
                document.getElementById(formularioa+'Baliabideak').appendChild(inputa);
                var labela=document.createElement('label');
                labela.id=formularioa+'Label'+baliabidea.name;
                labela.htmlFor=formularioa+'Checkbox'+baliabidea.name;
                var deskribapena=baliabidea.description;
                if (baliabidea.alert && aurrizkia=='AurreratuaEnter')
                {
                    deskribapena=deskribapena+' (*)';
                }
                var testua=document.createTextNode(deskribapena);
                labela.appendChild(testua);
                document.getElementById(formularioa+'Baliabideak').appendChild(labela);
                var bra=document.createElement('br');
                document.getElementById(formularioa+'Baliabideak').appendChild(bra);
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

/* Hobespenetako pantailako formulario bateko aukeretan erakutsi beharreko balioak 
   kargatzen dira storage objektutik. Lehenengo aldia bada hobespenak.js
   fitxategian dagoenaren arabera */

function KargatuHobespenakFormularioa(formularioa,aurrizkia)
{

    // Storage objektua kargatu eta aldaketak gordetzeko prestatu

    var storagealortu=browser.storage.local.get();
    storagealortu.then(function(itemak)
    {
        var itemberriak={};

        // Formularioko aukera bakoitzeko

        var form=document.getElementById(formularioa);
        for (var i=0;i<form.length;i++)
        {
            var ctrl=form.elements[i];
            var izena=aurrizkia+ctrl.name;

            // Checkbox-a bada

            if (ctrl.type=="checkbox")
            {

                // Storage objektuan egoten bada, han jartzen duen balioa jarri

                if (itemak[izena]!==undefined)
                {
                    if (itemak[izena]=="0")
                    {
                        ctrl.checked=false;
                    }
                    else
                    {
                        ctrl.checked=true;
                    }
                }

                // Ez badago

                else
                {

                    // hobespenak.js fitxategian duen balioa jarri, han badago, eta storage objektuan gorde gero

                    if (izena in HasierakoHobespenak)
                    {
                        if (HasierakoHobespenak[izena]=="0")
                        {
                            ctrl.checked=false;
                            itemberriak[izena]="0";
                        }
                        else
                        {
                            ctrl.checked=true;
                            itemberriak[izena]="1";
                        }
                    }

                    // Bestela markatu gabe utzi eta storage objektuan gorde gero

                    else
                    {
                        ctrl.checked=false;
                        itemberriak[izena]="0";
                    }
                }
            }

            // Select-a bada

            else if (ctrl.type=="select-one")
            {

                // Storage objektuan egoten bada, han jartzen duen balioa jarri

                if (itemak[izena]!==undefined)
                {
                    var indexa=itemak[izena];
                    ctrl.selectedIndex=indexa;
                }

                // Ez badago

                else
                {
                    // hobespenak.js fitxategian duen balioa jarri, han badago, eta storage objektuan gorde gero

                    if (izena in HasierakoHobespenak)
                    {
                        var indexa=HasierakoHobespenak[izena];
                        ctrl.selectedIndex=indexa;
                    }
                    itemberriak[izena]=ctrl.selectedIndex;
                }
            }
        }

        // Balioak gorde storage objektuan

        var storageagorde=browser.storage.local.set(itemberriak);

        // Gordetzean errorea ematen badu, kontsolan idatzi

        storageagorde.then(null,function(errorea)
        {
            console.log('Errorea storage gordetzean');
        });

    // Kargatzean errorea ematen badu, mezua idatzi

    },function(errorea)
    {
        console.log('Errorea storage kargatzean');
    });
}

/* Hobespenak aldatzen direnean storage objektuan gordetzen ditu */

function GordeHobespenakFormularioa(formularioa,aurrizkia)
{

    // Aldaketak gordetzeko prestatu

    var itemberriak={};

    // Formularioko objektu bakoitzeko

    var form=document.getElementById(formularioa);
    for (var i=0;i<form.length;i++)
    {
        var ctrl=form.elements[i];
        var izena=aurrizkia+ctrl.name;

        // Bere balioa gorde

        if (ctrl.type=="checkbox")
        {
            if (ctrl.checked===true)
            {
                itemberriak[izena]="1";
            }
            else
            {
                itemberriak[izena]="0";
            }
        }
        else if(ctrl.type=="select-one")
        {
            var indexa=ctrl.selectedIndex;
            itemberriak[izena]=indexa;
        }
    }

    // Balioak gorde storage objektuan

    var storageagorde=browser.storage.local.set(itemberriak);

    // Gordetzean errorea ematen badu, kontsolan idatzi

    storageagorde.then(null,function(errorea)
    {
        console.log('Errorea storage gordetzean');
    });
}

/* Orria kargatzen denean, aukerak sortu eta balioak jartzen dira */ 

document.addEventListener('DOMContentLoaded', function ()
{

    // Checkbox-ak sortu formulario guztietan

    KargatuBaliabideakFormularioa('BaliabideenAukerak','Baliabideak');
    KargatuBaliabideakFormularioa('AurreratuaEnter','AurreratuaEnter');
    KargatuBaliabideakFormularioa('AurreratuaShiftEnter','AurreratuaShiftEnter');
    KargatuBaliabideakFormularioa('AurreratuaCtrlEnter','AurreratuaCtrlEnter');

    // Hobespenen balioak kargatu formulario guztietan

    KargatuHobespenakFormularioa('HizkuntzaHobespenakForm','');
    KargatuHobespenakFormularioa('FitxaHobespenakForm','');
    KargatuHobespenakFormularioa('BaliabideenAukerakHobespenakForm','Baliabideak');
    KargatuHobespenakFormularioa('AurreratuaEnterHobespenakForm','AurreratuaEnter');
    KargatuHobespenakFormularioa('AurreratuaShiftEnterHobespenakForm','AurreratuaShiftEnter');
    KargatuHobespenakFormularioa('AurreratuaCtrlEnterHobespenakForm','AurreratuaCtrlEnter');

    // Aldatzean gordetzeko ebentoa jarri elementu guztiei 

    document.getElementById("HizkuntzaBikoteaHobespenaSelect").addEventListener('change',function()
    {
        GordeHobespenakFormularioa('HizkuntzaHobespenakForm','');
    }, false);
    document.getElementById("FitxakBerrerabiliHobespenaCheckbox").addEventListener('change',function()
    {
        GordeHobespenakFormularioa('FitxaHobespenakForm','');
    }, false);
    document.getElementById("FitxakAtzeanHobespenaCheckbox").addEventListener('change',function()
    {
        GordeHobespenakFormularioa('FitxaHobespenakForm','');
    }, false);
    var ae_aldaketak=document.getElementsByClassName("AurreratuaEnterCheckbox");
    for(var i=0,j=ae_aldaketak.length;i<j;i++)
    {
        ae_aldaketak[i].addEventListener('change',function()
        {
            GordeHobespenakFormularioa('AurreratuaEnterHobespenakForm','AurreratuaEnter');
        },false);
    }
    var ase_aldaketak=document.getElementsByClassName("AurreratuaShiftEnterCheckbox");
    for(var i=0,j=ase_aldaketak.length;i<j;i++)
    {
        ase_aldaketak[i].addEventListener('change',function()
        {
            GordeHobespenakFormularioa('AurreratuaShiftEnterHobespenakForm','AurreratuaShiftEnter');
        },false);
    }
    var ake_aldaketak=document.getElementsByClassName("AurreratuaCtrlEnterCheckbox");
    for(var i=0,j=ake_aldaketak.length;i<j;i++)
    {
        ake_aldaketak[i].addEventListener('change',function()
        {
            GordeHobespenakFormularioa('AurreratuaCtrlEnterHobespenakForm','AurreratuaCtrlEnter');
        },false);
    }
});
