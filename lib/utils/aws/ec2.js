const AWS = require("aws-sdk");

var log   = new utils.log.logger('AWS_EC2', 'DEBUG', 'logs/system.log');

var ec2 = {
    client: new AWS.EC2({apiVersion: '2016-11-15'}),

};

log.info('Initializing EC2 module...');
module.exports = ec2;