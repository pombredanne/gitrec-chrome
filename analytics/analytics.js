// GOOGLE ANALYTICS SETUP
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-43270865-1']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
// END

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request.recordEvent) {
      _gaq.push(['_trackEvent',
        request.recordEvent.category,
        request.recordEvent.action, 
        request.recordEvent.label ]);
      sendResponse({ success : true });
    } else {
      sendResponse({ success : false });
    }
    return true;
  });
