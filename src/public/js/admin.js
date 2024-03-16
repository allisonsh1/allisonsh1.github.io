document.getElementById('adminPassword').addEventListener('submit', async (e) => {
    e.preventDefault();

    const password = {
        password: this.password.value,
    };

    const response = await fetch(`/admin`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(password),
    });

    const data = await response.json();
    if (data.success) {
        document.getElementsByTagName('html')[0].innerHTML = data.data;

        const registrantsDiv = document.querySelector('.registrants');
        
        for (const registrant of data.registrants) {
            const registrantContainer = document.createElement('div');
            registrantContainer.className = 'registrant-container';

            const firstName = document.createElement('p');
            firstName.textContent = registrant.firstName;
            firstName.className = 'registrant';

            const lastName = document.createElement('p');
            lastName.textContent = registrant.lastName;
            lastName.className = 'registrant';

            const email = document.createElement('p');
            email.textContent = registrant.email;
            email.className = 'registrant';

            registrantContainer.appendChild(firstName);
            registrantContainer.appendChild(lastName);
            registrantContainer.appendChild(email);
            
            registrantsDiv.appendChild(registrantContainer);
        }

        document.appendChild(registrantsDiv);
    }
});