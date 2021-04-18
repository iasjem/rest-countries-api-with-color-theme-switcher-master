/** CONSTANTS */
const REST_API_URL = "https://restcountries.eu/rest/v2/all";

/** API CALL */
axios.get(REST_API_URL)
    .then(response => {
        let data = response.data;
        console.log(data);
    })
    .catch(error => {
        console.log(error);
    });