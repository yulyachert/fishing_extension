const body = document.querySelector("body");
const fishTank = document.createElement("div");
body.appendChild(fishTank);
const template = chrome.runtime.getURL("template.html");
fetch(template).then((res) => res.text().then((t) => (fishTank.innerHTML = t)));
