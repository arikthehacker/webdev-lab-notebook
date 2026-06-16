const pokemonColors = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#ea7ce8",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

const loader = document.querySelector(".loader");
const container = document.querySelector(".pokemon-container");
const searchInput = document.querySelector(".search-input");

let allPokemons = [];

// recieve pokemon object, build card, return it
const createCard = (pokemon) => {
  const types = pokemon.types.map((t) => t.type.name);

  const card = document.createElement("li");
  card.classList.add("pokemon-card");

  const name = document.createElement("h2");
  name.textContent = pokemon.name;

  const img = document.createElement("img");
  img.src = pokemon.sprites.other["official-artwork"].front_default;
  img.alt = `Official artwork of ${pokemon.name}`;
  img.loading = "lazy";
  img.width = 180;
  img.height = 180;

  const typesDiv = document.createElement("div");
  typesDiv.classList.add("types");
  types.forEach((type) => {
    const badge = document.createElement("span");
    badge.classList.add("type-badge");
    badge.textContent = type;
    badge.style.backgroundColor = pokemonColors[type] || "#ccc";
    typesDiv.append(badge);
  });

  card.append(name, img, typesDiv);
  return card;
};

// call renderPokemons every time search input changes
// wipes card grid and redraws with pokemon passed in
const renderPokemons = (pokemons) => {
  container.innerHTML = ""; // wipe

  if (pokemons.length === 0) {
    const msg = document.createElement("p");
    msg.classList.add("no-results");
    msg.textContent = "No Pokémon matched your search.";
    container.append(msg);
    return;
  }

  pokemons.forEach((pokemon) => container.append(createCard(pokemon)));
};

// fetch pokemon data then call render
const fetchPokemons = async () => {
  // fetch list of 25 pokemon & api urls
  const listRes = await fetch("https://pokeapi.co/api/v2/pokemon?limit=25");
  const listData = await listRes.json();

  // request all 25 at same time
  const detailPromises = listData.results.map((p) =>
    fetch(p.url).then((r) => r.json()),
  );

  // array of promises returns single new promise
  // resolves when every one of them is resolved
  allPokemons = await Promise.all(detailPromises);

  loader.style.display = "none"; // remove loading
  renderPokemons(allPokemons); // pass complete pokemon array
};

// connect input to js logic
searchInput.addEventListener("input", function () {
  const q = searchInput.value.toLowerCase();

  const filtered = allPokemons.filter((pokemon) => {
    const types = pokemon.types.map((t) => t.type.name);
    return (
      pokemon.name.toLowerCase().includes(q) || types.some((t) => t.includes(q))
    );
  });

  renderPokemons(filtered);
});

fetchPokemons();
