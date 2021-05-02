'use strict';

const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.update = (event, context, callback) => {
    const timestamp = new Date().getTime();
    const data = JSON.parse(event.body);

    // Validación
    if (typeof data.checked !== 'boolean') {
        console.error('Validation Failed');
        callback(null, {
            statusCode: 400,
            headers: {'Content-Type': 'text/plain'},
            body: 'No se puede actualizar el elemento película.',
        });
        return;
    }

    const params = {
        TableName: 'swapi-films',
        Key: {
            id: event.pathParameters.id,
        },
        ExpressionAttributeNames: {
            '#film': 'film',
        },
        ExpressionAttributeValues: {
            ':film': data.film,
            ':checked': data.checked,
            ':updatedAt': timestamp,
        },
        UpdateExpression: 'SET #film = :film, checked = :checked, updatedAt = :updatedAt',
        ReturnValues: 'ALL_NEW',
    };

    // Actualizar dato a la base de datos
    dynamoDb.update(params, (error, result) => {
        // handle potential errors
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
            body: JSON.stringify(result.Attributes),
        };
        callback(null, response);
    });
};
