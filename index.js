const express = require('express');
const app = express();
const port = process.env.PORT || 3456;

// options : https://stackoverflow.com/questions/63466426/handshake-failed-returned-1-ssl-error-code-1-net-error-201 

webdriver = require('selenium-webdriver'),
By = webdriver.By,
until = webdriver.until,
Builder = webdriver.Builder,
Capabilities = webdriver.Capabilities,
chrome = require('selenium-webdriver/chrome'),
firefox = require('selenium-webdriver/firefox');
var path = require('chromedriver').path;

//const caps = new Capabilities();
//caps.setPageLoadStrategy("eager");


async function getCompanies(url){
		
		let companyNumber = 0;
		
		let driver = chrome.Driver.createSession(new chrome.Options().addArguments(['--no-sandbox', /*'--headless', */ '--disable-dev-shm-usage', '--disable-gpu', '--disable-extensions',
		'excludeSwitches', 'enable-logging', '--ignore-ssl-errors', '--ignore-certificate-error', '--start-maximized','--enable-automation', 
		'--disable-blink-features=AutomationControlled', '--useAutomationExtension=False', '--disable-software-rasterizer', '--disable-web-security']), new 
		chrome.ServiceBuilder(path).build());
		//driver.manage().waitForPageToLoad(30000);
		driver.manage().timeouts().implicitlyWait(50000000);
		driver.manage().window().setSize(993, 745); // it's a size of the browser window with full screen and open developper tools in chrome

		let companies = [];
		await driver.get(url);
		await driver.findElement(By.xpath('/html/body/c-wiz/div/div/div/div[2]/div[1]/div[4]/form/div[1]/div/button/span')).click(); // pass RGPD page

		driver.sleep(1700);
		let maxResultForPage = await driver.findElement(By.xpath('/html/body/jsl/div[3]/div[10]/div[8]/div/div[1]/div/div/div[4]/div[2]/div/div[1]/span/span[2]')).getText(); // 20 ? 
		console.log(maxResultForPage);

		if(maxResultForPage > 0){
			for (let currentCompany = 1; currentCompany < maxResultForPage * 2 ; currentCompany = currentCompany = currentCompany + 2) {
				driver.sleep(1600);

				// SCROLL 
				console.log('scroll');
				let scrollValue = 900;
				//if(currentCompany > 5){ scrollValue = 1200;}
				if(currentCompany > 7){ scrollValue = 1300;}
				if(currentCompany > 9){scrollValue = 2000;}
				if(currentCompany > 12){scrollValue = 2300;}
				if(currentCompany > 18){scrollValue = 5500;}

				driver.executeScript("var el = document.evaluate('/html/body/jsl/div[3]/div[10]/div[8]/div/div[1]/div/div/div[4]/div[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue; el.scroll(0, "+scrollValue+");");
				
				// SELECT COMPANY IN LIST
				driver.sleep(1500);
				console.log('selection element');
				await driver.findElement(By.xpath('/html/body/jsl/div[3]/div[10]/div[8]/div/div[1]/div/div/div[4]/div[1]/div['+currentCompany+']/div/a')).click(); // select company

				// GET ELEMENTS ON COMPANY PAGE
				console.log('GET company');
				let companyTitle = await driver.findElement(By.xpath('/html/body/jsl/div[3]/div[10]/div[8]/div/div[1]/div/div/div[2]/div[1]/div[1]/div[1]/h1/span[1]')).getText();
				let phone = await driver.findElement(By.xpath('/html/body/jsl/div[3]/div[10]/div[8]/div/div[1]/div/div/div[7]/div[4]/button/div[1]/div[2]/div[1]')).getText();
				let website = await driver.findElement(By.xpath('/html/body/jsl/div[3]/div[10]/div[8]/div/div[1]/div/div/div[7]/div[3]/button/div[1]/div[2]/div[1]')).getText();
				let mail = 'TODO: mail from website scraping'; // TODO: scrap function from website to get mail
				let adresse = await driver.findElement((By.xpath('/html/body/jsl/div[3]/div[10]/div[8]/div/div[1]/div/div/div[7]/div[1]/button/div[1]/div[2]/div[1]'))).getText();

				// CONSTRUCT COMPANY OBJECT
				company = [];
				if(companyTitle !== null){company.push(companyTitle);}
				if(phone !== null){company.push(phone);}
				if(website!== null){company.push(website);}
				if(mail !== null){company.push(mail);}
				if(adresse !== null ){company.push(adresse);}
				if(company!== null ){
					companies.push(company);
					companyNumber++;
				}
				console.log(company);
				console.log(companyNumber);

				driver.sleep(400);
					
				console.log('Navigation Back');
				await driver.findElement(By.xpath('/html/body/jsl/div[3]/div[10]/div[3]/div[1]/div[1]/div[1]/div[1]/button')).click();
				driver.sleep(1200);

				//RESULT HANDLER
				if(companyNumber >= 25){
					currentCompany = 100000;
				}

				//PAGE HANDLER
				console.log('currentCompany var:' + currentCompany);
				if(currentCompany >= 17 && currentCompany < 99999){
					console.log('nextPAGE');
					await driver.findElement(By.xpath('/html/body/jsl/div[3]/div[10]/div[8]/div/div[1]/div/div/div[4]/div[2]/div/div[1]/div/button[2]')).click(); // next page
					driver.sleep(1300);
					maxResultForPage = await driver.findElement(By.xpath('/html/body/jsl/div[3]/div[10]/div[8]/div/div[1]/div/div/div[4]/div[2]/div/div[1]/span/span[2]')).getText();
					currentCompany = 1;
					driver.sleep(1300);
				}

				
			}
		}
			return companies;
	}

		/****  TESTING XPATH FOR CHOOSE ONE COMPANY  ****/
		// xpath first element :  /html/body/jsl/div[3]/div[10]/div[8]/div/div[1]/div/div/div[4]/div[1]/div[1]/div/a
		// xpath second element : /html/body/jsl/div[3]/div[10]/div[8]/div/div[1]/div/div/div[4]/div[1]/div[3]/div/a
		// third element :        /html/body/jsl/div[3]/div[10]/div[8]/div/div[1]/div/div/div[4]/div[1]/div[5]/div/a
		// 20eme element :        /html/body/jsl/div[3]/div[10]/div[8]/div/div[1]/div/div/div[4]/div[1]/div[39]/div/a
		// maxResultForPage : 		/html/body/jsl/div[3]/div[10]/div[8]/div/div[1]/div/div/div[4]/div[2]/div/div[1]/span/span[2]         // 20 ?
		// nextPageButton :       /html/body/jsl/div[3]/div[10]/div[8]/div/div[1]/div/div/div[4]/div[2]/div/div[1]/div/button[2]
		// back to list button :  /html/body/jsl/div[3]/div[10]/div[3]/div[1]/div[1]/div[1]/div[4]/div/div[1]/div/div/button/span
		// rollback button in menu: /html/body/jsl/div[3]/div[10]/div[3]/div[1]/div[1]/div[1]/div[1]/button 
		// scrollView XPATH =     /html/body/jsl/div[3]/div[10]/div[8]/div/div[1]/div/div/div[4]/div[1] 

	  
/* Find Company on google Maps */
app.get('/getCompany/:searchWord', async (req, res) => {

	let searchWord = req.params.searchWord;
	let url = 'https://www.google.fr/maps/search/'+searchWord+'/@49.6192493,0.257829,12z/';
	let companies = await getCompanies(url);

	console.log(companies);
  
  res.set('Content-Type', 'text/html');
  return res.send(companies);
});



app.get('/', (req, res) => {
  
    res.set('Content-Type', 'text/html');
    res.send('API on /getCompany/:searchWord (searching in google maps)');
});

app.listen(port, () => {
    console.log('Server app listening on port ' + port);
});