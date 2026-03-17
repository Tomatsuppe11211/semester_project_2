const menuIcon = document.getElementById('menuIcon');
const loggedInMobileNav = document.getElementById('loggedOutMobileNav');
const loggedOutMobileNav = document.getElementById('loggedInMobileNav');

const listingsDisplay = document.getElementById('listingsDisplay');


//Getting the listings
async function getListings(){
    const response = await fetch('https://v2.api.noroff.dev/auction/listings')
    const data = await response.json();
    const listings = data.data;
    console.log(listings);

    for(let i = 0; i < listings.length; i++){
        const itemDisplay = document.createElement('div'); //creating a div for each listing
        itemDisplay.classList = 'flex flex-col h-fit w-fit border cursor-pointer rounded-lg border';

        const itemImages = listings[i].media; //Getting media

        const thumbnailImage = document.createElement('img');
        //making sure images excists and have a url to the main image.
        if(itemImages && itemImages.length > 0 && itemImages[0]?.url){
            thumbnailImage.src = itemImages[0].url;
            thumbnailImage.alt = itemImages[0].alt;
        } else {
            thumbnailImage.src = 'https://images.unsplash.com/vector-1773501995769-cb593aed811c?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
            thumbnailImage.alt = 'Listing image';
        }
        thumbnailImage.classList = 'h-30 w-40 md:h-40 md:w-50 lg:h-70 lg:w-80 rounded-lg lg:rounded-none lg:rounded-tl-lg lg:rounded-tr-lg';
        itemDisplay.appendChild(thumbnailImage);

        //adding title to each listing
        if(listings[i].title.length < 30){
            const thumbnailTitle = document.createElement('h3');
            thumbnailTitle.innerHTML = listings[i].title;
            thumbnailTitle.classList = 'hidden lg:flex p-2 justify-center text-center text-lg font-bold'
            itemDisplay.appendChild(thumbnailTitle);
        } else {
            const thumbnailTitle = document.createElement('h3');
            thumbnailTitle.innerHTML = 'Listing item';
            thumbnailTitle.classList = 'hidden lg:flex p-2 justify-center text-center text-lg font-bold'
            itemDisplay.appendChild(thumbnailTitle);
        }

        listingsDisplay.appendChild(itemDisplay);
    }
};

getListings();



/*Creating functions for opening and closing navigationbars for mobile*/
function closeLoggedInNav(){
    loggedInMobileNav.classList = 'hidden';
};

function openLoggedInNav(){
    loggedInMobileNav.classList = 'flex';
};

function openLoggedOutNav(){
    loggedOutMobileNav.classList = 'flex';
};

function closeLoggedOutNav(){
    loggedOutMobileNav.classList = 'hidden';
};