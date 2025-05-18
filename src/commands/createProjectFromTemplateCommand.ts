'use strict';

import vscode = require("vscode");
import fs = require("fs");
import path = require("path");

import ProjectTemplatesPlugin from "../projectTemplatesPlugin";

/**
 * Main command to create a new project from a template.
 * This command can be invoked by the Command Palette or in a folder context menu on the explorer view.
 * @export
 * @param {ProjectTemplatesPlugin} templateManager
 * @param {*} args
 */
export async function run(templateManager: ProjectTemplatesPlugin, args: any) {
    let workspace = await templateManager.selectWorkspace(args);
    let workspacePath: string;
    let openedNewFolder = false;

    // Load latest configuration
    const config = vscode.workspace.getConfiguration('projectTemplates');
    templateManager.updateConfiguration(config);

    if (!workspace) {
        // Prompt for new folder name
        const folderName = await vscode.window.showInputBox({
            prompt: "Enter name for new project",
            placeHolder: "my-project",
            validateInput: value => value.trim() === "" ? "Folder name cannot be empty" : null
        });

        if (!folderName) {
            vscode.window.showErrorMessage("Project creation canceled.");
            return;
        }

        // Determine base path
        const configuredProjectsDir = config.get<string>('projectsDirectory');
        const homeDir = process.env.HOME ?? process.env.USERPROFILE;
        if (!homeDir) {
            vscode.window.showErrorMessage("Unable to determine your home directory.");
            return;
        }

        let basePath: string;

        if (configuredProjectsDir && configuredProjectsDir.trim() !== "") {
            basePath = configuredProjectsDir;
            workspacePath = path.join(basePath, folderName);
        } else {
            basePath = path.join(homeDir, "Projects");

            // Ensure ~/Projects exists
            if (!fs.existsSync(basePath)) {
                workspacePath = path.join(homeDir, folderName);
            } else {
                workspacePath = path.join(basePath, folderName);
            }
        }

        try {
            if (!fs.existsSync(workspacePath)) {
                fs.mkdirSync(workspacePath);
                openedNewFolder = true;
            }
        } catch (err: any) {
            vscode.window.showErrorMessage(`Failed to create folder: ${err.message}`);
            return;
        }

    } else {
        workspacePath = workspace;
    }

    // Load latest configuration
    templateManager.updateConfiguration(vscode.workspace.getConfiguration('projectTemplates'));

    // Create the project
    try {
        const template = await templateManager.createFromTemplate(workspacePath);
        if (template) {
            vscode.window.showInformationMessage(`Created project from template '${template}'`);

            // Open the new folder if it was created
            if (openedNewFolder) {
                const openUri = vscode.Uri.file(workspacePath);
                vscode.commands.executeCommand('vscode.openFolder', openUri, false); // false = open in existing window
            }
        }
    } catch (reason: any) {
        vscode.window.showErrorMessage(`Failed to create project from template: ${reason}`);
    }
}
