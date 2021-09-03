import fetch from "node-fetch";

 export default async function getEmailFromWebsite(url){
  let emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[/fr|com|org|net|us|info/]+)/;
  let emailRegex2 = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  try{
    return await fetch(url)
      .then( res => { 
        let htmlPage = res.text();     // res.text work ! 

        // scraping email logic is good
        console.log('scraping email in url...');
        var mail = emailRegex2.exec(htmlPage);
        if(mail){return mail[0]}
        var mail = htmlPage.toString().match(emailRegex);
        if(mail){return mail[0]}
        var mail = htmlPage.toString().match(emailRegex2);
        if(mail){return mail[0]}
        return 'no email';
      })
      
  }
  catch{ return; }
  
    
};

