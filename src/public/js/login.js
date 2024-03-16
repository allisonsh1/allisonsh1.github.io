const email = document.getElementById('email');
const password = document.getElementById('password');

const loginButton = document.getElementById('submit');

loginButton.addEventListener('click', async () => {
    const body = {
        email: email.value,
        password: password.value,
    };

    const response = await fetch('/login', {
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
        console.log('Failed to login');
        const res = await response.json();
        console.log(res);
    }
});