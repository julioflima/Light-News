# Resumo-News

let parag = document.getElementsByTagName("p")
var news = []
for (let [key, value] of Object.entries(parag)) {
  news.push(value.innerText);
}
