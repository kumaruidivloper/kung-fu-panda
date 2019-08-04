**iconReference**

### Notes
* tempory solution until icomoon-parser can be implemented
* https://davidecalignano.it/project/?icomoon-parser
* https://chrome.google.com/webstore/detail/icomoon/kppingdhhalimbaehfmhldppemnmlcjd/related?utm_source=chrome-ntp-icon
* icomoon-parser will need a reference to our `academy.json` file

### How it Works
* component makes a request for the site's css file
* parses css text looking for icon-* selectors
* attempts to render those icons

### Deficiencies
* fails to render complex icons of format `<div class="icon-*"><span class="pathX"/><span class="pathX"/></div>`
