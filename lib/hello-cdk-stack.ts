import * as cdk from 'aws-cdk-lib';
import { aws_s3 as s3 } from 'aws-cdk-lib';

export class HelloCdkStack extends cdk.Stack {
    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        new s3.Bucket(this, 'MyFirstBucket', {
            versioned: true,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
        });
    }
}

// versioned: true：バージョニングを有効にして、バケット内のオブジェクトの各バージョンを保持します。
// removalPolicy: cdk.RemovalPolicy.DESTROY：スタックが削除されるときに、バケットも自動的に削除されるようにします。これは開発やテスト環境で役立つ設定ですが、本番環境では慎重に使用する必要があります。
// autoDeleteObjects: true：バケットを削除する際に、そのバケット内のオブジェクトも自動的に削除されるようにします。removalPolicy が DESTROY に設定されている場合に特に便利です。
