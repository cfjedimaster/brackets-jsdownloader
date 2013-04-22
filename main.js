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
        NativeFileSystem        = brackets.getModule("file/NativeFileSystem");


    require('jsdownloader');

    var LAUNCH_JSDOWNLOADER = "jsdownloader.run";
    var libraryOb = {};
    var pathToUse;

    function _handleShowJSDownloader() {
        //Do we have our cached index
        if(!JSDownloader.hasCachedIndex()) {
            console.log("no good cache, so fetching.");
            $(".jsdownloader-dialog div.modal-body").html("<img src='" + require.toUrl("img/ajax-loader.gif") + "' style='float:right'><i>Caching list of libraries.<br/>Please stand by for awesome.</i>");
            Dialogs.showModalDialog("jsdownloader-dialog");

            JSDownloader.loadIndex(function() {
                _displayIndex();
            });

        } else {
            Dialogs.showModalDialog("jsdownloader-dialog");
            _displayIndex();
        }
    }

    function _handleLibClick(e) {
        e.preventDefault();
        var lib = $(this).data("library");
        console.log('click for library '+lib);

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

        var deferreds = [];

        filesToGet.forEach(function(f) {
            var deferred = $.get(f, {}, function(res,code) {
                var pathToSave = pathToUse + f.split("/").pop();
                console.log('about to save '+pathToSave);
                var fileEntry = new NativeFileSystem.NativeFileSystem.FileEntry(pathToSave);
                FileUtils.writeText(fileEntry, res);

            });
            deferreds.push(deferred);

        });

        $.when.apply(null, deferreds).then(function() {
            $span.html("<i>Done!</i>");
        });

    }

    function _displayIndex() {
        console.log("_displayIndex");
        pathToUse = "";
        var selectedItem = ProjectManager.getSelectedItem();
        if(selectedItem && selectedItem.isDirectory) {
            pathToUse = selectedItem.fullPath;
        } else {
            pathToUse = ProjectManager.getProjectRoot().fullPath;
        }
        var libraries = JSDownloader.getIndex();
        console.log('u gonna work? ');
        console.dir(libraries);
        //create a hash we can use on this side for click event
        for(var i=0, len=libraries.length;i<len; i++) {
            libraryOb[libraries[i].key] = libraries[i];
        }
        var html = Mustache.render(libraryListTemplate, {library: libraries, path:pathToUse});
        $(".jsdownloader-dialog div.modal-body").html(html);
        console.log('in theory i worked '+html);
    }

    CommandManager.register("Run JSDownloader", LAUNCH_JSDOWNLOADER, _handleShowJSDownloader);

    function init() {

        var menu = Menus.getMenu(Menus.AppMenuBar.FILE_MENU);
        menu.addMenuItem(LAUNCH_JSDOWNLOADER, "", Menus.AFTER);

        $('body').append(downloaderTemplate);

        $(document).on("click",".jsdownloader-dialog div.modal-body a", _handleLibClick);

    }

    init();

});