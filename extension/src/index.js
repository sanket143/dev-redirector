import * as browser from "webextension-polyfill";
import _ from "lodash";

let urlsMap = {};

const updateUrlsMap = ({ urls }) => {
  urls = JSON.parse(urls);

  urlsMap = {};
  _.forEach(urls, (url) => {
    urlsMap[url.targetUrl] = url.redirectUrl;
  });
};

browser.storage.local.get("urls").then(updateUrlsMap);

browser.storage.onChanged.addListener(({ urls }) => {
  updateUrlsMap({ urls: urls.newValue });
});

function redirect(requestDetails) {
  if (urlsMap[requestDetails.url]) {
    return {
      redirectUrl: urlsMap[requestDetails.url],
    };
  }

  return;
}

browser.webRequest.onBeforeRequest.addListener(
  redirect,
  { urls: ["<all_urls>"] },
  ["blocking"]
);
