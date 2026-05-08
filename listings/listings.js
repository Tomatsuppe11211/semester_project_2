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
    productModal.classList = 'hidden';
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
const leftArrow = document.getElementById('leftArrow');
const rightArrow = document.getElementById('rightArrow');

//For the bidding modal
const biddingModal = document.getElementById('biddingModal');
const biddingModalTitle = document.getElementById('itemTitle');
const biddingModalLatestBidding = document.getElementById('latestBidding');
const creditValueInput = document.getElementById('creditValueInput');
const biddingForm = document.getElementById('biddingForm');
const biddingModalCloseButton = document.getElementById('closeBiddingModal');

biddingModalCloseButton.addEventListener('click', function(){biddingModal.classList = 'hidden'});

//Adding custom message if input field is empty when submittet
creditValueInput.addEventListener('invalid', function(e){
    if(e.target.validity.valueMissing){ //If empty value input field
        e.target.setCustomValidity('You have to bid something');
    }

    creditValueInput.addEventListener('input', function(e){
        e.target.setCustomValidity(''); //Reset validity after displaying error message
    });
});




//Adding additional functions for logged in users
if(user){
    let latestBidData = 0;
    let latestBidderData = '';
    
    async function getProfile(){
        const response = await fetch(`https://v2.api.noroff.dev/auction/profiles/${currentUser.name}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'X-Noroff-API-Key': key
            }
        });

        if(!response.ok){console.log('There was an error fetching the profile')};

        const data = await response.json();
        const credits = data.data.credits;
        modalCreditDisplay.innerHTML = `Available credits: ${credits}`;
    }

    getProfile();

    //Opening and using bidding modal only if logged in
    modalBidButton.removeAttribute('disabled'); //Removing the sidabled attribute making it possible for the user to click on it
    
    
    

    //Let the user place bids if the value is higher than the latest bid
    biddingForm.addEventListener('submit', async function(e){
        e.preventDefault();
        
        //Getting the item id and searching for it in the API
        let itemId = sessionStorage.getItem('biddingItem');


        //Looking for latest bidder and bid from getBiddingItem()
        let latestBid = Number(latestBidData);
        let latestBidder = latestBidderData;

        //Checking if user is the latest bidder before proceeding
        if(latestBidder === user.name){
            alert('You are already the latest bidder');
            return;
        }

        //Checking if placed value is bigger than the latest bid
        if(Number(creditValueInput.value) <= latestBid){
            alert('You have to place a highter bidding than the latest bid');
            return;
        }

        try{
            const response = await fetch(`https://v2.api.noroff.dev/auction/listings/${itemId}/bids`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'X-Noroff-API-Key': key
                },
                body: JSON.stringify({'amount': Number(creditValueInput.value)})
            });

            if(!response.ok){
                console.log('There was an error placing the bid');
                const error = await response.json()
                console.log(error.errors[0].message); //Sending error message to console.log if something goes wrong
                return;
            };

            alert('Bid is placed! Updating listing...');
            biddingModal.classList = 'hidden';
            modalCurrentBidding.innerHTML = `Current bidding: ${creditValueInput.value} (Yours)`;

            //Learning of the code prepend(): https://developer.mozilla.org/en-US/docs/Web/API/Element/prepend
            listingBiddingHistory.prepend(`${user.name} bidded ${creditValueInput.value} credits`); //Adding the user's bid on top of history
            await getBiddingItem(); //Updating data after submission is succeeded
        } catch(error){
            console.error(error);
        };
    });
    
    //Showing bidding window (modal) and updating data
    modalBidButton.addEventListener('click', async function(){
        biddingModal.classList = 'fixed flex inset-0 items-center justify-center bg-black/50 z-100 p-4';
        await getBiddingItem();
    });    

    async function getBiddingItem(){
        //Getting item from the API so the user can bid on it
        let itemId = sessionStorage.getItem('biddingItem');
        
        const response = await fetch(`https://v2.api.noroff.dev/auction/listings/${itemId}?_bids=true`);

        if(!response.ok){
                console.log('There was an error fetching the listing item');
                return;
        };

        const data = await response.json();
        const wantedItem = data.data;

        const latest = wantedItem.bids.sort((a, b) => b.amount - a.amount); //sorting the bidding list to make sure the newest(highest) comes first

        if(latest.length !== 0 ){
            latestBidData = latest[0].amount;
            latestBidderData = latest[0].bidder.name;
            creditValueInput.value = latest[0].amount + 1;

            //Preventing user to place bids if already highest/latest bidder
            if(latest[0].bidder.name === user.name){
                biddingModalLatestBidding.innerHTML = `Latest bidding: ${latest[0].amount} credits (yours)`;
            } else {
                biddingModalLatestBidding.innerHTML = `Latest bidding: ${latest[0].amount} credits`;
            }
        } else {
            latestBidData = 0;
            latestBidderData = '';
            biddingModalLatestBidding.innerHTML = 'No one has bidded on this item yet';
            creditValueInput.value = 1;
        };
    };   
};






