# Euskalbar

Basque translator's friend.

Dictionaries, glossaries, corpora and more at one click.

Euskalbar is a Firefox extension.

**Download**: https://addons.mozilla.org/firefox/addon/euskalbar/

**License**: GPLv3.

## Downloading source code, testing and building the extension

### Downloading source code

You can download the code in one of two ways:

* Using the "Download ZIP" button inside "Clone or download" in this page and unzipping.
* Cloning with ``git clone`` + address inside "Clone or download" in this page.

### Testing the extension

1. Go inside the ``src`` folder of the downloaded code.
2. Run ``web-ext run`` ([more info on the web-ext tool](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Getting_started_with_web-ext))

### Building the extension

You can create the extension file in one of two ways:

* ``zip -r ../euskalbar-0.0.zip *``. You will get a ZIP file named "euskalbar-0.0.zip" (change the 0.0 part of the name to what you need; the real version number is defined in the "src/manifest.json" file).
* ``web-ext build -a ..``. You will get a ZIP file named "euskalbar-0.0.zip", with the real version number defined in the "src/manifest.json" file instead of the 0.0 part of the name).

The built extension can be installed and run in Developer Edition, Nightly, and ESR versions of Firefox, after toggling the "xpinstall.signatures.required" preference in "about:config".

For installation in any Firefox, extension has to be signed ([more info here](https://developer.mozilla.org/en-US/Add-ons/Distribution)).

Anyway, there is usually no need for this: the managers of Euskalbar handle the signing and publishing. For normal users, installing from AMO is sufficient ([https://addons.mozilla.org/firefox/addon/euskalbar/](https://addons.mozilla.org/firefox/addon/euskalbar/)). For development and testing purposes, the method described in "Testing the extension" is also enough.
