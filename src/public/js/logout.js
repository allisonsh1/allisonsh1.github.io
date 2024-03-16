const logoutButton = document.getElementById('submit');

logoutButton.addEventListener('click', async () => {
    const response = await fetch('/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (response.ok) {
        const res = await response.json();
        window.location = `/${res}`;
    }
});