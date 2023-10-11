# Markdown File Copy Plugin for Obsidian

This Obsidian plugin allows users to automatically copy markdown files from a specified source folder to a destination folder.

## Features

- **Single-click Copy**: Copy markdown files from a specified source folder to a destination folder with a single click.
- **Automatic Copy**: An option to enable or disable the automatic copying of markdown files.
- **Synchronization Interval**: Allows users to set the interval (in milliseconds) for automatic synchronization.

## Usage

### Setting up the Plugin

1. Install the plugin and enable it in Obsidian.
2. Navigate to the plugin settings.
3. Set the desired source and destination folders.
4. Adjust the synchronization interval as needed (in milliseconds).
5. Use the ribbon icon to manually copy the markdown files whenever needed.
6. Use the "Automatic Copy" toggle to enable or disable automatic copying of files at the specified interval.

### Manual File Copy

To manually copy the markdown files from the source to the destination:

1. Click on the ribbon icon on the Obsidian sidebar.
2. The files will be copied instantly from the source to the destination folder.

### Automatic File Copy

1. Enable the "Automatic Copy" toggle in the plugin settings.
2. The plugin will automatically copy files from the source to the destination at the set interval.

## Automatic File Copy and Performance

When using the "Automatic File Copy" feature, it's important to note that it may increase Obsidian's CPU usage, especially if the synchronization interval is set to a very short duration. This can lead to Obsidian consuming more resources and potentially affecting the performance of other applications on your system. If you experience performance issues or increased CPU usage, consider increasing the synchronization interval or disabling the automatic copy feature.

## Settings

- **Source Folder**: Specify the folder from which markdown files should be copied.
- **Destination Folder**: Specify the folder to which the markdown files should be copied.
- **Automatic Copy**: Toggle to enable or disable automatic copying of files.
- **Synchronization Interval**: Define the time interval (in milliseconds) at which the automatic copying should occur.

## Bug 

## Note

Make sure you have the necessary permissions for both the source and destination folders. Insufficient permissions can prevent the plugin from copying files.

## Support

For any issues, suggestions, or feedback, please contact the developer.
