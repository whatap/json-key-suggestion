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

    const provider = vscode.languages.registerCompletionItemProvider(
        { scheme: 'file', language: 'mdx' }, // MDX 파일에 적용
        {
            provideCompletionItems(document, position) {
                // JSON 파일 경로 동적 설정
                const jsonFilePath = getJsonFilePath();

                // JSON 파일 읽기
                let jsonData;
                try {
                    jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
                } catch (error) {
                    vscode.window.showErrorMessage(
                        `JSON 파일을 읽는 중 오류가 발생했습니다: ${error.message}`
                    );
                    return [];
                }

                // 입력된 텍스트 가져오기
                const linePrefix = document.lineAt(position).text.substr(0, position.character).trim();

                // 입력 텍스트를 기준으로 value 검색
                const matchingItems = Object.entries(jsonData)
                    .filter(([key, value]) => value.includes(linePrefix)) // value에 입력 텍스트가 포함된 경우
                    .map(([key, value]) => {
                        const item = new vscode.CompletionItem(
                            value, // 팝업에 표시되는 내용은 value로 설정
                            vscode.CompletionItemKind.Value
                        );
                        item.detail = `Key: ${key}`; // 상세 정보에 key를 표시
                        item.insertText = `"${key}"`; // key를 삽입
                        return item;
                    });

                return matchingItems;
            },
        },
        '$', ':' // 특정 문자 입력 시 자동완성 트리거
    );

    context.subscriptions.push(provider);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate,
};
