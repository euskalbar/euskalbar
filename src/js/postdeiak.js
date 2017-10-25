/* Parametroak kargatu eta POST eskaera egiten du */

function KargatuEtaBidali(request,sender,sendResponse)
{

    // Formularioa lortzen du, indize edo izen bidez, eta frame batean egon edo ez

    var forma;
    if (request['frame_index']!=undefined)
    {
        forma=window.frames[request['frame_index']].document.forms[request['form_name_or_index']];
    }
    else
    {
        forma=document.forms[request['form_name_or_index']];
    }

    // Formularioaren action-a aldatu behar bada, egin

    if (request['form_url']!=undefined)
    {
        forma.action=request['form_url'];
    }

    // Formularioaren method-a aldatu behar bada, egin

    if (request['form_method']!=undefined)
    {
        forma.method=request['form_method'];
    }

    // Formularioko elementu batzuk ezabatu behar badira, egin

    if (request['elements_to_delete']!=undefined)
    {
        for (var i=0;i<request['elements_to_delete'].length;i++)
        {
            var ezabatzekoa=forma.elements[request['elements_to_delete'][i]];
            ezabatzekoa.remove();
        }
    }

    // Aldatu behar den elementu bakoitzeko

    for (var elementuarenizena in request)
    {
        var elementuarenbalioa=request[elementuarenizena];
        if (elementuarenizena!='form_name_or_index' && elementuarenizena!='form_url' && elementuarenizena!='form_method' && elementuarenizena!='hidden_elements' && elementuarenizena!='elements_to_delete')
        {

            // Elementua egoten bada, bere balioa aldatu

            if (forma[elementuarenizena]!=undefined)
            {
                forma[elementuarenizena].value=elementuarenbalioa;
            }

            // Bestela, hidden elementua sortu balioarekin

            else
            {
                var inputa=document.createElement('input');
                inputa.type='hidden';
                inputa.name=elementuarenizena;
                inputa.value=elementuarenbalioa;
                forma.appendChild(inputa);
            }
        }
    }

    // Ezkutatu behar diren elementuak ezkutatu

    if ('hidden_elements' in request)
    {
        for (var ezkutuenizena in request['hidden_elements'])
        {
            forma[ezkutuenizena].type='hidden';
        }
    }

    // Submit egin ordez botoi batean klik egin behar bada (onpress duelako, adibidez), egin

    if (request['click_button']!=undefined)
    {
        document.getElementById(request['click_button']).click();
    }

    // submit egitearekin nahikoa bada, egin 

    else
    {
        forma.submit();
    }
}


// Parametroak kargatu eta POST egiteko mezua jasotzen denean, egin

browser.runtime.onMessage.addListener(KargatuEtaBidali);
