'use strict';

const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const SELECT_PARAMS = {
  Bucket: process.env.BUCKET_NAME,
  Key: process.env.CSV_FILE,
  ExpressionType: 'SQL',
  InputSerialization: {CSV: {FileHeaderInfo: 'USE', RecordDelimiter: '\r\n'}},
  OutputSerialization: {JSON: {RecordDelimiter: '\n'}},
};

async function findAccommodation(county) {
  const response = await s3
    .selectObjectContent({
      ...SELECT_PARAMS,
      Expression: `SELECT * FROM S3Object s WHERE s.AddressRegion = '${county}'`,
    })
    .promise();

  let result = '';
  for await (const event of response.Payload) {
    if (event.Records) {
      result += event.Records['Payload'].toString();
    }
  }
  return result
    .trim()
    .split('\n')
    .map(JSON.parse);
}

module.exports = {findAccommodation};
