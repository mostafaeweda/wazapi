var cf = require('cloudfoundry');
var settings = {
    'user' : 'yourname@localhost',
	'sessionSecret': 'sessionSecret'
    , 'internal_host' : '127.0.0.1'
    , 'internal_port' : 3000
	, 'port': 3000
	, 'uri': 'http://wazapi.dev:3000' // Without trailing /
    , 'redisOptions': {host: '127.0.0.1', port: 6379}
    , 'mongoUrl': 'mongodb://localhost/mongodb-wazapi'
	// You can add multiple recipients for notifo notifications
	, 'notifoAuth': null /*[
		{
			'username': ''
			, 'secret': ''
		}
	]*/


	// Enter API keys to enable auth services, remove entire object if they aren't used.
	, 'external': {
		'facebook': {
			appId: "278100548945916",
			appSecret: "c0978e40fab68b6b70751df882fcbce8"
		}
		, 'google': {
			clientId: "821590616390.apps.googleusercontent.com",
			clientSecret: "qtb4AA90N7zkMVDeEcJyXoXk"
		}
		, 'amazon': {
			awsId:     'AKIAIXR4XNCZ3OLY632Q',
  		awsSecret: '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',
  		assocId:   'wazapi-20',
		}
		, 'github': {
			appId: process.env.github_client_id,
			appSecret: process.env.github_client_secret
		}
	},

	per_page: 9,

	'debug': cf.cloud
};

if (cf.cloud) {
	settings.uri = 'http://' + cf.app.name + '.cloudfoundry.com';
    settings.internal_host = cf.host;
    settings.internal_port = cf.port;
	settings.port = 80; // CloudFoundry uses process.env.VMC_APP_PORT

	settings.airbrakeApiKey = process.env.airbrake_api_key; // Error logging, Get free API key from https://airbrakeapp.com/account/new/Free

    if (cf.redis['redis-wazapi'] != null) {
        var redisConfig = cf.redis['redis-wazapi'].credentials;
        settings.redisOptions.port = redisConfig.port;
        settings.redisOptions.host = redisConfig.hostname;
        settings.redisOptions.pass = redisConfig.password;
        console.log("Redis options are");
        console.dir(settings.redisOptions);
    }

    if (cf.mongodb['mongo-wazapi']) {
        var cfg = cf.mongodb['mongo-wazapi'].credentials;
        settings.mongoUrl = ["mongodb://", cfg.username, ":", cfg.password, "@", cfg.hostname, ":", cfg.port,"/" + cfg.db].join('');
    }
    settings.user_email = cf.app['users'][0];
}
module.exports = settings;
