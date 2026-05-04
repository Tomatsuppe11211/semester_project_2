//Retrieving User information
const user = JSON.parse(sessionStorage.getItem('user'));
const key = sessionStorage.getItem('key');
const token = sessionStorage.getItem('token');
if(!key){window.location.href = '../listings/index.html';}; //Sending user to listing page if not logged in


//Getting html elements we can edit
const avatarInput = document.getElementById('avatar');
const bannerInput = document.getElementById('banner');
const bioInput = document.getElementById('bio');
const editForm = document.getElementById('editForm');


//Creating custom error message for html validation
avatarInput.addEventListener('invalid', function(e){
    if(e.target.validity.patternMismatch){ //If pattern is not matched with value
        e.target.setCustomValidity('The link has to start with https::/')
    }

    avatarInput.addEventListener('input', function(e){
        e.target.setCustomValidity(''); //Reset validity after displaying error message
    });
})

bannerInput.addEventListener('invalid', function(e){
    if(e.target.validity.patternMismatch){ //If pattern is not matched with value
        e.target.setCustomValidity('The link has to start with https::/')
    }

    bannerInput.addEventListener('input', function(e){
        e.target.setCustomValidity(''); //Reset validity after displaying error message
    });
})


//Adding function for fetching profile info
async function getProfile(){
    try{
        const response = await fetch(`https://v2.api.noroff.dev/auction/profiles/${user.name}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, 
                'Content-Type': 'application/json',
                'X-Noroff-API-Key': key
            }
        });

        if(!response.ok){
                const errorMessage = await response.json()
                console.log(errorMessage.errors[0].message); //Reading error message
                return
        };

        const data = await response.json();
        const myData = data.data;

        avatarInput.value = myData.avatar.url;
        bannerInput.value = myData.banner.url;

        if(myData.bio !== '' || myData.bil !== null){
            bioInput.value = myData.bio;
        }

        //Updating profile if submitting is successful
        editForm.addEventListener('submit', async function(e){
            e.preventDefault();
            
            const response = await fetch(`https://v2.api.noroff.dev/auction/profiles/${user.name}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`, 
                    'Content-Type': 'application/json',
                    'X-Noroff-API-Key': key
                },
                body: JSON.stringify({
                    'bio': bioInput.value,
                    'avatar': {
                        'url': avatarInput.value,
                        'alt': 'Avatar'
                    }, 
                    'banner': {
                        'url': bannerInput.value,
                        'alt': 'Banner'
                    }
                })
            });

            if(!response.ok){
                const errorMessage = await response.json()
                console.log(errorMessage.errors[0].message); //Reading error message
                return
            };

            alert('Profile updated!');
            window.location.href = 'index.html';
        })
    }catch(error){
        console.error(error);
    };
};

getProfile();