const loginForm = document.getElementById('loginForm')
const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const loginButton = document.getElementById('loginButton');
const messageDisplay = document.getElementById('message');


//Chreating custom messages for the html validation
//Link to inspiration: https://stackoverflow.com/questions/63491564/change-default-html-input-validation-message
emailInput.addEventListener('invalid', function(e){
    if(e.target.validity.valueMissing){ //If empty input field
        e.target.setCustomValidity('Please enter your Noroff email');
    } else if(e.target.validity.patternMismatch){ //if mismatched email
        e.target.setCustomValidity('Your email must be an @stud.noroff.no'); 
    };

    emailInput.addEventListener('input', function(e){
        e.target.setCustomValidity(''); //Reset validity after displaying error message
    });
});

passwordInput.addEventListener('invalid', function(e){
    if(e.target.validity.valueMissing){ //If empty value input field
        e.target.setCustomValidity('Please enter your password');
    } else if(e.target.validity.patternMismatch){ //If mismatched password with pattern
        e.target.setCustomValidity('Your password must be at least 8 characters long')
    }

    passwordInput.addEventListener('input', function(e){
        e.target.setCustomValidity(''); //Reset validity after displaying error message
    });
});

//Login function
loginForm.addEventListener('submit', async function(e){
    e.preventDefault();

    try{
        const response = await fetch('https://v2.api.noroff.dev/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                    email: emailInput.value,
                    password: passwordInput.value
                })
        });

        const data = await response.json();

        if(!response.ok){
            messageDisplay.innerHTML = data.errors?.[0].message || data.message || 'Login failed';
            messageDisplay.classList = 'p-2 border w-full text-lg bg-error dark:text-black dark:border-black'
            return;
        };

        messageDisplay.innerHTML = `welcome ${data.data.name}! loggin in and redirecting...`
        messageDisplay.classList = 'p-2 border w-full text-lg bg-success dark:text-black dark:border-black'

        sessionStorage.setItem('user', JSON.stringify(data.data));

        const token = data.data.accessToken
        sessionStorage.setItem('token', token);

        //Creating an API-Key
        async function createApiKey(){
            const response = await fetch('https://v2.api.noroff.dev/auth/create-api-key', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({name: 'Current ApiKey'})
            });

            const data = await response.json();
            const createdKey = data.data.key;

            
            sessionStorage.setItem('key', createdKey);
        }

        createApiKey();

        //redirecting after 3 seconds
        setTimeout(() => {window.location.href = '../listings/index.html';}, 3000);
    } catch(error) {
        console.error('Error: User unauthorized');
    }
});