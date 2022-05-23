const AWS = require("aws-sdk");
const Loader = require('@aws-sdk/shared-ini-file-loader');

var log    = new utils.log.logger('AWS_IAM', 'DEBUG', 'logs/system.log');
var client = new AWS.IAM({apiVersion: '2010-05-08'});

var iam = {
  switch_profile: (profile) => {
    log.info(`Switching profile to ${profile}`);
    AWS.config.update({profile: profile});
  },
  get_local_profiles: async function() {
    await Loader.loadSharedConfigFiles().then((result) => {utils.aws.profiles = result.credentialsFile;});
  },
  get_profiles: async function() {
    log.info('Loading local profiles...');
    var local = await iam.get_local_profiles();
    while (!utils.aws?.profiles) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    for (const key in utils.aws.profiles) {
      log.debug(`Profile [${key}] found.`);
      utils.aws.profiles[key].name = key;
    }
  },
};
log.info('Initializing IAM module...');
utils.aws.profiles = iam.get_profiles();

module.exports = iam;