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

### 基本コマンド

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

# スタックの比較
cdk diff

# AWS SAMを利用したAPIエンドポイントの起動
sam local start-api -t ./cdk.out/HelloCdkStack.template.json

# AWS SAMを利用したLambda関数の実行
sam local invoke MyFunction --no-event -t ./cdk.out/HelloCdkStack.template.json

```

<br/>

### 自作コマンド

```bash
# 新規スタック追加のために以下3ファイルを作成する
# bin/xxx-cdk.ts
# lib/xxx/xxx-cdk-stack.ts
# lambda/xxx/indes.mjs
npm run add-stack

# 特定のスタックのCloudFormationテンプレートを作成する
npm run synth

# binフォルダ内定義のすべてのスタックのCloudFormationテンプレートを作成する
npm run synth-all

# cdk.outフォルダ内に作成したCLoudFormationテンプレートを結合する
npm run stack-combine
```

<br/>

### 参考資料

[AWS CDK とは](https://docs.aws.amazon.com/ja_jp/cdk/v2/guide/home.html)
[AWS CDK 概要 (Basic #1)【AWS Black Belt】](https://www.youtube.com/watch?v=BmCpa44rAXI)
