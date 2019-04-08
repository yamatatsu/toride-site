import cdk = require("@aws-cdk/cdk")
import s3 = require("@aws-cdk/aws-s3")

const bucketName = process.env.BUCKET_NAME

export class AwsStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    new s3.Bucket(this, "Bucket", {
      bucketName,
    })

    // The code that defines your stack goes here
  }
}
