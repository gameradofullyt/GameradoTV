// 1. CARROSSEL PRINCIPAL (TOPO)
let slideIndex = 1;
const slides = document.querySelectorAll('.carousel-item');

function showSlides(n) {
    if (slides.length === 0) return;
    if (n > slides.length) slideIndex = 1;
    if (n < 1) slideIndex = slides.length;
    slides.forEach(s => s.style.display = "none");
    slides[slideIndex - 1].style.display = "flex";
}

function changeSlide(n) {
    showSlides(slideIndex += n);
}

if(slides.length > 0) {
    showSlides(slideIndex);
    setInterval(() => changeSlide(1), 5000);
}

// 2. MOVIMENTO DOS SLIDERS DE CATEGORIA (SETAS)
function scrollSlider(button, direction) {
    const track = button.parentElement.querySelector('.slider-track');
    const scrollAmount = track.clientWidth * 0.8; // Rola 80% da tela visível
    track.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
    });
}

// 3. TEMA E PESQUISA (OPCIONAL)
const themeToggle = document.getElementById('themeToggle');
if(themeToggle) {
    themeToggle.addEventListener('click', () => {
        const html = document.documentElement;
        const isDark = html.getAttribute('data-theme') === 'dark';
        html.setAttribute('data-theme', isDark ? 'light' : 'dark');
    });
}

const grid = document.getElementById('grid-filmes');

let pagina = 0;
const filmesPorPagina = 20;

// EXEMPLO DE DADOS (troque depois por API ou JSON)
function gerarFilmes(qtd) {
    const filmes = [];
    for (let i = 0; i < qtd; i++) {
        filmes.push({
            titulo: 'Filme ' + (pagina * filmesPorPagina + i + 1),
            imagem: 'https://via.placeholder.com/300x450'
        });
    }
    return filmes;
}

function carregarFilmes() {
    const filmes = gerarFilmes(filmesPorPagina);

    filmes.forEach(filme => {
        const div = document.createElement('div');
        div.className = 'filme';
        div.innerHTML = `
            <img src="${filme.imagem}">
            <h4>${filme.titulo}</h4>
        `;
        grid.appendChild(div);
    });

    pagina++;
}

// SCROLL INFINITO
window.addEventListener('scroll', () => {
    const fimDaPagina =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;

    if (fimDaPagina) {
        carregarFilmes();
    }
});

// PRIMEIRA CARGA
carregarFilmes();

// ==========================================
// PESQUISA EM TEMPO REAL
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById('searchInput');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const termo = e.target.value.toLowerCase().trim();
            const sections = document.querySelectorAll('.category-slider');
            const dividers = document.querySelectorAll('.category-divider');
            const allCards = document.querySelectorAll('.card');

            if (termo.length > 0) {
                // 1. Esconde as faixas divisórias (ex: "Sagas", "Cine Pipoca")
                dividers.forEach(div => div.classList.add('hidden-search'));

                // 2. Filtra os cards seção por seção
                sections.forEach(section => {
                    let hasVisibleCard = false;
                    const cards = section.querySelectorAll('.card');

                    cards.forEach(card => {
                        const titulo = card.querySelector('h4').innerText.toLowerCase();
                        const info = card.querySelector('p') ? card.querySelector('p').innerText.toLowerCase() : '';

                        // Verifica se o termo existe no título ou na descrição
                        if (titulo.includes(termo) || info.includes(termo)) {
                            card.classList.remove('hidden-search');
                            hasVisibleCard = true;
                        } else {
                            card.classList.add('hidden-search');
                        }
                    });

                    // 3. Se a seção inteira (carrossel) não tiver resultados, esconde ela toda
                    if (hasVisibleCard) {
                        section.classList.remove('hidden-search');
                    } else {
                        section.classList.add('hidden-search');
                    }
                });
            } else {
                // CAMPO VAZIO: Mostra absolutamente tudo novamente
                dividers.forEach(div => div.classList.remove('hidden-search'));
                sections.forEach(section => section.classList.remove('hidden-search'));
                allCards.forEach(card => card.classList.remove('hidden-search'));
            }
        });
    }
});