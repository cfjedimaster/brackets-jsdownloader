var JSDownloader = (function() {
    
	var INDEX_URL = "http://localhost/testingzone/jsdownloader_index.json";
	var INDEX_KEY = "jsdownloader.index";
	//Number of minutes to cache
	var CACHE_LEN = 1000*60*60*24;
	var index;

	return {

		getIndex:function() {
			var raw = JSON.parse(localStorage.getItem(INDEX_KEY));
			return raw.index;
		},

		hasCachedIndex:function() {
			var cache = localStorage.getItem(INDEX_KEY);
			if(!cache) return false;
			var ob = JSON.parse(cache);
			var then = new Date(ob.created);
			var now = new Date();
			if((now.getTime() - then.getTime()) > CACHE_LEN) return false;
			return true;
		},

		loadIndex:function(cb) {
			console.log("Getting index");
			$.get(INDEX_URL, {}, function(res,code) {
				console.dir(res);
				var ob = {};
				ob.created = new Date();
				ob.index = res;
				localStorage.setItem(INDEX_KEY, JSON.stringify(ob));
				cb();
			},"json");

		} 

	};
    
}());

