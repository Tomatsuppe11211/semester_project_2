const menuIcon = document.getElementById('menuIcon');
const loggedInMobileNav = document.getElementById('loggedOutMobileNav');
const loggedOutMobileNav = document.getElementById('loggedInMobileNav');




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
