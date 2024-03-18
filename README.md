## AWS CDK ハンズオン

### 環境設定

[AWS CDK ツールキット (cdk コマンド）](https://docs.aws.amazon.com/ja_jp/cdk/v2/guide/cli.html)

```bash
npm install -g aws-cdk
```

[ブートストラップ](https://docs.aws.amazon.com/ja_jp/cdk/v2/guide/bootstrapping.html)（デプロイする環境を準備するコマンド。最初に 1 回だけ実行する必要がある）

```bash
cdk bootstrap aws://ACCOUNT-NUMBER-1/REGION-1
```

<br/>

### コマンド

```bash
# アプリケーションの開始
cdk init app --language typescript

# アプリケーションの構築
npm run build

# アプリケーション内のスタックを一覧表示
cdk ls

# CloudFormationテンプレートを作成
cdk synth

# CloudFormationテンプレートを作成（アセット（Lambda 関数のコードや Docker イメージなど）を S3 バケットにアップロード（ステージング）するプロセスがスキップ）
cdk synth --no-staging

# スタックをデプロイ
cdk deploy


# 変更の監視とコンパイル
npm run watch

# Jestのテストを実行
npm run test

# スタックの比較
cdk diff

# AWS SAMを利用したAPIエンドポイントの起動
sam local start-api -t ./cdk.out/HelloCdkStack.template.json

# AWS SAMを利用したLambda関数の実行
sam local invoke MyFunction --no-event -t ./cdk.out/HelloCdkStack.template.json

```

<br/>

### 参考資料

[AWS CDK とは](https://docs.aws.amazon.com/ja_jp/cdk/v2/guide/home.html)
[AWS CDK 概要 (Basic #1)【AWS Black Belt】](https://www.youtube.com/watch?v=BmCpa44rAXI)
