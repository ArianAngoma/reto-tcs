'use strict';

const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.delete = (event, context, callback) => {
    const params = {
        TableName: 'swapi-films',
        Key: {
            id: event.pathParameters.id,
        },
    };

    // Eliminar dato de la base de datos
    dynamoDb.delete(params, (error) => {
        // Manejo de errores potenciales
        if (error) {
            console.error(error);
            callback(null, {
                statusCode: error.statusCode || 501,
                headers: {'Content-Type': 'text/plain'},
                body: 'No se puede eliminar el elemento película.',
            });
            return;
        }

        const response = {
            statusCode: 200,
            body: JSON.stringify({}),
        };
        callback(null, response);
    });
};
