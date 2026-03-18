const menuIcon = document.getElementById('menuIcon');
const loggedInMobileNav = document.getElementById('loggedInMobileNav');
const loggedOutMobileNav = document.getElementById('loggedOutMobileNav');
const closeMenu = document.getElementById('closeBurgerMenu');


//Getting modal and close modal button
const productModal = document.getElementById('productModal');
const closeModalButton = document.getElementById('closeModal');
closeModalButton.addEventListener('click', function(){
    productModal.classList = 'hidden'
});





//Getting modal content we want to change later
const modalImages = document.getElementById('productImages');
const modalTitle = document.getElementById('productTitle');
const modalProductSeller = document.getElementById('seller');
const modalDescription = document.getElementById('productDescription');
const modalCountdown = document.getElementById('timer');
const modalCurrentBidding = document.getElementById('currentBidding');
const modalCreditDisplay = document.getElementById('modalCreditDisplay');
const modalBidButton = document.getElementById('modalBidButton');
const listingBiddingHistory = document.getElementById('listingHistory');








//Getting area where listings will be displayed.
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
        itemDisplay.addEventListener('click', function(){ //fetching products details for the modal
            async function getSingleItem(){
                const response = await fetch(`https://v2.api.noroff.dev/auction/listings/${listings[i].id}?_bids=true&_seller=true`)
                const data = await response.json();
                const details = data.data
                const biddings = details.bids.reverse()
                const seller = details.seller.name

                if(!response.ok){
                    console.log('An error occcured fetching listing item')
                };

                //Resets history section if user swaps between listing items
                listingBiddingHistory.innerHTML = '<h2 class="text-lg font-bold font-libre">Bidding History</h2>'

                //Changing current information for the modal
                modalImages.src = thumbnailImage.src
                
                modalTitle.innerHTML = details.title

                modalProductSeller.innerHTML = `Seller <a href="#" class="text-blue-500 underline hover:text-button">${seller}</a>`

                if(details.description !== null | undefined){
                    modalDescription.innerHTML = details.description
                } else {
                    modalDescription.innerHTML = 'No description provided.'
                }

                modalCountdown.innerHTML = `Time left: ${details.endsAt}`


                modalCurrentBidding.innerHTML = `Current bid: <strong>${JSON.stringify(biddings[0].amount)} credits</strong>`

                for(let i = 0; i < biddings.length; i++){
                    const bidder = document.createElement('p');
                    bidder.innerHTML = `<a href="#" class="text-blue-500 underline hover:text-button">${biddings[i].bidder.name}</a> bidded ${biddings[i].amount} credits`
                    listingBiddingHistory.appendChild(bidder)
                }

                //Replacing standard content with actual listing details
                console.log(details);
                console.log(biddings); //making the newest bid be the first in the array
            }

            getSingleItem();
            productModal.classList = 'fixed flex inset-0 items-center justify-center bg-black/50 z-50 p-4';
            
        });
    };
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
    loggedOutMobileNav.classList = 'flex flex-col absolute bg-white z-50 items-center w-50 gap-10 top-0 py-10 right-0 border-l h-screen';
};

function closeLoggedOutNav(){
    loggedOutMobileNav.classList = 'hidden';
};


menuIcon.addEventListener('click', openLoggedOutNav);
closeMenu.addEventListener('click', closeLoggedOutNav);