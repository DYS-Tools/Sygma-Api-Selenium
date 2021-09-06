import fetch from "node-fetch";

 export default async function getEmailFromWebsite(url){
  let emailRegex = /([a-zA-Z0-9.&%^_-]+@[a-zA-Z0-9.&%^_-]+\.[/fr|com|org|net|us|info/]+)/;
  let emailRegex2 = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  return await fetch(url)
    .then( async res => { 
       return await res.text()   // res.text work ! 
        .then(  function  (text)  {
            console.log('render text from website');
            return emailRegex.exec(text);
          })

      //htmlPage = htmlPage.replace('', ' ');
      //htmlPage = htmlPage.replace('\t', ' ');
  })
};

