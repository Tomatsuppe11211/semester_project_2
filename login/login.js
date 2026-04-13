const loginForm = document.getElementById('loginForm')
const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const loginButton = document.getElementById('loginButton');


//Chreating custom messages for the html validation
//Link to inspiration: https://stackoverflow.com/questions/63491564/change-default-html-input-validation-message
emailInput.addEventListener('invalid', function(e){
    if(e.target.validity.valueMissing){ //If empty input field
        e.target.setCustomValidity('Please enter your Noroff email');
    } else if(e.target.validity.patternMismatch){ //if mismatched email
        e.target.setCustomValidity('Your email must be an @stud.noroff.no'); 
    };
});

passwordInput.addEventListener('invalid', function(e){
    if(e.target.validity.valueMissing){ //If empty value input field
        e.target.setCustomValidity('Please enter your password');
    } else if(e.target.validity.patternMismatch){ //If mismatched password with pattern
        e.target.setCustomValidity('Your password must be at least 8 characters long')
    }
});

//Login function
loginForm.addEventListener('submit', async function(e){
    e.preventDefault();

    let userRequest = {
        email: emailInput.value,
        password: passwordInput.value
    }

    try{
        const response = await fetch('https://v2.api.noroff.dev/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                    email: userRequest.email,
                    password: userRequest.password
                })
        });

        const data = await response.json();

        if(!response.ok){
            console.log(data.errors?.[0].message || data.message || 'Login failed');
            return;
        };

        console.log(data);
        sessionStorage.setItem('user', JSON.stringify(data.data));

        const token = data.data.accessToken

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
            console.log(sessionStorage.getItem('key'));
        }

        createApiKey();

        window.location.href = '../listings/index.html';
    } catch(error) {
        console.error('Error: User unauthorized');
    }
});