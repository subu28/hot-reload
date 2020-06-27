# hot-reload
a minimal http file server to develop tiny web apps with automatic reloading

# Install

`npm install -g subu28/hot-reload`

# Usage
`hot-reload [--port 8088] [--watch-dir src]`

# Settings

| Argument | Default Value | Description |
| -------- | ------------- | ----------- |
| --port | 8088 | the port at which the dev server will run |
| --watch-dir | src | the directory from where the files will be watched and served |
| --debounce | 100 | the time to wait before reloading after last change |
| --try-index | true | adjusts the way requests that point to a folder are handled. by defualt it tries to serve index.html and fallbacks to folder contents. if set to false it will serve folder contents even if index.html is present in that folder |