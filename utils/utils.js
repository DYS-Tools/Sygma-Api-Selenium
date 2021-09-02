import fetch from "node-fetch";

 export default function getEmailFromWebsite(url){
  console.log('scraping email in url...');
  fetch(url).then(function(response) {
    response.text().then(function(text) {
      return text;
    });
  });
}


