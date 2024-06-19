require("dotenv").config();
process.env.TYPESENSEAPIKEY;

async function searchTypesense(query, conversationId = null) {
  const url = `https://j6wg7ln8zo0ity15p-1.a1.typesense.net/multi_search`;

  const params = new URLSearchParams({
    q: query,
    conversation: "true",
    // conversation_model_id: "0aa6ecfe-dcd7-469c-ba9f-cb407d0a9499",
    conversation_model_id: "aff860fa-dbb9-4260-82e0-3f50bcff9328",
  });

  if (conversationId) {
    params.append('conversation_id', conversationId);
  }

  try {
    const response = await fetch(`${url}?${params}`, {
      method: "POST",
      headers: {
        "X-TYPESENSE-API-KEY": process.env.TYPESENSEAPIKEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        searches: [
          {
            collection: "obadbx",
            query_by: "embedding",
            per_page: "50",
            prefix: "false",
            include_fields: "titel,beschrijving,auteur,ppn",
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    let results = await response.json();
    const uniqueResults = removeDuplicates(results.results[0].hits);
    results.results[0].hits = uniqueResults;
    return results;

  } catch (error) {
    console.error("Error searching Typesense:", error);
  }
}

function removeDuplicates(searchResults) {
  const uniqueResults = [];
  const seenPPNs = new Set();
  const seenTitles = new Set();
  
  searchResults.forEach(element => {
    const ppn = element.document.ppn;
    const title = element.document.titel.toLowerCase(); // Case-insensitive check for titles
    
    if (!seenPPNs.has(ppn) && !seenTitles.has(title)) {
      seenPPNs.add(ppn);
      seenTitles.add(title);
      uniqueResults.push(element);
    }
  });

  return uniqueResults;
}




async function addCoverImageToDocuments(searchResults) {
  let finalResults = searchResults;
  // console.log(searchResults)

  // Maak een array van fetch promises
  const fetchPromises = finalResults.map((item) =>
    fetch(
      `https://cover.biblion.nl/coverlist.dll/?doctype=morebutton&bibliotheek=oba&style=0&ppn=${item.document.ppn}&isbn=&lid=&aut=&ti=&size=150`
    )
      .then((response) => {
        if (!response.ok) throw new Error("Netwerk respons was niet ok.");

        item.document.coverUrl = response.url;
      })
      .catch((error) => {
        console.error("Er is een fout opgetreden:", error);
      })
  );

  // Wacht tot alle fetch promises zijn voltooid
  await Promise.all(fetchPromises);

  // Return de resultaten
  return finalResults;
}


module.exports = {
  searchTypesense,
  addCoverImageToDocuments,
};
