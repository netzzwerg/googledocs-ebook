googledocs-ebook
================

Create an ebook from your Google Docs document.

1. Convert Google Docs to Markdown. 

https://github.com/mangini/gdocs2md

2. Generate ebook from Markdown with Metalsmith.

https://github.com/segmentio/metalsmith


Current Workflow

html 	-> 	markdown 	-> latex 	-> pdf
									-> mobi
									-> epub


svg 	->  eps			-> pdf

install pandoc
install latex ( mac: http://www.tug.org/mactex/)

node index.js