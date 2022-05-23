const AWS = require("aws-sdk");

var log    = new utils.log.logger('AWS_S3', 'DEBUG', 'logs/system.log');

var s3 = {
  client: new AWS.S3({apiVersion: '2006-03-01'}),
  refresh_buckets: async function(profile) {
    await s3.client.listBuckets(function(err, data) {
      if (err) return false;
      utils.aws.profiles[profile].s3.buckets = {};
      for (let i = 0; i < data.Buckets.length; i++) {
        const bkt = data.Buckets[i];
        if (!(utils.aws.profiles[profile].s3.buckets?.[bkt.Name])) {
          utils.aws.profiles[profile].s3.buckets[bkt.Name] = {
            name: bkt.Name,
            open: false,
            date: bkt.CreationDate,
            cont: {
              refresh: false,
            },
          };
          log.debug(`${bkt.Name} added.`);
        }else{

        }
      }
      utils.aws.profiles[profile].s3.refresh = false;
    });
  },
  _init: async function(profile) {
    var list = utils.aws.s3.refresh_buckets(profile);
    if (!(utils.aws.profiles[profile]?.s3)) utils.aws.profiles[profile].s3 = {buckets: [], refresh: false};
    utils.aws.profiles[profile].s3.refresh = true;
    while (utils.aws.profiles[profile].s3.refresh) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    for (let i = 0; i < list.length; i++) {
      var bucket  = list[i];
      bucket.open = false;
      bucket.cont = [];
    }
    return list;
  },
};

log.info('Initializing S3 module...');
module.exports = s3;