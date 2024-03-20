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
        const { stderr } = await exec(`cdk synth --no-staging -a "npx ts-node ${filePath}"`);
        console.log(`${filePath}をベースにCLoudFormationテンプレートを生成しました。\n`);
        if (stderr.length > 2) {
            console.error(`cdk synth err: ${stderr}`);
            return;
        }
        console.log(
            `【Lambda関数を実行するコマンド】\nsam local invoke -e events/event.json -t ./cdk.out/${file.toUpperCase()}CdkStack.template.json\n`
        );
        console.log(
            `【APIエンドポイントを起動するコマンド】\nsam local start-api -t ./cdk.out/${file.toUpperCase()}CdkStack.template.json\n`
        );
    } catch (err) {
        console.error(`exec error: ${err}`);
        rl.close();
    }
}

rl.question('CloudFormationテンプレートを作成するスタック名を入力してください: ', (stackName) => {
    if (!/^[a-z0-9]+$/.test(stackName)) {
        console.log('スタック名は小文字英数字のみを使用できます。');
        rl.close();
        return;
    }
    runCommand(stackName);
    rl.close();
});
