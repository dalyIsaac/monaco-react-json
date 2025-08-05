import "@codingame/monaco-vscode-standalone-languages";
import "@codingame/monaco-vscode-standalone-json-language-features";

import TextEditorWorker from "@codingame/monaco-vscode-editor-api/esm/vs/editor/editor.worker?worker";
import TextMateWorker from "@codingame/monaco-vscode-textmate-service-override/worker?worker";
import JsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";

import { configureDefaultWorkerFactory } from "monaco-editor-wrapper/workers/workerLoaders";
import { MonacoEditorReactComp } from "@typefox/monaco-editor-react";
import { useWorkerFactory } from "monaco-languageclient/workerFactory";

import type {
  WrapperConfig,
  MonacoEditorLanguageClientWrapper,
} from "monaco-editor-wrapper";

const createWrapperConfig = (): WrapperConfig => {
  return {
    $type: "classic",
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
      monacoWorkerFactory: () => {
        configureDefaultWorkerFactory();

        // eslint-disable-next-line react-hooks/rules-of-hooks
        useWorkerFactory({
          workerLoaders: {
            TextEditorWorker: () => new TextEditorWorker(),
            TextMateWorker: () => new TextMateWorker(),
            json: () => new JsonWorker(),
          },
        });
      },
    },
  };
};

const wrapperConfig = createWrapperConfig();

function App() {
  const onLoad = (monaco: MonacoEditorLanguageClientWrapper) => {
    console.log("Loaded");
    const editor = monaco.getEditor();
    if (editor === undefined) {
      return;
    }

    console.log(monaco.getLanguageClient("json"));
  };

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

export default App;
