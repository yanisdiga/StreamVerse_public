var playerReady = false;
var player; // Déclarez la variable du lecteur en dehors des fonctions pour qu'elle soit accessible dans tout le script

function onYouTubeIframeAPIReady() {
    // Aucun besoin de créer le lecteur ici car il sera créé dynamiquement lors du clic
}
function onPlayerStateChange(event) {
    // Gérez les changements d'état du lecteur ici
}

let firstClick = 0;

function iOS() {
    return [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod'
    ].includes(navigator.platform)
        // iPad on iOS 13 detection
        || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
}

const os = iOS();

function createPlayer() {
    player = new YT.Player('youtube', {
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady() {
    playerReady = true;
}

const bannerImg = document.querySelector(".bannerImg");
const bannerTitle = document.querySelector(".bannerTitle");
const bannerDescription = document.querySelector(".bannerDescription");
const container = document.querySelector(".container");
const categoryContainers = [];


const posters = document.querySelectorAll(".poster");
const modalContainer = document.querySelector(".modal-container");
const modalBackground = document.querySelector(".modal-background");
const modal = document.getElementById("previewModal");

const blurBackground = document.querySelector(".blur-background");

const login = document.querySelector(".login");

let connected = 0;

const apiKey = '' //TMDB API KEY;

const azureJsonUrl = '' // Azure blob storage link;

const showPassword = document.querySelector(".show-password");
const hidePassword = document.querySelector(".hide-password");
const password = document.querySelector(".login-password");
showPassword.addEventListener("click", () => {
    showPassword.style.display = "none";
    hidePassword.style.display = "block";
    password.type = "text";
});

hidePassword.addEventListener("click", () => {
    hidePassword.style.display = "none";
    showPassword.style.display = "block";
    password.type = "password";
});

const showSignupPassword = document.querySelector(".show-password-signup");
const hideSignupPassword = document.querySelector(".hide-password-signup");

const showSignupConfirmPassword = document.querySelector(".show-confirm-password");
const hideSignupConfirmPassword = document.querySelector(".hide-confirm-password");

const signupPassword = document.querySelector(".signup-password");
const signupConfirmPassword = document.querySelector(".signup-confirm-password");

showSignupPassword.addEventListener("click", () => {
    showSignupPassword.style.display = "none";
    hideSignupPassword.style.display = "block";
    signupPassword.type = "text";
});
hideSignupPassword.addEventListener("click", () => {
    hideSignupPassword.style.display = "none";
    showSignupPassword.style.display = "block";
    signupPassword.type = "password";
});
showSignupConfirmPassword.addEventListener("click", () => {
    showSignupConfirmPassword.style.display = "none";
    hideSignupConfirmPassword.style.display = "block";
    signupConfirmPassword.type = "text";
});
hideSignupConfirmPassword.addEventListener("click", () => {
    hideSignupConfirmPassword.style.display = "none";
    showSignupConfirmPassword.style.display = "block";
    signupConfirmPassword.type = "password";
});

let isMuted = false;

fetch('/check-subscription')
    .then(response => response.json())
    .then(data => {
        const isSubscribed = data.isSubscribed !== false ? data.isSubscribed : 0;
        const userId = data.userId;
        const loginButton = document.querySelector(".loginButton");
        const closeLoginButton = document.querySelector(".close-login");
        const account = document.querySelector(".account");
        const closeAccountButton = document.querySelector(".close-account");

        loginButton.addEventListener("click", () => {
            if (isSubscribed == undefined) {
                login.style.display = "flex";
                modalBackground.style.display = "block";
                document.body.style = "overflow: hidden;";
            }
            else {
                modalBackground.style.display = "block";
                account.style.display = "flex";
                document.body.style = "overflow: hidden;";
            }

        });

        closeLoginButton.addEventListener("click", () => {
            login.style.display = "none"
            modalBackground.style.display = "none";
        });

        closeAccountButton.addEventListener("click", () => {
            account.style.display = "none";
            modalBackground.style.display = "none";
        });

        // Utilisation de l'API Fetch pour récupérer le fichier JSON
        fetch(azureJsonUrl)
            .then(response => response.json())
            .then(data => {
                const results = data.result;

                results.forEach((item, index) => {
                    const details = item.details;
                    const categoryName = item.title;

                    const categoryDiv = document.createElement("div");
                    categoryDiv.className = "category";

                    const categoryTitle = document.createElement("h2");
                    categoryTitle.textContent = categoryName;
                    categoryDiv.appendChild(categoryTitle);

                    const postersDiv = document.createElement("div");
                    postersDiv.className = "posters";

                    details.forEach((detail, detailIndex) => {
                        let movieType = detail.type;
                        let movieId = detail.id;
                        let url = "";
                        const episodeURLs = [];
                        if (isSubscribed !== 0 || isSubscribed !== undefined) {
                            if (movieType === "tv") {
                                if (detail.episodes) {
                                    const episodeURLs = detail.episodes.map(episode => episode.url);
                                    url = detail.url;
                                } else {
                                    // Si la propriété episodes n'existe pas, utilisez l'URL du détail
                                    episodeURLs.push(detail.url);
                                    url = detail.url;
                                }
                            }
                            else {
                                url = detail.url;
                            }
                        }
                        let title = "";

                        // Faire une requête à l'API TMDb pour obtenir les détails du film
                        const requestUrl = `https://api.themoviedb.org/3/${movieType}/${movieId}?language=fr-FR&api_key=${apiKey}`;
                        fetch(requestUrl)
                            .then(response => response.json())
                            .then(movieData => {
                                const overview = movieData.overview;
                                const runtime = movieData.runtime;
                                const hour = Math.floor(movieData.runtime / 60);
                                const minutes = runtime % 60;
                                const releaseDate = movieData.release_date;
                                let year = "";
                                if (releaseDate) {
                                    const dateParts = releaseDate.split('-');
                                    year = dateParts[0];
                                }
                                if (movieType === "movie") {
                                    title = movieData.title;
                                }
                                else {
                                    title = movieData.name;
                                }

                                const posterDiv = document.createElement("div");
                                posterDiv.className = "poster";

                                const img = document.createElement("img");
                                img.src = "https://image.tmdb.org/t/p/w500" + movieData.poster_path;

                                posterDiv.appendChild(img);

                                postersDiv.appendChild(posterDiv);
                                posterDiv.addEventListener("mouseover", () => {
                                    // Appliquer les nouvelles valeurs avec une transition fluide
                                    bannerImg.style.opacity = "0"; // Réduire l'opacité à 0
                                    bannerTitle.style.opacity = "0"; // Réduire l'opacité du titre à 0
                                    bannerDescription.style.opacity = "0"; // Réduire l'opacité de la description à 0

                                    bannerImg.style.transform = "translateX(20%)"; // Déplacer légèrement l'image vers la droite
                                    bannerTitle.style.transform = "translateX(20%)"; // Déplacer légèrement le titre vers la droite
                                    bannerDescription.style.transform = "translateX(20%)"; // Déplacer légèrement la description vers la droite

                                    setTimeout(() => {
                                        bannerImg.src = "https://image.tmdb.org/t/p/w780" + movieData.backdrop_path;
                                        bannerTitle.textContent = title;
                                        bannerDescription.textContent = overview;

                                        bannerImg.style.transform = "translateX(0%)"; // Revenir à la position d'origine (0%)
                                        bannerTitle.style.transform = "translateX(0%)"; // Revenir à la position d'origine (0%)
                                        bannerDescription.style.transform = "translateX(0%)"; // Revenir à la position d'origine (0%)

                                        bannerImg.style.opacity = "1"; // Augmenter l'opacité de l'image à 1
                                        bannerTitle.style.opacity = "1"; // Augmenter l'opacité du titre à 1
                                        bannerDescription.style.opacity = "1"; // Augmenter l'opacité de la description à 1
                                    }, 300); // Attendre 300 millisecondes avant de changer les valeurs
                                });

                                posterDiv.addEventListener("click", () => {
                                    modalContainer.style = "display: block;";
                                    modalBackground.style = "display: block;";
                                    document.body.style.overflow = "hidden";

                                    const requestUrlVideo = `https://api.themoviedb.org/3/${movieType}/${movieId}/videos?language=fr-FR&api_key=${apiKey}`;
                                    fetch(requestUrlVideo)
                                        .then(response => response.json())
                                        .then(data => {
                                            let trailerUrl = "";
                                            // Vérifier si des vidéos sont disponibles dans la réponse
                                            if (data.results && data.results.length > 0) {
                                                // Filtrer les vidéos pour obtenir la bande annonce (trailer) en VF
                                                const vfTrailer = data.results.find(video => video.site === 'YouTube' && video.type === 'Trailer' && video.iso_639_1 === 'fr');

                                                if (vfTrailer) {
                                                    trailerUrl = vfTrailer.key;
                                                }
                                            }

                                            if (trailerUrl === "") {
                                                if (data.results.length > 0) {
                                                    trailerUrl = data.results[0].key;
                                                }
                                                else {
                                                    trailerUrl = "";
                                                }
                                            }

                                            let mute = false;
                                            if (os == true) {
                                                mute = true;
                                                if (firstClick == 0) {
                                                    isMuted = true;
                                                }
                                            }
                                            else if (isMuted == true) {
                                                mute = true;
                                            }
                                            else {
                                                mute = false;
                                            }



                                            modalContainer.innerHTML = `
                                                <div class="modal">
                                                    <div class="modal-img">
                                                        <iframe id="youtube" class="video" width="1280" height="720" src="https://www.youtube.com/embed/${trailerUrl}?enablejsapi=1&autoplay=1&controls=0&disablekb=1&showinfo=0&loop=1&mute=${mute}&playlist=${trailerUrl}" frameborder="0" allowfullscreen="1" allow="autoplay;encrypted-media"></iframe>
                                                        <img src="https://image.tmdb.org/t/p/w780${movieData.backdrop_path}" alt="background" class="background-img" style="display: none">
                                                        <div class="modal-img-overlay">
                                                            <h1>${title}</h1>
                                                            <p class="modal-info">${hour} h ${minutes} min • ${year}</p>
                                                            <div class="modal-buttons">
                                                                <div class="modal-play">
                                                                    <button class="play-btn" data-lien="${url}">
                                                                        <div class="play-btn-icon">
                                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="ltr-0 e1mhci4z1" data-name="Play" aria-hidden="true">
                                                                                <path d="M5 2.69127C5 1.93067 5.81547 1.44851 6.48192 1.81506L23.4069 11.1238C24.0977 11.5037 24.0977 12.4963 23.4069 12.8762L6.48192 22.1849C5.81546 22.5515 5 22.0693 5 21.3087V2.69127Z" fill="currentColor"></path>
                                                                            </svg>
                                                                        </div>
                                                                        <div class="ltr-1npqywr" style="width: 1rem;"></div>
                                                                        Lecture
                                                                    </button>
                                                                </div>
                                                                <div class="modal-watchlist">
                                                                    <button aria-label="Ajouter à Ma liste" id="watchlistButtonAdd" data-uia="add-to-my-list" type="button">
                                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" data-name="Plus" aria-hidden="true">
                                                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M11 11V2H13V11H22V13H13V22H11V13H2V11H11Z" fill="currentColor"></path>
                                                                            </svg>      
                                                                    </button>
                                                                    <button aria-label="Supprimer de Ma liste" class="watchlistButtonRemove" id="watchlistButtonRemove" data-uia="add-to-my-list-added" type="button">
                                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" data-name="Checkmark" aria-hidden="true">
                                                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M21.2928 4.29285L22.7071 5.70706L8.70706 19.7071C8.51952 19.8946 8.26517 20 7.99995 20C7.73474 20 7.48038 19.8946 7.29285 19.7071L0.292847 12.7071L1.70706 11.2928L7.99995 17.5857L21.2928 4.29285Z" fill="currentColor"></path>
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                                <div class="modal-mute">
                                                                    <button aria-label="Activer l'audio" id="muteButton" type="button">
                                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="playing" style="display: block" data-name="VolumeHigh" aria-hidden="true">
                                                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M24 12C24 8.28693 22.525 4.72597 19.8995 2.10046L18.4853 3.51468C20.7357 5.76511 22 8.81736 22 12C22 15.1826 20.7357 18.2348 18.4853 20.4852L19.8995 21.8995C22.525 19.2739 24 15.713 24 12ZM11 3.99995C11 3.59549 10.7564 3.23085 10.3827 3.07607C10.009 2.92129 9.57889 3.00685 9.29289 3.29285L4.58579 7.99995H1C0.447715 7.99995 0 8.44767 0 8.99995V15C0 15.5522 0.447715 16 1 16H4.58579L9.29289 20.7071C9.57889 20.9931 10.009 21.0786 10.3827 20.9238C10.7564 20.7691 11 20.4044 11 20V3.99995ZM5.70711 9.70706L9 6.41417V17.5857L5.70711 14.2928L5.41421 14H5H2V9.99995H5H5.41421L5.70711 9.70706ZM16.0001 12C16.0001 10.4087 15.368 8.88254 14.2428 7.75732L12.8285 9.17154C13.5787 9.92168 14.0001 10.9391 14.0001 12C14.0001 13.0608 13.5787 14.0782 12.8285 14.8284L14.2428 16.2426C15.368 15.1174 16.0001 13.5913 16.0001 12ZM17.0709 4.92889C18.9462 6.80426 19.9998 9.3478 19.9998 12C19.9998 14.6521 18.9462 17.1957 17.0709 19.071L15.6567 17.6568C17.157 16.1565 17.9998 14.1217 17.9998 12C17.9998 9.87823 17.157 7.8434 15.6567 6.34311L17.0709 4.92889Z" fill="currentColor"></path>
                                                                        </svg>
                                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="muted" style="display: none" data-name="VolumeOff" aria-hidden="true">
                                                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M11 4.00003C11 3.59557 10.7564 3.23093 10.3827 3.07615C10.009 2.92137 9.57889 3.00692 9.29289 3.29292L4.58579 8.00003H1C0.447715 8.00003 0 8.44774 0 9.00003V15C0 15.5523 0.447715 16 1 16H4.58579L9.29289 20.7071C9.57889 20.9931 10.009 21.0787 10.3827 20.9239C10.7564 20.7691 11 20.4045 11 20V4.00003ZM5.70711 9.70714L9 6.41424V17.5858L5.70711 14.2929L5.41421 14H5H2V10H5H5.41421L5.70711 9.70714ZM15.2929 9.70714L17.5858 12L15.2929 14.2929L16.7071 15.7071L19 13.4142L21.2929 15.7071L22.7071 14.2929L20.4142 12L22.7071 9.70714L21.2929 8.29292L19 10.5858L16.7071 8.29292L15.2929 9.70714Z" fill="currentColor"></path>
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="modal-close close-container">
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" data-name="X" aria-labelledby="preview-modal-80236390" data-uia="previewModal-closebtn" role="button" aria-label="close" tabindex="0">
                                                        <title id="preview-modal-80236390">close</title>
                                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M10.5858 12L2.29291 3.70706L3.70712 2.29285L12 10.5857L20.2929 2.29285L21.7071 3.70706L13.4142 12L21.7071 20.2928L20.2929 21.7071L12 13.4142L3.70712 21.7071L2.29291 20.2928L10.5858 12Z" fill="currentColor"></path>
                                                        </svg>
                                                    </div>
                                                    <div class="modal-details">
                                                        <div class="dropdownDiv">
                                                            <div class="dropdown-season" style="display: none">
                                                                <button class="dropbtn dropbtn-season">Saison 1</button>
                                                                <div class="dropdown-content dropdown-content-season"></div>
                                                            </div>
                                                        </div>
                                                        <div class="episode-list-container" style="display: none"></div>
                                                        <div class="genre"></div>
                                                        <p class="movie-overview">${overview}</p>
                                                    </div>
                                                </div>
                                            ` ;
                                            createPlayer();

                                            const playing = document.querySelector(".playing");
                                            const muted = document.querySelector(".muted");
                                            const youtube = document.getElementById("youtube");

                                            if (isMuted) {
                                                playing.style.display = 'none';
                                                muted.style.display = 'block';
                                            }
                                            else {
                                                playing.style.display = 'block';
                                                muted.style.display = 'none';
                                            }

                                            // Event listener pour le bouton de sourdine
                                            document.getElementById("muteButton").addEventListener('click', function (event) {
                                                if (playerReady) {
                                                    if (isMuted) {
                                                        player.unMute();
                                                        playing.style.display = 'block';
                                                        muted.style.display = 'none';
                                                        isMuted = false;

                                                    } else {
                                                        player.mute();
                                                        playing.style.display = 'none';
                                                        muted.style.display = 'block';
                                                        isMuted = true;
                                                    }
                                                }
                                            });

                                            if (trailerUrl === "") {
                                                const video = document.querySelector(".video");
                                                video.style.display = "none";
                                                const backgroundImg = document.querySelector(".background-img");
                                                backgroundImg.style.display = "block";
                                            }

                                            const modalButtons = document.querySelector(".modal-buttons");
                                            if (movieType === "tv") {
                                                modalButtons.style.marginBottom = "2.5%";
                                            }

                                            const watchlistButton = document.getElementById("watchlistButtonAdd");
                                            const watchlistButtonRemove = document.querySelector(".watchlistButtonRemove");

                                            watchlistButton.addEventListener("click", () => {
                                                watchlistButton.style.display = "none";
                                                watchlistButtonRemove.style.display = "flex";
                                            });

                                            watchlistButtonRemove.addEventListener("click", () => {
                                                watchlistButtonRemove.style.display = "none";
                                                watchlistButton.style.display = "flex";
                                            });

                                            const dropdownSeason = document.querySelector(".dropdown-season");
                                            const dropdownContentSeason = document.querySelector(".dropdown-content-season");
                                            const episodeListContainer = document.querySelector(".episode-list-container");
                                            const movieOverview = document.querySelector(".movie-overview");
                                            const modalInfo = document.querySelector(".modal-info");
                                            const modalDetails = document.querySelector(".modal-details");
                                            const dropbtnSeasons = document.querySelector(".dropbtn-season");
                                            dropbtnSeasons.setAttribute("data-season", 1);

                                            if (movieType === "tv") {
                                                dropdownSeason.style.display = "block";
                                                episodeListContainer.style.display = "flex";
                                                movieOverview.style.display = "none";
                                                modalInfo.style.display = "none";
                                                getEpisodes(dropbtnSeasons.getAttribute("data-season"));
                                            }

                                            const dropbtn = document.querySelector(".dropbtn");

                                            dropbtn.addEventListener("click", (event) => {
                                                event.stopPropagation(); // Empêche la propagation du clic au document
                                                dropdownContentSeason.style.display = "block";
                                                //dropbtn.classList.remove("dropbtn");
                                                dropbtn.classList.add("dropbtn_clicked");
                                                getSeasons();
                                            });

                                            // Écouteur de clic sur l'ensemble du document
                                            document.addEventListener("click", () => {
                                                dropdownContentSeason.style.display = "none";
                                                dropbtn.classList.remove("dropbtn_clicked");
                                            });


                                            function getSeasons() {
                                                dropdownContentSeason.innerHTML = "";
                                                const seasons = movieData.seasons.filter(season => season.season_number > 0);
                                                const seasonNumbers = seasons.map(season => season.season_number);

                                                const seasonList = document.createElement("ul");

                                                for (let i = 0; i < seasonNumbers.length; i++) {
                                                    const seasonItem = document.createElement("li");
                                                    const seasonLink = document.createElement("a");
                                                    seasonLink.href = "#";
                                                    seasonLink.textContent = `Saison ${seasonNumbers[i]}`;
                                                    seasonLink.className = "season-link";
                                                    seasonLink.setAttribute("data-season", seasonNumbers[i]);
                                                    seasonItem.appendChild(seasonLink);
                                                    seasonList.appendChild(seasonItem);

                                                    seasonLink.addEventListener("click", (event) => {
                                                        dropbtn.classList.remove("dropbtn_clicked");
                                                        const dropbtnSeason = document.querySelector(".dropbtn-season");
                                                        dropbtnSeason.textContent = `Saison ${seasonNumbers[i]}`;
                                                        dropbtnSeason.setAttribute("data-season", seasonNumbers[i]);
                                                        dropdownContentSeason.style.display = "none";
                                                        getEpisodes(seasonNumbers[i]);
                                                    });

                                                    dropdownContentSeason.appendChild(seasonList);
                                                }
                                            }

                                            const episodeCounts = {};

                                            async function getTotalEpisodes(seasonNumber) {
                                                let totalEpisodes = 0;

                                                for (let i = 1; i < seasonNumber; i++) {
                                                    const response = await fetch(`https://api.themoviedb.org/3/tv/${movieId}?language=fr-FR&api_key=${apiKey}`);
                                                    const showData = await response.json();
                                                    // Vérifiez si la série a des saisons
                                                    if (showData.seasons && showData.seasons.length >= i) {
                                                        const season = showData.seasons[i]; // Accédez à la saison spécifique (attention à l'indice)
                                                        episodeCounts[i] = season.episode_count;
                                                        totalEpisodes += episodeCounts[i];
                                                    }
                                                }

                                                return totalEpisodes;
                                            }

                                            async function getEpisodes(seasonNumber) {
                                                episodeListContainer.innerHTML = "";

                                                const totalEpisodes = await getTotalEpisodes(seasonNumber);

                                                const response = await fetch(`https://api.themoviedb.org/3/tv/${movieId}/season/${seasonNumber}?language=fr-FR&api_key=${apiKey}`);
                                                const seasonData = await response.json();
                                                const episodes = seasonData.episodes;

                                                episodes.forEach((episode, i) => {
                                                    const episodeList = document.createElement("div");
                                                    episodeList.className = "episode-list";

                                                    // Calcul de l'épisode actuel en tenant compte des saisons précédentes
                                                    const episodeNumber = totalEpisodes + (i + 1);

                                                    episodeList.setAttribute("data-episode", episodeNumber);
                                                    //episodeList.setAttribute("data-episode", episode.episode_number);

                                                    const cardList = document.createElement("div");
                                                    cardList.className = "card-list";

                                                    const cardIndex = document.createElement("div");
                                                    cardIndex.className = "card-index";
                                                    cardIndex.textContent = episodeNumber;

                                                    const cardImage = document.createElement("div");
                                                    cardImage.className = "card-image";
                                                    const image = document.createElement("img");
                                                    image.setAttribute("src", "https://image.tmdb.org/t/p/w500" + episode.still_path);
                                                    cardImage.appendChild(image);

                                                    const cardInfo = document.createElement("div");
                                                    cardInfo.className = "card-info";

                                                    const cardTitle = document.createElement("div");
                                                    cardTitle.className = "card-title";
                                                    cardTitle.textContent = episode.name;

                                                    const cardOverview = document.createElement("div");
                                                    cardOverview.className = "card-overview";
                                                    cardOverview.textContent = episode.overview;

                                                    cardInfo.appendChild(cardTitle);
                                                    cardInfo.appendChild(cardOverview);

                                                    cardList.appendChild(cardIndex);
                                                    cardList.appendChild(cardImage);
                                                    cardList.appendChild(cardInfo);

                                                    episodeList.appendChild(cardList);
                                                    episodeListContainer.appendChild(episodeList);
                                                });
                                                const episodeLists = document.querySelectorAll(".episode-list");
                                                episodeLists.forEach(episodeList => {
                                                    episodeList.addEventListener("click", (event) => {
                                                        console.log("test:" + episodeList.getAttribute("data-episode"));
                                                        const episodeNumber = episodeList.getAttribute("data-episode");
                                                        const dropbtnSeason = document.querySelector(".dropbtn-season");
                                                        const seasonNumber = dropbtnSeason.getAttribute("data-season");
                                                        const episodeURLs = detail.episodes.map(episode => episode.url);
                                                        const episodeURL = episodeURLs[episodeNumber - 1];
                                                        console.log(episodeURL);
                                                        if (isSubscribed !== 0 || isSubscribed !== undefined) {
                                                            if (episodeURL === undefined) {

                                                            }
                                                            else {
                                                                window.location.href = `/watch?src=${episodeURL}&type=${movieType}`;
                                                            }
                                                        } else {
                                                            notSubscbribed.style.display = "flex";
                                                            blurBackground.style.display = "block";
                                                        }
                                                    });
                                                });
                                            }

                                            const playButton = document.querySelector(".play-btn");

                                            // Écoutez le clic sur le bouton
                                            playButton.addEventListener("click", function () {
                                                // Vérifiez si l'utilisateur est abonné
                                                if (isSubscribed >= 1) {
                                                    // Récupérez le lien de destination depuis l'attribut data-lien
                                                    var lienDeDestination = playButton.getAttribute("data-lien");
                                                    // Effectuez la redirection
                                                    window.location.href = `/watch?src=${lienDeDestination}&type=${movieType}`;
                                                } else {
                                                    notSubscbribed.style.display = "flex";
                                                    blurBackground.style.display = "block";
                                                }
                                            });


                                            const modalClose = document.querySelector(".close-container");
                                            modalClose.addEventListener("click", () => {
                                                // Ciblez l'élément iframe de la vidéo
                                                const videoIframe = modalContainer.querySelector(".video");
                                                // Supprimez l'élément iframe du DOM pour arrêter la vidéo
                                                if (videoIframe) {
                                                    videoIframe.remove();
                                                }
                                                document.body.style.overflow = "auto";
                                                modalContainer.style = "display: none;";
                                                modalBackground.style = "display: none;";
                                            });
                                            modalBackground.addEventListener("click", () => {
                                                // Ciblez l'élément iframe de la vidéo
                                                const videoIframe = modalContainer.querySelector(".video");

                                                // Supprimez l'élément iframe du DOM pour arrêter la vidéo
                                                if (videoIframe) {
                                                    videoIframe.remove();
                                                }
                                                document.body.style.overflow = "auto";
                                                modalContainer.style = "display: none;";
                                                modalBackground.style = "display: none;";
                                            });
                                        });
                                });
                            });
                    });
                    // Ajouter la div des posters à la div de la catégorie
                    categoryDiv.appendChild(postersDiv);

                    // Ajouter la div de la catégorie au conteneur principal
                    container.appendChild(categoryDiv);

                    // Ajouter une balise <br> pour sauter une ligne entre les catégories
                    container.appendChild(document.createElement("br"));;
                });
            })
        .catch(error => console.error('Une erreur s\'est produite :', error));
    })
.catch(error => {
    console.error('Erreur lors de la récupération de l\'état d\'abonnement :', error);
});

const signupButton = document.querySelector(".signup-button");
const signinButton = document.querySelector(".login-button");
const signup = document.querySelector(".signup");
const closeButton = document.querySelector(".modal-close");
const notSubscbribed = document.querySelector(".not-subscribed");
const subscribedLoginButton = document.querySelector(".subscribed-login");
const account = document.querySelector(".account");

signupButton.addEventListener("click", () => {
    signup.style.display = "flex";
    modalBackground.style.display = "block";
    login.style.display = "none";
    document.body.style = "overflow: hidden;";
});
signinButton.addEventListener("click", () => {
    login.style.display = "flex";
    modalBackground.style.display = "block";
    signup.style.display = "none";
    document.body.style = "overflow: hidden;";
});

subscribedLoginButton.addEventListener("click", () => {
    login.style.display = "flex";
    modalBackground.style.display = "block";
    signup.style.display = "none";
    notSubscbribed.style.display = "none";
    blurBackground.style.display = "none";
    modalContainer.style = "display: none;";
    const videoIframe = modalContainer.querySelector(".video");
    videoIframe.remove();
});

closeButton.addEventListener("click", () => {
    signup.style.display = "none";
    modalBackground.style.display = "none";
    document.body.style = "overflow: auto;";

});

modalBackground.addEventListener("click", () => {
    login.style.display = "none"
    signup.style.display = "none";
    account.style.display = "none";
    modalBackground.style.display = "none";
    document.body.style = "overflow: auto;";
});
const closeButtonSubscribe = document.querySelector(".close-not-subscribed");
const subscribed = document.querySelector(".subscribe");
closeButtonSubscribe.addEventListener("click", () => {
    notSubscbribed.style.display = "none";
    blurBackground.style.display = "none";
    subscribe.style.display = "none";
    document.body.style = "overflow: auto;";
});
blurBackground.addEventListener("click", () => {
    notSubscbribed.style.display = "none";
    blurBackground.style.display = "none";
    subscribe.style.display = "none";
    document.body.style = "overflow: auto;";
});

document.addEventListener('DOMContentLoaded', function () {
    const signupButtonPost = document.getElementById('signup-btn-post');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const errorMessage = document.getElementById('error-message');

    function updateButtonState() {
        const signupPassword = passwordInput.value;
        const signupPasswordConfirm = confirmPasswordInput.value;
        if (signupPassword.length < 8 || !signupPassword.match(/[A-Z]/) || !signupPassword.match(/[0-9]/) || !signupPassword.match(/[^A-Za-z0-9]/)) {
            signupButtonPost.disabled = true;
            signupButtonPost.style.backgroundColor = 'red';
            errorMessage.textContent = "Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial";
            errorMessage.style.display = "block";
        }
        else {
            if (signupPassword !== signupPasswordConfirm) {
                signupButtonPost.disabled = true;
                signupButtonPost.style.backgroundColor = 'red';
                errorMessage.textContent = "Les mots de passe ne correspondent pas";
                errorMessage.style.display = "block";
            }
            else {
                signupButtonPost.disabled = false;
                signupButtonPost.style.backgroundColor = 'white';
                errorMessage.style.display = "none";
            }
        }
    }

    passwordInput.addEventListener('input', updateButtonState);
    confirmPasswordInput.addEventListener('input', updateButtonState);
});

const containerBoxes = document.querySelectorAll(".container-box");
const videos = document.querySelectorAll('.hover-image');

// Parcourez tous les éléments .container-box
containerBoxes.forEach((containerBox, index) => {
    const video = videos[index];

    containerBox.addEventListener('mouseover', () => {
        // Démarrer la lecture de la vidéo
        video.play();
    });

    containerBox.addEventListener('mouseout', () => {
        // Mettre en pause la lecture de la vidéo
        video.pause();
    });
});

const subscribedButton = document.getElementById("subscribe-btn");
const subscribe = document.querySelector(".subscribe");

subscribedButton.addEventListener("click", () => {
    notSubscbribed.style.display = "none";
    subscribe.style.display = "flex";
    blurBackground.style.display = "block";
    player.pauseVideo();
});

const closeSubscribed = document.querySelector(".close-subscribe");
closeSubscribed.addEventListener("click", () => {
    subscribe.style.display = "none";
    blurBackground.style.display = "none";
    document.body.style = "overflow: auto;";
    player.playVideo();
});

addEventListener("DOMContentLoaded", (event) => {
    bannerImg.src = "https://image.tmdb.org/t/p/w780" + "/a6ptrTUH1c5OdWanjyYtAkOuYD0.jpg";
    bannerTitle.textContent = "One Piece";
    bannerDescription.textContent = "Il fut un temps où Gold Roger était le plus grand de tous les pirates, le \"Roi des Pirates\" était son surnom. A sa mort, son trésor d'une valeur inestimable connu sous le nom de \"One Piece\" fut caché quelque part sur \"Grand Line\". De nombreux pirates sont partis à la recherche de ce trésor mais tous sont morts avant même de l'atteindre. Monkey D. Luffy rêve de retrouver ce trésor légendaire et de devenir le nouveau \"Roi des Pirates\". Après avoir mangé un fruit du démon, il possède un pouvoir lui permettant de réaliser son rêve. Il lui faut maintenant trouver un équipage pour partir à l'aventure !";
});