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

loginForm.addEventListener('submit', async function(){
    try{
        const response = fetch('https://v2.api.noroff.dev/auth/login', {
            method: 'post',
            headers: {
                'content-type': 'json/application'
            },
            body:JSON.stringify({
                    email: emailInput.value,
                    password: passwordInput.value
                })
        });

    } catch(error) {

    }
});