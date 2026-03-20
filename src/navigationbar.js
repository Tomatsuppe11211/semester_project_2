//Getting mobile menu
const mobileNav = document.getElementById('mobileNav');

//Getting toggler buttons for mobileNav
const menuToggler = document.getElementById('menuIcon')
const closeNavbarButton = document.getElementById('closeBurgerMenu');

//Adding a close and open function for the mobile nav
function closemobileNav(){
    mobileNav.classList = 'hidden'
}

function openMobileNav(){
    mobileNav.classList = 'flex md:hidden fixed flex-col w-50 bg-white border-l top-0 right-0 px-10 h-screen gap-5'
}

//Adding functions to buttons
closeNavbarButton.addEventListener('click', closemobileNav);
menuToggler.addEventListener('click', openMobileNav);


