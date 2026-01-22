# Minders Feedback SDK

Browser widget SDK for embedding feedback forms.

## NPM Installation

Install the SDK via NPM for use in your project:

```bash
npm install minders-demo-sdk
```

## Development Installation

1. `cd sdk`
2. `npm install`
3. `npm run build` (generates dist/)

## Usage

### Via Script Tag

```html
<script src="https://unpkg.com/minders-demo-sdk@1.0.5/dist/minders-feedback-sdk.iife.js"></script>
<script>
  window.FeedbackSDK.init({
    projectId: '0',
    apiKey: 'minders_secret_key_0',
    apiEndpoint: 'http://localhost:3000/api/feedback',
    theme: { primaryColor: '#3b82f6' },
    onSuccess: (feedback) => console.log('Submitted', feedback),
    onError: (error) => console.error('Error', error),
  });
</script>
```

### Via Import

```javascript
import { FeedbackSDK } from 'minders-demo-sdk';
FeedbackSDK.init({
  /* config */
});
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
- `theme`: Customize widget appearance.
  - `primaryColor`: Main color for buttons and highlights (e.g., "#3b82f6").
  - `backgroundColor`: Widget background (e.g., "#ffffff").
  - `textColor`: Text color (e.g., "#1f2937").
  - `borderColor`: Border colors (e.g., "#d1d5db").
  - `inputBackgroundColor`: Input field backgrounds (e.g., "#f9fafb").
  - `submitColor`: Submit button background (e.g., "#f9fafb").
- `debug`: Enable logging.
- `onSuccess/onError`: Callbacks.

## ADR

See [docs/adr.md](../docs/adr.md).
