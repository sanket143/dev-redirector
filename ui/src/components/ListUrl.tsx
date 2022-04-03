import * as browser from "webextension-polyfill";
import _ from "lodash";
import { Component, createSignal, onMount, PropsWithChildren } from "solid-js";

import styles from "./ListUrl.module.css";
import { Url } from "../types/url";

type ListUrlInput = {
  setMode: (mode: string) => String;
  setCurrentUrlIndex: (index: number) => void;
};

const ListUrl: Component<ListUrlInput> = (props) => {
  const [urls, setUrls] = createSignal([]);

  onMount(async () => {
    const urlString: string =
      (await browser.storage.local.get("urls")).urls || "[]";

    try {
      setUrls(JSON.parse(urlString));
    } catch (err) {
      setUrls([]);
    }
  });

  const getUrlComponentList = () => {
    return _.map(urls(), (url: Url, index) => {
      return (
        <div
          class={styles.link}
          onClick={() => {
            props.setCurrentUrlIndex(index);
            props.setMode("edit");
          }}
        >
          {url.targetUrl}
        </div>
      );
    });
  };

  return (
    <div>
      <div style={{ "margin-bottom": "4px" }}>{getUrlComponentList()}</div>
    </div>
  );
};

export default ListUrl;
