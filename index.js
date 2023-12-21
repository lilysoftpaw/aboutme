const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

class DOMParser {
	parseFromString(s, contentType = 'text/html') {
	  return new JSDOM(s, {contentType});
	}
  }
  const domparser = new DOMParser();
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


app.get("/", async (request, resolve) => {
	//console.log("nya1")
	let discordEmbedTemplate = await fs.readFileSync(path.join(__dirname, "templates/discordEmbed.html")).toString()
	let pageTemplate = await fs.readFileSync(path.join(__dirname, "templates/pageTemplate.html")).toString()
	const pageTemplateDom = domparser.parseFromString(pageTemplate);
	discordEmbedTemplate = replaceAll(discordEmbedTemplate, "{domain}", domain);
	discordEmbedTemplate = replaceAll(discordEmbedTemplate, "{title}", embedTitle);
	discordEmbedTemplate = replaceAll(discordEmbedTemplate, "{description}", embedDescription);
	discordEmbedTemplate = replaceAll(discordEmbedTemplate, "{color}", embedColor);
	//console.log(pageTemplateDom.window.document.querySelector("head").querySelector(`meta[name="DiscordEmbed"]`))//.querySelectorAll(`div`).length)
	pageTemplateDom.window.document.querySelector("head").innerHTML += discordEmbedTemplate;
	let cardLinksData = JSON.parse(fs.readFileSync(path.join(__dirname, "data.json")).toString());
	cardLinksData.forEach(card => {
		let linkCard = fs.readFileSync(path.join(__dirname, "templates/linkCard.html")).toString();
	linkCard = replaceAll(linkCard, "{reference}", card.reference);
	linkCard = replaceAll(linkCard, "{logo}", assetsUrl + card.logo);
	linkCard = replaceAll(linkCard, "{title}", card.title);
	linkCard = replaceAll(linkCard, "{descTitle}", card.descTitle);
	linkCard = replaceAll(linkCard, "{desc}", card.desc);
	pageTemplateDom.window.document.querySelector("div#links>div#linksContainerRow>div.linksContainer").innerHTML += linkCard;
	
	})
		//const ParsedHTMLData = domparser.parseFromString(HtmlData);
		//let BaseScript = fs.readFileSync(path.join(global.appPath,"/wwwroot/scripts/subscribeScriptbase.js")).toString();
		//const SubscritionScript = BaseScript.replace("<url>","http://localhost:8081/endpoints/obs-overlay/subscribe");
		//ParsedHTMLData.window.document.querySelector("#subscribeScript").innerHTML = SubscritionScript;
		resolve.set('Content-Type', 'text/html');
		//console.log(ParsedHTMLData.serialize());
		resolve.send(pageTemplateDom.serialize());
		

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