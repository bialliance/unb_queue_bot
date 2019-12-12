var https = require('https');
var querystring = require('querystring');
// var req = require('request');
// const axios = require('axios')

module.exports = class Blockchain {

	// uint256 _date, string memory _oyName, uint256 _oyId, uint256 _userId, string memory _userName, string memory _status, uint256 _statusDate, string memory _comment
	constructor(url, login, password) {
		this.url = url;
		this.login = login;
		this.password = password;
	}

	async call(data) {
		return new Promise((resolve, reject) => {
			var postData = querystring.stringify(data);
			// console.log(data);
			// console.log(postData);
			// request option
			var options = {
				host: 'unb.uz',
				port: 443,
				method: 'POST',
				path: '/api2/contract/biavqxkx76ijlbr0hv',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'Content-Length': postData.length
				}
			};
	
			// request object
			var req = https.request(options, function (res) {
				var result = '';
				res.on('data', function (chunk) {
					result += chunk;
				});
				res.on('end', function () {
					// console.log(result);
					resolve(JSON.parse(result));
	
				});
				res.on('error', function (err) {
					// console.log(err);
					reject(err);
				})
			});
	
			// req error
			req.on('error', function (err) {
				// console.log(err);
				reject(err);
			});
	
			//send request witht the postData form
			req.write(postData);
			req.end();
		})
	}

	// aaa(){
	// 	params = ["1554806633", "ДС 1", "1", "1", "Fanil", "Новая", "1554806633", "Примите в детский сад"];

	// 	var data = {
	// 		controller: 'send',
	// 		contract_id: 338,
	// 		func: 'newRecord',
	// 		funcVal: params
	// 	}//

	// 	var data = {
	// 		controller: 'call',
	// 		contract_id: 338,
	// 		func: 'count',
	// 		funcVal: ''
	// 	}//

	// 	// 'controller:call\ncontract_id:338\nfunc:count\nfuncVal:\n\n'; //

	// 	var postData = querystring.stringify(data);
	// 	// console.log(postData)

	// 	// request option
	// 	var options = {
	// 		host: 'unb.uz',
	// 		port: 443,
	// 		method: 'POST',
	// 		path: '/api2/contract/biavqxkx76ijlbr0hv',
	// 		headers: {
	// 			'Content-Type': 'application/x-www-form-urlencoded',
	// 			'Content-Length': postData.length
	// 		}
	// 	};

	// 	//axios.post(url, JSON.stringify(data)).then(r => console.log(r));
	// 	// request object
	// 	var req = https.request(options, function (res) {
	// 		var result = '';
	// 		res.on('data', function (chunk) {
	// 			result += chunk;
	// 		});
	// 		res.on('end', function () {
	// 			console.log(result);
	// 			console.log(JSON.parse(result));

	// 		});
	// 		res.on('error', function (err) {
	// 			console.log(err);
	// 		})
	// 	});

	// 	// req error
	// 	req.on('error', function (err) {
	// 		console.log(err);
	// 	});

	// 	//send request witht the postData form
	// 	req.write(postData);
	// 	req.end();
	// }
}