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

    const dir = 'memes';

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

    async function main() {
      /* using 20 to make the progress bar length 20 charactes, multiplying by 5 below to arrive to 100 */

      function wait(ms) {
        return new Promise((res) => setTimeout(res, ms));
      }
      for (let i = 0; i <= 20; i++) {
        const dots = '.'.repeat(i);
        const left = 20 - i;
        const empty = ' '.repeat(left);

        /* need to use  `process.stdout.write` becuase console.log print a newline character */
        /* \r clear the current line and then print the other characters making it looks like it refresh*/
        process.stdout.write(`\r[${dots}${empty}] ${i * 5}%`);
        await wait(80);
      }
    }
    main();
  });
