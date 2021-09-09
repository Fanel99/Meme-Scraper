const fs = require('node:fs');
const { JSDOM } = require('jsdom');
const axios = require('axios');
const request = require('request');

// Remove directory which is not empty (the recursive option deletes the entire directory recursively)
fs.rmdirSync('memes', { recursive: true });

axios
  .get('https://memegen-link-examples-upleveled.netlify.app/')

  .then(async (response) => {
    // Get back an JSDOM Object
    const dom = new JSDOM(response.data);

    // getting   pictures
    const memes = dom.window.document.querySelectorAll('img');

    // Creating new  folder
    fs.mkdirSync('./memes');

    // looping thru data
    for (let i = 0; i < 10; i++) {
      const source = memes[i].getAttribute('src');

      // brings the memes in .jpg and add names
      request(source).pipe(
        fs.createWriteStream(`${__dirname}/memes/img_${i + 1}.jpg`),
      );
    }
  });
