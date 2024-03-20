const fs = require('fs');
const path = require('path');

// ./cdk.out/ ディレクトリ下のすべての *.template.json ファイルを取得します
const templateFiles = fs
    .readdirSync('./cdk.out/')
    .filter((file) => file.endsWith('.template.json'));
const templatePaths = templateFiles.map((file) => `./cdk.out/${file}`);

let combinedTemplate = {
    Resources: {},
};

templatePaths.forEach((templatePath) => {
    const template = JSON.parse(fs.readFileSync(path.resolve(__dirname, templatePath), 'utf8'));
    combinedTemplate.Resources = { ...combinedTemplate.Resources, ...template.Resources };
});

fs.writeFileSync(
    './cdk.out/CombinedStack.template.json',
    JSON.stringify(combinedTemplate, null, 2)
);
