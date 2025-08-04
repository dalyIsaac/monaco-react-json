import { useMemo } from "react";
import type {
  WrapperConfig,
  MonacoEditorLanguageClientWrapper,
} from "monaco-editor-wrapper";
import { MonacoEditorReactComp } from "@typefox/monaco-editor-react";
import { configureDefaultWorkerFactory } from "monaco-editor-wrapper/workers/workerLoaders";
import {
  BrowserMessageReader,
  BrowserMessageWriter,
} from "vscode-jsonrpc/browser";
import { useWorkerFactory } from "monaco-languageclient/workerFactory";

import "@codingame/monaco-vscode-standalone-json-language-features";
import "@codingame/monaco-vscode-json-default-extension";
import "@codingame/monaco-vscode-textmate-service-override";

import TextEditorWorker from "@codingame/monaco-vscode-editor-api/esm/vs/editor/editor.worker?worker";
import TextMateWorker from "@codingame/monaco-vscode-textmate-service-override/worker?worker";
import JsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";

function App() {
  const onLoad = (monaco: MonacoEditorLanguageClientWrapper) => {
    console.log("Loaded");
    const editor = monaco.getEditor();
    if (editor === undefined) {
      return;
    }

    console.log(monaco.getLanguageClient("json"));
  };

  const wrapperConfig = useMemo(() => createWrapperConfig(), []);

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <MonacoEditorReactComp
        wrapperConfig={wrapperConfig}
        onLoad={onLoad}
        style={{ height: "100%" }}
      />
    </div>
  );
}

const createWrapperConfig = (): WrapperConfig => {
  const worker = new JsonWorker();

  return {
    $type: "extended",
    vscodeApiConfig: {
      userConfiguration: {
        json: JSON.stringify({
          "json.validate.enable": true,
          "json.schemas": [
            {
              uri: "schema-id",
              fileMatch: ["*"],
              schema: {
                type: "object",
                patternProperties: {
                  "^(?=.*[A-Za-z0-9])[\\S]*": {
                    type: "string",
                    pattern: "^(?=.*[A-Za-z0-9])[\\S]*",
                  },
                },
                additionalProperties: false,
              },
            },
          ],
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
            json: () => worker,
          },
          logger,
        });
      },
    },
    languageClientConfigs: {
      configs: {
        json: {
          clientOptions: {
            documentSelector: ["json"],
          },
          name: "json",
          connection: {
            options: {
              $type: "WorkerDirect",
              worker,
            },
            messageTransports: {
              reader: new BrowserMessageReader(worker),
              writer: new BrowserMessageWriter(worker),
            },
          },
        },
      },
    },
  };
};

export default App;
