//Retrieving User information
const user = JSON.parse(sessionStorage.getItem('user'));
const key = sessionStorage.getItem('key');
const token = sessionStorage.getItem('token');
if(!key){window.location.href = '../listings/index.html';}; //Sending user to listing page if not logged in

//Fetching profile name from session storage
const seeUser = sessionStorage.getItem('seeSingleProfile');

//Getting elements from see.html
const banner = document.getElementById('banner');
const avatar = document.getElementById('avatar');
const username = document.getElementById('username');
const bio = document.getElementById('bio');

const nameDisplay = document.getElementById('nameDisplay');
const display = document.getElementById('display');

//For the item modal
const itemModal = document.getElementById('itemModal');
const image = document.getElementById('itemImage');
const title = document.getElementById('modalTitle');
const description = document.getElementById('modalDescription');
const timer = document.getElementById('timer');
const historyDisplay = document.getElementById('listingHistory');
const seeButton = document.getElementById('seeHistory');
const closeItemButton = document.getElementById('closeItem');
const currentBid = document.getElementById('currentBid');

//Closing modal function
closeItemButton.addEventListener('click', function(){itemModal.classList = 'hidden'});



//for the history modal
const historyModal = document.getElementById('historyModal');
const closeHistoryButton = document.getElementById('closeHistory');
const openHistorybutton = document.getElementById('historyButton');
const biddingStory = document.getElementById('biddingHistory');
const biddingButton = document.getElementById('biddingsButton');
const winningStory = document.getElementById('winningHistory');
const winningsButton = document.getElementById('winningsButton');



//Opening and closing history modal
openHistorybutton.addEventListener('click', function(){historyModal.classList = 'fixed flex inset-0 items-center justify-center bg-black/50 z-50 p-4 h-full';})
closeHistoryButton.addEventListener('click', function(){historyModal.classList = 'hidden'});

//Showing bidding history
biddingButton.addEventListener('click', function(){
    winningHistory.classList = 'hidden';
    winningsButton.classList = 'text-lg font-libre font-bold hover:text-hover hover:underline cursor-pointer';
    biddingStory.classList = 'flex flex-col gap-2 md:gap-5';
    biddingButton.classList = 'text-lg font-libre font-bold underline text-hover cursor-pointer';
});

//Showing winning history
winningsButton.addEventListener('click', function(){
    biddingStory.classList = 'hidden';
    biddingButton.classList = 'text-lg font-libre font-bold hover:text-hover hover:underline cursor-pointer';
    winningStory.classList = 'flex flex-col gap-2 md:gap-5';
    winningsButton.classList = 'text-lg font-libre font-bold underline text-hover cursor-pointer';
});



//Displaying the user's biddings
async function getBiddings(){
    const response = await fetch(`https://v2.api.noroff.dev/auction/profiles/${seeUser}/bids?_listings=true`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json',
            'X-Noroff-API-Key': key
        }
    });

    const data = await response.json();
    let biddings = data.data;

    if(biddings.length > 0){
        for(let i = 0; i < biddings.length; i++){
            const item = document.createElement('div');
            item.classList = 'flex flex-row w-full';

            const title = document.createElement('p');
            title.classList = 'text-lg w-2/3 text-start';
        
            if(biddings[i].listing.title.length > 20){
                title.innerHTML = `${biddings[i].listing.title.slice(0,20)}...`;
            } else {
                title.innerHTML = biddings[i].listing.title;
            }
            item.appendChild(title);


            const amount = document.createElement('div');
            amount.classList = 'text-lg w-1/3 text-end';
            amount.innerHTML = `${biddings[i].amount} credits`;
            item.appendChild(amount);

            biddingStory.appendChild(item);
        };
    } else {
        const message = document.createElement('p');
        message.classList = 'w-full text-lg'
        message.innerHTML = `${seeUser} has not bidded on any items yet`;
        biddingStory.appendChild(message);
    }

    
};

getBiddings();



//Displaying the user's winnings
async function getWinnings(){
    const response = await fetch(`https://v2.api.noroff.dev/auction/profiles/${seeUser}/wins`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json',
            'X-Noroff-API-Key': key
        }
    });

    const data = await response.json();
    let wins = data.data;

    if(wins.length > 0){
        for(let i = 0; i < wins.length; i++){
            const item = document.createElement('p');
            item.classList = 'text-lg text-center w-full'
            item.innerHTML = wins[i].title;
            winningHistory.appendChild(item);
        }
    } else {
        const message = document.createElement('p');
        message.classList = 'text-lg text-center w-full';
        message.innerHTML = `${seeUser} has not won any biddings yet`;
        winningHistory.appendChild(message);
    }


    
};

getWinnings();








