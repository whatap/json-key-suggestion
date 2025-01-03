# JSON Key Suggestion for MDX and Markdown Files

와탭 테크니컬 라이터를 위한 VS code Extension 입니다.

This Visual Studio Code extension provides intelligent suggestions for JSON keys and values within `sid=""` attributes in `.mdx` and `.md` files. It helps you quickly insert predefined JSON values into your code.

## Features

* Auto-suggest JSON values when editing `sid=""` attributes in MDX and Markdown files.
* Supports both `.mdx` and `.md` file types.
* Trigger suggestions by pressing `Alt+T` when your cursor is inside `sid=""`.
* Configurable JSON file path via VS Code settings.

## Installation

1. Clone the repository or download the `.vsix` file.
2. Install the extension:
   * Open VS Code.
   * Go to the Extensions view (`Ctrl+Shift+X`).
   * Click the `...` menu and select "Install from VSIX".
   * Select the `.vsix` file to install.
3. Reload VS Code.

## Configuration

You can configure the path to your JSON file in the VS Code settings:

1. Open the settings (`Ctrl+,` or `Cmd+,` on Mac).
2. Search for `jsonKeySuggestion.jsonFilePath`.
3. Set the path to your JSON file (relative to the workspace or absolute path).

### Example JSON File

```json
{
  "forgot_password": "비밀번호를 분실하셨습니까?",
  "login": "로그인",
  "create_an_account": "계정 생성하기!",
  "page_help": "화면 도움말",
  "confirm_delete": "정말로 삭제하시겠습니까?",
  "confirm_copy": "복사하시겠습니까?",
  "sign_up": "계정 생성",
  "view_terms_of_use": "이용 약관 보기",
  "view_privacy_policy": "개인정보 처리방침 보기",
  "edit": "수정",
  ...
}
```

## Usage

1. Open a `.mdx` or `.md` file in VS Code.

2. Type `<Cmdname sid="" className="uitext" />` and place the cursor inside the `sid=""` attribute.

3. Press `Alt+T` to trigger suggestions.

4. Select a value from the suggestion list to insert it into the `sid=""`.

## Keybindings

The default keybinding is:

* Alt+T: Trigger suggestions for JSON values.

You can customize this in `keybindings.json`:

```json
[
  {
    "key": "alt+t",
    "command": "jsonKeySuggestion.triggerCompletion",
    "when": "editorTextFocus"
  }
]
```

## Supported File Types

* `.mdx`
* `.md`

## Known Issues

* Currently, the extension only works for the `sid=""` attribute. Support for other attributes may be added in future updates.

* The JSON file must be valid and accessible.

## Contributing

Contributions are welcome! If you encounter issues or have feature requests, feel free to open an issue or submit a pull request.

## License

This extension is licensed under the MIT License. See the LICENSE file for details.

