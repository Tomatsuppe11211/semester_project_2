//getting elements from the register form
const registerForm = document.getElementById('registerForm');
const messageDisplay = document.getElementById('message');
const usernameinput = document.getElementById('username');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const registerButton = document.getElementById('registerButton');



//-------------------------------------------------------------------------------------------------



//Setting custom error messages for html validation
usernameinput.addEventListener('invalid', function(e){
    if(e.target.validity.valueMissing){ //if empty
        e.target.setCustomValidity('You Must have a username');
    } else if(e.target.validity.paternMismatch){
        e.target.setCustomValidity('Username cannot accept special characters except _');
    };
});

emailInput.addEventListener('invalid', function(e){
    if(e.target.validity.valueMissing){ //if empty
        e.target.setCustomValidity('You must enter your Noroff email');
    } else if(e.target.validity.paternMismatch){
        e.target.setCustomValidity('The email must contain @stud.noroff.no');
    };
});

passwordInput.addEventListener('invalid', function(e){
    if(e.target.validity.valueMissing){ //if empty
        e.target.setCustomValidity('You must enter a password');
    } else if(e.target.validity.paternMismatch){
        e.target.setCustomValidity('Your password must contain at least 8 characters');
    };
});

confirmPasswordInput.addEventListener('invalid', function(e){
    if(e.target.validity.valueMissing){ //if empty
        e.target.setCustomValidity('You must enter a password');
    };
});


//The register function
registerForm.addEventListener('submit', async function(e){
    e.preventDefault();

    if(passwordInput.value !== confirmPasswordInput.value){
        messageDisplay.innerHTML = 'Passwords do not match.';
        messageDisplay.classList = 'p-2 border w-full text-lg bg-error dark:text-black dark:border-black';
        return;
    };

    try{
        const response = await fetch('https://v2.api.noroff.dev/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: usernameinput.value,
                email: emailInput.value,
                password: passwordInput.value
            })
        });

        const data = await response.json();

        if(!response.ok){
            messageDisplay.innerHTML = data.errors?.[0].message || data.message || 'Registration failed';
            messageDisplay.classList = 'p-2 border w-full text-lg bg-error dark:text-black dark:border-black';
            return
        } else {
            messageDisplay.innerHTML = `Registration complete. Welcome ${usernameinput.value}!`;
            messageDisplay.classList = 'p-2 border w-full text-lg bg-success dark:text-black dark:border-black';
        
            //redirecting after 3 seconds
            setTimeout(() => {window.location.href = '../login/index.html';}, 3000);
        };
    } catch(error){
        console.error(error);
        messageDisplay.innerHTML = 'Something went wrong';
        messageDisplay.classList = 'p-2 border w-full text-lg bg-error dark:text-black dark:border-black';
    }
})