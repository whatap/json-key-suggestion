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
                const linePrefix = document.lineAt(position).text.substr(0, position.character);

                // 특정 패턴 감지 (예: " 또는 key 입력 후)
                if (!linePrefix.endsWith('$') && !linePrefix.endsWith(':')) {
                    return [];
                }

                // JSON 키 목록에서 CompletionItem 생성
                return Object.keys(jsonData).map((key) => {
                    const item = new vscode.CompletionItem(
                        key,
                        vscode.CompletionItemKind.Property
                    );
                    item.detail = jsonData[key]; // 키에 대한 상세 설명 (값) 추가
                    item.insertText = `"${key}"`;
                    return item;
                });
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
