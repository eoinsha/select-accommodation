'use strict';

const {findAccommodation} = require('./lib/accommodation');

async function lookup({queryStringParameters: {county}}) {
  const result = await findAccommodation(county);
  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
}

module.exports = {lookup};
