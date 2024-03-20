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
        // cdk synth コマンドを実行し、CloudFormation テンプレートを生成
        const { stderr: err1 } = await exec(`cdk synth --no-staging -a "npx ts-node ${filePath}"`);
        console.log(`Done ${filePath}`);
        console.error(`cdk synth err: ${err1}`);

        // API Gateway のエンドポイントを取得
        const { stderr: err2 } = await exec(
            `sam local start-api -t ./cdk.out/${file.toUpperCase()}CdkStack.template.json`
        );
        console.error(`start-api err: ${err2}`);
    } catch (err) {
        console.error(`exec error: ${err}`);
        rl.close();
    }
}

rl.question('APIエンドポイントを起動するスタックの名前を入力してください: ', (stackName) => {
    if (!/^[a-z0-9]+$/.test(stackName)) {
        console.log('スタック名は小文字英数字のみを使用できます。');
        rl.close();
        return;
    }
    runCommand(stackName);
    rl.close();
});
