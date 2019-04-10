const requestPromise = require("request-promise

const url = process.env.NETLIFY_BUILD_WEBHOOK_URL

exports.handler = async event => {
  console.info(JSON.stringify(event))

  if (!url) new Error("NETLIFY_BUILD_WEBHOOK_URL が空っぽ！！！")

  const result = await requestPromise({
    url,
    method: "POST",
    json: true,
    body: {},
  }).promise()

  console.info(result)
}
