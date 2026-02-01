// Central API base URL. Uses localhost during local dev, otherwise uses the Render production URL.
if (!window.API_BASE) {
	if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
		window.API_BASE = 'http://localhost:4000/api';
	} else {
		window.API_BASE = 'https://projet-techweb-arw-cosmetics-backen.onrender.com/api';
	}
}
