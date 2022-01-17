const randomBytes = require('crypto').randomBytes;
const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-2'});

exports.handler = (event, context, callback) => {

    const logId = randomBytes(16);
    console.log('Received event (', logId, ') : ', event);

    var params  = generateParams(event.toAddress);
    sendEmail(params).then(() => {
        callback(null, {
            statusCode: 201,
            body: JSON.stringify({
                logID: logId.toString("hex"),
                status: 'Success'
            }),
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        });
    }).catch((err) => {
        console.error(err);
        callback(null, {
          statusCode: 501,
          body: JSON.stringify({
            logID: logId.toString("hex"),
            status: 'Failed'
          }),
          headers: {
              'Access-Control-Allow-Origin': '*',
          },
        });
    });    
};

function sendEmail(params){
  console.info("Parms Generated : ", params);
  return new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();
}


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