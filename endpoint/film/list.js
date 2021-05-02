'use strict';

const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const params = {
    TableName: 'swapi-films',
};

module.exports.list = (event, context, callback) => {
    // Recuperar todos los datos de la base de datos
    dynamoDb.scan(params, (error, result) => {
        // Manejo de errores potenciales
        if (error) {
            console.error(error);
            callback(null, {
                statusCode: error.statusCode || 501,
                headers: {'Content-Type': 'text/plain'},
                body: 'No se ha podido recuperar los elementos películas.',
            });
            return;
        }

        const response = {
            statusCode: 200,
            body: JSON.stringify(result.Items),
        };
        callback(null, response);
    });
};
