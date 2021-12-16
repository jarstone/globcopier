# globcopier

### Installation

```bash
npm install globcopier -g
```
### Usage/Examples

```json
// data.json
{
	"vendor/bootstrap": "node_modules/bootstrap/dist/js/bootstrap.bundle.*",
	"vendor/summernote": [
		"node_modules/summernote/dist/**/*",
		"!node_modules/summernote/dist/**/*.{zip,txt}"
	]
}
```

```bash
globcopier data.json
globcopier data.json --watch
```
