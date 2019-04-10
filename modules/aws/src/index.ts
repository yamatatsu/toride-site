import "source-map-support/register"
import cdk = require("@aws-cdk/cdk")
import s3 = require("@aws-cdk/aws-s3")
import lambda = require("@aws-cdk/aws-lambda")

const bucketName = process.env.BUCKET_NAME
const NETLIFY_BUILD_WEBHOOK_URL = process.env.NETLIFY_BUILD_WEBHOOK_URL

export class AwsStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const s3Bucket = new s3.Bucket(this, "Bucket", {
      bucketName,
    })

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
        // timeout?: number,
        // functionName: string,
        // memorySize?: number,
        // initialPolicy?: iam.PolicyStatement[],
        // role?: iam.IRole,
        // vpc?: ec2.IVpcNetwork,
        // vpcSubnets?: ec2.SubnetSelection,
        // securityGroup?: ec2.ISecurityGroup,
        // allowAllOutbound?: boolean,
        // deadLetterQueueEnabled?: boolean,
        // deadLetterQueue?: sqs.IQueue,
        // tracing?: Tracing,
        // layers?: ILayerVersion[],
        // reservedConcurrentExecutions?: number,
        // events?: IEventSource[],
        // logRetentionDays?: logs.RetentionDays,
      }
    )

    s3Bucket.onEvent(s3.EventType.ObjectCreated, lambdaHookNetlifyBuild, {
      prefix: "content",
    })
  }
}

const app = new cdk.App()
new AwsStack(app, "TorideKosodateMatome")
