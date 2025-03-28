document.addEventListener('DOMContentLoaded', () => {
    const countrySelect = document.getElementById('countrySelect');
    const searchBtn = document.getElementById('searchBtn');
    const countryDetails = document.getElementById('countryDetails');
    const loader = document.getElementById('loader');
    const error = document.getElementById('error');

    // fetch countries for dropdown.
    async function fetchCountries() {
        try {
            showLoader();
            const response = await fetch('https://restcountries.com/v3.1/all');

            if (!response.ok) {
                throw new Error('Failed to fetch countries');
            }

            const countries = await response.json();

            // Sort results
            countries.sort((a, b) => {
                const nameA = a.name.common.toUpperCase();
                const nameB = b.name.common.toUpperCase();
                return nameA.localeCompare(nameB);
            });

            // insert countries in dropdown.
            countries.forEach(country => {
                const option = document.createElement('option');
                option.value = country.cca3; // Country code
                option.textContent = country.name.common;
                countrySelect.appendChild(option);
            });

            hideLoader();
        } catch (err) {
            // handle error
            hideLoader();
            showError('Error loading countries. Please try again later.');
            console.error('Error fetching countries:', err);
        }
    }

    // Fetch details for a specific country
    async function fetchCountryDetails(countryCode) {
        try {
            showLoader();
            hideError();

            const response = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`);

            if (!response.ok) {
                throw new Error('Failed to fetch country details');
            }

            const [country] = await response.json();
            displayCountryDetails(country);

            hideLoader();
        } catch (err) {
            hideLoader();
            showError('Error loading country details. Please try again later.');
            console.error('Error fetching country details:', err);
        }
    }

    // Display details of country
    function displayCountryDetails(country) {
        // Get the necessary data
        const name = country.name.common;
        const officialName = country.name.official;
        const flag = country.flags.svg;
        const capital = country.capital ? country.capital.join(', ') : 'N/A';
        const population = country.population.toLocaleString();
        const region = country.region;
        const subregion = country.subregion || 'N/A';
        const languages = country.languages ? Object.values(country.languages).join(', ') : 'N/A';

        // Get country's currency
        let currencies = 'N/A';
        if (country.currencies) {
            currencies = Object.values(country.currencies)
                .map(currency => `${currency.name} (${currency.symbol || 'N/A'})`)
                .join(', ');
        }

        // Get bordering countries
        let borders = 'None';
        if (country.borders && country.borders.length > 0) {
            borders = country.borders.join(', ');
        }

        // HTML for country details
        const html = `
            <div class="country-header">
                <img src="${flag}" alt="${name} flag" class="flag">
                <div>
                    <h2 class="country-name">${name}</h2>
                    <p>${officialName}</p>
                </div>
            </div>
            
            <div class="info-grid">
                <div class="info-item">
                    <span class="info-label">Capital:</span> ${capital}
                </div>
                <div class="info-item">
                    <span class="info-label">Population:</span> ${population}
                </div>
                <div class="info-item">
                    <span class="info-label">Region:</span> ${region}
                </div>
                <div class="info-item">
                    <span class="info-label">Subregion:</span> ${subregion}
                </div>
                <div class="info-item">
                    <span class="info-label">Languages:</span> ${languages}
                </div>
                <div class="info-item">
                    <span class="info-label">Currencies:</span> ${currencies}
                </div>
                <div class="info-item">
                    <span class="info-label">Bordering Countries:</span> ${borders}
                </div>
            </div>
        `;

        countryDetails.innerHTML = html;
        countryDetails.classList.remove('hidden');
    }

    // Add event listeners for the search button.
    searchBtn.addEventListener('click', () => {
        const selectedCountry = countrySelect.value;

        if (selectedCountry) {
            fetchCountryDetails(selectedCountry);
        } else {
            showError('Please select a country');
            countryDetails.classList.add('hidden');
        }
    });

    // Other functions
    function showLoader() {
        loader.classList.remove('hidden');
    }

    function hideLoader() {
        loader.classList.add('hidden');
    }

    function showError(message) {
        error.textContent = message;
        error.classList.remove('hidden');
    }

    function hideError() {
        error.classList.add('hidden');
    }

    // Start the app
    fetchCountries();
});