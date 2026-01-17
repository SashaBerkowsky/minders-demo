# Minders Feedback SDK

Browser widget SDK for embedding feedback forms.

## Installation
1. `cd sdk`
2. `npm install`
3. `npm run build` (generates dist/)

## Usage
### Via Script Tag
```html
<script src="path/to/minders-feedback-sdk.js"></script>
<script>
  window.FeedbackSDK.init({
    projectId: "0",
    apiKey: "minders_secret_key_0",
    apiEndpoint: "http://localhost:3000/api/feedback",
    theme: { primaryColor: "#3b82f6" },
    onSuccess: (feedback) => console.log("Submitted", feedback),
    onError: (error) => console.error("Error", error)
  });
</script>
```

### Via Import
```javascript
import { FeedbackSDK } from './dist/minders-feedback-sdk.js';
FeedbackSDK.init({ /* config */ });
```

## Demo
- Open `demo.html` in browser.
- Click widget, submit feedback, check backend logs.

## Testing
- Unit/Integration: `npm run test:coverage`
- Build Test: `npm run build:test`

## Configuration Options
- `projectId`, `apiKey`: Required for auth.
- `apiEndpoint`: API URL (default: production).
- `theme`: Customize colors.
- `debug`: Enable logging.
- `onSuccess/onError`: Callbacks.

## ADR
See [docs/adr.md](../docs/adr.md).