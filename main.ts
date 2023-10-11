import { Plugin, PluginSettingTab, Setting } from 'obsidian';

export default class MarkdownFileCopyPlugin extends Plugin {
    private sourceFolder: string;
    private destFolder: string;
    private syncInterval: number;
    private autoCopyEnabled: boolean;
    private timer: any;

    onload() {
        this.loadSettings();

        this.addRibbonIcon('documents', 'Copy Markdown Files', async () => {
            this.copyMarkdownFiles();
        });

        this.addSettingTab(new MarkdownFileCopySettingTab(this.app, this));
        
        this.updateTimer();


    }

    async loadSettings() {
        this.sourceFolder = (await this.loadData())?.sourceFolder || '/path/to/source/folder';
        this.destFolder = (await this.loadData())?.destFolder || '/path/to/dest/folder';
        this.syncInterval = (await this.loadData())?.syncInterval || 60000;
        this.autoCopyEnabled = (await this.loadData())?.autoCopyEnabled || false;
    }

    async saveSettings() {
        await this.saveData({ sourceFolder: this.sourceFolder, destFolder: this.destFolder, syncInterval: this.syncInterval, autoCopyEnabled: this.autoCopyEnabled });
    }

    
    updateTimer() {
        if (this.autoCopyEnabled) {
            if (this.timer) {
                clearInterval(this.timer);
            }
            this.timer = setInterval(() => {
                this.copyMarkdownFiles();
            }, this.syncInterval);
        } else {
            if (this.timer) {
                clearInterval(this.timer);
            }
        }
    }

    copyMarkdownFiles() {
        const fs = require('fs');
        const path = require('path');
        
        fs.readdir(this.sourceFolder, (err, files) => {
            if (err) throw err;
            
            for (const file of files) {
                if (file.endsWith('.md')) {
                    const srcPath = path.join(this.sourceFolder, file);
                    const destPath = path.join(this.destFolder, file);
                    
                    fs.copyFile(srcPath, destPath, (err) => {
                        if (err) throw err;
                        console.log(`${file} was copied to ${destPath}`);
                    });
                }
            }
        });
    }
}

class MarkdownFileCopySettingTab extends PluginSettingTab {
    plugin: MarkdownFileCopyPlugin;

    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        let containerEl = this.containerEl;

        containerEl.empty();
        
        new Setting(containerEl)
            .setName('Source Folder (원본 위치)')
            .setDesc('Path to the source folder')
            .addText(text => text
                .setPlaceholder('/path/to/source/folder')
                .setValue(this.plugin.sourceFolder)
                .onChange(async (value) => {
                    this.plugin.sourceFolder = value;
                    await this.plugin.saveSettings();
                }));
        
        
        
        new Setting(containerEl)
            .setName('Enable Automatic Copy')
            .setDesc('Turn on/off automatic copying of markdown files')
            .addToggle(toggle => toggle
                .setValue(this.plugin.autoCopyEnabled)
                .onChange(async (value) => {
                    this.plugin.autoCopyEnabled = value;
                    await this.plugin.saveSettings();
                    this.plugin.updateTimer();
                }));

        new Setting(containerEl)
            .setName('Synchronization Interval (동기화 간격)')
            .setDesc('Interval for automatic synchronization in milliseconds')
            .addText(text => text
                .setPlaceholder('60000')
                .setValue(this.plugin.syncInterval.toString())
                .onChange(async (value) => {
                    this.plugin.syncInterval = parseInt(value);
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Destination Folder (복사할 위치)')
            .setDesc('Path to the destination folder')
            .addText(text => text
                .setPlaceholder('/path/to/dest/folder')
                .setValue(this.plugin.destFolder)
                .onChange(async (value) => {
                    this.plugin.destFolder = value;
                    await this.plugin.saveSettings();
                }));
    }
}