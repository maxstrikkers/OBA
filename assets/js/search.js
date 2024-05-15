const corsProxyUrl = 'https://cors-anywhere.herokuapp.com/';

document.getElementById('zoekFormulier').addEventListener('submit', function(e) {
    e.preventDefault();
    const resultatenDiv = document.getElementById('resultaten');
    resultatenDiv.innerHTML = '';
    voerZoekopdrachtenUit();
});

document.querySelectorAll('.zoekOptie').forEach(optie => {
    optie.addEventListener('click', function() {
        document.querySelectorAll('.zoekOptie').forEach(k => {
            k.classList.remove('aktief');
        });
        this.classList.add('aktief');
    });
});

document.querySelectorAll('.filterKnop').forEach(knop => {
    knop.addEventListener('mouseover', function() {
        this.style.backgroundColor = this.classList.contains('aktief') ? 'white' : '#4CAF50';
        this.style.color = this.classList.contains('aktief') ? '#4CAF50' : 'white';
    });

    knop.addEventListener('mouseout', function() {
        this.style.backgroundColor = '';
        this.style.color = '';
    });

    knop.addEventListener('click', function() {
        if (this.dataset.filter === 'alles') {
            document.querySelectorAll('.filterKnop').forEach(k => {
                if (k.dataset.filter !== 'alles') k.classList.remove('aktief');
            });
        } else {
            document.querySelector('.filterKnop[data-filter="alles"]').classList.remove('aktief');
        }
        this.classList.toggle('aktief');
        const resultatenDiv = document.getElementById('resultaten');
        resultatenDiv.innerHTML = '';
        voerZoekopdrachtenUit();
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const exportButton = document.createElement('button');
    exportButton.textContent = 'Exporteer stoute ppn';
    exportButton.addEventListener('click', exportFoutenlijst);
    document.body.appendChild(exportButton);
});

function exportFoutenlijst() {
    const foutenlijst = getFoutenlijst();
    const foutenJson = JSON.stringify(foutenlijst, null, 2);
    const blob = new Blob([foutenJson], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'foutenlijst.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function getFoutenlijst() {
    return JSON.parse(localStorage.getItem('foutenlijst')) || [];
}

function setFoutenlijst(foutenlijst) {
    localStorage.setItem('foutenlijst', JSON.stringify(foutenlijst));
}

function voerZoekopdrachtenUit() {
    let zoekTerm = document.getElementById('zoekInput').value;
    if (zoekTerm.trim() === '') {
        zoekTerm = document.getElementById('zoekInput').placeholder;
    }

    const alleFilters = document.querySelectorAll('.filterKnop');
    const resultatenDiv = document.getElementById('resultaten');
    resultatenDiv.innerHTML = '';

    Array.from(alleFilters).forEach(filter => {
        if (filter.classList.contains('aktief')) {
            const filterWaarde = filter.dataset.filter;
            const filterNaam = filter.textContent;
            voerZoekopdrachtUit(zoekTerm, filterWaarde, filterNaam);
        }
    });
}

function voerZoekopdrachtUit(zoekTerm, filterWaarde, filterNaam) {
    let filterBy = "";
    switch (filterWaarde) {
        case "prentenboeken_baby":
            filterBy = "indeling:=prentenboeken baby";
            break;
        case "prentenboeken_tot4":
            filterBy = "indeling:=prentenboeken tot 4 jaar";
            break;
        case "prentenboeken_vanaf4":
            filterBy = "indeling:=prentenboeken vanaf 4 jaar";
            break;
        case "leren_lezen":
            filterBy = "indeling:=leren lezen";
            break;
        case "fictie_A_tot9":
            filterBy = "indeling:=A";
            break;
        case "fictie_B_9tot12":
            filterBy = "indeling:=fictie 9 tot 12 jaar";
            break;
        case "fictie_C_12enouder":
            filterBy = "indeling:=fictie vanaf 12 jaar";
            break;
        case "fictie_D_15enouder":
            filterBy = "indeling:=fictie vanaf 15 jaar";
            break;
        case "fictie_volwassenen":
            filterBy = "indeling:=fictie volwassenen";
            break;
        case "informatie_tot9":
            filterBy = "indeling:=info tot 9 jaar";
            break;
        case "informatie_vanaf9":
            filterBy = "indeling:=info vanaf 9 jaar";
            break;
        case "informatie_volwassenen":
            filterBy = "indeling:=info volwassenen";
            break;
    }

    let queryBy = '';
    let vectorQuery = ''; // Nieuwe variabele voor vectorquery

    if (document.getElementById('direct').classList.contains('aktief')) {
        queryBy = 'titel';
        vectorQuery = ''; // Vectorquery uitschakelen voor directe zoekopdracht
    } else if (document.getElementById('vector').classList.contains('aktief') || document.getElementById('hybride').classList.contains('aktief')) {
        queryBy = 'embedding';
        vectorQuery = 'embedding:([], alpha: 0.8)'; // Vectorquery inschakelen voor semantic/vector en hybride zoekopdracht
    }

    const apiUrl = 'http://localhost:8108/multi_search';
    const apiKey = 'ASazh4BPl5wNdEo2Iz5lvAWsdh4tfdFeS8Z39hlAKs0AOu6E';

    const foutenlijst = getFoutenlijst();

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-TYPESENSE-API-KEY': apiKey,
        },
        body: JSON.stringify({
            searches: [{
                q: zoekTerm,
                query_by: queryBy,
                collection: 'obadbx',
                prefix: 'false',
                vector_query: vectorQuery, // Gebruik vectorQuery variabele
                include_fields: 'titel,ppn',
                per_page: 20,
                filter_by: filterBy
            }]
        })
    })
    .then(response => response.json())
    .then(data => {
        if (!document.getElementById(`resultatenContainer-${filterWaarde}`)) {
            let resultatenDiv = document.getElementById('resultaten');
            let resultatenContainer = document.createElement('div');
            resultatenContainer.id = `resultatenContainer-${filterWaarde}`;
            resultatenContainer.className = 'resultatenContainer';
            let titelElement = document.createElement('h2');
            titelElement.textContent = filterNaam;
            resultatenContainer.appendChild(titelElement);
            let resultatenRij = document.createElement('div');
            resultatenRij.className = 'resultatenRij';
            resultatenContainer.appendChild(resultatenRij);
            resultatenDiv.appendChild(resultatenContainer);
            verwerkResultaten(data.results[0].hits || [], corsProxyUrl, resultatenRij, 0, filterWaarde, filterNaam);
        }
    })
    .catch(error => console.error('Error:', error));
}



