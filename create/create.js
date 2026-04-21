//Getting info for authentication
const user = JSON.parse(sessionStorage.getItem('user'));
const key = sessionStorage.getItem('key');
const token = sessionStorage.getItem('token');


//Adding arrays that will contain the listing information later
let listingDetails = [];


//Getting HTML elements
const createForm = document.getElementById('createForm');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const images = document.getElementById('urlInputs')
const mediaUrl = document.getElementById('mediaUrl');
const addButton = document.getElementById('add');
const endsAt = document.getElementById('expireDate');



//----------------------------------------------------------------------------------------------------------



//Custom messages for HTML-validation
titleInput.addEventListener('invalid', function(e){
    if(e.target.validity.valueMissing){ //If empty
        e.target.setCustomValidity('Pleas enter a title');
    };

    titleInput.addEventListener('input', function(e){
        e.target.setCustomValidity(''); //Reset validity after displaying error message
    });
});


descriptionInput.addEventListener('invalid', function(e){
    if(e.target.validity.valueMissing){ //If empty
        e.target.setCustomValidity('Please enter a description');
    };

    descriptionInput.addEventListener('input', function(e){
        e.target.setCustomValidity(''); //Reset validity after displaying error message
    });
});


mediaUrl.addEventListener('invalid', function(e){
    if(e.target.validity.valueMissing){ //If empty
        e.target.setCustomValidity('Please enter the image URL');
    } else if(e.target.validity.patternMismatch){ //If pattern mismatch
        e.target.setCustomValidity('The url has to start with https?://');
    };

    mediaUrl.addEventListener('input', function(e){
        e.target.setCustomValidity(''); //Reset validity after displaying error message
    })
});

endsAt.addEventListener('invalid', function(e){
    if(e.target.validity.valueMissing){ //If empty
        e.target.setCustomValidity('You must enter an expire date');
    }

    endsAt.addEventListener('input', function(e){
        e.target.setCustomValidity(''); //Reset validity after displaying error message
    })
});

//----------------------------------------------------------------------------------------------------------


//Link to explanation for reading validity for html validation
//https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/setCustomValidity


//Counting for extra image URLs if needed
let mediaCount = 0;


//Adding inputs if needed (max 10)
addButton.addEventListener('click', function(e){
    e.preventDefault();
    
    //Adding inputs (max 10 in total)
    for(let i = 0; i < 3; i++){
        if(mediaCount < 10){
            mediaCount ++;
            const urlInput = document.createElement('input');
            urlInput.type = 'text';
            urlInput.id = `url${mediaCount}`;
            urlInput.placeholder = 'Add image url'
            urlInput.classList = 'p-2 border border-black rounded-full bg-white text-lg dark:bg-dark-header dark:text-white w-full shadow-inner shadow-black'
            urlInput.pattern = 'https?://.+';
            images.appendChild(urlInput);
        }
    }
});

createForm.addEventListener('submit', function(e){
    e.preventDefault();
    let mediaSent = [];

    //Adding Required media into the media array
    mediaSent.push({'url': mediaUrl.value, 'alt': 'Listing image'});

    //Adding extra media URLs to array if provided by the user
    if(mediaCount > 0){
        for(let i = 1; i < mediaCount; i++){
            const extraImg = document.getElementById(`url${i}`);

            if(extraImg.value !== '' | null){
                mediaSent.push({'url': extraImg.value, 'alt': 'Listing image'});
            };
        };
    };

    let listing = {
        'title': titleInput.value,
        'description': descriptionInput.value,
        'tags': [],
        'media': mediaSent,
        'endsAt': endsAt.value
    };

    async function postListing() {
        try{
            const response = await fetch('https://v2.api.noroff.dev/auction/listings', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`, 
                    'Content-Type': 'application/json',
                    'X-Noroff-API-Key': key
                },
                body: JSON.stringify(listing)
            });

            if(!response.ok){
                const errorMessage = await response.json()
                console.log(errorMessage.errors[0].message); //Reading error message
                return
            }

            alert('Listing has been posted');
        } catch(error){
            console.error(error)
        };
    };

    postListing();
});