require("dotenv").config();
process.env.TYPESENSEAPIKEY;

async function searchTypesense(query) {
  const url = `https://j6wg7ln8zo0ity15p-1.a1.typesense.net/multi_search`;
  try {
    const params = new URLSearchParams({
      q: query,
      conversation: "true",
      conversation_model_id: "0aa6ecfe-dcd7-469c-ba9f-cb407d0a9499",
      searches: JSON.stringify([
        {
          collection: "obadbx",
          query_by: "embedding",
          "per page": "50",
          prefix: "false",
          include_fields: "titel,beschrijving,auteur,ppn",
        },
      ]),
    });

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
            "per page": "50",
            prefix: "false",
            include_fields: "titel,beschrijving,auteur,ppn",
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error searching Typesense:", error);
  }
} 

async function addCoverImageToDocuments(searchResults) {
  let finalResults = searchResults;

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
