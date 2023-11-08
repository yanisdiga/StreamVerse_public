fetch('/check-subscription')
    .then(response => response.json())
    .then(data => {
        const isSubscribed = data.isSubscribed !== false ? data.isSubscribed : 0;
        const subscribeContainer = document.querySelector('.subscribe');
        const basicSubscribeButton = document.getElementById('basic-subscribe');
        const premiumSubscribeButton = document.getElementById('premium-subscribe');
        const ultraPremiumSubscribeButton = document.getElementById('ultra-premium-subscribe');
        if(isSubscribed == 1) {
            const basicContainer = document.querySelector('.basic');
            basicContainer.style = "background: linear-gradient(rgba(111, 219, 125, 1), rgba(111, 219, 125, 0.5));";
            basicSubscribeButton.textContent = "Se désabonner";
            premiumSubscribeButton.textContent = "Changer d'abonnement";
            ultraPremiumSubscribeButton.textContent = "Changer d'abonnement";
            const text = document.getElementById('your-basic');
            text.style.display = "flex";
        }
        if(isSubscribed == 2) {
            const premiumContainer = document.querySelector('.premium');
            premiumContainer.style = "background: linear-gradient(rgba(88, 91, 255, 1), rgba(88, 91, 255, 0.5));";
            premiumSubscribeButton.textContent = "Se désabonner";
            basicSubscribeButton.textContent = "Changer d'abonnement";
            ultraPremiumSubscribeButton.textContent = "Changer d'abonnement";
            const text = document.getElementById('your-premium');
            text.style.display = "flex";
        }
        if(isSubscribed == 3) {
            const ultraPremiumContainer = document.querySelector('.ultra-premium');
            ultraPremiumContainer.style = "background: linear-gradient(rgba(255, 88, 88, 1), rgba(255, 88, 88, 0.5));";
            ultraPremiumSubscribeButton.textContent = "Se désabonner";
            basicSubscribeButton.textContent = "Changer d'abonnement";
            premiumSubscribeButton.textContent = "Changer d'abonnement";
            const text = document.getElementById('your-ultra-premium');
            text.style.display = "flex";
        }
    });

const modalClose = document.querySelector('.modal-close');
const arrow = document.querySelector('.arrow');
const back = document.querySelector('.back');
modalClose.addEventListener('mouseover', () => {
    modalClose.style.paddingLeft = "20px";
    modalClose.style.borderRadius = "30px";
    modalClose.style.border = "1px solid #ffffff";
    arrow.style.transform = "translateX(-50%)";
    back.style.transform = "translateX(-20%)";
    modalClose.addEventListener("click", () => {
        window.location.href = "/";
    });
});

modalClose.addEventListener('mouseout', () => {
    modalClose.style.paddingLeft = "0px";
    modalClose.style.borderRadius = "0px";
    modalClose.style.border = "none";
    arrow.style.transform = "translateX(230%)";
    back.style.transform = "translateX(100%)";
});