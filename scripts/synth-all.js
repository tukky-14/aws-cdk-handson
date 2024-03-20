const fs = require('fs');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function runCommands(files) {
    for (const file of files) {
        if (path.extname(file) === '.ts') {
            const filePath = `./bin/${file}`;

            try {
                const { stdout, stderr } = await exec(
                    `cdk synth --no-staging -a "npx ts-node ${filePath}"`
                );

                console.log(`Done ${filePath}`);
                console.error(`stderr: ${stderr}`);
            } catch (err) {
                console.error(`exec error: ${err}`);
            }
        }
    }
}

fs.readdir('./bin', (err, files) => {
    if (err) throw err;

    runCommands(files);
});
