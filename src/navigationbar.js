//Getting logos
const headerLogo = document.getElementById('headerLogo');
const footerLogo = document.getElementById('footerLogo');

function logoSend(){
    window.location.href = '../listings/index.html';
};

if(headerLogo && footerLogo){
    headerLogo.addEventListener('click', logoSend);
    footerLogo.addEventListener('click', logoSend);
};


//--------------------------------------------------------------------------



//Getting mobile menu
const mobileNav = document.getElementById('mobileNav');

//Getting toggler buttons for mobileNav
const menuToggler = document.getElementById('menuIcon');
const closeNavbarButton = document.getElementById('closeBurgerMenu');



//Adding a close and open function for the mobile nav
function closemobileNav(){
    mobileNav.classList = 'hidden';
};

function openMobileNav(){
    mobileNav.classList = 'flex md:hidden fixed flex-col w-fit px-10 bg-white border-l top-0 right-0 px-2 h-screen gap-5 dark:bg-dark-header dark:text-white';
};

//Adding functions to buttons
if(closeNavbarButton && menuToggler){
    closeNavbarButton.addEventListener('click', closemobileNav);
    menuToggler.addEventListener('click', openMobileNav);
};



//--------------------------------------------------------------------------



//Dark mode
//Getting the sun buttons on both navs
const desktopSun = document.getElementById('desktopSun');
const mobileSun = document.getElementById('mobileSun');

//Adding icons to change when dark mode is toggled
const sun = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8 hover:text-hover cursor-pointer"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" /></svg>';
const moon = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8 hover:text-hover cursor-pointer"><path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" /></svg>';

function toggleMode(){
    document.documentElement.classList.toggle('dark');

    //Saving preferences
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark': 'light');

    //Changing icons based on toggled mode
    if(desktopSun){
        desktopSun.innerHTML = isDark ? moon: sun;
    }
    
    if(mobileSun){
        mobileSun.innerHTML = isDark ? moon: sun;
    };
};

//Adding the eventListeners for toggling the modes
if(desktopSun && mobileSun){
    desktopSun.addEventListener('click', toggleMode);
    mobileSun.addEventListener('click', toggleMode);
}


//Loading/respecting system preferences if made
if(
    localStorage.theme === 'dark' ||
    (localStorage.theme && window.matchMedia('(prefers-color-scheme: dark)').matches)
){
    document.documentElement.classList.add('dark');
    if(desktopSun){
        desktopSun.innerHTML = moon;
    }
    
    if(mobileSun){
        mobileSun.innerHTML = moon;
    };
} else {
    document.documentElement.classList.remove('dark');
    if(desktopSun){
        desktopSun.innerHTML = sun;
    }
    
    if(mobileSun){
        mobileSun.innerHTML = sun;
    };
};



//--------------------------------------------------------------------------



//Changing the navigationbar if logged in

//Getting login and register links
const deskLoginLink = document.getElementById('desktopLoginLink'); 
const deskRegisterLink = document.getElementById('desktopRegisterLink');
const mobileLoginLink = document.getElementById('mobileLoginLink');
const mobileRegisterLink = document.getElementById('mobileRegisterLink');

//Getting hidden links
const deskAddLink = document.getElementById('desktopPlus');
const deskProfileLink = document.getElementById('desktopProfile');
const desktopSignOut = document.getElementById('desktopDoor');
const mobileAddLink = document.getElementById('mobilePlus');
const mobileProfileLink = document.getElementById('mobileProfile');
const mobileSignOut = document.getElementById('mobileDoor');

//Setting style for shown navigationbar icons when logged in
const iconStyle = 'size-8 hover:text-hover hover:font-bold cursor-pointer';
const signOutStyle = 'size-8 hover:text-red hover:font-bold cursor-pointer';

//CHecking if there is any logged in users
const currentUser = JSON.parse(sessionStorage.getItem('user'));
if(currentUser && currentUser !== null){
    const key = sessionStorage.getItem('key');
    const token = sessionStorage.getItem('token');
    console.log(currentUser);
    console.log(key);
    console.log(token);

    //Making login and register links invisible
    deskLoginLink.classList = deskRegisterLink.classList = 
    mobileLoginLink.classList = mobileRegisterLink.classList = 'hidden';

    //Making icons visible
    deskAddLink.classList = deskProfileLink.classList  =
    mobileAddLink.classList = mobileProfileLink.classList = iconStyle;
    
    mobileSignOut.classList = desktopSignOut.classList = signOutStyle;
}



//Adding a signout function
function signOut(){
    if(currentUser){
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('key');

        window.location.href = '../index.html';
    }
}

//creating a signout modal the user can open/close
function openSignOutModal(){
    //Adding a message modal
    const body = document.body;

    const modal = document.createElement('div');
    modal.classList = 'flex fixed inset-0 items-center justify-center bg-black/50 z-50 overflow-y-auto p-4';

    modalDisplay = document.createElement('div');
    modalDisplay.classList = 'flex flex-col text-center bg-white dark:bg-darkBG dark:text-white p-2 md:p-4 w-2/3 md:w-1/4 gap-5 shadow-lg shadow-black';
    modal.appendChild(modalDisplay);

    const modalTitle = document.createElement('h1');
    modalTitle.innerHTML = 'Sign out?';
    modalTitle.classList = 'text-2xl md:text-4xl';
    modalDisplay.appendChild(modalTitle);

    const modalMessage = document.createElement('p');
    modalMessage.innerHTML = 'You are about to sign out. Continue?';
    modalMessage.classList = 'text-lg md:text-xl';
    modalDisplay.appendChild(modalMessage);

    const choiceDiv = document.createElement('div');
    choiceDiv.classList = 'flex flex-row w-full justify-evenly ';
    modalDisplay.appendChild(choiceDiv);

    const signOutButton = document.createElement('button');
    signOutButton.innerHTML = 'Sign out';
    signOutButton.classList = 'border p-2 md:w-1/5 bg-error text-black hover:bg-red hover:text-white hover:border-black cursor-pointer md:text-lg dark:border-black';
    signOutButton.addEventListener('click', signOut);
    choiceDiv.appendChild(signOutButton);

    const cancelButton = document.createElement('button');
    cancelButton.innerHTML = 'Cancel';
    cancelButton.classList = 'border p-2 md:w-1/5 hover:bg-hover cursor-pointer md:text-lg dark:border-black dark:bg-dark-header';
    cancelButton.addEventListener('click', closeSignOutModal);
    choiceDiv.appendChild(cancelButton);

    body.appendChild(modal);


    function closeSignOutModal(){
        modal.classList = modalDisplay.classlist = modalTitle.classlist =
        modalMessage.classlist = choiceDiv.classlist = 'hidden';
    }
}

desktopSignOut.addEventListener('click', openSignOutModal);
mobileSignOut.addEventListener('click', openSignOutModal);

//Sending user to create listing page when clicking plus icon
function sendToAddListing(){
    window.location.href = '../create/index.html';
};

deskAddLink.addEventListener('click', sendToAddListing);
mobileAddLink.addEventListener('click', sendToAddListing);