import "@codingame/monaco-vscode-json-default-extension";
import "@codingame/monaco-vscode-json-language-features-default-extension";
import "@codingame/monaco-vscode-textmate-service-override";

import TextEditorWorker from "@codingame/monaco-vscode-editor-api/esm/vs/editor/editor.worker?worker";
import TextMateWorker from "@codingame/monaco-vscode-textmate-service-override/worker?worker";
import JsonWorker from "@codingame/monaco-vscode-standalone-json-language-features/worker?worker";

import type { WrapperConfig } from "monaco-editor-wrapper";
import { MonacoEditorReactComp } from "@typefox/monaco-editor-react";
import { configureDefaultWorkerFactory } from "monaco-editor-wrapper/workers/workerLoaders";
import { useWorkerFactory } from "monaco-languageclient/workerFactory";

const createWrapperConfig = (): WrapperConfig => {
  return {
    $type: "extended",
    vscodeApiConfig: {
      userConfiguration: {
        json: JSON.stringify({
          "json.validate.enable": true,
          "json.allowComments": false,
        }),
      },
    },
    editorAppConfig: {
      codeResources: {
        modified: {
          text: `{"key": "value"}`,
          uri: "/workspace/data.json",
          enforceLanguageId: "json",
        },
      },
      editorOptions: {
        language: "json",
      },
      monacoWorkerFactory: (logger) => {
        configureDefaultWorkerFactory();
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useWorkerFactory({
          workerLoaders: {
            TextEditorWorker: () => new TextEditorWorker(),
            TextMateWorker: () => new TextMateWorker(),
            json: () => new JsonWorker(),
          },
          logger,
        });
      },
    },
  };
};

const wrapperConfig = createWrapperConfig();

function App() {
  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <MonacoEditorReactComp
        wrapperConfig={wrapperConfig}
        style={{ height: "100%" }}
      />
    </div>
  );
}

export default App;
