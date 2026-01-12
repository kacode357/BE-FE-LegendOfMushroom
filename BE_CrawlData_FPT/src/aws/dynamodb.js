const { DynamoDBClient, DescribeTableCommand } = require("@aws-sdk/client-dynamodb");

function getAwsRegion() {
  return (
    process.env.AWS_REGION ||
    process.env.AWS_DEFAULT_REGION ||
    process.env.AMAZON_REGION ||
    "ap-southeast-1"
  );
}

function isDynamoEnabled() {
  return Boolean(String(process.env.DYNAMODB_TABLE_NAME || "").trim());
}

function getDynamoClient() {
  return new DynamoDBClient({
    region: getAwsRegion(),
  });
}

async function describeConfiguredTable() {
  const tableName = String(process.env.DYNAMODB_TABLE_NAME || "").trim();
  if (!tableName) {
    return { enabled: false };
  }

  const client = getDynamoClient();
  const out = await client.send(new DescribeTableCommand({ TableName: tableName }));

  return {
    enabled: true,
    tableName,
    tableStatus: out?.Table?.TableStatus,
    arn: out?.Table?.TableArn,
    itemCount: out?.Table?.ItemCount,
  };
}

module.exports = {
  isDynamoEnabled,
  describeConfiguredTable,
};
