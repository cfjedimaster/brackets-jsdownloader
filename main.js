/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4,
maxerr: 50, browser: true */
/*global $, define, brackets */

define(function (require, exports, module) {
	"use strict";

	var downloaderTemplate = require("text!htmlContent/downloader.html"),
		libraryListTemplate = require("text!htmlContent/librarylist.html");

	var Commands                = brackets.getModule("command/Commands"),
		CommandManager          = brackets.getModule("command/CommandManager"),
		EditorManager           = brackets.getModule("editor/EditorManager"),
		DocumentManager         = brackets.getModule("document/DocumentManager"),
		Menus                   = brackets.getModule("command/Menus"),
		Dialogs                 = brackets.getModule("widgets/Dialogs"),
		ExtensionUtils          = brackets.getModule("utils/ExtensionUtils"),
		ProjectManager          = brackets.getModule("project/ProjectManager"),
		FileUtils               = brackets.getModule("file/FileUtils"),
		AppInit                 = brackets.getModule("utils/AppInit"),
		NodeConnection          = brackets.getModule("utils/NodeConnection");


	var nodeConnection;

	require('jsdownloader');

	var LAUNCH_JSDOWNLOADER = "jsdownloader.run";
	var libraryOb = {};
	var pathToUse;

	function _handleShowJSDownloader() {
		//Do we have our cached index
		if(!JSDownloader.hasCachedIndex()) {
			$(".jsdownloader-dialog div.modal-body").html("<img src='" + require.toUrl("img/ajax-loader.gif") + "' style='float:right'><i>Caching list of libraries.<br/>Please stand by for awesome.</i>");
			Dialogs.showModalDialog("jsdownloader-dialog");

			$(".jsdownloader-dialog div.modal-body").html("<i>Fetching content.</i>");

			JSDownloader.loadIndex(function(result) {
				if(result) {
					_displayIndex();
				} else {
					$(".jsdownloader-dialog div.modal-body").html("<p>Sorry, I was unable to fetch the library information.</p>");
				}
			});

		} else {
			Dialogs.showModalDialog("jsdownloader-dialog");
			_displayIndex();
		}
	}

	function _handleLibClick(e) {
		e.preventDefault();
		var lib = $(this).data("library");

		//Fire off an async process to do the download
		//First, get the related span
		var $span = $(this).next("span");
		$span.html("<i>Downloading...</i>");

		/*
		Ok, now to create the deferreds for our downloads. Note that we don't yet
		support N files for a library, but I'm going to build it later. So for now
		we just assume.
		*/
		var library = libraryOb[lib];

		var filesToGet;
		if(library.file) {
			filesToGet = [library.file];
		} else {
			filesToGet = library.files;
		}

		console.dir(filesToGet);

        var suPromise = nodeConnection.domains.downloader.fetchStuff(filesToGet,pathToUse);
        suPromise.done(function(port) {
			$span.html("<i>Done!</i>");
        });

	}

	function _displayIndex() {
		pathToUse = "";
		var selectedItem = ProjectManager.getSelectedItem();
		if(selectedItem && selectedItem.isDirectory) {
			pathToUse = selectedItem.fullPath;
		} else {
			pathToUse = ProjectManager.getProjectRoot().fullPath;
		}
		var libraries = JSDownloader.getIndex();
		//create a hash we can use on this side for click event
		for(var i=0, len=libraries.length;i<len; i++) {
			libraryOb[libraries[i].key] = libraries[i];
		}
		var html = Mustache.render(libraryListTemplate, {library: libraries, path:pathToUse});
		$(".jsdownloader-dialog div.modal-body").html(html);
	}

	function chain() {
		var functions = Array.prototype.slice.call(arguments, 0);
		if (functions.length > 0) {
			var firstFunction = functions.shift();
			var firstPromise = firstFunction.call();
			firstPromise.done(function () {
				chain.apply(null, functions);
			});
		}
	}

	AppInit.appReady(function() {

		nodeConnection = new NodeConnection();

		function connect() {
			var connectionPromise = nodeConnection.connect(true);
			connectionPromise.fail(function () {
				console.error("[brackets-jsdownloader] failed to connect to node");
			});
			return connectionPromise;
		}
		
		// Helper function that loads our domain into the node server
		function loadMyDomain() {
			var path = ExtensionUtils.getModulePath(module, "node/downloader");
			var loadPromise = nodeConnection.loadDomains([path], true);
			loadPromise.fail(function (e) {
				console.log(JSON.stringify(e));
				console.log("[brackets-jsdownloader] failed to load domain");
			});
			
			loadPromise.done(function(e) {
				ready();
			});
			
			return loadPromise;
		}

		function ready() {
			/* At this point we are ready to add to the UI */
			CommandManager.register("Run JSDownloader", LAUNCH_JSDOWNLOADER, _handleShowJSDownloader);

			var menu = Menus.getMenu(Menus.AppMenuBar.FILE_MENU);
			menu.addMenuItem(LAUNCH_JSDOWNLOADER, "", Menus.AFTER);
            
            var context_menu = Menus.getContextMenu(Menus.ContextMenuIds.PROJECT_MENU);
            context_menu.addMenuDivider();
            context_menu.addMenuItem(LAUNCH_JSDOWNLOADER);

			$('body').append(downloaderTemplate);

			$(document).on("click",".jsdownloader-dialog div.modal-body a", _handleLibClick);

			console.log("[brackets-jsdownloader] Ready for ludicrous speed!");
		}

		chain(connect, loadMyDomain);

	});


});