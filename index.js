const express    = require('express');
const app        = express();
const { engine } = require('express-handlebars');
require('./lib/utils.js');

var log = new utils.log.logger('SYSMAIN', 'DEBUG', 'logs/system.log');
log.debug('Testing DEBUG System');
log.info('Testing INFO Network');
log.warn('Testing Early WARN System');
log.error('Testing PANIC Stations.');
const port = 3000;

app.set('view engine', 'hbs');
app.use(express.static(__dirname));

//Set handlebars configuration
app.engine('hbs', engine({
  layoutsDir:    __dirname + '/views/layouts',
  extname:       'hbs',
  defaultLayout: 'main',
  partialsDir:   __dirname + '/views/partials/',
  helpers:       utils.hbs.helpers,
}));



app.listen(port, () => {
  log.notice(`Application started. Running on {{cyan}}http://localhost:${port}`);
});

function load_pages() {
  app.get('/', (req, res) => {
    res.render('landing', {layout: 'index', profiles: utils.aws.profiles});
    load_pages();
  });
  for (const key in utils.aws.profiles) {
    if (Object.hasOwnProperty.call(utils.aws.profiles, key)) {
      if (!(utils.aws.profiles[key]?.s3)) utils.aws.s3._init(key);
      app.get(`/${key}`, function(req, res) {
        utils.aws.iam.switch_profile(key);
        res.render('main', {layout: 'index', account: utils.aws.profiles[key], profiles: utils.aws.profiles});
      });
    }
  }
}

load_pages();