require('dotenv').config();
process.env.TYPESENSEAPIKEY

async function searchTypesense(query) {
    const url = `https://j6wg7ln8zo0ity15p-1.a1.typesense.net/multi_search`;
    try {
        const params = new URLSearchParams({
            'q': query, 
            'conversation': 'true', 
            'conversation_model_id': '0aa6ecfe-dcd7-469c-ba9f-cb407d0a9499',
            'searches': JSON.stringify([
                {
                    "collection": "obadbx",
                    "query_by": "embedding",
                    "per page": "6",
                    "prefix":"false",
                    "include_fields": "titel,beschrijving,auteur,ppn"
                }
            ])
        });
        
        const response = await fetch(`${url}?${params}`, {
            method: 'POST',
            headers: {
                'X-TYPESENSE-API-KEY': process.env.TYPESENSEAPIKEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "searches": [
                    {
                        "collection": "obadbx",
                        "query_by": "embedding",
                        "per page": "6",
                        "prefix":"false",
                        "include_fields": "titel,beschrijving,auteur,ppn"
                    }
                ]
            })
        });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log(data.results[0]. hits)
    } catch (error) {
      console.error('Error searching Typesense:', error);
    }
  }



module.exports = {
    searchTypesense
}