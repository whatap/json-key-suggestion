const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

function activate(context) {
    // 사용자 설정에서 JSON 파일 경로를 읽음
    const getJsonFilePath = () => {
        const config = vscode.workspace.getConfiguration('jsonKeySuggestion');
        const customPath = config.get('jsonFilePath');
        if (customPath) {
            return path.isAbsolute(customPath)
                ? customPath
                : path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, customPath);
        }
        // 기본 경로 (확장 디렉토리 내)
        return path.join(__dirname, 'data', 'translations.json');
    };

    // 명령 등록
    const disposable = vscode.commands.registerCommand('jsonKeySuggestion.triggerCompletion', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        // 현재 커서 위치 및 텍스트 가져오기
        const position = editor.selection.active;
        const document = editor.document;
        const line = document.lineAt(position).text;

        // JSON 파일 경로 동적 설정
        const jsonFilePath = getJsonFilePath();
        let jsonData;
        try {
            jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
        } catch (error) {
            vscode.window.showErrorMessage(`JSON 파일을 읽는 중 오류가 발생했습니다: ${error.message}`);
            return;
        }

        // 따옴표 안의 텍스트를 감지하는 정규식
        const pattern = /sid="([^"]*)"/;
        const match = line.match(pattern);

        if (!match) {
            vscode.window.showInformationMessage('sid="" 패턴을 찾을 수 없습니다.');
            return;
        }

        const inputText = match[1]; // 따옴표 안의 텍스트

        // 입력 텍스트를 기준으로 JSON value 검색
        const matchingItems = Object.entries(jsonData)
            .filter(([key, value]) => value.includes(inputText)) // value에 입력 텍스트가 포함된 경우
            .map(([key, value]) => ({
                label: value,
                detail: `${key}`,
            }));

        // 자동완성 선택창 표시
        vscode.window.showQuickPick(matchingItems, {
            placeHolder: 'JSON Value를 선택하세요.',
        }).then((selectedItem) => {
            if (selectedItem) {
                const edit = new vscode.WorkspaceEdit();
                const start = position.translate(0, -inputText.length);
                const end = position;
                edit.replace(document.uri, new vscode.Range(start, end), selectedItem.detail);
                vscode.workspace.applyEdit(edit);
            }
        });
    });

    context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate,
};