function verwerkResultaten(data, corsProxyUrl, resultatenRij, getoondeResultaten, filterWaarde) {
    if (getoondeResultaten >= 5 || data.length === 0) {
        return;
    }

    const hit = data.shift();
    const titel = hit.document.titel;
    const ppn = hit.document.ppn;

    if (resultatenRij.querySelectorAll(`.resultaat[data-titel="${titel}"]`).length > 0) {
        verwerkResultaten(data, corsProxyUrl, resultatenRij, getoondeResultaten, filterWaarde);
        return;
    }

    if (getFoutenlijst().includes(ppn)) {
        verwerkResultaten(data, corsProxyUrl, resultatenRij, getoondeResultaten, filterWaarde);
        return;
    }

    let cachedCover = localStorage.getItem(ppn);
    if (cachedCover) {
        getDetailLink(ppn, (detailLink) => {
            displayResultaat(cachedCover, titel, detailLink, resultatenRij);
            verwerkResultaten(data, corsProxyUrl, resultatenRij, getoondeResultaten + 1, filterWaarde);
        });
    } else {
        const obaResolverUrl = `${corsProxyUrl}https://zoeken.oba.nl/api/v1/resolver/ppn/?id=${ppn}&authorization=ffbc1ededa6f23371bc40df1864843be`;
        fetch(obaResolverUrl)
            .then(response => {
                if (!response.ok) throw new Error('Netwerk respons was niet ok.');
                return response.text();
            })
            .then(str => {
                const parser = new window.DOMParser();
                const xml = parser.parseFromString(str, "text/xml");
                const itemidElements = xml.getElementsByTagName("itemid");
                if (itemidElements.length === 0 || !itemidElements[0].childNodes.length) {
                    console.error('Geen itemid gevonden.');
                    throw new Error('Geen itemid gevonden.');
                }
                const itemid = itemidElements[0].childNodes[0].nodeValue.split('|oba-catalogus|')[1];
                const obaDetailsUrl = `${corsProxyUrl}https://zoeken.oba.nl/api/v1/details/?id=|oba-catalogus|${itemid}&authorization=ffbc1ededa6f23371bc40df1864843be&output=json`;
                return fetch(obaDetailsUrl);
            })
            .then(response => {
                if (!response.ok) throw new Error('Netwerk respons was niet ok.');
                return response.json();
            })
            .then(details => {
                const detailLink = details.record.detailLink;
                let coverImage = details.record.coverimages && details.record.coverimages.length > 0 ? details.record.coverimages[0].replace("size=120", "size=200") : 'fail.jpg';
                localStorage.setItem(ppn, coverImage);
                displayResultaat(coverImage, titel, detailLink, resultatenRij);
                verwerkResultaten(data, corsProxyUrl, resultatenRij, getoondeResultaten + 1, filterWaarde);
            })
            .catch(error => {
                console.error('Error bij het verkrijgen van gegevens:', error);
                setFoutenlijst([...getFoutenlijst(), ppn]);
                verwerkResultaten(data, corsProxyUrl, resultatenRij, getoondeResultaten, filterWaarde);
            });
    }
}


