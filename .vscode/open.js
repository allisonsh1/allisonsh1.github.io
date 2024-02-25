import('open').then(open => {
    open.default('http://localhost:8080');
}).catch(err => {
    console.error('Failed to open URL:', err);
});