//Getting area where listings will be displayed.
let listingsDisplay = document.getElementById('listingsDisplay');


//Getting the listings
async function getListings(){
    const response = await fetch('https://v2.api.noroff.dev/auction/listings?_active=true')
    const data = await response.json();
    const sortedData = data.data.sort((a, b) => new Date(a.endsAt)  - new Date(b.endsAt)); //Sorting by end date
    const listings = sortedData;

    for(let i = 0; i < listings.length; i++){
        const itemDisplay = document.createElement('div'); //creating a div for each listing
        itemDisplay.classList = 'flex flex-col h-fit w-full border cursor-pointer rounded-lg border border-black bg-white dark:bg-dark-header dark:text-white shadow-lg shadow-black';

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
            sessionStorage.setItem('biddingItem', listings[i].id) //Storing item we want to bid on in the session storage
            
            async function getSingleItem(){
                const response = await fetch(`https://v2.api.noroff.dev/auction/listings/${listings[i].id}?_bids=true&_seller=true`)
                const data = await response.json();
                const details = data.data
                const biddings = details.bids.sort((a, b) => b.amount - a.amount);
                const seller = details.seller.name;

                if(!user || seller === user.name){
                    modalBidButton.setAttribute('disabled', 'true');
                } else {
                    modalBidButton.removeAttribute('disabled');
                }

                if(!response.ok){
                    console.log('An error occcured fetching listing item')
                };

                //Resets history section if user swaps between listing items
                listingBiddingHistory.innerHTML = ''

                //Letting the user swap images (down/back)
                let imageNumber = 0
                if(listings[i].media.length > 1){
                    leftArrow.classList = 'size-15 absolute left-5 bottom-10 rounded-full bg-button hover:bg-hover hover:text-white shadow-xl shadow-black'
                    rightArrow.classList = 'size-15 absolute right-5 bottom-10 rounded-full bg-button hover:bg-hover hover:text-white shadow-xl shadow-black'

                    leftArrow.addEventListener('click', function(){
                        imageNumber --;

                        if(imageNumber < 0){
                            imageNumber = listings[i].media.length - 1;
                        }

                        modalImages.src = listings[i].media[imageNumber].url;
                        modalImages.alt = listings[i].media[imageNumber].alt;
                    });

                    rightArrow.addEventListener('click', function(){
                        imageNumber ++;

                        if(imageNumber >= listings[i].media.length){
                            imageNumber = 0;
                        }

                        modalImages.src = listings[i].media[imageNumber].url;
                        modalImages.alt = listings[i].media[imageNumber].alt;
                    });
                } else {
                    leftArrow.classList = 'hidden';
                    rightArrow.classList = 'hidden';
                }

                modalImages.src = thumbnailImage.src
                
                modalTitle.innerHTML = details.title

                sessionStorage.setItem('seeSingleProfile', details.seller.name);

                modalProductSeller.innerHTML = `Seller <a href="../profiles/see.html" class="text-blue-500 underline hover:text-button">${seller}</a>`

                if(details.description !== null | undefined){
                    modalDescription.innerHTML = details.description
                } else {
                    modalDescription.innerHTML = 'No description provided.'
                }

                let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

                let year = details.endsAt.slice(0,4);
                let month = Number(details.endsAt.slice(5,7));
                let day = Number(details.endsAt.slice(8,10));
                let time = details.endsAt.slice(11,16);
                let monthName = months[month - 1];

                modalCountdown.innerHTML = `Ends: ${day} of ${monthName} ${year} at ${time}`;


                //Displaying standard info when no one had bidded on an item
                if(biddings.length === 0){
                    listingBiddingHistory.innerHTML = 'No one has bidded on this item.'
                    modalCurrentBidding.innerHTML = 'Current bid: 0 credits';
                } else {
                    if(!user || biddings[0].bidder.name === user.name){
                        modalCurrentBidding.innerHTML = `Current bid: ${JSON.stringify(biddings[0].amount)} credits (Yours)`;
                    } else {
                        modalCurrentBidding.innerHTML = `Current bid: ${JSON.stringify(biddings[0].amount)} credits`;
                    };

                    for(let i = 0; i < biddings.length; i++){
                        const bidder = document.createElement('p');
                        bidder.innerHTML = `${biddings[i].bidder.name} bidded ${biddings[i].amount} credits`
                        listingBiddingHistory.appendChild(bidder)
                    }
                };

                
                

                
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

            const now = new Date(); //Getting today's date

            const newListings = data.data
                .filter(listing => new Date(listing.endsAt) > now) //Removing outdated listings
                .sort((a, b) => new Date(a.endsAt) - new Date(b.endsAt)) //Sorting by closest to expiring date

            //displaying new listings
            for(let i = 0; i < newListings.length; i++){
                const listing = document.createElement('div');
                listing.classList = 'flex flex-col h-fit w-full border cursor-pointer rounded-lg border border-black bg-white dark:bg-dark-header dark:text-white shadow-lg shadow-black';

                const listingImage = document.createElement('img');
                if(newListings[i].media && newListings[i].media.length > 0 && newListings[i]?.media[0].url){
                    listingImage.src = newListings[i].media[0].url;
                    listingImage.alt = newListings[i].media[0].alt;
                } else {
                    listingImage.src = 'https://images.unsplash.com/vector-1773501995769-cb593aed811c?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
                    listingImage.alt = 'Item image';
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
                        const details = data.data;
                        const biddings = details.bids.sort((a, b) => b.amount - a.amount)
                        const seller = details.seller.name;

                        if(!user || seller === user.name){
                            modalBidButton.setAttribute('disabled', 'true');
                        } else {
                            modalBidButton.removeAttribute('disabled');
                        }

                        if(!response.ok){
                            console.log('An error occcured fetching listing item')
                        };

                        //Resets history section if user swaps between listing items
                        listingBiddingHistory.innerHTML = '';

                        //Letting the user swap images (down/back)
                        let imageNumber = 0
                        if(details.media.length > 1){
                            leftArrow.classList = 'size-15 absolute left-5 bottom-10 rounded-full bg-button hover:bg-hover hover:text-white shadow-xl shadow-black'
                            rightArrow.classList = 'size-15 absolute right-5 bottom-10 rounded-full bg-button hover:bg-hover hover:text-white shadow-xl shadow-black'

                            leftArrow.addEventListener('click', function(){
                                imageNumber --;

                                if(imageNumber < 0){
                                    imageNumber = details.media.length - 1;
                                }

                                modalImages.src = details.media[imageNumber].url;
                                modalImages.alt = details.media[imageNumber].alt;
                            });

                            rightArrow.addEventListener('click', function(){
                                imageNumber ++;

                                if(imageNumber >= details.media.length){
                                    imageNumber = 0;
                                }

                                modalImages.src = details.media[imageNumber].url;
                                modalImages.alt = details.media[imageNumber].alt;
                            });
                        } else {
                            leftArrow.classList = 'hidden';
                            rightArrow.classList = 'hidden';
                        }
                        
                        

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
                    let month = Number(details.endsAt.slice(5,7));
                    let day = Number(details.endsAt.slice(8,10));
                    let time = details.endsAt.slice(11,16);
                    let monthName = months[month - 1];

                    modalCountdown.innerHTML = `Ends: ${day} of ${monthName} ${year} at ${time}`;

                    if(biddings.length === 0){
                        listingBiddingHistory.innerHTML = 'No one has bidded on this item.'
                        modalCurrentBidding.innerHTML = 'Current bid: 0 credits';
                    }

                    if(biddings.length > 0){
                        if(user && biddings[0].bidder.name === user.name){
                            modalCurrentBidding.innerHTML = `Current bid: ${biddings[0].amount} credits (Yours)`;
                        } else {
                            modalCurrentBidding.innerHTML = `Current bid: ${biddings[0].amount} credits`;
                        }

                        for(let i = 0; i < biddings.length; i++){
                            const bidder = document.createElement('p');
                            bidder.innerHTML = `${biddings[i].bidder.name} bidded ${biddings[i].amount} credits`;
                            listingBiddingHistory.appendChild(bidder);
                        };
                    } 
                }

            getSingleItem();
            productModal.classList = 'fixed flex inset-0 items-center justify-center bg-black/50 z-50 p-4';
            
        });
            }
        };


        //Searching for other users if the user is logged in
        if(user){
            await searchListings()

            async function getProfiles(){
                const response = await fetch(`https://v2.api.noroff.dev/auction/profiles/search?q=${searchInput.value}`, {
                    method: 'GET',
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'X-Noroff-API-Key': key
                    }
                });

                if(!response.ok){console.log('There was an error fetching profile(s)')};

                const data = await response.json();
                const profiles = data.data;
                
                //Adding the profiles be shown where the listings are supposed to be
                for(let i = 0; i < profiles.length; i++){
                    const profileCard = document.createElement('div');
                    profileCard.classList = 'flex flex-col gap-5 h-fit w-full text-center items-center justify-evenly p-2 border cursor-pointer rounded-lg border border-black bg-white dark:bg-dark-header dark:text-white shadow-lg shadow-black hover:bg-hover hover:text-white';

                    const profileImage = document.createElement('img');
                    profileImage.classList = 'h-20 md:h-30 w-20 md:w-30 rounded-full border border-black'
                    profileImage.src = profiles[i].avatar.url;
                    profileImage.alt = 'Profile image';
                    profileCard.appendChild(profileImage);

                    const profileName = document.createElement('h1');
                    profileName.classList = 'text-lg font-bold w-full';

                    let maxlength = 0;

                    //Checking screen width and adding a maxlength
                    if(window.innerWidth <= 640){
                        maxlength = 10;
                    } else if(window.innerWidth <= 768){
                        maxlength = 15;
                    };

                    //Deciding length of title based on the custom set maxlength
                    if(maxlength && profiles[i].name.length > maxlength){
                        profileName.innerHTML = `${profiles[i].name.slice(0,maxlength)}...`;
                    } else {
                        profileName.innerHTML = `${profiles[i].name}`;
                    };
                    
                    profileCard.appendChild(profileName);


                    listingsDisplay.appendChild(profileCard);

                    profileCard.addEventListener('click', function(){
                        sessionStorage.setItem('seeSingleProfile', profiles[i].name);
                        window.location.href = '../profiles/see.html';
                    });
                };
            };

            getProfiles();
        } else {
            searchListings();
        }
    } else {
        window.location.href = '../listings/index.html';
    }
});





