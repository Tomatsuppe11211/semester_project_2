//Retrieving User information
const user = JSON.parse(sessionStorage.getItem('user'));
const key = sessionStorage.getItem('key');
const token = sessionStorage.getItem('token');
if(!key){window.location.href = '../listings/index.html';}; //Sending user to listing page if not logged in


//Getting all HTML elements we want to change
const banner = document.getElementById('banner');
const avatar = document.getElementById('avatar');
const userName = document.getElementById('username');
const bio = document.getElementById('bio');
const editBioButton = document.getElementById('edit');
const listingDisplay = document.getElementById('display')

//For the history modal
const openHistoryButton = document.getElementById('historyButton');
const closeHistoryButton = document.getElementById('closeHistory');
const modal = document.getElementById('historyModal');
const biddingsButton = document.getElementById('biddingsButton');
const WinningsButton = document.getElementById('winningsButton');
const biddingHistory = document.getElementById('biddingHistory');
const winningHistory = document.getElementById('winningHistory');
const biddingsOverview = document.getElementById('biddingsOverview');
const winningsOverview = document.getElementById('winningsOverview');


//Functions for open and close history modal
openHistoryButton.addEventListener('click', function(){modal.classList = 'fixed flex inset-0 items-center justify-center bg-black/50 z-50 p-4 overflow-y-auto max-h-[90vh]'})
closeHistoryButton.addEventListener('click', function(){modal.classList = 'hidden';});

//Showing biddings when this button is clicked
biddingsButton.addEventListener('click', function(){
    WinningsButton.classList = 'text-lg font-libre font-bold cursor-pointer';
    winningHistory.classList = 'hidden';
    biddingsButton.classList = 'text-lg font-libre font-bold underline text-hover cursor-pointer';
    biddingHistory.classList = 'flex flex-col gap-2 md:gap-5';
});

//Showing the winnings when this button is clicked
WinningsButton.addEventListener('click', function(){
    biddingsButton.classList = 'text-lg font-libre font-bold cursor-pointer';
    biddingHistory.classList = 'hidden';
    WinningsButton.classList = 'text-lg font-libre font-bold underline text-hover cursor-pointer';
    winningHistory.classList = 'flex flex-col gap-2 md:gap-5';
});






//For the listing item modal
const itemModal = document.getElementById('itemModal');
const closeItemModalButton = document.getElementById('closeItem');
const itemImage = document.getElementById('itemImage');
const itemTitle = document.getElementById('listingTitle');
const itemDescription = document.getElementById('listingDescription');
const itemTimer = document.getElementById('timer');
const currentBid = document.getElementById('currentBid');
const itemHistory = document.getElementById('listingHistory');
const seeHistoryButton = document.getElementById('seeHistory');
const editItemButton = document.getElementById('editItem');
const deleteItemButton = document.getElementById('deleteItem');

//Adding function to close button
closeItemModalButton.addEventListener('click', function(){
    itemModal.classList = 'hidden'; 
    itemHistory.classList = 'hidden';
});











//Sending user to a edit profile page when clicking on the button
editBioButton.addEventListener('click', function(){
    window.location.href = 'edit.html';
});


