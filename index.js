const express = require('express');
const app = express();
const port = process.env.PORT || 3456;

/*
require('chromedriver');
const chrome = require ('selenium-webdriver/chrome');
const {Builder, By, Key, until} = require ('selenium-webdriver');
*/

// options : https://stackoverflow.com/questions/63466426/handshake-failed-returned-1-ssl-error-code-1-net-error-201 

webdriver = require('selenium-webdriver'),
By = webdriver.By,
until = webdriver.until,
Builder = webdriver.Builder,
chrome = require('selenium-webdriver/chrome'),
firefox = require('selenium-webdriver/firefox');
var path = require('chromedriver').path;
 
//available on https://www.marinetraffic.com/en/ais/details/ships/shipid:5941181/mmsi:227914510/imo:0/vessel:HERMIONE
async function getCompany(url){

		// set driver   TODO: --disable-web-security
		
		let driver = chrome.Driver.createSession(new chrome.Options().addArguments(['--no-sandbox', /*'--headless', */ '--disable-dev-shm-usage', '--disable-gpu', '--disable-extensions',
		'excludeSwitches', 'enable-logging', '--ignore-ssl-errors', '--ignore-certificate-error', '--start-maximized','--enable-automation', 
		'--disable-blink-features=AutomationControlled', '--useAutomationExtension=False', '--disable-software-rasterizer']), new 
		chrome.ServiceBuilder(path).build());
		driver.manage().timeouts().implicitlyWait(200000000);
		driver.manage().window().setSize(993, 745); // it's a size of the browser window with full screen and open developper tools in chrome

		let companies = [];
		await driver.get(url);
		await driver.findElement(By.xpath('/html/body/c-wiz/div/div/div/div[2]/div[1]/div[4]/form/div[1]/div/button/span')).click(); // pass RGPD page

		let maxResultForPage = await driver.findElement(By.xpath('/html/body/jsl/div[3]/div[10]/div[8]/div/div[1]/div/div/div[4]/div[2]/div/div[1]/span/span[2]')).getText(); // 20 ? 
		console.log(maxResultForPage);

		if(maxResultForPage > 0){
			for (let currentCompany = 1; currentCompany < maxResultForPage ; currentCompany = currentCompany + 2) {
				  try{
						driver.sleep(800);
						await driver.findElement(By.xpath('/html/body/jsl/div[3]/div[10]/div[8]/div/div[1]/div/div/div[4]/div[1]/div['+currentCompany+']/div/a')).click();
						let companyTitle = await driver.findElement(By.xpath('/html/body/jsl/div[3]/div[10]/div[8]/div/div[1]/div/div/div[2]/div[1]/div[1]/div[1]/h1/span[1]')).getText();
						let phone = await driver.findElement(By.xpath('/html/body/jsl/div[3]/div[10]/div[8]/div/div[1]/div/div/div[7]/div[4]/button/div[1]/div[2]/div[1]')).getText();
						let website = await driver.findElement(By.xpath('/html/body/jsl/div[3]/div[10]/div[8]/div/div[1]/div/div/div[7]/div[3]/button/div[1]/div[2]/div[1]')).getText();
						let mail = 'TODO: mail from website scraping'; // TODO: scrap function from website to get mail
						let adresse = await driver.findElement((By.xpath('/html/body/jsl/div[3]/div[10]/div[8]/div/div[1]/div/div/div[7]/div[1]/button/div[1]/div[2]/div[1]'))).getText();

						let company = [companyTitle, phone, website, mail, adresse];
						companies.push(company);
						console.log(company);
						//driver.quit();
						await driver.navigate().back();
					} catch(e){}

					try{
						await driver.findElement(By.xpath('/html/body/c-wiz/div/div/div/div[2]/div[1]/div[4]/form/div[1]/div/button/span')).click(); // pass RGPD page
					}catch(e){}
			}
			return companies;
		}

		//if /html/body/jsl/div[3]/div[10]/div[8]/div/div[1]/div/div/div[4]/div[2]/div/div[1]/span/span[2] == 20
		
		await driver.findElement(By.xpath('/html/body/jsl/div[3]/div[10]/div[8]/div/div[1]/div/div/div[4]/div[1]/div[1]/div/a')).click(); // click on one company

		let companyTitle = await driver.findElement(By.xpath('/html/body/jsl/div[3]/div[10]/div[8]/div/div[1]/div/div/div[2]/div[1]/div[1]/div[1]/h1/span[1]')).getText();
		let phone = await driver.findElement(By.xpath('/html/body/jsl/div[3]/div[10]/div[8]/div/div[1]/div/div/div[7]/div[4]/button/div[1]/div[2]/div[1]')).getText();
		let website = await driver.findElement(By.xpath('/html/body/jsl/div[3]/div[10]/div[8]/div/div[1]/div/div/div[7]/div[3]/button/div[1]/div[2]/div[1]')).getText();
		let mail = 'TODO: mail from website scraping'; // TODO: scrap function from website to get mail
		let adresse = await driver.findElement((By.xpath('/html/body/jsl/div[3]/div[10]/div[8]/div/div[1]/div/div/div[7]/div[1]/button/div[1]/div[2]/div[1]'))).getText();

		/****  TESTING XPATH FOR CHOOSE ONE COMPANY  ****/
		// xpath first element :  /html/body/jsl/div[3]/div[10]/div[8]/div/div[1]/div/div/div[4]/div[1]/div[1]/div/a
		// xpath second element : /html/body/jsl/div[3]/div[10]/div[8]/div/div[1]/div/div/div[4]/div[1]/div[3]/div/a
		// third element :        /html/body/jsl/div[3]/div[10]/div[8]/div/div[1]/div/div/div[4]/div[1]/div[5]/div/a
		// 20eme element :        /html/body/jsl/div[3]/div[10]/div[8]/div/div[1]/div/div/div[4]/div[1]/div[39]/div/a
		// maxResultForPage : 		/html/body/jsl/div[3]/div[10]/div[8]/div/div[1]/div/div/div[4]/div[2]/div/div[1]/span/span[2]         // 20 ?
		// nextPageButton :       /html/body/jsl/div[3]/div[10]/div[8]/div/div[1]/div/div/div[4]/div[2]/div/div[1]/div/button[2]/img

		//driver.back()

		let company = [companyTitle, phone, website, mail, adresse];
		companies.push(company);
		//driver.quit();
		return companies;
  }
	  
/* Find Company on google Maps */
app.get('/getCompany/:searchWord', async (req, res) => {
	let searchWord = req.params.searchWord;

	let url = 'https://www.google.fr/maps/search/'+searchWord+'/@49.6192493,0.257829,12z/';
	let companies = await getCompany(url);

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