const axios = require('axios');

module.exports = async function fetchData(url) {
    axios.interceptors.response.use(response => response, error => {
        if(error.response.status === 401) {
            console.log('401');
            res.send({ 
                code: '401',
                error
            })
        };
    });
    const res = await axios.get(url)
    const data =  await res.data;
    return data;
}