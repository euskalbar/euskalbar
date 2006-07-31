const SBservice = {
        RDF     : Components.classes['@mozilla.org/rdf/rdf-service;1'].getService(Components.interfaces.nsIRDFService),
        RDFC    : Components.classes['@mozilla.org/rdf/container;1'].getService(Components.interfaces.nsIRDFContainer),
        RDFCU   : Components.classes['@mozilla.org/rdf/container-utils;1'].getService(Components.interfaces.nsIRDFContainerUtils),
        DIR     : Components.classes['@mozilla.org/file/directory_service;1'].getService(Components.interfaces.nsIProperties),
        IO      : Components.classes['@mozilla.org/network/io-service;1'].getService(Components.interfaces.nsIIOService),
        UNICODE : Components.classes['@mozilla.org/intl/scriptableunicodeconverter'].getService(Components.interfaces.nsIScriptableUnicodeConverter),
        WINDOW  : Components.classes['@mozilla.org/appshell/window-mediator;1'].getService(Components.interfaces.nsIWindowMediator),
        PROMPT  : Components.classes['@mozilla.org/embedcomp/prompt-service;1'].getService(Components.interfaces.nsIPromptService),
        PREF    : Components.classes['@mozilla.org/preferences;1'].getService(Components.interfaces.nsIPrefBranch),
        WM      : Components.classes['@mozilla.org/appshell/window-mediator;1'].getService(Components.interfaces.nsIWindowMediator),
};

// Loads the extension home page in a new tab
function euskalbar_visitHomePage(aURL, tabbed)
{
 var win = SBservice.WINDOW.getMostRecentWindow("navigator:browser");
 var browser = win.document.getElementById("content");
	if ( tabbed ) {
		browser.selectedTab = browser.addTab(aURL);
	} else {
		browser.loadURI(aURL);
	}

}
