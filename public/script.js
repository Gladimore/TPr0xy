var haha = document.querySelector("#haha");
var lol = []

fetch('./assets/sprites.json')
.then((res) => res.json())
.then((data) => {
  lol = data
  shuffle(lol)
  lmao();
})

async function getRandomJoke() {
  const response = await fetch('https://api.chucknorris.io/jokes/random');
  const joke = await response.json();
  lol.push(joke.value)
}
getRandomJoke();

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

let jokeOn = 0
function lmao(){
  jokeOn++;

  if (jokeOn < lol.length){
    haha.textContent = lol[jokeOn];
  } else{
     jokeOn = 0;
    shuffle(lol) 
    haha.textContent = lol[jokeOn]
  }
}


lmao();

haha.addEventListener('click', function(){
  lmao();
});

document.body.addEventListener("keydown", (event) => {
  if (event.keyCode == 13) {
    getSite();
  }
});

function getSite() {
  let inputValue = document.querySelector('input').value;

  if (!inputValue.startsWith('http://') && !inputValue.startsWith('https://')) {
    inputValue = 'http://' + inputValue;
  }

  const encodedValue = btoa(inputValue);
  window.location.href = "/web/_" + encodedValue + '_/';
}