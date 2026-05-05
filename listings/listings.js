//Retrieving User information
const user = JSON.parse(sessionStorage.getItem('user'));
const key = sessionStorage.getItem('key');
const token = sessionStorage.getItem('token');

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
let listingsDisplay = document.getElementById('listingsDisplay');


//Getting the listings
async function getListings(){
    const response = await fetch('https://v2.api.noroff.dev/auction/listings?_active=true')
    const data = await response.json();
    const listings = data.data;

    for(let i = 0; i < listings.length; i++){
        const itemDisplay = document.createElement('div'); //creating a div for each listing
        itemDisplay.classList = 'flex flex-col h-fit w-full border cursor-pointer rounded-lg border border-black bg-white dark:bg-dark-header dark:text-white';

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
        thumbnailImage.classList = 'h-30 w-full md:h-40 lg:h-70 rounded-lg lg:rounded-none lg:rounded-tl-lg lg:rounded-tr-lg';
        itemDisplay.appendChild(thumbnailImage);

        //adding title to each listing
        if(listings[i].title.length < 25){
            const thumbnailTitle = document.createElement('h3');
            thumbnailTitle.innerHTML = listings[i].title;
            thumbnailTitle.classList = 'hidden lg:flex p-2 justify-center text-center text-lg font-bold'
            itemDisplay.appendChild(thumbnailTitle);
        } else {
            const thumbnailTitle = document.createElement('h3');
            thumbnailTitle.innerHTML = `${listings[i].title.slice(0,25)}...`;
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

                sessionStorage.setItem('seeSingleProfile', details.seller.name);

                modalProductSeller.innerHTML = `Seller <a href="../profiles/see.html" class="text-blue-500 underline hover:text-button">${seller}</a>`

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
            }

            getSingleItem();
            productModal.classList = 'fixed flex inset-0 items-center justify-center bg-black/50 z-50 p-4';
            
        });
    };
};

getListings();



//Making searchbar work for listings
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton')

searchButton.addEventListener('click', async function(){
    if(searchInput.value !== ''){
        
        //Searching for listings
        async function searchListings(){
            listingsDisplay.innerHTML = '';
        
            const response = await fetch(`https://v2.api.noroff.dev/auction/listings/search?q=${searchInput.value}`, {
                method: 'GET',
                headers: { 
                    'Content-Type': 'application/json',
                }
            });

            if(!response.ok){console.log('There was an error with searching'); return;}

            const data = await response.json();
            const newListings = data.data;
            console.log(newListings)

            //displaying new listings
            for(let i = 0; i < newListings.length; i++){
                const listing = document.createElement('div');
                listing.classList = 'flex flex-col h-fit w-full border cursor-pointer rounded-lg border border-black bg-white dark:bg-dark-header dark:text-white'

                const listingImage = document.createElement('img');
                if(newListings[i].media.length === 0){
                    listingImage.src = 'https://images.unsplash.com/vector-1773501995769-cb593aed811c?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
                } else {
                    listingImage.src = newListings[i].media[0].url;
                };
                listingImage.alt = 'Item image';
                listingImage.classList = 'h-30 w-full md:h-40 lg:h-70 rounded-lg lg:rounded-none lg:rounded-tl-lg lg:rounded-tr-lg';
                listing.appendChild(listingImage);


                const listingTitle = document.createElement('h3');
                listingTitle.classList = 'hidden lg:flex p-2 justify-center text-center text-lg font-bold';
                if(newListings[i].title.length < 25){
                    listingTitle.innerHTML = newListings[i].title;
                } else {
                    listingTitle.innerHTML = `${newListings[i].title.slice(0,25)}...`;
                }
                
                listing.appendChild(listingTitle);

                listingsDisplay.appendChild(listing);

                listing.addEventListener('click', function(){ //fetching products details for the modal
                    async function getSingleItem(){
                        const response = await fetch(`https://v2.api.noroff.dev/auction/listings/${newListings[i].id}?_bids=true&_seller=true`)
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
                        modalImages.src = listingImage.src
                
                        modalTitle.innerHTML = details.title

                        sessionStorage.setItem('seeSingleProfile', details.seller.name);

                        modalProductSeller.innerHTML = `Seller: ${seller}`

                    if(details.description !== null | undefined){
                        modalDescription.innerHTML = details.description
                    } else {
                        modalDescription.innerHTML = 'No description provided.'
                    }

                    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

                    let year = details.endsAt.slice(0,4);
                    let month = details.endsAt.slice(5,7);
                    let day = details.endsAt.slice(8,10);
                    let time = details.endsAt.slice(11,16);
                    let monthName = months[month - 1];

                    modalCountdown.innerHTML = `Ends: ${day} of ${monthName} ${year} at ${time}`;

                    if(biddings.length !== 0){
                        modalCurrentBidding.innerHTML = `Current bid: ${JSON.stringify(biddings[0].amount)} credits`

                        for(let i = 0; i < biddings.length; i++){
                            const bidder = document.createElement('p');
                            bidder.innerHTML = `${biddings[i].bidder.name} bidded ${biddings[i].amount} credits`
                            listingBiddingHistory.appendChild(bidder)
                        };
                    } else {
                        modalCurrentBidding.innerHTML = 'There is no bids on this item yet'

                        const message = document.createElement('p')
                        message.innerHTML = 'There is no placed biddings on this item';
                        message.classList = 'text-lg'
                        listingBiddingHistory.appendChild(message);
                    };
            }

            getSingleItem();
            productModal.classList = 'fixed flex inset-0 items-center justify-center bg-black/50 z-50 p-4';
            
        });
            }
        };

        searchListings();
    }
});