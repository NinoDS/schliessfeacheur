let lockerTitle = document.querySelector('.locker-title');

const params = new URLSearchParams(window.location.search);

lockerTitle.innerHTML = `Schließfach ${params.get('id') || 'Unbekannt'}`;