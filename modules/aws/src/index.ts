import "source-map-support/register"
import cdk = require("@aws-cdk/cdk")
import s3 = require("@aws-cdk/aws-s3")
import lambda = require("@aws-cdk/aws-lambda")
import cognito = require("@aws-cdk/aws-cognito")

const bucketName = process.env.BUCKET_NAME
const NETLIFY_BUILD_WEBHOOK_URL = process.env.NETLIFY_BUILD_WEBHOOK_URL

export class AwsStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const s3Bucket = new s3.Bucket(this, "Bucket", { bucketName })

    const lambdaHookNetlifyBuild = new lambda.Function(
      this,
      "HookNetlifyBuild",
      {
        code: new lambda.AssetCode(__dirname + "/../lambda"),
        handler: "hookNetlifyBuild.handler",
        runtime: lambda.Runtime.NodeJS810,
        environment: {
          NETLIFY_BUILD_WEBHOOK_URL,
        },
      },
    )

    s3Bucket.onEvent(s3.EventType.ObjectCreated, lambdaHookNetlifyBuild, {
      prefix: "content",
    })

    const adminPool = new cognito.UserPool(this, "AdminPool", {
      signInType: cognito.SignInType.Email,
    })
    const adminPoolClient = new cognito.UserPoolClient(
      this,
      "AdminPoolClient",
      { userPool: adminPool },
    )
    // FIXME: refactor to no cfn
    const adminIdentityPool = new cognito.CfnIdentityPool(
      this,
      "CfnIdentityPool",
      {
        allowUnauthenticatedIdentities: false, // サインアップ機能を作らない予定
        cognitoIdentityProviders: [
          {
            clientId: adminPoolClient.clientId,
            providerName: adminPool.userPoolProviderName,
          },
        ],
      },
    )

    new cdk.CfnOutput(this, "adminPoolUserPoolId", {
      value: adminPool.userPoolId,
    })
    new cdk.CfnOutput(this, "adminPoolClientClientId", {
      value: adminPoolClient.clientId,
    })
    new cdk.CfnOutput(this, "adminIdentityPoolIdentityPoolId", {
      value: adminIdentityPool.identityPoolId,
    })
  }
}

const app = new cdk.App()
new AwsStack(app, "TorideKosodateMatome")
