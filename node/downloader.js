
(function () {

	var domainName = "downloader";

	var http = require('http');
	var fs = require('fs');

	/*
	* urls is an array of objects with a href key and a path value.
	* The path value is appended to the core path. So for example, if the file
	* uri is meant to be saved in the root of path, path is blank/undefined.
	* But if path is "img/", then we would save it at corePath + path
	* For each, I fetch X and save to Y
	*/
	function fetchStuff(urls,basePath) {
		console.log("fetchStuff");
		console.log(JSON.stringify(urls));
		console.log('path = '+basePath);

		urls.forEach(function(item, idx, urls) {
			var fileName = item.href.split("/").pop();

			console.log("to process: "+item.href);
			console.log("item path? "+item.path);

			var fullPath;
			
			if(item.path) {
				fullPath = basePath + item.path + fileName;
				//does item path exist?
				if(!fs.existsSync(basePath+item.path)) {
					fs.mkdirSync(basePath+item.path);
				}
			} else {
				fullPath = basePath + fileName;
			}
				
			console.log("full path "+fullPath);

			// Credit: http://stackoverflow.com/a/5294619/52160
			var file = fs.createWriteStream(fullPath);
			var request = http.get(item.href, function(res) {

				var imagedata = '';
				res.setEncoding('binary');

				res.on('data', function(chunk){
					imagedata += chunk;
				});

				res.on('end', function(){
				fs.writeFile(fullPath, imagedata, 'binary', function(err){
					if (err) throw err;
						console.log('File saved.');
					});
				});


			});


		});


		return 1;
	}

	function init(DomainManager) {

		if(!DomainManager.hasDomain(domainName)) {
			DomainManager.registerDomain(domainName, {major:0,  minor:1});
		}

		DomainManager.registerCommand(
			domainName,
			"fetchStuff",
			fetchStuff,
			false
		);

	}

	exports.init = init;

}());