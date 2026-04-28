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
                const response = await fetch(`https://v2.api.noroff.dev/auction/profiles/${user.name}/listings`, {
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
                    listingDisplay.classList = 'flex flex-col md:flex-row md:flex-wrap items-center justify-evenly w-[90%]'
                }

                for(let i = 0; i < listings.length; i++){
                    const listing = document.createElement('div');
                    listing.classList = 'border border-black w-1/2 md:w-[10rem] lg:w-[12rem] flex flex-col gap-2 mb-5';

                    const listingImage = document.createElement('img')
                    listingImage.classList = 'w-full'
                    listingImage.alt = 'Listing image';
                    listingImage.src = listings[i].media[0].url;
                    listing.appendChild(listingImage);

                    const listingTitle = document.createElement('h2')
                    if(listings[i].title.length > 15){
                        listingTitle.innerHTML = `Listing ${i}`;
                    } else {
                        listingTitle.innerHTML = listings[i].title;
                    };
                    
                    
                    listingTitle.classList = 'w-full px-1 font-semibold text-center lg:text-lg';
                    listing.appendChild(listingTitle);

                    const actions = document.createElement('div');
                    actions.classList = 'w-full flex flex-row';

                    const editButton = document.createElement('button');
                    editButton.innerHTML = 'Edit';
                    editButton.classList = 'w-1/2 border border-black bg-button dark:bg-darkBG dark:text-white text-black p-2 hover:bg-hover cursor-pointer';
                    actions.appendChild(editButton);

                    const deleteButton = document.createElement('button');
                    deleteButton.innerHTML = 'Delete';
                    deleteButton.classList = 'w-1/2 border border-black bg-error dark:bg-darkBG dark:text-white text-black p-2 hover:bg-red hover:text-white cursor-pointer';
                    actions.appendChild(deleteButton);

                    listing.appendChild(actions);
                    listingDisplay.appendChild(listing);
                    
                    
                    //Adding temporary functions. Will edit later
                    editButton.addEventListener('click', function(){console.log('You clicked Edit')});
                    

                    //Deleting function
                    deleteButton.addEventListener('click', async function(){
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
                        listingDisplay.removeChild(listing);
                    });
                };
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
        const response = await fetch(`https://v2.api.noroff.dev/auction/profiles/${user.name}/bids?_listings`, {
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

        //Checking array lenght and give message based on total biddings
        if(data.length > 0){
            console.log(data);
        } else {
            console.log('You have not bidded on anything yet');
        };

    }catch(error){
        console.error(error)
    };
};

getBiddings();