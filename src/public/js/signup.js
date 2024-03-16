const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const email = document.getElementById('email');
const password = document.getElementById('password');

const signupButton = document.getElementById('submit');

signupButton.addEventListener('click', async () => {    
    const body = {
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        password: password.value,
    };

    const response = await fetch('/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    if (response.ok) {
        const res = await response.json();
        window.location = `/${res}`;
    } else {
        console.log('Failed to sign up');
        const res = await response.json();
        console.log(res);
    }
});