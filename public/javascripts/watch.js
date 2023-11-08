fetch('/check-subscription')
    .then(response => response.json())
    .then(data => {
    const isSubscribed = data.isSubscribed !== false ? data.isSubscribed : 0;
    // Récupérer le paramètre d'URL "src" qui contient l'URL de la vidéo
    if(isSubscribed >= 1){
        const videoSrc = decodeURIComponent(getQueryParam('src'));
        const videoType = decodeURIComponent(getQueryParam('type'));
        const videoContainer = document.getElementById("video-container");
        if(videoType === 'tv'){
            videoContainer.innerHTML = `<iframe src="${videoSrc}" frameborder="0" allowfullscreen></iframe>`;
        }
        else {
            const videoCompleteSrc = videoSrc + '?sp=r&st=2023-08-23T10:10:59Z&se=2025-01-01T19:10:59Z&spr=https&sv=2022-11-02&sr=c&sig=Irgf0gqr%2Be%2BcGd%2F7n2BeCajK3b8r6I03VMj7k6NGhJU%3D';

            // Sélectionner l'élément vidéo
            const videoPlayer = document.getElementById('videoPlayer');

            // Définir la source de la vidéo
            videoPlayer.src = videoCompleteSrc;
        }
    }
    else {
        const blurBackground = document.querySelector(".blur-background");
        const notSubscbribed = document.querySelector(".not-subscribed");
        const videoContainer = document.getElementById("video-container");
        blurBackground.style.display = "block";
        notSubscbribed.style.display = "flex";
        videoContainer.style.display = "none";
    }
});

// Fonction pour obtenir la valeur d'un paramètre d'URL
function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}