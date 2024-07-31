const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

function activate(context) {
    let disposable = vscode.commands.registerCommand('extension.generateFilesAndFolders', async function (uri) {
        // Get input from user
        const input = await vscode.window.showInputBox({
            prompt: 'Enter files and folders (separated by commas or spaces)',
            placeHolder: 'styles/style.css mobile.css, core.js'
        });

        if (!input) return; // User cancelled

        // Determine the root folder
        const rootFolder = uri ? uri.fsPath : vscode.workspace.workspaceFolders?.[0]?.uri?.fsPath;
        if (!rootFolder) {
            vscode.window.showErrorMessage('No folder selected or no workspace folder open');
            return;
        }

        // Process input
        const items = input.split(',').map(item => item.trim()).filter(item => item !== '');

        items.forEach(group => {
            const paths = group.split(/[\s]+/).filter(p => p.trim() !== '');
            let currentFolder = '';
            paths.forEach(p => {
                // Check if the path contains a folder
                if (p.includes('/')) {
                    currentFolder = path.dirname(p);
                }

                const fullPath = path.join(rootFolder, currentFolder, path.basename(p));
                const directory = path.dirname(fullPath);

                // Create directory if it doesn't exist
                if (!fs.existsSync(directory)) {
                    fs.mkdirSync(directory, { recursive: true });
                }

                // Create file if it doesn't exist
                if (!fs.existsSync(fullPath)) {
                    fs.writeFileSync(fullPath, '');
                }
            });
        });

        vscode.window.showInformationMessage('Files and folders created successfully!');
    });

    context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
