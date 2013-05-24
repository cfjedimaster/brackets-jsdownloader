JSDownloader
============

JSDownloader provides a simple way to download various JavaScript libraries into your project. It does this by providing direct
links to various JavaScript libraries and a quick link to download.

Currently JSDownloader supports a limited set of libraries. It sources its data from a file called jsdownloader_index.json. In
order to to make it easier to update this index, JSDownloader will actually load the data file from the GitHub repo for this 
project. That makes it easier for me to add different libraries.

Currently this extension supports single-file libraries only. I've got support in for multiple file libraries (somewhat), 
but as this will mainly be important for UI libraries, I'm holding off on *truly* supporting it until it is easier to handle
binary data in Brackets.

Note that the remote index is cached locally for 24 hours. I need a better way of clearing the cache.

Updates
=======
[5/24/2013] Support for package.json

[4/22/2013] Initial Release