// // Background script to block sites
// chrome.webRequest.onBeforeRequest.addListener(
//   function(details) {
//     // Check if the request is for the blocked site
//     var isBlocked = detectPhishing(details.url);

//     if (isBlocked) {
//       // Block the request by returning { cancel: true }
//       return { cancel: true };
//     }
//   },
//   { urls: ["<all_urls>"] },
//   ["blocking"]
// );