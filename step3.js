const fs = require('fs')

const process = require('process')

const axios = require('axios')

let path;
let out;

function cat(path, out) {
    fs.readFile(path, 'utf8', function (err, data) {
        if (err) {
            console.error(`Error reading ${path}: ${err}`);
            process.exit(1);
        } else {
            handleOut(data, out);
        }
    });
}



async function webCat(URL, out) {
    try {
        let resp = await axios.get(URL)
        handleOut(resp.data, out)
    } catch (err) {
        console.error(`Error fetching ${URL}: ${err}`)
        process.exit(1)
    }
}



let handleOut = (text, out) => {
    if (out) {
        fs.writeFile(out, text, 'utf8', function (err) {
            if (err) {
                console.error(`couldn't write ${out}: ${err}`)
                process.exit(1)
            }
        })
    } else {
        console.log(text)
    }
}

if (process.argv[2] === '--out') {
    out = process.argv[3]
    path = process.argv[4]
} else {
    path = process.argv[2]
}

if (path.slice(0, 4) === 'http') {
    webCat(path, out);
} else {
    cat(path, out);
}