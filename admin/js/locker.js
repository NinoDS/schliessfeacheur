const url = '';

let globalId = null;

updateSite().catch(() => {
	alert('Ein unbekannter Fehler ist aufgetreten😥\nDas Schließfach konnte nicht geladen werden');
	disableInputs();
});

async function updateSite() {
	const params = new URLSearchParams(window.location.search);
	globalId = params.get('id');

	setLockerId(globalId);

	if (globalId) {
		let username = localStorage.getItem('username');
		let password = localStorage.getItem('password');

		const data = await fetch(`${url}/lockers/${globalId}`, {
			method: 'GET',
			body: JSON.stringify({
				username,
				password,
			}),
		});

		const json = await data.json();

		if (json.success) {
			setData(json.data);
		} else {
			// Unauthorized
			if (data.status === 401) {
				window.location.href = '../login.html';
			} else {
				alert(data.message || 'Wir konnten das Schließfach nicht finden😥');
				disableInputs();
			}
		}
	} else {
		alert('Wir konnten das Schließfach nicht finden😥');
		disableInputs();
	}
}

function disableInputs() {
	let inputs = document.querySelectorAll('input,.data');

	for (const input of inputs) {
		input.disabled = true;
	}

	document.querySelector('.submit-changes-button').disabled = true;
}

function setData(data) {
	for (const [ key, value ] in Object.entries(data)) {
		document.querySelector(`[name=${key}]`).value = value;
	}
}

function setLockerId(id) {
	document.querySelector('#lockerId').value = id;
	let lockerTitle = document.querySelector('.locker-title');
	lockerTitle.innerHTML = id ? `Schließfach ${id}` : 'Unbekanntes Schließfach😥';
	globalId = parseInt(id) || null;
}

function saveChanges() {
	let inputs = document.querySelectorAll('input,.data');

	let data = {};

	for (const input of inputs) {
		data[input.getAttribute("name")] = input.value;
	}

	fetch(`${url}/lockers/${globalId}`, {
		method: 'POST',
		body: {
			username: localStorage.getItem('username'),
			password: localStorage.getItem('password'),
			data
		}
	}).then((data) => {
		return data.json();
	}).then((json) => {
		if (json.success) {
			alert('Die Daten wurden erfolgreich gespeichert!');
		} else {
			alert((json.message || 'Ein unbekannter Fehler ist aufgetreten😥') + '\nDie Daten konnten nicht gespeichert werden.');
		}
	}).catch(() => {
		alert(('Ein unbekannter Fehler ist aufgetreten😥') + '\nDie Daten konnten nicht gespeichert werden.');
	})

}

function updateLockerId() {
	const id = document.querySelector('#lockerId');
	setLockerId(id.value);
}