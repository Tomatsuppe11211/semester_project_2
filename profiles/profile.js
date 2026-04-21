//Retrieving User information
const user = JSON.parse(sessionStorage.getItem('user'));
const key = sessionStorage.getItem('key');
const token = sessionStorage.getItem('token');


//Getting all HTML elements we want to change
const banner = document.getElementById('banner');
const avatar = document.getElementById('avatar');
const userName = document.getElementById('username');
const bio = document.getElementById('bio');


async function getProfileInfo(){
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
        console.log(myData);

        banner.src = myData.banner.url;
        avatar.src = myData.avatar.url;
        userName.innerHTML = myData.name;

        if(myData.bio === '' || myData.bio === null){
            bio.innerHTML = 'You have no bio. Tell us something about you';
        } else {
            bio.innerHTML = myData.bio;
        };

        console.log(myData.bio)
    } catch(error){
        console.error(error);
    };
};

getProfileInfo();