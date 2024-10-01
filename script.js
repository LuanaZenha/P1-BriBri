// Utilize a Fetch API para consumir dados de uma API pública.

// API de Hearthstone
const API_URL = 'https://api.hearthstonejson.com/v1/25770/ptBR/cards.collectible.json';

// Elementos do DOM (interface que permite que scripts acessem e manipulem o conteúdo)
const cardListElement = document.getElementById('card-list'); // Elemento onde as cartas serão exibidas
const favoritesElement = document.getElementById('favorites'); // Elemento onde as cartas favoritas serão exibidas
const searchInput = document.getElementById('search'); // Campo de entrada para pesquisa
const loadMoreButton = document.getElementById('load-more'); // Botão para carregar mais cartas

// Array para armazenar cartas e favoritos
let cards = []; // Armazena todas as cartas recebidas da API
let displayedCardsCount = 0; // Conta quantas cartas estão atualmente exibidas
let favorites = []; // Armazena cartas que o usuário marcou como favoritas

// Função para buscar cartas da API
async function fetchCards() {
  try {
    const response = await fetch(API_URL); // Faz uma requisição para a API
    cards = await response.json(); // Converte a resposta em JSON(formato de troca de dados que é fácil para ler e escrever) e armazena em 'cards'
    displayCards(cards.slice(0, 14)); // Exibe as 7 primeiras cartas
    displayedCardsCount = 14; // Atualiza a contagem de cartas exibidas
  } catch (error) {
    console.error('Erro ao buscar cartas:', error); // Exibe erro no console se a requisição falhar
  }
}

// Função para exibir cartas
function displayCards(cardsToShow) {
  cardsToShow.forEach(card => { // Para cada carta que deve ser exibida
    const cardElement = document.createElement('div'); // Cria uma nova div para a carta
    cardElement.className = 'card'; // Define a classe CSS para estilização
    cardElement.innerHTML = `
      <h3>${card.name}</h3> <!-- Nome da carta -->
      <img src="https://art.hearthstonejson.com/v1/render/latest/ptBR/256x/${card.id}.png" alt="${card.name}" width="100"> <!-- Imagem da carta -->
      <button onclick="addFavorite('${card.id}')">Adicionar ao meu Deck</button> <!-- Botão para adicionar aos favoritos -->
      <button onclick="showDetails('${card.id}')">Detalhes</button> <!-- Botão para mostrar detalhes da carta -->
    `;
    cardListElement.appendChild(cardElement); // Adiciona o elemento da carta ao DOM
  });
}

// Função para carregar mais cartas
function loadMoreCards() {
  const remainingCards = cards.slice(displayedCardsCount, displayedCardsCount + 7); // Obtém as próximas 7 cartas
  displayCards(remainingCards); // Exibe as cartas restantes
  displayedCardsCount += 7; // Atualiza a contagem de cartas exibidas

  // Esconde o botão "Carregar Mais" se não houver mais cartas a serem exibidas
  if (displayedCardsCount >= cards.length) {
    loadMoreButton.style.display = 'none'; // Oculta o botão se todas as cartas foram exibidas
  }
}

// Implemente uma funcionalidade que permita ao usuário filtrar a lista exibida com base em um critério.
// Utilize funções de alta ordem como filter e map para manipular e exibir os dados filtrados.

// Função para filtrar cartas
function filterCards() {
  const searchTerm = searchInput.value.toLowerCase(); // Obtém o termo de pesquisa em minúsculas
  const filteredCards = cards.filter(card => card.name.toLowerCase().includes(searchTerm)); // Filtra cartas que incluem o termo de pesquisa
  cardListElement.innerHTML = ''; // Limpa a lista antes de exibir as filtradas
  displayCards(filteredCards.slice(0, 14)); // Exibe até 10 cartas filtradas
  displayedCardsCount = 14; // Atualiza a contagem de cartas exibidas
  loadMoreButton.style.display = filteredCards.length > 14 ? 'block' : 'none'; // Controla o botão "Carregar Mais" baseado no número de cartas filtradas
}