function displayResultaat(coverImage, titel, detailLink, resultatenRij) {
    let div = document.createElement('div');
    div.className = 'resultaat';
    div.setAttribute('data-titel', titel);

    let img = document.createElement('img');
    img.src = coverImage;
    img.alt = "Cover Image";

    let link = document.createElement('a');
    link.href = detailLink;
    link.target = "_blank";
    link.textContent = titel;

    div.appendChild(img);
    div.appendChild(link);

    resultatenRij.appendChild(div);
}

function getDetailLink(ppn, callback) {
    const obaResolverUrl = `${corsProxyUrl}https://zoeken.oba.nl/api/v1/resolver/ppn/?id=${ppn}&authorization=ffbc1ededa6f23371bc40df1864843be`;
    fetch(obaResolverUrl)
        .then(response => {
            if (!response.ok) throw new Error('Netwerk respons was niet ok.');
            return response.text();
        })
        .then(str => {
            const parser = new window.DOMParser();
            const xml = parser.parseFromString(str, "text/xml");
            const itemidElements = xml.getElementsByTagName("itemid");
            if (itemidElements.length === 0 || !itemidElements[0].childNodes.length) throw new Error('Geen itemid gevonden.');
            const itemid = itemidElements[0].childNodes[0].nodeValue.split('|oba-catalogus|')[1];
            const obaDetailsUrl = `${corsProxyUrl}https://zoeken.oba.nl/api/v1/details/?id=|oba-catalogus|${itemid}&authorization=ffbc1ededa6f23371bc40df1864843be&output=json`;
            return fetch(obaDetailsUrl);
        })
        .then(response => {
            if (!response.ok) throw new Error('Netwerk respons was niet ok.');
            return response.json();
        })
        .then(details => {
            const detailLink = details.record.detailLink;
            callback(detailLink);
        })
        .catch(error => {
            console.error('Error:', error);
            callback(null);
        });
}