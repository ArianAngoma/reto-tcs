'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');

// Dependencia para la integración con SWAPI
const swapi = require('swapi-node');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
    const timestamp = new Date().getTime();

    // Recuperación de datos de la API SWAPI - PERSON
    swapi.getPerson(event.pathParameters.id).then((star) => {
        console.log(star)
        const params = {
            TableName: 'swapi-person',
            Item: {
                id: uuid.v1(),
                star,
                checked: false,
                createdAt: timestamp,
                updatedAt: timestamp,
            },
        };

        // Escribir dato en la base de datos
        dynamoDb.put(params, (error) => {
            // Manejo de errores potenciales
            if (error) {
                console.error(error);
                callback(null, {
                    statusCode: error.statusCode || 501,
                    headers: {'Content-Type': 'text/plain'},
                    body: 'No se puede crear el elemento persona.',
                });
                return;
            }

            const response = {
                statusCode: 200,
                body: JSON.stringify(params.Item),
            };
            callback(null, response);
        });
    });
};