//Adding the tag search
const tagInput = document.getElementById('tagSearch');
const tagButton = document.getElementById('tagButton');

tagButton.addEventListener('click', async function(){
    const response = await fetch(`https://v2.api.noroff.dev/auction/listings?_tag=${tagInput.value}&_active=true&_seller=true&_bids=true`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if(!response.ok){
        const message = await response.json();
        console.log(message);
        return;
    };

    const data = await response.json();
    const taggedListings = data.data;

    if(taggedListings.length > 0){

        listingsDisplay.innerHTML = '';

        for(let i = 0; i < taggedListings.length; i++){
            const item = document.createElement('div');
            item.classList = 'flex flex-col gap-5 h-fit w-full text-center items-center justify-evenly border cursor-pointer rounded-lg border border-black bg-white dark:bg-dark-header dark:text-white shadow-lg shadow-black hover:bg-hover hover:text-white';

            const image = document.createElement('img');
            image.classList = 'h-30 w-full md:h-40 lg:h-70 rounded-lg lg:rounded-none lg:rounded-tl-lg lg:rounded-tr-lg';
            
            //Adding standard image if none images is provided
            if(taggedListings[i].media.length > 0){
                image.src = taggedListings[i].media[0].url;
                image.alt = taggedListings[i].media[0].alt;
            } else {
                image.src = 'https://images.unsplash.com/vector-1773501995769-cb593aed811c?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
                image.alt = 'Item image';
            }

            item.appendChild(image);


            if(taggedListings[i].title.length < 25){
                const title = document.createElement('h3');
                title.innerHTML = taggedListings[i].title;
                title.classList = 'hidden lg:flex p-2 justify-center text-center text-lg font-bold'
                item.appendChild(title);
            } else {
                const title = document.createElement('h3');
                title.innerHTML = `${taggedListings[i].title.slice(0,25)}...`;
                title.classList = 'hidden lg:flex p-2 justify-center text-center text-lg font-bold'
                item.appendChild(title);
            }

            listingsDisplay.appendChild(item);

            //Adding details to product modal
            item.addEventListener('click', function(){
                if(user && taggedListings[i].seller.name === user.name){
                    modalBidButton.setAttribute('disabled', 'true');
                } else {
                    modalBidButton.removeAttribute('disabled');
                }

                sessionStorage.setItem('biddingItem', taggedListings[i].id);

                productModal.classList = 'fixed flex inset-0 items-center justify-center bg-black/50 z-50 p-4';

                modalImages.src = taggedListings[i].media[0].url;
                modalImages.alt = taggedListings[i].media[0].alt;

                if(taggedListings[i].media.length > 1){
                    console.log(taggedListings[i].media);

                    leftArrow.classList = 'size-15 absolute left-5 bottom-10 rounded-full bg-button hover:bg-hover hover:text-white shadow-xl shadow-black';
                    rightArrow.classList = 'size-15 absolute right-5 bottom-10 rounded-full bg-button hover:bg-hover hover:text-white shadow-xl shadow-black';

                    let imageNumber = 0;

                    leftArrow.addEventListener('click', function(){
                        imageNumber --;
                        
                        if(imageNumber < 0){
                            imageNumber = taggedListings[i].media.length - 1;
                        }

                        modalImages.src = taggedListings[i].media[imageNumber].url;
                        modalImages.alt = taggedListings[i].media[imageNumber].alt;
                    });

                    rightArrow.addEventListener('click', function(){
                        imageNumber ++;

                        if(imageNumber >= taggedListings[i].media.length){
                            imageNumber = 0;
                        };

                        modalImages.src = taggedListings[i].media[imageNumber].url;
                        modalImages.alt = taggedListings[i].media[imageNumber].alt;
                    })


                } else {
                    leftArrow.classList = 'hidden';
                    rightArrow.classList = 'hidden';
                }




                modalTitle.innerHTML = taggedListings[i].title;
                modalProductSeller.innerHTML = `Created by ${taggedListings[i].seller.name}`;
                modalDescription.innerHTML = taggedListings[i].description;
                
                
                
                let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

                let year = taggedListings[i].endsAt.slice(0,4);
                let month = Number(taggedListings[i].endsAt.slice(5,7));
                let day = Number(taggedListings[i].endsAt.slice(8,10));
                let time = taggedListings[i].endsAt.slice(11,16);
                let monthName = months[month - 1];

                modalCountdown.innerHTML = `Ends: ${day} of ${monthName} ${year} at ${time}`;

                let bids = taggedListings[i].bids.sort((a, b) => b.amount - a.amount); //Sorting so biggest/latest bidding is showinf first
                modalCurrentBidding.innerHTML = `Current bidding: ${bids[0].amount} credits`;
                
                listingBiddingHistory.innerHTML = ''; //Reseting bidding history so no duplications is made

                for(let i = 0; i < bids.length; i++){
                    const bidding = document.createElement('p');
                    bidding.innerHTML = `${bids[i].bidder.name} bidded ${bids[i].amount} credits`;
                    listingBiddingHistory.appendChild(bidding);
                }
            })
        };
    } else {
        listingsDisplay.innerHTML = '';
        listingsDisplay.classList = 'flex w-4/5 justify-center';
        
        const returnMessage = document.createElement('p')
        returnMessage.classList = 'w-full text-center text-lg my-10 dark:text-white';
        returnMessage.innerHTML = 'Could not find any tags matching your search...'
        listingsDisplay.appendChild(returnMessage);
        setTimeout(() => {
            window.location.href = '../listings/index.html'
        }, 3000);
    }
})