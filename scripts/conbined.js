const fs = require('fs');
const path = require('path');

// テンプレートファイルのパスを指定します
const templatePaths = [
    './cdk.out/HelloCdkStack.template.json',
    './cdk.out/GoodbyeCdkStack.template.json',
];

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