// Adicione uma funcionalidade que permita ao usuário salvar seus itens favoritos (por exemplo, salvar uma raça de cão favorita em um array local).
// Utilize o localStorage do navegador para armazenar os favoritos e possibilitar que, ao recarregar a página, os itens favoritos continuem visíveis.

// Função para adicionar uma carta aos favoritos
function addFavorite(cardId) {
  const favoriteCard = cards.find(card => card.id === cardId); // Busca a carta pelos seus ID
  // Verifica se a carta já está nos favoritos
  if (!favorites.some(card => card.id === cardId)) { 
    favorites.push(favoriteCard); // Adiciona a carta aos favoritos
    saveFavorites(); // Salva os favoritos 
    displayFavorites(); // Atualiza a exibição dos favoritos
  }
}

// Função para exibir cartas favoritas
function displayFavorites() {
  favoritesElement.innerHTML = ''; // Limpa a seção de favoritos
  favorites.forEach(card => { // Para cada carta favorita
    const cardElement = document.createElement('div'); // Cria uma div para a carta
    cardElement.className = 'card favorites'; // Define a classe CSS para estilização
    cardElement.innerHTML = `
      <h3>${card.name}</h3> <!-- Nome da carta favorita -->
      <img src="https://art.hearthstonejson.com/v1/render/latest/ptBR/256x/${card.id}.png" alt="${card.name}" width="100"> <!-- Imagem da carta favorita -->
      <button onclick="removeFavorite('${card.id}')">Remover do meu Deck</button> <!-- Botão para remover dos favoritos -->
    `;
    favoritesElement.appendChild(cardElement); // Adiciona o elemento da carta favorita ao DOM
  });
}

// Função para remover uma carta dos favoritos
function removeFavorite(cardId) {
  favorites = favorites.filter(card => card.id !== cardId); // Filtra as cartas favoritas para remover a carta selecionada
  saveFavorites(); // Salva a nova lista de favoritos
  displayFavorites(); // Atualiza a exibição dos favoritos
}

// Função para salvar favoritos 
function saveFavorites() {
  localStorage.setItem('favorites', JSON.stringify(favorites)); // Converte a lista de favoritos para string e armazena
}

/// Função para carregar favoritos
function loadFavorites() {
  const storedFavorites = localStorage.getItem('favorites'); // Obtém os favoritos
  if (storedFavorites) { // Verifica se existem favoritos salvos
    favorites = JSON.parse(storedFavorites); // Converte a string armazenada de volta para um array de objetos
    displayFavorites(); // Exibe os favoritos carregados
  }
}

// Implemente uma interação dinâmica ao clicar em um item da lista, exibindo um detalhe adicional sobre o item.
// A interação deve atualizar o DOM sem recarregar a página (utilizando eventos JavaScript).

// Função para exibir detalhes de uma carta
function showDetails(cardId) {
  const card = cards.find(card => card.id === cardId); // Busca a carta pelo ID
  // Atualiza o conteúdo do pop up
  document.getElementById('modal-card-image').src = `https://art.hearthstonejson.com/v1/render/latest/ptBR/256x/${card.id}.png`; // Exibe a imagem da carta pop up

  // Exibe o modal
  const modal = document.getElementById('card-modal');
  modal.style.display = 'block'; // Mostra o pop up
}

// Função para fechar o pop up
function closeModal() {
  const modal = document.getElementById('card-modal');
  modal.style.display = 'none'; // Oculta o pop up
}

// Adiciona o evento para fechar o modal ao clicar fora dele
window.addEventListener('click', (event) => {
  const modal = document.getElementById('card-modal');
  if (event.target === modal) { // Verifica se o clique foi fora do conteúdo do pop up
    closeModal(); // Fecha o pop up se clicado fora
  }
});

// Eventos
searchInput.addEventListener('input', filterCards); // Adiciona um evento de input para filtrar cartas enquanto o usuário digita
loadMoreButton.addEventListener('click', loadMoreCards); // Adiciona um evento de clique para carregar mais cartas

// Inicialização
fetchCards(); // Faz a requisição inicial para buscar cartas
loadFavorites(); // Carrega os favoritos na inicialização