//Fetching single profile
async function getProfile(){
    const response = await fetch(`https://v2.api.noroff.dev/auction/profiles/${seeUser}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json',
            'X-Noroff-API-Key': key
        }
    });

    const data = await response.json();
    const profileDetails = data.data;

    //Displaying the profile on the page
    banner.src = profileDetails.banner.url;
    avatar.src = profileDetails.avatar.url;
    username.innerHTML = profileDetails.name;


    if(profileDetails.bio === '' || profileDetails.bio === null){
        bio.innerHTML = 'This user has no bio';
    } else {
        bio.innerHTML = profileDetails.bio;
    };

    nameDisplay.innerHTML = `${profileDetails.name}'s Listings`;
}


//Fetching all listings by the single profile
async function getListings(){
    await getProfile();
    
    const response = await fetch(`https://v2.api.noroff.dev/auction/profiles/${seeUser}/listings?_bids=true`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json',
            'X-Noroff-API-Key': key
        }
    });

    const data = await response.json();
    const listings = data.data;

    if(listings.length <= 2){
        display.classList = 'flex flex-col md:flex-row md:flex-wrap items-center justify-evenly w-[90%] overflow-y-auto max-h-[95vh]';
    }; 

    if(listings.length > 0){
        for(let i = 0; i < listings.length; i++){
            const listing = document.createElement('div');
            listing.classList = 'border border-black w-1/2 md:w-1/4 flex flex-col gap-2 mb-5 shadow-lg shadow-black cursor-pointer';

            const listingImage = document.createElement('img');
            listingImage.classList = 'w-full h-40';
            listingImage.alt = 'Listing image';

            if(listings[i].media.length === 0){
                listingImage.src = 'https://images.unsplash.com/vector-1773501995769-cb593aed811c?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
            } else {
                listingImage.src = listings[i].media[0].url;
            }
            
            
            listing.appendChild(listingImage);

            const listingTitle = document.createElement('h2');
            if(listings[i].title.length > 15){
                listingTitle.innerHTML = `Listing ${i}`;
            } else {
                listingTitle.innerHTML = listings[i].title;
            };        
            listingTitle.classList = 'w-full px-1 font-semibold text-center lg:text-lg';
            listing.appendChild(listingTitle);

            
            const actions = document.createElement('div');
            actions.classList = 'w-full flex flex-row';

            listing.appendChild(actions);
            display.appendChild(listing);
                    
            //Adding information to the item modal
            listing.addEventListener('click', function(){
                let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                itemModal.classList = 'fixed flex inset-0 items-center justify-center bg-black/50 z-50 p-4';

                let year = listings[i].endsAt.slice(0,4);
                let month = Number(listings[i].endsAt.slice(5,7));
                let day = listings[i].endsAt.slice(8,10);
                let time = listings[i].endsAt.slice(11,16);

                let monthName = months[month - 1];

                image.src = listings[i].media[0].url;
                title.innerHTML = listings[i].title;
                description.innerHTML = listings[i].description;
                timer.innerHTML = `Ends at: ${monthName} ${day} ${year} at ${time}`;

                let bids = listings[i].bids.reverse();
                currentBid.innerHTML = `Current bid: ${bids[0].amount} credits`;


                //See bids to listing item function
                seeButton.addEventListener('click', async function(){
                    historyDisplay.innerHTML = ''; //Empty before filling up to prevent duplicates

                    if(listings[i].bids.length > 0){
                        const titles = document.createElement('div');
                        titles.classList = 'w-full flex flex-row border-t border-black';

                        const nameDisplay = document.createElement('p');
                        nameDisplay.classList = 'w-1/2 text-start text-lg font-bold'
                        nameDisplay.innerHTML = 'Name';
                        titles.appendChild(nameDisplay);

                        const amountDisplay = document.createElement('p');
                        amountDisplay.classList = 'w-1/2 text-start text-lg font-bold';
                        amountDisplay.innerHTML = 'Amount';
                        titles.appendChild(amountDisplay);

                        historyDisplay.appendChild(titles);

                        for(let i = 0; i < bids.length; i++){
                            const bidding = document.createElement('div');
                            bidding.classList = 'flex flex-row w-full';

                            const name = document.createElement('p');
                            name.classList = 'w-1/2 text-start text-lg'
                            name.innerHTML = bids[i].bidder.name;
                            bidding.appendChild(name);

                            const amount = document.createElement('p');
                            amount.classList = 'w-1/2 text-start text-lg';
                            amount.innerHTML = `${bids[i].amount} credits`;
                            bidding.appendChild(amount);

                            historyDisplay.appendChild(bidding);
                        };
                    } else {
                        historyDisplay.innerHTML = 'There are no biddings on this item yet'
                    }

                    historyDisplay.classList = 'flex flex-col w-[90%] gap-5';
                });
            });
        };  
    } else {
        display.innerHTML = `${seeUser} has no listings yet`;
        display.classList = 'text-lg';
    };
};

getListings();