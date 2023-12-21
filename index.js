const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
/*const jsdom = require("jsdom");
const { JSDOM } = jsdom;

class DOMParser {
	parseFromString(s, contentType = 'text/html') {
	  return new JSDOM(s, {contentType});
	}
  }
  const domparser = new DOMParser();*/
/*app.get("/", (req, res) => {
	
	res.send("html data here")
})*/



const domain = "aboutme.vercel.lilysoftpaw.com";
const embedTitle = "Lily's About me / Bio / Pronouns page";
const embedDescription = "Hehe Hello UwU!! I exist UwU!! I Shy Cat furry UwU!!"
const embedColor = "#8c05c1";
const assetsUrl = "./static/"
/*const cardLinksData = [
	{
		reference: "./projects",
		logo: "assets/logos/github.svg",
		title: "My projects",
		descTitle: "Cute projects page",
		desc: "A cute page for all of my projects",
	}
]*/
function createData(cardType, data){
	let returnData = "";
	data.forEach((item) => {
		returnData += `${cardType == 2 ? "<li>" : ""}<p>${item}</p>${cardType == 2 ? "</li>" : ""}`;
	})
	return returnData
}

app.get("/", async (request, resolve) => {
	//console.log("nya1")
	let discordEmbedTemplate = await fs.readFileSync(path.join(__dirname, "templates/discordEmbed.html")).toString()
	let twitterEmbedCard = await fs.readFileSync(path.join(__dirname, "templates/TwitterCard.html")).toString()
	twitterEmbedCard.replace("{username}", "@lilysoftpaw")
	let pageTemplate = await fs.readFileSync(path.join(__dirname, "templates/pageTemplate.html")).toString()
	
	discordEmbedTemplate = replaceAll(discordEmbedTemplate, "{domain}", domain);
	discordEmbedTemplate = replaceAll(discordEmbedTemplate, "{title}", embedTitle);
	discordEmbedTemplate = replaceAll(discordEmbedTemplate, "{description}", embedDescription);
	discordEmbedTemplate = replaceAll(discordEmbedTemplate, "{color}", embedColor);
	//console.log(pageTemplateDom.window.document.querySelector("head").querySelector(`meta[name="DiscordEmbed"]`))//.querySelectorAll(`div`).length)
	pageTemplate = pageTemplate.replace("{discordEmbed}", discordEmbedTemplate);
	pageTemplate = pageTemplate.replace("{twitterEmbed}",twitterEmbedCard);
	let cardLinksData = JSON.parse(fs.readFileSync(path.join(__dirname, "data.json")).toString()).links;
	let cards = ""
	cardLinksData.forEach(card => {
		let linkCard = fs.readFileSync(path.join(__dirname, "templates/linkCard.html")).toString();
	linkCard = replaceAll(linkCard, "{reference}", card.reference);
	linkCard = replaceAll(linkCard, "{logo}", assetsUrl + card.logo);
	linkCard = replaceAll(linkCard, "{title}", card.title);
	linkCard = replaceAll(linkCard, "{descTitle}", card.descTitle);
	linkCard = replaceAll(linkCard, "{desc}", card.desc);
	cards += linkCard;
	
	})
	pageTemplate = pageTemplate.replace("{linkCards}", cards)
	let cardInfoData1 = JSON.parse(fs.readFileSync(path.join(__dirname, "data.json")).toString()).info1;
	let cards2 = "";
	cardInfoData1.forEach(card => {
		let infoCard = fs.readFileSync(path.join(__dirname, "templates/infoCard1.html")).toString();
	infoCard = replaceAll(infoCard, "{title}", card.title);
	infoCard = replaceAll(infoCard, "{data}", createData(1,card.data));
	cards2 += infoCard;
	
	})
	pageTemplate = pageTemplate.replace("{infoCards1}", cards2)
	let cardInfoData2 = JSON.parse(fs.readFileSync(path.join(__dirname, "data.json")).toString()).info2;
	let cards3 = "";
	cardInfoData2.forEach(card => {
		let infoCard = fs.readFileSync(path.join(__dirname, "templates/infoCard2.html")).toString();
	infoCard = replaceAll(infoCard, "{title}", card.title);
	infoCard = replaceAll(infoCard, "{data}", createData(2,card.data));
	cards3 += infoCard;
	
	})
	pageTemplate = pageTemplate.replace("{infoCards2}", cards3)
		//const ParsedHTMLData = domparser.parseFromString(HtmlData);
		//let BaseScript = fs.readFileSync(path.join(global.appPath,"/wwwroot/scripts/subscribeScriptbase.js")).toString();
		//const SubscritionScript = BaseScript.replace("<url>","http://localhost:8081/endpoints/obs-overlay/subscribe");
		//ParsedHTMLData.window.document.querySelector("#subscribeScript").innerHTML = SubscritionScript;
		resolve.set('Content-Type', 'text/html');
		//console.log(ParsedHTMLData.serialize());
		resolve.send(pageTemplate);
		

});

function htmlToElems(document, html) {
	let temp = document.createElement('template');
	temp.innerHTML = html;
	return temp.content.childNodes;
  }

function replaceAll(string, replace, replaceWith){
	do{
		string = string.replace(replace, replaceWith);
	}while(string.includes(replace))
	return string;
}
/*
router.get("/subscribe", (req, res) => {
	res.()
	//console.log("Client subscribing to event");
	res.set({
		'Cache-Control': 'no-cache',
		'Content-Type': 'text/event-stream',
		'Connection': 'keep-alive'
	  });
	res.flushHeaders();
  
	  // Tell the client to retry every 10 seconds if connectivity is lost
	res.write('retry: 10000\n\n');
	//res.writeHead(200, headers);
	res.write('data: ' + JSON.stringify({msg: "subbed"}) + '\n\n');
	global.clients.push(res);
	sendDefault(res)


});*/
app.use("/static/", express.static(path.join(__dirname, "staticFiles")));

module.exports = app;

app.listen(3000, ()=>{
	console.log("port 3000");
})