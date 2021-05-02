'use strict';

const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.get = (event, context, callback) => {
    const params = {
        TableName: 'swapi-films',
        Key: {
            id: event.pathParameters.id,
        },
    };

    // Recuperar dato de la base de datos
    dynamoDb.get(params, (error, result) => {
        // Manejo de errores potenciales
        if (error) {
            console.error(error);
            callback(null, {
                statusCode: error.statusCode || 501,
                headers: {'Content-Type': 'text/plain'},
                body: 'No se ha podido recuperar el elemento película.',
            });
            return;
        }

        const response = {
            statusCode: 200,
            body: JSON.stringify(result.Item),
        };
        callback(null, response);
    });
};
