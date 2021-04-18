/** CONSTANTS */
const REST_API_URL = "https://restcountries.eu/rest/v2";

/** API CALLS */
const getAllList = (limitTo, region) => {
    let url = region ? `${REST_API_URL}/region/${region}?fields=name;flag;population;region;capital` : `${REST_API_URL}/all?fields=name;flag;population;region;capital`;

    axios.get(url)
        .then(response => {
            let data = response.data ? response.data : [];
            data = limitTo ? data.slice(0, limitTo) : data
            console.log(data)
        })
        .catch(error => {
            console.log(error);
        });
}

const searchOnList = (keyword) => {
    axios.get(`${REST_API_URL}/name/${encodeURIComponent(keyword)}?fields=name;flag;alpha3Code;`)
        .then(response => {
            let data = response.data ? response.data : [];
            console.log(data)
        })
        .catch(error => {
            console.log(error);
        });
}

const viewCountry = (country) => {
    axios.get(`${REST_API_URL}/name/${encodeURIComponent(country)}?fullText=true&fields=name;flag;nativeName;population;region;capital;subregion;topLevelDomain;currencies;languages;borders;`)
        .then(async (response) => {
            let data = response.data ? response.data : [];
            let borders = data[0].borders;
            let codes = borders.length > 0 ? borders.join(";").toLowerCase() : null;

            if (codes) {
                let listCountryNames = await axios.get(`${REST_API_URL}/alpha?codes=${codes}&fields=name`);
                let borderCountries = listCountryNames.data.map(country => country.name);
                console.log(borderCountries)
            }

        })
        .catch(error => {
            console.log(error);
        });
}