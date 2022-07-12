"use strict";

const FCClient = require("@alicloud/fc2");

const {
  ACCOUNT_ID,
  ACCESS_KEY_ID,
  ACCESS_KEY_SECRET,
  REGION_ID,
  SERVICE_NAME,
  FUNCTION_NAME,
} = process.env;

exports.handler = async (event, context, callback) => {
  const client = new FCClient(ACCOUNT_ID, {
    accessKeyID: ACCESS_KEY_ID,
    accessKeySecret: ACCESS_KEY_SECRET,
    region: REGION_ID,
    timeout: 10000000,
  });
  try {
    const { data } = await client.getFunction(SERVICE_NAME, FUNCTION_NAME);
    data.customContainerConfig.image = `${
      data.customContainerConfig.image.split(":")[0]
    }:${JSON.parse(event.toString()).data.body.push_data.tag}`;
    console.log(
      `Updating function with image ${data.customContainerConfig.image}`
    );
    await client.updateFunction(SERVICE_NAME, FUNCTION_NAME, data);
    callback(null, "function updated");
  } catch (error) {
    console.log(error);
    callback("failed to update function", null);
  }
};
