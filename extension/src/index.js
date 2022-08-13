import * as browser from "webextension-polyfill";
import _ from "lodash";

let urlsMap = {};
const decoder = new TextDecoder("utf-8");

const updateUrlsMap = ({ urls }) => {
  urls = JSON.parse(urls);

  urlsMap = {};
  _.forEach(urls, (url) => {
    urlsMap[url.targetUrl] = {
      redirectTo: url.redirectUrl,
      regex: _.isEmpty(_.trim(url.regexMatchString))
        ? null
        : new RegExp(url.regexMatchString),
    };
  });
};

browser.storage.local.get("urls").then(updateUrlsMap);

browser.storage.onChanged.addListener(({ urls }) => {
  updateUrlsMap({ urls: urls.newValue });
});

function redirect(requestDetails) {
  if (urlsMap[requestDetails.url]) {
    if (!_.isNil(urlsMap[requestDetails.url].regex)) {
      let body = "";
      _.forEach(_.get(requestDetails, "requestBody.raw"), (raw) => {
        body += decoder.decode(raw.bytes);
      });

      if (urlsMap[requestDetails.url].regex.test(body)) {
        return {
          redirectUrl: urlsMap[requestDetails.url].redirectTo,
        };
      }
    } else {
      return {
        redirectUrl: urlsMap[requestDetails.url].redirectTo,
      };
    }
  }

  return;
}

browser.webRequest.onBeforeRequest.addListener(
  redirect,
  { urls: ["<all_urls>"] },
  ["blocking", "requestBody"]
);
