exports.handler = (event, context, callback) => {
    // if (!event.requestContext.authorizer) {
    //   errorResponse('Authorization not configured', context.awsRequestId, callback);
    //   return;
    // }

    const logId = randomBytes(16);
    console.log('Received event (', logId, '): ', event);

    // Because we're using a Cognito User Pools authorizer, all of the claims
    // included in the authentication token are provided in the request context.
    // This includes the username as well as other attributes.
    // const username = event.requestContext.authorizer.claims['cognito:username'];
    
    // The body field of the event in a proxy integration is a raw string.
    // In order to extract meaningful values, we need to first parse this string
    // into an object. A more robust implementation might inspect the Content-Type
    // header first and use a different parsing strategy based on that value.

    recordRide(logId, response).then(() => {
        // You can use the callback function to provide a return value from your Node.js
        // Lambda functions. The first parameter is used for failed invocations. The
        // second parameter specifies the result data of the invocation.

        // Because this Lambda function is called by an API Gateway proxy integration
        // the result object must use the following structure.
        callback(null, {
            statusCode: 201,
            body: JSON.stringify({
                logID: logId.toString("hex"),
                representatives: response.representative
            }),
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        });
    }).catch((err) => {
        console.error(err);

        // If there is an error during processing, catch it and return
        // from the Lambda function successfully. Specify a 500 HTTP status
        // code and provide an error message in the body. This will provide a
        // more meaningful error response to the end client.
        errorResponse(err.message, context.awsRequestId, callback)
    });

    
};


function generateParams(toAddresses, ccAddresses='scldeveloper1@gmail.com', replyToAddresses='austin.puthen@pace.edu') {
    const sourceEmailID = 'austin.puthen@pace.edu'; // This email needs to be verified at AWS SNS
    var params = {
        Source: sourceEmailID, /* required */
        ReplyToAddresses: [
            replyToAddresses,
            /* more items */
        ],
        Destination: { /* required */
          ToAddresses: [
            toAddresses,
            /* more items */
          ],
          CcAddresses: [
            ccAddresses,
            /* more items */
          ]
        },
        Message: { /* required */
          Body: { /* required */
            // Html: {
            //  Charset: "UTF-8",
            //  Data: "HTML_FORMAT_BODY"
            // },
            Text: {
             Charset: "UTF-8",
             Data: "Welcome to Email Services BY SCL !"
            }
           },
           Subject: {
            Charset: 'UTF-8',
            Data: 'Email Service SCL | Delete me'
           }
        }
    };
      return params;
}