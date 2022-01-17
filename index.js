exports.handler = (event, context, callback) => {

    const logId = randomBytes(16);
    console.log('Received event (', logId, '): ', event);

    recordRide(logId, response).then(() => {
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