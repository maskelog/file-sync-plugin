import { Plugin, PluginSettingTab, Setting, TFile, App, FileSystemAdapter, Vault } from 'obsidian';

interface FileSyncPluginSettings {
    sourceFolder: string;
    destFolder: string;
    syncInterval: number;
}

const DEFAULT_SETTINGS: FileSyncPluginSettings = {
    sourceFolder: '',
    destFolder: '',
    syncInterval: 10
}

export default class FileSyncPlugin extends Plugin {
    settings: FileSyncPluginSettings;
    syncInterval: any;

    async onload() {
        await this.loadSettings();

        this.addSettingTab(new FileSyncSettingTab(this.app, this));

        this.syncInterval = window.setInterval(this.syncFiles.bind(this), this.settings.syncInterval * 1000);
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
        window.clearInterval(this.syncInterval);
        this.syncInterval = window.setInterval(this.syncFiles.bind(this), this.settings.syncInterval * 1000);
    }

    async syncFiles() {
        const vault: Vault = this.app.vault;
        const adapter: FileSystemAdapter = (vault.adapter as FileSystemAdapter);
        const sourceFolderPath = this.settings.sourceFolder;
        const destFolderPath = this.settings.destFolder;
    
        const allFiles: TFile[] = vault.getFiles().filter(file => file.path.startsWith(sourceFolderPath));

        for (const file of allFiles) {
            const content = await vault.read(file);
            const destFilePath = destFolderPath + '/' + file.path.replace(sourceFolderPath, '');
            await adapter.write(destFilePath, content);
        }
    }
}

class FileSyncSettingTab extends PluginSettingTab {
    plugin: FileSyncPlugin;

    constructor(app: App, plugin: FileSyncPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        let { containerEl } = this;

        containerEl.empty();
        containerEl.createEl('h2', { text: 'File Sync Settings' });

        new Setting(containerEl)
            .setName('Source Folder')
            .setDesc('The source folder in Obsidian')
            .addText(text => text
                .setPlaceholder('Enter source folder path')
                .setValue(this.plugin.settings.sourceFolder)
                .onChange(async (value) => {
                    this.plugin.settings.sourceFolder = value;
                }));

        new Setting(containerEl)
            .setName('Destination Folder')
            .setDesc('The destination folder for the files')
            .addText(text => text
                .setPlaceholder('Enter destination folder path')
                .setValue(this.plugin.settings.destFolder)
                .onChange(async (value) => {
                    this.plugin.settings.destFolder = value;
                }));

        new Setting(containerEl)
            .setName('Sync Interval')
            .setDesc('How often you want the files to be synced (in seconds)')
            .addText(text => text
                .setPlaceholder('Enter the sync interval')
                .setValue(this.plugin.settings.syncInterval.toString())
                .onChange(async (value) => {
                    this.plugin.settings.syncInterval = parseInt(value);
                }));

        new Setting(containerEl)
            .setName('Save Settings')
            .addButton(button => {
                button.setButtonText('Save').onClick(async () => {
                    await this.plugin.saveSettings();
                    new Notice('Settings saved!');
                });
            });
    }
}