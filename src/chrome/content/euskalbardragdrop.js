/**
 * Developers:
 *   Asier Sarasua Garmendia <asarasua@vitoria-gasteiz.org> 2007
 *   Julen Ruiz Aizpuru <julenx@gmail.com> 2007
 *
 * This is Free Software (GPL License)
 */


  var buttonObserver = { 
    onDragStart: function (event, transferData, action){
      var txt = event.target.getAttribute("id");
      transferData.data = new TransferData();
      transferData.data.addDataForFlavour("text/unicode", txt);
    }
  };


  var toolbarObserver = {
    getSupportedFlavours: function () {
      var flavours = new FlavourSet();
      flavours.appendFlavour("text/unicode");
      return flavours;
    },
  
    onDragOver: function (event, flavour, session) {
    },
  
    onDrop: function (event, dropdata, session) {
      if (dropdata.data != "") {
        var theBar = document.getElementById("EuskalBar-Toolbar");
        var button1 = document.getElementById(dropdata.data); // arrastatutakoa
        var button2 = event.target; // jaregin den lekuko botoia
        
        if (button2.ordinal) {
          // txertatu arrastatutako botoia jaregindako leku berrian
          var theButton = theBar.insertBefore(button1, button2);
          // eguneratu ordinal atributuak
          updateOrdinals();
        }
      }
    }
  };


  // Botoien ordinal atributuak eguneratzen ditu uneko posizioaren arabera 
  function updateOrdinals() {
    var theBar = document.getElementById("EuskalBar-Toolbar");
    var btn = evaluateXPath(theBar, "//*[@ordinal]");
    var k = 1;
    for (var i in btn) {
      btn[i].ordinal = k;
      k++;
    }
  }
  


  // XPath espresioak ebaluatzeko funtzio lagungarria
  // Jatorria: http://developer.mozilla.org/en/docs/Using_XPath
  // Oharra: agian funtzio honentzat beste leku bat
  //         aurkitu beharko genuke, modu globalean erabiltzeko
  function evaluateXPath(aNode, aExpr) {
    var xpe = new XPathEvaluator();
    var nsResolver = xpe.createNSResolver(aNode.ownerDocument == null ?
      aNode.documentElement : aNode.ownerDocument.documentElement);
    var result = xpe.evaluate(aExpr, aNode, nsResolver, 0, null);
    var found = [];
    var res;
    while (res = result.iterateNext())
      found.push(res);
    return found;
  }
