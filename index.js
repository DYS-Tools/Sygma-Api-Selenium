import express from 'express';
const app = express();
const port = process.env.PORT || 3456;
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

// options : https://stackoverflow.com/questions/63466426/handshake-failed-returned-1-ssl-error-code-1-net-error-201 

import 'selenium-webdriver';
import webdriver from 'selenium-webdriver';
//import By from 'selenium-webdriver';
import until  from 'selenium-webdriver';
import {Builder, By, }  from 'selenium-webdriver';
import Capabilities from 'selenium-webdriver';

import chrome from 'selenium-webdriver/chrome.js';
//firefox = require('selenium-webdriver/firefox');
import 'chromedriver';

import getEmailFromWebsite from './utils/utils.js';

async function getCompanies(url){
		
		let companyNumber = 0;

		//.setPageLoadStrategy(PageLoadStrategy.NORMAL)   // pass to eager
		let driver = chrome.Driver.createSession(new chrome.Options().addArguments(['--no-sandbox', /* '--headless', */  '--disable-dev-shm-usage', '--disable-gpu', '--disable-extensions',
		'excludeSwitches', 'enable-logging', '--ignore-ssl-errors', '--ignore-certificate-error', '--start-maximized','--enable-automation', 
		'--disable-blink-features=AutomationControlled', '--useAutomationExtension=False', '--disable-software-rasterizer', '--disable-web-security']), new 
		chrome.ServiceBuilder().build());

		//driver.manage().waitForPageToLoad(30000);
		driver.manage().timeouts().implicitlyWait(25);
		//driver.manage().window().setSize(993, 745); // it's a size of the browser window with full screen and open developper tools in chrome
		driver.manage().window().maximize();

		let companies = [];
		await driver.get(url);
		driver.sleep(1000);
		await driver.findElement(By.xpath('/html/body/c-wiz/div/div/div/div[2]/div[1]/div[4]/form/div[1]/div/button/span')).click(); // pass RGPD page

		driver.sleep(3800);
		let maxResultForPage = await driver.findElement(By.xpath('/html/body/jsl/div[3]/div[10]/div[8]/div/div[1]/div/div/div[4]/div[2]/div/div[1]/span/span[2]')).getText();
		console.log(maxResultForPage);

		if(Number(maxResultForPage) > 0){
			for (let currentCompany = 1; currentCompany < maxResultForPage * 2 ; currentCompany = currentCompany = currentCompany + 2) {
				driver.sleep(1600);

				// SCROLL 
				console.log('scroll');
				let scrollValue = 850;
				//if(currentCompany > 5){ scrollValue = 1200;}
				if(currentCompany > 7){ scrollValue = 1300;}
				if(currentCompany > 9){scrollValue = 2000;}
				if(currentCompany > 12){scrollValue = 2300;}
				if(currentCompany > 18){scrollValue = 5500;}
				driver.executeScript("var el = document.evaluate('/html/body/jsl/div[3]/div[10]/div[8]/div/div[1]/div/div/div[4]/div[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue; el.scroll(0, "+scrollValue+");");
				
				// SELECT COMPANY IN LIST
				driver.sleep(800);
				console.log('selection element');
				await driver.findElement(By.xpath('/html/body/jsl/div[3]/div[10]/div[8]/div/div[1]/div/div/div[4]/div[1]/div['+currentCompany+']/div/a')).click(); // select company
				driver.sleep(2400);

				// GET ELEMENTS ON COMPANY PAGE

				console.log('GET company');
				var companyTitle =  await driver.findElement(By.xpath("//div[@role='main' and @aria-label]"))//.get_attribute('aria-label')
					.then(function(element) { return element.getAttribute('aria-label'); })
					.catch( function(err) {  });

				var phone =  await driver.findElement(By.xpath("//button[contains(@aria-label, 'Numéro de téléphone:')]"))//.getAttribute('aria-label');
					.then(function(element) { return element.getAttribute('aria-label'); })
					.catch( function(err) {  });
				var website =  await driver.findElement(By.xpath("//button[contains(@aria-label, 'Site Web:')]"))//.getAttribute('aria-label');
					.then(function(element) { return element.getAttribute('aria-label'); })
					.catch( function(err) {  });

				var adresse =  await driver.findElement(By.xpath("//button[@data-item-id='address']"))//.getAttribute('aria-label');
					.then(function(element) { return element.getAttribute('aria-label'); })
					.catch( function(err) {  });

				//FIND EMAIL
				if(website !== null && website !== undefined){
					website =	website.replace('Site Web: ','');
					website =	website.replace(' ','');
					console.log(website);
					var mail = await getEmailFromWebsite('https://'+website);
					console.log(mail);
				}
				
				//mail = 'TODO: True email from website';

				driver.sleep(2000);
				//List elementsList = driver.findElements(By.xpath("//[contains(text(),'Selenium')]"));

				console.log('construct object');
				// CONSTRUCT COMPANY OBJECT AND TRANSFORM DATA
				let company = [];
				if(companyTitle !== null){company.push(companyTitle);}
				if(phone !== null && phone !== undefined ){company.push(phone.replace('Numéro de téléphone: ','')  );}
				if(website !== null && website !== undefined){company.push(website);}
				if(mail !== null && mail !== undefined){company.push(mail);}
				if(adresse !== null && adresse !== undefined ){company.push(adresse.replace('Adresse: ','')  );}
				
				if(company!== null && company.length > 0){
					companies.push(company);
					companyNumber++;
				}
				if(company !== null && company.length > 0){console.log(company);} else {console.log('company is null');}
				console.log(companyNumber);
				

				driver.sleep(800);
					
				//REMOVE MENU IF IT ENABLED
				/*
				if(await driver.findElement(By.xpath('/html/body/jsl/div[3]/div[10]/div[24]/div/div[2]/ul/jsl[3]/ul[1]/li[1]/button/label')).isDisplayed() == true ){
					await driver.findElement(By.xpath('/html/body/jsl/div[3]/div[10]/div[24]/div/div[2]/ul/div[2]/button')).click();
				}
				*/

				console.log('Navigation Back');
				//await driver.findElement(By.xpath('/html/body/jsl/div[3]/div[10]/div[3]/div[1]/div[1]/div[1]/div[1]/button')).click(); // work
				await driver.findElement(By.xpath('/html/body/jsl/div[3]/div[10]/div[3]/div[1]/div[1]/div[1]/div[4]/div/div[1]/div/div/button')).click();
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
					driver.sleep(2500);
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