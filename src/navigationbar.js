//Getting mobile menu
const mobileNav = document.getElementById('mobileNav');

//Getting logos
const headerLogo = document.getElementById('headerLogo');
const footerLogo = document.getElementById('footerLogo');

function logoSend(){
    window.location.href = '../index.html'
}

headerLogo.addEventListener('click', logoSend);
footerLogo.addEventListener('click', logoSend);


//Getting toggler buttons for mobileNav
const menuToggler = document.getElementById('menuIcon')
const closeNavbarButton = document.getElementById('closeBurgerMenu');



//Adding a close and open function for the mobile nav
function closemobileNav(){
    mobileNav.classList = 'hidden'
}

function openMobileNav(){
    mobileNav.classList = 'flex md:hidden fixed flex-col w-fit px-10 bg-white border-l top-0 right-0 px-2 h-screen gap-5'
}

//Adding functions to buttons
closeNavbarButton.addEventListener('click', closemobileNav);
menuToggler.addEventListener('click', openMobileNav);
