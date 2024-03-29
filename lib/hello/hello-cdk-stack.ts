import * as cdk from 'aws-cdk-lib';
import { aws_s3 as s3 } from 'aws-cdk-lib';
import { aws_lambda as lambda } from 'aws-cdk-lib';
import { aws_apigateway as apigateway } from 'aws-cdk-lib'; // API Gateway をインポート

export class HelloCdkStack extends cdk.Stack {
    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // S3 バケットの作成
        // const bucket = new s3.Bucket(this, 'MyFirstBucket', {
        //     versioned: true,
        //     removalPolicy: cdk.RemovalPolicy.DESTROY,
        //     autoDeleteObjects: true,
        // });

        // Lambda 関数の作成
        const lambdaFunction = new lambda.Function(this, 'MyFunctionHello', {
            runtime: lambda.Runtime.NODEJS_18_X,
            handler: 'index.handler',
            code: lambda.Code.fromAsset('lambda/hello'),
        });

        // API Gateway の作成
        const api = new apigateway.RestApi(this, 'MyApi', {
            restApiName: 'My Service',
            description: 'This service serves as a backend for ...',
            deployOptions: {
                stageName: 'prod', // デプロイステージの設定
            },
        });

        // Lambda をバックエンドとするリソースの追加
        const lambdaIntegration = new apigateway.LambdaIntegration(lambdaFunction, {
            requestTemplates: { 'application/json': '{ "statusCode": "200" }' },
        });

        // API Gateway にリソースとメソッドを追加
        const lambdaResource = api.root.addResource('hello');
        lambdaResource.addMethod('GET', lambdaIntegration); // GET リクエストを Lambda 関数に紐付け
    }
}

// versioned: true：バージョニングを有効にして、バケット内のオブジェクトの各バージョンを保持します。
// removalPolicy: cdk.RemovalPolicy.DESTROY：スタックが削除されるときに、バケットも自動的に削除されるようにします。これは開発やテスト環境で役立つ設定ですが、本番環境では慎重に使用する必要があります。
// autoDeleteObjects: true：バケットを削除する際に、そのバケット内のオブジェクトも自動的に削除されるようにします。removalPolicy が DESTROY に設定されている場合に特に便利です。
