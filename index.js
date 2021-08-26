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
async function getShipPosition(url){

		// set driver   TODO: --disable-web-security
		
		let driver = chrome.Driver.createSession(new chrome.Options().addArguments(['--no-sandbox', '--headless', '--disable-dev-shm-usage', '--disable-gpu', '--disable-extensions',
		'excludeSwitches', 'enable-logging', '--ignore-ssl-errors', '--ignore-certificate-error', '--start-maximized', '--enable-automation',
		'--disable-blink-features=AutomationControlled', '--useAutomationExtension=False' ]), new 
		chrome.ServiceBuilder(path).build());
		driver.manage().timeouts().implicitlyWait(15000);
		driver.manage().window().setSize(993, 745); // it's a size of the browser window with full screen and open developper tools in chrome

		await driver.get(url);

		try {
			await driver.findElement(By.xpath("/html/body/div/div/div/div/div[2]/div/button[2]")).click();
		}
		catch(error){
    	console.error(error);
		}

		// find position
		const position = await driver.findElement(By.xpath("/html/body/main/div/div/div[3]/div[2]/div/div/div[3]/div/div[1]/span/div/div[2]/div/div/div/div/div[1]/p[5]/b/a")).getText();
		driver.quit();
		return position;

  }
	  
app.get('/getShipPosition/:ship', async (req, res) => {
	ship = req.params.ship;

	var shipArray = { 
		"HERMIONE" : 'https://www.marinetraffic.com/en/ais/details/ships/shipid:180670/mmsi:228052600/imo:0/vessel:LHERMIONE',
	  "BELEM" : 'https://www.marinetraffic.com/en/ais/details/ships/shipid:173170/mmsi:227051000/imo:8622983/vessel:BELEM',
	};

	console.log(shipArray[ship]);

	let position = await getShipPosition(shipArray[ship]);
  
    //res.set('Content-Type', 'text/html');
  return res.send(position);
});

app.get('/', (req, res) => {
  
    res.set('Content-Type', 'text/html');
    res.send('API on /getShipPosition/:ship');
});

app.listen(port, () => {
    console.log('Server app listening on port ' + port);
});