import "./App.css";
import * as React from "react";
import Approach1 from "./components/Approach1";
import Approach2 from "./components/Approach2";
import Approach3 from "./components/Approach3";

function App() {
  const ApproachNavigation = () => {
    return (
      <div style={{ textAlign: "center", marginBottom: 30, fontSize: 26 }}>
        <a href="#approach1">Approach #1</a> |&nbsp;
        <a href="#approach2">Approach #2</a> |&nbsp;
        <a href="#approach3">Approach #3</a> |&nbsp;
        <a href="#recommendation">Recommended approach</a> |&nbsp;
        <a
          href="https://github.com/dominiquemb/undo-example-1"
          target="_blank"
          rel="noop noreferrer"
        >
          GitHub
        </a>{" "}
        |&nbsp;
        <a
          href="https://codesandbox.io/s/friendly-villani-iog5vj"
          target="_blank"
          rel="noop noreferrer"
        >
          Edit the source code (sandbox)
        </a>
      </div>
    );
  };

  return (
    <div className="App">
      <div id="approach1">
        <div style={{ fontSize: 42 }}>
          <strong>Approach #1:</strong>
        </div>
        <hr />
        <ApproachNavigation />
        <Approach1 />
      </div>

      <div id="approach2">
        <div style={{ fontSize: 42 }}>
          <strong>Approach #2:</strong>
        </div>
        <hr />
        <ApproachNavigation />
        <Approach2 />
      </div>

      <div id="approach3">
        <div style={{ fontSize: 42 }}>
          <strong>Approach #3:</strong>
        </div>
        <hr />
        <ApproachNavigation />
        <Approach3 />
      </div>

      <div id="recommendation" style={{ marginTop: 150, marginBottom: 150 }}>
        <div style={{ fontSize: 42 }}>
          <strong>Recommended approach</strong>
        </div>
        <hr />
        <ApproachNavigation />
        <div
          style={{
            textAlign: "left",
            width: 600,
            display: "block",
            margin: "auto",
            marginTop: 70
          }}
        >
          <p>
            I think a careful implementation of approach #1 would allow the most
            flexibility, however, a hybrid approach of 1 and 2 would be best
            depending on the type of action being undone/redone.
          </p>
          <p>
            Sometimes, approach #2 may be best when it is not possible to undo a
            specific isolated action.
          </p>
          <p>
            Approach #3 may be best for periodic backups on a weekly or daily
            basis. This would be a great feature to have when there have been
            numerous unwanted changes done, or when the brand would like to
            “start over” completely from a previous revision.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
