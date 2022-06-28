/* Parametroak kargatu eta POST eskaera egiten du */

function KargatuEtaBidali(request,_sender,_sendResponse)
{

    // Formularioa lortzen du, indize edo izen bidez, eta frame batean egon edo ez

    var forma = (request['frame_index'] != undefined) ? window.frames[request['frame_index']].document.forms[request['form_name_or_index']] : document.forms[request['form_name_or_index']];

    // Formularioaren action-a aldatu behar bada, egin

    forma.action ??= request['form_url'];
    
    // Formularioaren method-a aldatu behar bada, egin

    forma.method ??= request['form_method'];
    

    // Formularioko elementu batzuk ezabatu behar badira, egin

    if (request['elements_to_delete']!=undefined)
    {
        for (const element of request['elements_to_delete'])
        {
            forma.elements[element].remove();
        }
    }

    // Ezikusiko diren elementuak zerrendatzen dira
    var ezikusitakoElementuak = [
        'form_name_or_index',
        'form_url',
        'form_method',
        'hidden_elements',
        'elements_to_delete'
    ]

    // Aldatu behar den elementu bakoitzeko
    for (var elementuarenizena in request)
    {
        if (!elementuarenizena.includes(ezikusitakoElementuak))
        {
            var elementuarenbalioa=request[elementuarenizena];
            // Elementua egoten bada, bere balioa aldatu

            if (forma[elementuarenizena] != undefined)
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
