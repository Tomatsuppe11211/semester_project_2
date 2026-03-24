const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const loginButton = document.getElementById('loginButton');


//Chreating custom messages for the html validation
//Link to inspiration: https://stackoverflow.com/questions/63491564/change-default-html-input-validation-message
emailInput.addEventListener('invalid', function(e){
    if(e.target.validity.valueMissing){ //If empty input field
        e.target.setCustomValidity('Please anter your Noroff email');
    } else if(e.target.validity.patternMismatch){ //if mismatched email
        e.target.setCustomValidity('Your email must be an @stud.noroff.no'); 
    };
});