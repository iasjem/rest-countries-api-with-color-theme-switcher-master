/** CONSTANTS */
const REST_API_URL = "https://restcountries.eu/rest/v2";
const DEFAULT_LIST_LIMIT = 10;
const DEFAULT_FILTER_REGION = null;

/** DOM ELEMENTS */
const homepageItemList = document.querySelector(".homepage-item-list");

/** API CALLS */
const getAllList = (limitTo, region) => {
    let url = region ? `${REST_API_URL}/region/${region}?fields=name;flag;population;region;capital` : `${REST_API_URL}/all?fields=name;flag;population;region;capital`;

    axios.get(url)
        .then(response => {
            let data = response.data ? response.data : [];
            data = limitTo ? data.slice(0, limitTo) : data;

            let items = data.map(item => {
                return `<div class="homepage-item">
                    <div class="img-flag-holder">
                        <img src="${item.flag}" alt="${item.name}"/>
                    </div>
                    <div class="country-details-container">
                        <h3>${item.name}</h3>
                        <div class="info">
                            <p>
                                <span class="text-bolded">Population:</span> ${numbro(item.population).format({thousandSeparated: true})}
                            </p>
                            <p>
                                <span class="text-bolded">Region:</span> ${item.region}
                            </p>
                            <p>
                                <span class="text-bolded">Capital:</span> ${item.capital}
                            </p>
                        </div>
                    </div>
                </div>`;
            }).join("").trim();

            homepageItemList.innerHTML = items;
        })
        .catch(error => {
            console.log(error);
            let item = `<div class="homepage-error-msg">
                            <p>No results found</p>
                        </div>`;

            homepageItemList.innerHTML = item;
        });
}

const searchOnList = (keyword) => {
    axios.get(`${REST_API_URL}/name/${encodeURIComponent(keyword)}?fields=name;flag;alpha3Code;`)
        .then(response => {
            let data = response.data ? response.data : [];
            let items = data.map(item => {
                return `<a class="search-keyword-suggestion-item">
                    <div class="img-flag-search-holder">
                        <img src="${item.flag}" alt="${item.name}"/>
                    </div>
                    <div class="country-details-search-container" title="${item.name}">
                        ${item.alpha3Code}
                    </div>
                </a>`;
            }).join("").trim();
        })
        .catch(error => {
            console.log(error);
            let item = `<div class="search-suggestion-error-msg">
                            <p>No result found with current search keyword</p>
                        </div>`;
        });
}

const viewCountry = (country) => {
    axios.get(`${REST_API_URL}/name/${encodeURIComponent(country)}?fullText=true&fields=name;flag;nativeName;population;region;capital;subregion;topLevelDomain;currencies;languages;borders;`)
        .then(async (response) => {
            let data = response.data ? response.data[0] : [];
            let borders = data.borders;
            let codes = borders.length > 0 ? borders.join(";").toLowerCase() : null;
            let borderCountries = null;

            if (codes) {
                let listCountryNames = await axios.get(`${REST_API_URL}/alpha?codes=${codes}&fields=name`);
                borderCountries = listCountryNames.data.map(country => {
                    return `<div class="border-country-item">${country.name}</div>`;
                }).join("").trim();
            }

            let item = `<div class="detail-page-item">
                <div class="img-flag-holder">
                    <img src="${data.flag}" alt="${data.name}"/>
                </div>
                <div class="country-details-container">
                    <h2>${data.name}</h2>
                    <div class="info-row">
                        <div class="col">
                            <p>
                                <span class="text-bolded">Native Name:</span> ${data.nativeName}
                            </p>
                            <p>
                                <span class="text-bolded">Population:</span> ${numbro(data.population).format({thousandSeparated: true})}
                            </p>
                            <p>
                                <span class="text-bolded">Region:</span> ${data.region}
                            </p>
                            <p>
                                <span class="text-bolded">Sub Region:</span> ${data.subregion}
                            </p>
                            <p>
                                <span class="text-bolded">Capital:</span> ${data.capital}
                            </p>
                        </div>
                        <div class="col">
                            <p>
                                <span class="text-bolded">Top Level Domain:</span> ${data.topLevelDomain}
                            </p>

                            <p>
                                <span class="text-bolded">Currencies:</span> ${data.currencies}
                            </p>
                            <p>
                                <span class="text-bolded">Languages:</span> ${data.languages ? data.languages.join(", ") : "N/A"}
                            </p>
                        </div>
                    </div>
                    <div class="info-row>
                        <div class="border-countries-container">
                            <span class="text-bolded">Border Countries:</span>
                            ${borderCountries ? borderCountries : "N/A"}
                        </div>
                    </div>
                </div>
            </div>`;
        })
        .catch(error => {
            console.log(error);
            let item = `<div class="detail-page-error-msg">
                            <p>Country not found</p>
                        </div>`;
        });
}

/** DOM EVENTS */
document.querySelector("body").addEventListener("load", getAllList(DEFAULT_LIST_LIMIT, DEFAULT_FILTER_REGION));