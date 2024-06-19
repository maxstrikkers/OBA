# OBA Laagdrempelig zoeken
Dit is het Oba laagdrempelig zoeken prototype. Ons prototype is een applicatie waarmee je alle informatie van de OBA kunt opvragen, dit gebeurd doormiddel van een mix tussen een zoekfunctie en een chatbot. Deze zoekfunctie is toegankelijk gemaakt voor zoveel mogenlijk mensen.


## Installatie
Onze applicatie werkt met [Node.js](https://nodejs.org/en/). Dus om te beginnen moet je in een console de juiste folder vinden.
> **Note**: De juiste folder bevat de server.js file

Als je de folder hebt gevonden moet je in de console deze commands typen.

```console
npm i
```
Wanneer dit is afgerond voer je de volgende command uit

```console
npm run start
```

De applicatie zou nu actief moeten zijn op [Localhost:3000](https://localhost:3000).


## Werking
De applicatie heeft een heleboel functies. Maar de hoofdfunctie is het zoeken. De zoekbalk die linksboven staat functioneerd als 2 dingen. Je kunt het gebruiken om direct te zoeken naar een titel zoals:
 > Harry Potter en de steen der wijzen

Maar je kunt hem ook als chatbot gebruiken, dus dan kun je een vraag stellen.
> Hallo, ik zoek naar een boek van J.K. rowling over een tovenaar.

Dit zou beiden harry potter boeken moeten laten zien.

Ook kun je filteren op boeken met het filter aan de rechter kant van de pagina 
> **W.I.P:** Het filtersysteem is nog niet werkend.

## Details
Wanneer je het boek hebt gevonden waar je naar zocht kun je erop klikken. Als je erop klikt opent er een kleine detailpagina waar je een samenvatting kunt lezen van het boek. Voor meer informatie over het boek kun je op de knop "bekijk details" klikken, Dit opent de officiele OBA detailpagina.

## Testen
Deze versie van het prototype heeft een ingebouwd logging systeem. Dus wanneer je een sterren review achtelaat in de app, wordt alle data naar de server gestuurd. Het optimale gebruik zou zijn na elke chat een rating achterlaten, Alle data wordt netjes in een object gezet dus kun je zovaak een rating achterlaten als je wilt. Via de data op de server kun je een aantal dingen bekijken:

 - Conversation ID
 - Conversation History ( Het hele gesprek )
 - Resultaten ( Alle titels en de informatie die daarbij hoort )
 - Tijd
 - Datum
 - Rating ( 1 tot 5 sterren )



## Contributies
 Dit prototype is gemaakt door: 

 - [Hidde](https://github.com/Hiddevdp)
 - [Xiao Nan](https://github.com/xiaonanpols21)
 - [Max](https://github.com/maxstrikkers)
 - [Stef](https://github.com/Kitch41)
