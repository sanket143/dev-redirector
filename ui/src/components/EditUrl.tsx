import * as browser from "webextension-polyfill";
import { Component, createSignal, onMount } from "solid-js";
import { Url } from "../types/url";
import _ from "lodash";

type EditUrlInput = {
  setMode: (mode: string) => String;
  currentUrlIndex?: number;
};

const EditUrl: Component<EditUrlInput> = (props) => {
  const [targetUrl, setTargetUrl] = createSignal("");
  const [redirectionUrl, setRedirectionUrl] = createSignal("");

  let urls: Url[] = [];

  onMount(async () => {
    const urlString: string =
      (await browser.storage.local.get("urls")).urls || "[]";

    try {
      urls = JSON.parse(urlString);
    } catch (err) {
      console.error(urlString);
      urls = [];
    }

    console.log(props.currentUrlIndex);

    if (!_.isNil(props.currentUrlIndex)) {
      setTargetUrl(urls[props.currentUrlIndex].targetUrl);
      setRedirectionUrl(urls[props.currentUrlIndex].redirectUrl);
    }
  });

  const save = () => {
    if (_.isEmpty(targetUrl()) || _.isEmpty(redirectionUrl())) {
      return;
    }

    if (!_.isNil(props.currentUrlIndex)) {
      urls[props.currentUrlIndex] = {
        targetUrl: targetUrl(),
        redirectUrl: redirectionUrl(),
      };
    } else {
      urls.push({
        targetUrl: targetUrl(),
        redirectUrl: redirectionUrl(),
      });
    }

    browser.storage.local.set({ urls: JSON.stringify(urls) }).then((val) => {
      console.log(val);
    });

    props.setMode("list");
  };

  const remove = () => {
    if (!_.isNil(props.currentUrlIndex)) {
      _.pullAt(urls, [Number(props.currentUrlIndex)]);
    }

    browser.storage.local.set({ urls: JSON.stringify(urls) }).then((val) => {
      console.log(val);
    });

    props.setMode("list");
  };

  return (
    <div>
      <input
        onInput={(event) => {
          setTargetUrl(event.currentTarget.value);
        }}
        placeholder="Target URL"
        value={targetUrl()}
      ></input>
      <input
        onInput={(event) => {
          setRedirectionUrl(event.currentTarget.value);
        }}
        placeholder="Redirect to?"
        value={redirectionUrl()}
      ></input>
      <button onClick={save}>Save</button>
      {!_.isNil(props.currentUrlIndex) && (
        <button onClick={remove}>Remove</button>
      )}
      <button onClick={() => props.setMode("list")}>Cancel</button>
    </div>
  );
};

export default EditUrl;
