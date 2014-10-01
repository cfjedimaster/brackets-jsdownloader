JSDownloader
============

JSDownloader provides a simple way to download various JavaScript libraries into your project. It does this by providing direct
links to various JavaScript libraries and a quick link to download.

Currently JSDownloader supports a limited set of libraries. It sources its data from a file called jsdownloader_index.json. 

ToDo: Write the docs for the jsdownloader_index.json file. 

Updates
=======
[8/5/2014] Phaser lig changed. Thanks to @OttoRobba

[7/30/2014] Phaser added. Thanks to @OttoRobba

[7/9/2014] Updates:

---NEW---
BackboneJS 1.1.2
Bootstrap 3.2.0 CSS
Bootstrap 3.2.0 JS
KnockoutJS 3.1.0

---UPDATED---
Underscore 1.5.2 -> 1.6.0
PrototypeJS 1.7.1 (dev) -> 1.7.2
Lo-Dash 2.3.0 (dev) -> 2.4.1
Raphaël 2.1.2 (dev) -> 2.1.2

Thanks to https://github.com/tobipch

[5/9/2014] Update to jquery 2 and jquery mobile by @denisov21
[5/9/2014] Update to jquery lib by @denisov21

[5/9/2014] Update to lungojs and quojs by @matheusrocha89

[2/7/2014] Remove tree refresh since Sprint 36 fixed it. Fixed bugs in the json data file. Switched to the non-runtime version of Handlebars.

[1/22/2013] Handlebars 1.3.0 update

[12/20/2013] Added LungoJS and QuoJS libs (pull request by matheusrocha89)

[12/2/2013] Removed NativeFileSystem from main as I wasn't using it. Also removed a large commented out block.

[11/28/2013] Lower cache (one minute), fix Zepto.js data

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