//Retrieving User information
const user = JSON.parse(sessionStorage.getItem('user'));
const key = sessionStorage.getItem('key');
const token = sessionStorage.getItem('token');
if(!key){window.location.href = '../listings/index.html';}; //Sending user to listing page if not logged in


//Getting listing details from the session storage
const listingDetails = JSON.parse(sessionStorage.getItem('editListing'));
console.log(listingDetails);


let images = [];
let imageCount = 0;


//Fix this code! will not add images to array.

if(listingDetails.media.length > 1){
    for(let i = 0; i < listingDetails.media.length; i++){
        images.push(listingDetails.media[i].url);
        imageCount ++;
    }
    
    console.log(images);
}



















































//Getting html elements
const title = document.getElementById('titleInput');
title.value = listingDetails.title;

const description = document.getElementById('description');
if(listingDetails.description!== '' || listingDetails.description !== null){
    description.value = listingDetails.description;
};

const imageDrop = document.getElementById('imageDrop');

const firstImage = document.getElementById('image1');
if(listingDetails.appendChild())


//Adding input fields for every image in the listing
for(let i = 1; i < listingDetails.media.length; i++){
    const field = document.createElement('input');
    field.classList = 'border border-black w-full text-xl p-2 rounded-full shadow-inner shadow-black dark:bg-dark-header';
    field.value = listingDetails.media[i].url;
    field.pattern = 'https?://.+';

    imageDrop.appendChild(field);

    images.push(listingDetails.media[i].url);
    imageCount ++;
};

const addButton = document.getElementById('addButton');
addButton.addEventListener('click', function(){
    if(imageCount < 10){
        let extra = document.createElement('input');
        extra.classList = 'border border-black w-full text-xl p-2 rounded-full shadow-inner shadow-black dark:bg-dark-header';
        extra.pattern = 'https?://.+';
        extra.placeholder = 'Add image url';
        imageCount ++;

        imageDrop.appendChild(extra);
    } 
});

extra.addEventListener('invalid', function(e){
    if(e.target.validity.patternMismatch && imageCount > 1){
        e.target.setCustomvalidity('The url must start with https://');
    }

    if(e.target.validity.valueMissing && imageCount < 1){
        e.target.setCustomvalidity('You must have at least 1 image');
    }

    extra.addEventListener('input', function(e){
        e.target.setCustomvalidity('');
    });
});