JSDownloader
============

JSDownloader provides a simple way to download various JavaScript libraries into your project. It does this by providing direct
links to various JavaScript libraries and a quick link to download.

Currently JSDownloader supports a limited set of libraries. It sources its data from a file called jsdownloader_index.json. 

ToDo: Write the docs for the jsdownloader_index.json file. 

Updates
=======
[11/24/2013] Updates from clouddueling to add more libraries.

[11/23/2013] Pull from hayatoShingu to add more libraries. NOTE - I have not done 
the file system API updates yet. Will do so soon.

[9/30/2013] Pull from bibz: The initial URL was to the latest stable release.
It now points to the tagged version library.

[9/27/2013] Pull in a Matt Gifford request to add right click context support.
Added https support.

[9/27/2013] Removed some console.logs and fixed the cache. It is much smaller though since it is a local file read.

[9/22/2013] JSD has been updated to connect to a Node app in the back end. This enables it to now handle binary
transfers. JSD also supports libraries with multiple files now (see the JQM one).

[5/24/2013] Support for package.json

[4/22/2013] Initial Release