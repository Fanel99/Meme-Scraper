import fs from 'node:fs';
import axios from 'axios';
import { JSDOM } from 'jsdom';
import request from 'request';

// Remove directory which is not empty (the recursive option deletes the entire directory recursively)
fs.rmdirSync('memes', { recursive: true });
axios
  .get('https://memegen-link-examples-upleveled.netlify.app/')
  .then(async (response) => {
    // Get back an JSDOM Object
    const newJsDom = new JSDOM(response.data);

    // getting   pictures
    const memes = newJsDom.window.document.querySelectorAll('img');

    let dir = 'memes';

    // Checking for dir, if not exist just create one
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    for (let i = 0; i < 10; i++) {
      const sourceForPipe = memes[i].getAttribute('src');
      // console.log(sourceForPipe);
      request(sourceForPipe).pipe(
        fs.createWriteStream(dir + `/img_${i + 1}.jpg`),
      );
    }
  });
