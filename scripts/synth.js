const util = require('util');
const exec = util.promisify(require('child_process').exec);
const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

async function runCommand(file) {
    const filePath = `./bin/${file}-cdk.ts`;

    try {
        const { stderr } = await exec(`cdk synth --no-staging -a "npx ts-node ${filePath}"`);
        console.log(`Done ${filePath}`);
        console.error(`stderr: ${stderr}`);
    } catch (err) {
        console.error(`exec error: ${err}`);
        rl.close();
    }
}

rl.question('APIエンドポイントを起動するスタックの名前を入力してください: ', (stackName) => {
    if (!/^[a-zA-Z0-9]+$/.test(stackName)) {
        console.log('スタック名は英数字のみを使用できます。');
        rl.close();
        return;
    }
    runCommand(stackName);
    rl.close();
});
