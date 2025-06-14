//code for rewards gift box
const giftBox = document.querySelector('.gift-box');
const surprise = document.querySelector('.surprise');

function openGiftBox(){
    giftBox.classList.add('open');
    surprise.classList.remove('hidden');
}

document.querySelector('.complete-task-btn').addEventListener('click', openGiftBox);