//Getting and displaying profile
async function getProfileInfo(){
    try{
        const response = await fetch(`https://v2.api.noroff.dev/auction/profiles/${user.name}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, 
                'Content-Type': 'application/json',
                'X-Noroff-API-Key': key
            }
        });

        if(!response.ok){
                const errorMessage = await response.json()
                console.log(errorMessage.errors[0].message); //Reading error message
                return
        };

        const data = await response.json();
        const myData = data.data;

        banner.src = myData.banner.url;
        avatar.src = myData.avatar.url;
        userName.innerHTML = myData.name;

        if(myData.bio === '' || myData.bio === null){
            bio.innerHTML = 'You have no bio. Tell us something about you';
        } else {
            bio.innerHTML = myData.bio;
        };

        //Fetching profile listings
        async function getListings(){
            try{
                const response = await fetch(`https://v2.api.noroff.dev/auction/profiles/${user.name}/listings?_bids=true`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`, 
                        'Content-Type': 'application/json',
                        'X-Noroff-API-Key': key
                    }
                });

                if(!response.ok){
                    const errorMessage = await response.json();
                    console.log('There was an error fetching the listings');
                    return;
                }

                const data = await response.json();
                const listings = data.data;

                if(listings.length <= 2){
                    listingDisplay.classList = 'flex flex-col md:flex-row md:flex-wrap items-center justify-evenly w-[90%]';
                }; 

                if(listings.length > 0){
                    for(let i = 0; i < listings.length; i++){
                        const listing = document.createElement('div');
                        listing.classList = 'border border-black w-1/2 md:w-[10rem] lg:w-[12rem] flex flex-col gap-2 mb-5 shadow-lg shadow-black';

                        const listingImage = document.createElement('img');
                        listingImage.classList = 'w-full';
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
                        listingDisplay.appendChild(listing);
                    
                    
                        //Adding information to the item modal
                        listing.addEventListener('click', function(){
                            let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                            itemModal.classList = 'fixed flex inset-0 items-center justify-center bg-black/50 z-50 p-4';

                            let year = listings[i].endsAt.slice(0,4);
                            let month = Number(listings[i].endsAt.slice(5,7));
                            let day = listings[i].endsAt.slice(8,10);
                            let time = listings[i].endsAt.slice(11,16);

                            let monthName = months[month - 1];

                            itemImage.src = listings[i].media[0].url;
                            itemTitle.innerHTML = listings[i].title;
                            itemDescription.innerHTML = listings[i].description;
                            itemTimer.innerHTML = `Ends at: ${monthName} ${day} ${year} at ${time}`;

                            let bids = listings[i].bids.reverse();
                            currentBid.innerHTML = `Current bid: ${bids[0].amount} credits`;

                            //See bids to listing item function
                            seeHistoryButton.addEventListener('click', async function(){
                                itemHistory.innerHTML = ''; //Empty before filling up to prevent duplicates

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

                                    itemHistory.appendChild(titles);

                                    let bids = listings[i].bids;

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

                                        itemHistory.appendChild(bidding);
                                    };
                                } else {
                                    itemHistory.innerHTML = 'There are no biddings on this item yet'
                                }

                                itemHistory.classList = 'flex flex-col w-[90%] gap-5';
                            });


                            //Sending the user to the edit listing page with listing details
                            editItemButton.addEventListener('click', function(){
                                sessionStorage.setItem('editListing', JSON.stringify(listings[i]))
                                window.location.href = '../edit_listing/index.html';
                            });

                            //Deleting function
                            deleteItemButton.addEventListener('click', async function(){
                                try{
                                    const response = await fetch(`https://v2.api.noroff.dev/auction/listings/${listings[i].id}`, {
                                        method: 'DELETE',
                                        headers: {
                                            'Authorization': `Bearer ${token}`,
                                            'X-Noroff-API-Key': key
                                        }
                                    });

                                    if(!response.ok){
                                        console.log('There was an error deleting this post');
                                        const mes = await response.json();
                                        console.log(mes);
                                        return;
                                    };

                                    alert('Listing deleted');
                                } catch(error){
                                    console.error(error)
                                }
                                window.location.href = 'index.html';
                            });
                        })
                    };  
                } else {
                    listingDisplay.innerHTML = ' You have no listing items yet';
                    listingDisplay.classList = 'text-lg'
                }   
            } catch(error){
                console.error(error);
            };
        };
        getListings();
    } catch(error){
        console.error(error);
    };
};

//Getting profile's bidding history
async function getBiddings(){
    await getProfileInfo()
    
    try{
        const response = await fetch(`https://v2.api.noroff.dev/auction/profiles/${user.name}/bids?_listings=true`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, 
                'Content-Type': 'application/json',
                'X-Noroff-API-Key': key
            }
        });

        if(!response.ok){
                const errorMessage = await response.json()
                console.log(errorMessage.errors[0].message); //Reading error message
                return
        };

        const data = await response.json();
        const biddings = data.data;

        //Checking array lenght and give message based on total biddings
        console.log('Bidded on:');
        console.log(biddings);

        //Added listing items the user had bidded on in the overview
        if(biddings.length === 0){
            const message = document.createElement('p')
            message.innerHTML = 'You have not bidded on anything yet';

            biddingsOverview.appendChild(message);
        } else {
            //Update when making bidding function
            for(let i = 0; i < biddings.length; i++){
                const item = document.createElement('div');
                item.classList = 'flex flex-row w-full';

                const title = document.createElement('p');
                title.classList = 'w-2/3 text-start';
                if(biddings[i].title > 20){
                    title.innerHTML = `${biddings[i].title.slice(0,20)}...`
                } else {
                    title.innerHTML = biddings[i].title; //Check if it works
                }
                
                item.appendChild(title);

                const bidding = document.createElement('p');
                bidding.classList = 'w-1/3 text-end';
                bidding.innerHTML = `${biddings[i].amount} credits`; //Check if it works
                item.appendChild(bidding);

                biddingsOverview.appendChild(item);
            }
        }
    }catch(error){
        console.error(error)
    };
};

//Get profile's winning history
async function getWins() {
    await getBiddings()
    
    try{
        const response = await fetch(`https://v2.api.noroff.dev/auction/profiles/${user.name}/wins?_listings`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, 
                'Content-Type': 'application/json',
                'X-Noroff-API-Key': key
            }
        });

        if(!response.ok){
                const errorMessage = await response.json()
                console.log(errorMessage.errors[0].message); //Reading error message
                return
        };

        const data = await response.json();
        const winnings = data.data;

        console.log('Won:');
        console.log(winnings);

        if(winnings.length === 0){
            const message = document.createElement('p');
            message.innerHTML = 'No biddings won yet';

            winningsOverview.appendChild(message);
        } else {
            for(let i = 0; i < winnings.length; i++){
                const item = document.createElement('div');
                item.classList = 'flex flex-row w-full';

                const title = document.createElement('p');
                title.classList = 'w-2/3 text-start';
                title.innerHTML = 'Title'; //Change with actual title
                item.appendChild(title);

                const bidding = document.createElement('p');
                bidding.classList = 'w-1/3 text-end';
                bidding.innerHTML = '20000 credits'; //Change with actual bidding
                item.appendChild(bidding);

                winningsOverview.appendChild(item);
            } 
        }
    } catch(error){
        console.error(error);
    }
}

getWins()