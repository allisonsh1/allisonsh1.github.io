document.getElementById('registrationForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = {
        firstName: this.firstName.value,
        lastName: this.lastName.value,
        email: this.email.value,
    };

    const response = await fetch(`/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
    });

    if (response.ok) {
        window.location = '/';
    } else {
        console.log('Failed to submit form');
    }
})