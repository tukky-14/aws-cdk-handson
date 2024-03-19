const fs = require('fs');
const path = require('path');

// 新しいスタックの名前を指定します
const stackName = 'stack';

// -------------------------------------------
// cdk.ts ファイルの内容を定義
// -------------------------------------------
const cdkContent = `
#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ${stackName.toUpperCase()}CdkStack } from '../lib/${stackName}/${stackName}-cdk-stack';

const app = new cdk.App();
new ${stackName.toUpperCase()}CdkStack(app, 'HelloCdkStack', {});
`;
fs.writeFileSync(path.resolve(__dirname, 'bin/hello-cdk.ts'), cdkContent);

// -------------------------------------------
// 新しいスタックのテンプレートを作成
// -------------------------------------------
const stackTemplate = `
import * as cdk from 'aws-cdk-lib';
import { aws_lambda as lambda } from 'aws-cdk-lib';
import { aws_apigateway as apigateway } from 'aws-cdk-lib';

export class ${stackName.toUpperCase()} extends cdk.Stack {
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
        lambdaResource.addMethod('GET', lambdaIntegration); // GET リクエストを Lambda 関数に紐付け
    }
}
`;
fs.writeFileSync(path.resolve(__dirname, `${stackName}.ts`), stackTemplate);

// -------------------------------------------
// Lambda関数とディレクトリの作成
// -------------------------------------------
const lambdaTemplate = `
exports.handler = async function(event, context) {
    console.log("EVENT: \\n" + JSON.stringify(event, null, 2));
    return context.logStreamName;
}
`;

fs.mkdirSync(path.resolve(__dirname, 'lambda'));
fs.writeFileSync(path.resolve(__dirname, `lambda/${stackName}/index.mjs`), lambdaTemplate);
