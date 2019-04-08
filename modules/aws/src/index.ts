import "source-map-support/register"
import cdk = require("@aws-cdk/cdk")
import { AwsStack } from "./aws-stack"

const app = new cdk.App()
new AwsStack(app, "TorideKosodateMatome")
