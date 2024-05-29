require('dotenv').config();
process.env.TYPESENSEAPIKEY


async function searchTypesense(query) {
    const apiKey = process.env.TYPESENSEAPIKEY;
    const encodedQuery = encodeURIComponent(query).replace(/%20/g, '+');
    const url = `http://localhost:8108/collections/obadbx/documents/search?q=${encodedQuery}&query_by=titel`;
    console.log(url)
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'X-TYPESENSE-API-KEY': apiKey
        }
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error searching Typesense:', error);
    }
  }

module.exports = {
    searchTypesense
}