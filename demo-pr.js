/* NodeJS version */
//uses the `request` package which makes working with Node's native http methods easier
import request from "request";
import https from 'https';
import fetch from 'node-fetch';

var requestAsync = function (url) {
    return new Promise((resolve, reject) => {
        var req = request(url, (err, response, body) => {
            const urlRes = fetchUrlData(url);
            if (urlRes) {
                if (err) return reject(err, response, body);
                resolve(JSON.stringify(body, 4));
            } else {
                reject(err, response);
            }
        });
    });
};

async function fetchUrlData(req_url) {
    try {
        const reponse = await fetch(req_url); // Fetch the resource
        const text = await reponse.text(); // Parse it as text
        const data = JSON.parse(text); // Try to parse it as json
        const verifyJson = isJsonStringified(data);
        if (verifyJson) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        // This probably means your response is text, do you text handling here
        console.log(err);
    }
}
const isJsonStringified = (value) => {
    try {
        if (value) {
            JSON.stringify(value, 4);
        } else {
            return false;
        }
    } catch (err) {
        return err;
    }
    return true;
};


/* Works as of Node 12.6 */
module.exports = async function getParallel(urlArray = []) {
    //transform requests into Promises, await all
    try {
        if (urlArray.length != 0) {
            console.log(urlArray);
            var workingURLs = [];
            var brokenURLs = [];
            var promises = urlArray.map(url => validateUrl(url)
                .then(res => (res ? workingURLs : brokenURLs).push(url)));
                
            // console.log(promises);
            const test = await Promise.all(promises)
            console.log(test);

            console.log("workingURLs =", workingURLs, "brokenURLs", brokenURLs);
            const dataValue = await Promise.all(workingURLs.map(requestAsync));
            console.log(dataValue);

        } else {
            throw new Error("Invalid Data");
        }
    } catch (err) {
        console.error(err);
    }
}

// ----Check if url is valid or not
function validateUrl(url) {
    return new Promise((ok, fail) => {
        https.get(url, res => { return ok(res.statusCode == 200) })
            .on('error', e => ok(false));
    });
}