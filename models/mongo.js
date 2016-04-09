var mongodb = require('mongodb');

function getMongoConnection() {
	
	return new mongodb.Db('smartcity', new mongodb.Server(
			'ds021000.mlab.com', 21000, {
				auto_reconnect : true
			}), {});
}

exports.getMongoConnection = getMongoConnection;