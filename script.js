if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
    .then(() => console.log("Service Worker Ativo"));
}

async function searchMovie() {
    const movie = document.getElementById('movieInput').value.trim();
    const resultDiv = document.getElementById('result');
    const apiKey = 'd7d1449552ecf788e3f630f05b8a5dd9';
    const url = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${movie}&language=pt-BR`;

    if (!movie) return;

    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `<div class="loading">⏳ Buscando no TMDB...</div>`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.results.length === 0) {
            resultDiv.innerHTML = `<div class="error-msg"><h3>🎬 Título não encontrado.</h3></div>`;
            return;
        }

        const item = data.results[0];
        const title = item.title || item.name;
        const releaseDate = item.release_date || item.first_air_date || "";
        const year = releaseDate ? releaseDate.substring(0, 4) : "N/A";
        const posterSrc = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "https://via.placeholder.com/400x600?text=Sem+Capa";
        const rating = item.vote_average ? item.vote_average.toFixed(1) : "N/A";
        const plot = item.overview || "Sinopse não disponível.";

        resultDiv.innerHTML = `
            <img src="${posterSrc}" alt="Capa de ${title}">
            <div class="info">
                <h2>${title} (${year})</h2>
                <p class="rating">Nota: ${rating} ⭐</p>
                <p>${plot}</p>
                <a href="https://www.google.com/search?q=onde+assistir+${title}" target="_blank" class="watch-btn">▶️ ONDE ASSISTIR</a>
                <button class="share-btn" onclick="shareMovie('${title}')">📤 COMPARTILHAR</button>
            </div>
        `;
    } catch (e) {
        resultDiv.innerHTML = `<div class="error-msg"><p>⚠️ Erro de conexão.</p></div>`;
    }
}

function shareMovie(title) {
    if (navigator.share) {
        navigator.share({
            title: title,
            text: `Olha esse filme que achei no Netflux: ${title}`,
            url: window.location.href
        });
    } else {
        alert("Compartilhamento não suportado neste navegador.");
    }
}