const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// ここで stackName を使用してファイルを作成します
rl.question('新しいスタックの名前を入力してください: ', (stackName) => {
    if (!/^[a-z0-9]+$/.test(stackName)) {
        console.log('スタック名は小文字英数字のみを使用できます。');
        rl.close();
        return;
    }

    // 新しいcdk.tsファイルを作成
    const cdkContent = `#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ${stackName.toUpperCase()}CdkStack } from '../lib/${stackName}/${stackName}-cdk-stack';

const app = new cdk.App();
new ${stackName.toUpperCase()}CdkStack(app, '${stackName.toUpperCase()}CdkStack', {});
`;
    fs.writeFileSync(path.resolve(__dirname, `../bin/${stackName}-cdk.ts`), cdkContent);

    // 新しいスタックファイルを作成
    const stackTemplate = `
import * as cdk from 'aws-cdk-lib';
import { aws_lambda as lambda } from 'aws-cdk-lib';
import { aws_apigateway as apigateway } from 'aws-cdk-lib';

export class ${stackName.toUpperCase()}CdkStack extends cdk.Stack {
    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // Lambda 関数の作成
        const lambdaFunction = new lambda.Function(this, 'get${stackName.toUpperCase()}', {
            runtime: lambda.Runtime.NODEJS_18_X,
            handler: 'index.handler',
            code: lambda.Code.fromAsset('lambda/${stackName}'),
        });

        // API Gateway の作成
        const api = new apigateway.RestApi(this, 'MyApi', {
            restApiName: 'My Service',
            description: 'This service serves as a backend for ...',
            deployOptions: {
                stageName: 'prod',
            },
        });

        // Lambda をバックエンドとするリソースの追加
        const lambdaIntegration = new apigateway.LambdaIntegration(lambdaFunction, {
            requestTemplates: { 'application/json': '{ "statusCode": "200" }' },
        });

        // API Gateway にリソースとメソッドを追加
        const lambdaResource = api.root.addResource('${stackName}');
        lambdaResource.addMethod('GET', lambdaIntegration);
    }
}
`;

    const stackDirPath = path.resolve(__dirname, `../lib/${stackName}`);
    if (!fs.existsSync(stackDirPath)) {
        fs.mkdirSync(stackDirPath);
    }
    fs.writeFileSync(
        path.resolve(__dirname, `../lib/${stackName}/${stackName}-cdk-stack.ts`),
        stackTemplate
    );

    // 新しいLambda関数ファイルを作成
    const lambdaTemplate = `
exports.handler = async function(event, context) {
    console.log("EVENT: \\n" + JSON.stringify(event, null, 2));
    return context.logStreamName;
}
`;

    const lambdaDirPath = path.resolve(__dirname, `../lambda/${stackName}`);
    if (!fs.existsSync(lambdaDirPath)) {
        fs.mkdirSync(lambdaDirPath);
    }
    fs.writeFileSync(path.resolve(__dirname, `../lambda/${stackName}/index.mjs`), lambdaTemplate);

    rl.close();
});
