//Retrieving User information
const user = JSON.parse(sessionStorage.getItem('user'));
const key = sessionStorage.getItem('key');
const token = sessionStorage.getItem('token');
if(!key){window.location.href = '../listings/index.html';}; //Sending user to listing page if not logged in


//Getting listing details from the session storage
const listingDetails = JSON.parse(sessionStorage.getItem('editListing'));

//Adding title to the form
const title = document.getElementById('titleInput');
title.value = listingDetails.title;


//Adding description to the form
const description = document.getElementById('description');
description.value = listingDetails.description;


//Getting the div where the images shall be put
const drop = document.getElementById('imageDrop');

let inputCount = 0

//Adding already excisting images
for(let i = 0; i < listingDetails.media.length; i++){
    const urlInput = document.createElement('input')
    urlInput.id = `input-${inputCount}`
    urlInput.placeholder = 'Add image'
    urlInput.value = listingDetails.media[i].url;
    urlInput.classList = 'border border-black w-full text-xl p-2 rounded-full shadow-inner shadow-black dark:bg-dark-header';
    urlInput.pattern = 'https?://.+';

    if(urlInput.id === 'input-0'){
        urlInput.required = true;

        urlInput.addEventListener('invalid', function(e){
            if(e.target.validity.patternMismatch){
                e.target.setCustomValidity('The link must start with https://');
            } else if(e.target.validity.valueMissing){
                e.target.setCustomValidity('This field cannot be left empty');
            };
        });

        urlInput.addEventListener('input', function(e){
            e.target.setCustomValidity('');
        });
    } else {
        urlInput.addEventListener('invalid', function(e){
            if(e.target.validity.patternMismatch){
                e.target.setCustomValidity('The link must start with https://')
            } else {
                e.target.setCustomValidity('');
            }
        })
    }
    drop.appendChild(urlInput);

    inputCount ++;
}

//Adding more input fields if button is pressed
const addButton = document.getElementById('addButton');
addButton.addEventListener('click', function(){
    if(inputCount < 10){
        const extra = document.createElement('input')
        extra.id = `input-${inputCount}`;
        extra.classList = 'border border-black w-full text-xl p-2 rounded-full shadow-inner shadow-black dark:bg-dark-header';
        extra.pattern = 'https?://.+';
        extra.placeholder = 'Add extra image';

        drop.appendChild(extra);

        inputCount ++;

        extra.addEventListener('invalid', function(e){
            if(e.target.validity.patternMismatch){
                e.target.setCustomValidity('The link must start with https://')
            }
        })

        extra.addEventListener('input', function(e){
            e.target.setCustomValidity('');
        });
    } else {
        alert('You can not add more than 10 images');
    };
});

//adding a send function for images (just to test)
editForm = document.getElementById('editForm');

editForm.addEventListener('submit', function(e){
    e.preventDefault();
    let images = [];
    for (let i = 0; i < inputCount; i++){
        const input = document.getElementById(`input-${i}`);
        if(input.value !== null && input.value !== ''){
            images.push({'url': input.value, 'alt': `Image ${i}`});
        } 
    }

    //Sending data to API
    async function update(){
        try{
            const response = await fetch(`https://v2.api.noroff.dev/auction/listings/${listingDetails.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'X-Noroff-API-Key': key
                },
                body: JSON.stringify({
                    'title': title.value,
                    'description': description.value,
                    'tags': [],
                    'media': images,
                })
            })

            if(!response.ok){
                const message = await response.json();
                console.log(message);
                return; 
            }

            const data = await response.json();
            alert('Listing is updated');
            window.location.href = '../profiles/index.html';
        } catch(error){
            console.error(error);
        }
    }

    update()
})