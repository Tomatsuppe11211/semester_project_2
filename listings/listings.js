const menuIcon = document.getElementById('menuIcon');
const loggedInMobileNav = document.getElementById('loggedOutMobileNav');
const loggedOutMobileNav = document.getElementById('loggedInMobileNav');


async function getListings(){
    const response = await fetch('https://v2.api.noroff.dev/auction/listings')
    const data = await response.json()
    const listings = data.data
    for(let i = 0; i < listings.length; i++){
        console.log(listings[i].title)
    }
}

getListings()



/*Creating functions for opening and closing navigationbars for mobile*/
function closeLoggedInNav(){
    loggedInMobileNav.classList = 'hidden'
}

function openLoggedInNav(){
    loggedInMobileNav.classList = 'flex'
}

function openLoggedOutNav(){
    loggedOutMobileNav.classList = 'flex'
}

function closeLoggedOutNav(){
    loggedOutMobileNav.classList = 'hidden'
}