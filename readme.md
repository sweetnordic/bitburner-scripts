# My Bitburner Script Collection

[Bitburner Official GitHub Repository](https://github.com/danielyxie/bitburner)
[Bitburner Documentation](https://bitburner.readthedocs.io/en/latest/index.html)
[Bitburner NetscriptJS Documentation](https://github.com/danielyxie/bitburner/tree/dev/markdown/bitburner.md)

## Dokumentation

- [Factions](/doc/factions.rst) ([ReadTheDocs](https://bitburner.readthedocs.io/en/latest/basicgameplay/factions.html))
- [Source-Files](/doc/source-files.rst) ([ReadTheDocs](https://bitburner.readthedocs.io/en/latest/advancedgameplay/sourcefiles.html))
- [Bitnodes](https://bitburner.readthedocs.io/en/latest/advancedgameplay/bitnodes.html)
- [Infiltration](https://bitburner.readthedocs.io/en/latest/basicgameplay/infiltration.html)
- [Stock Market](https://bitburner.readthedocs.io/en/latest/basicgameplay/stockmarket.html)
- [BitNode Order](https://bitburner.readthedocs.io/en/latest/guidesandtips/recommendedbitnodeorder.html)

## Scripts

- [scan.js](src/scan.js)
  - Netzwerk Scanner schreibt alle IP-Adressen in die Datei "network.txt"
- [collect-info.js](src/collect-info.js)
  - Sammelt Informationen zu einem Server und gibt Informationen in der Console aus
- [new-server.js](src/new-server.js)
  - Erstellt neue Server mit Hostnamen Vorlage psrv
- [takeover.js](src/takeover.js)
  - Versucht die Server im Netzwerk zu hacken und bei einigen davon das [self-hack.js](src/self-hack.js) Script darauf auszuführen
- [self-hack.js](src/self-hack.js)
  - Hackt den Server selbst
- [hacknet.js](src/hacknet.js)
  - Management Script für Hacknet
- [spendhashes.js](src/spendhashes.js)
  - Spendet Hashes für Geld

## Todo List

- [ ] Hacknet Automation Script
- [ ] Hacknet Hash Management Script
