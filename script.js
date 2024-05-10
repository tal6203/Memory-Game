let game_data = {
    face: [],
    temp: false,
    firstCard: undefined,
    secondCard: undefined,
    count: 0,
    loader: 5,
    gameStarted: false,
    cardsClickable: true
  };
  
  let programImages = [
    "img/monsters-01.png",
    "img/monsters-02.png",
    "img/monsters-03.png",
    "img/monsters-04.png",
    "img/monsters-05.png",
    "img/monsters-06.png",
    "img/monsters-07.png",
    "img/monsters-08.png",
    "img/monsters-01.png",
    "img/monsters-02.png",
    "img/monsters-03.png",
    "img/monsters-04.png",
    "img/monsters-05.png",
    "img/monsters-06.png",
    "img/monsters-07.png",
    "img/monsters-08.png"
  ];
  
  const cards = document.querySelectorAll(".card");
  const fetchImagesBtn = document.getElementById("fetchImagesBtn");
  const useProgramImagesBtn = document.getElementById("useProgramImagesBtn");
  
  create_game();
  
  function create_game() {
    fetchImagesBtn.style.cursor = "pointer";
    useProgramImagesBtn.style.cursor = "pointer";
    fetchImagesBtn.addEventListener("click", () => {
      fetch("https://dog.ceo/api/breeds/image/random/8")
        .then((response) => response.json())
        .then((data) => {
          const newImages = data.message;
          const copyNewImages = [...newImages];
          game_data.face = newImages.concat(copyNewImages);
          fetchImagesBtn.classList.add("bord");
          useProgramImagesBtn.style.textDecoration = "line-through";
          enableGame();
        });
    });
  
    useProgramImagesBtn.addEventListener("click", () => {
      game_data.face = programImages.slice();
      useProgramImagesBtn.classList.add("bord");
      fetchImagesBtn.style.textDecoration = "line-through";
      enableGame();
    });
  }
  
  function enableGame() {
    fetchImagesBtn.style.cursor = "";
    useProgramImagesBtn.style.cursor = "";
    fetchImagesBtn.disabled = true;
    useProgramImagesBtn.disabled = true;
    game_data.face.sort(() => 0.5 - Math.random());
  
    cards.forEach((card, index) => {
      const cardBack = card.querySelector(".card-back");
      cardBack.style.backgroundImage = `url(${game_data.face[index]})`;
  
      card.addEventListener("click", () => {
        if (game_data.gameStarted && game_data.cardsClickable) {
          valid(card, index);
        }
      });
    });
    game_data.gameStarted = true;
  }
  
  function valid(card, index) {
    if (game_data.firstCard === undefined || game_data.secondCard === undefined) {
      card.classList.add("flipped");
  
      if (!game_data.temp) {
        game_data.firstCard = card;
        game_data.temp = true;
      } else {
        game_data.secondCard = card;
        game_data.temp = false;
      }
  
      if (game_data.firstCard === card) {
        game_data.secondCard = undefined;
        game_data.temp = true;
      } else if (game_data.firstCard !== undefined && game_data.secondCard !== undefined) {
        checkMatch();
      }
    }
  }
  
  function checkMatch() {
    game_data.cardsClickable = false;
    const card1Back = game_data.firstCard.querySelector(".card-back");
    const card2Back = game_data.secondCard.querySelector(".card-back");
  
    if (
      card1Back.style.backgroundImage === card2Back.style.backgroundImage &&
      game_data.firstCard !== game_data.secondCard
    ) {
      document.getElementById("result").innerHTML = "Match";
      document.getElementById("result").style.color = "gold";
      game_data.count++;
      setTimeout((a, b) => {
        document.getElementById("result").innerHTML = "";
        a.style.visibility = "hidden";
        b.style.visibility = "hidden";
        game_data.temp = false;
        game_data.cardsClickable = true;
      }, 1000, game_data.firstCard, game_data.secondCard);
  
      if (game_data.count === 8) {
        counter();
      }
    } else {
      document.getElementById("result").innerHTML = "Not a match, but don't worry, try again";
      document.getElementById("result").style.color = "#d9534f";
      setTimeout((a, b) => {
        document.getElementById("result").innerHTML = "";
        a.classList.remove("flipped");
        b.classList.remove("flipped");
        game_data.temp = false;
        game_data.cardsClickable = true;
      }, 1000, game_data.firstCard, game_data.secondCard);
    }
  
    game_data.firstCard = undefined;
    game_data.secondCard = undefined;
  }
  
  function restGame() {
    game_data.count = 0;
    game_data.loader = 5;
    game_data.face.sort(() => 0.5 - Math.random());
    document.getElementById("result").innerHTML = ``;
    cards.forEach((card) => {
      card.classList.remove("flipped");
      card.style.visibility = "visible";
    });
    fetchImagesBtn.disabled = false;
    useProgramImagesBtn.disabled = false;
    fetchImagesBtn.style.cursor = "pointer";
    useProgramImagesBtn.style.cursor = "pointer";
    fetchImagesBtn.classList.remove("bord");
    useProgramImagesBtn.classList.remove("bord");
    fetchImagesBtn.style.textDecoration = "";
    useProgramImagesBtn.style.textDecoration = "";
    game_data.gameStarted = false;
    game_data.cardsClickable = true;
  }
  
  function counter() {
    let myTimer = setInterval(function () {
      document.getElementById("result").innerHTML = `Congratulations! You found them all! The new game starts in: ${game_data.loader}`;
      game_data.loader--;
      if (game_data.loader === -1) {
        clearInterval(myTimer);
        restGame();
      }
    }, 1000);
  }
  
