import { Component, createSignal } from "solid-js";

import styles from "./App.module.css";
import EditUrl from "./components/EditUrl";
import ListUrl from "./components/ListUrl";

const App: Component = () => {
  const [mode, setMode] = createSignal("list");
  const [currentUrlIndex, setCurrentUrlIndex] = createSignal(0);

  const getView = () => {
    switch (mode()) {
      case "list":
        return (
          <ListUrl setMode={setMode} setCurrentUrlIndex={setCurrentUrlIndex} />
        );
      case "edit":
        return (
          <EditUrl setMode={setMode} currentUrlIndex={currentUrlIndex()} />
        );
      case "new":
        return <EditUrl setMode={setMode} />;

      default:
        return (
          <ListUrl setMode={setMode} setCurrentUrlIndex={setCurrentUrlIndex} />
        );
    }
  };

  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <p>Redirector for Developers</p>
      </header>
      <main class={styles.main}>{getView()}</main>
      {mode() == "list" ? (
        <div class={styles.options}>
          <button onClick={() => setMode("new")}>Add new</button>
        </div>
      ) : (
        ""
      )}
      <footer class={styles.footer}>
        <small>
          <a
            class={styles.link}
            href="https://github.com/sanket143/dev-redirector"
            target="_blank"
            rel="noopener noreferrer"
          >
            Source Code
          </a>
          {" | "}
          <a
            class={styles.link}
            href="https://github.com/sanket143/dev-redirector/issues"
            target="_blank"
            rel="noopener noreferrer"
          >
            Bug Report
          </a>
        </small>
      </footer>
    </div>
  );
};

export default App;
