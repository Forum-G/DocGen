# ⚡ DocGen — AI-Powered API Documentation Generator

> Paste raw endpoint definitions. Get clean, professional Markdown docs with one click. Export to PDF.

![DocGen Screenshot](https://via.placeholder.com/900x500/0d0d0d/F59E0B?text=DocGen+Preview)

---

## Features

- **AI Generation** — Powered by Claude (Anthropic). Converts freeform endpoint definitions into structured, professional documentation
- **Split-panel editor** — Write definitions on the left, see docs appear on the right
- **Dual output views** — Toggle between raw Markdown source and a rendered preview
- **PDF export** — One-click print-ready export with a clean light theme
- **Summary table** — Auto-generates an endpoint overview table at the top of every doc
- **Zero config** — No database, no auth, no backend. Runs entirely in the browser

---

## Tech Stack

| Layer      | Technology          |
|------------|---------------------|
| Framework  | React 18 + Vite     |
| AI Model   | Claude Sonnet (Anthropic) |
| Styling    | CSS-in-JS (no dependencies) |
| Fonts      | JetBrains Mono + Newsreader |
| Export     | Browser Print API   |

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/docgen.git
cd docgen
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up your API key

The app calls the Anthropic API directly from the browser. The API key is handled by the Claude.ai environment automatically — **no `.env` file needed** when running inside Claude artifacts.

If you're self-hosting, add your Anthropic API key to requests in `src/api.js`:

```js
headers: {
  "Content-Type": "application/json",
  "x-api-key": "YOUR_ANTHROPIC_API_KEY",   // ← add this line
  "anthropic-version": "2023-06-01",
}
```

> ⚠️ Never commit API keys. Use environment variables in production.

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### 5. Build for production

```bash
npm run build
npm run preview
```

---

## Usage

### Input format

DocGen accepts freeform text. Use any structure that describes your endpoints clearly:

```
POST /api/users/register
Description: Register a new user account
Headers:
  Content-Type: application/json
Body:
  name: string (required) - Full name
  email: string (required) - Valid email
Responses:
  201: User created
  400: Validation error
  409: Email already exists

---

GET /api/users/:id
Description: Get user by ID
Headers:
  Authorization: Bearer <token>
Responses:
  200: User object
  404: Not found
```

### Output

DocGen generates:

- **Summary table** — all endpoints at a glance
- **Per-endpoint sections** — method, path, description, parameter tables, code examples
- **JSON examples** — realistic request/response bodies
- **Export-ready PDF** — formatted for printing or sharing

---

## Project Structure

```
docgen/
├── src/
│   ├── App.jsx          # Main app + all UI components
│   ├── api.js           # Anthropic API integration
│   ├── markdown.js      # Markdown → HTML renderer + PDF builder
│   ├── constants.js     # Sample endpoint data
│   ├── main.jsx         # React entry point
│   └── index.css        # Global resets + scrollbar styles
├── index.html
├── vite.config.js
├── package.json
└── .gitignore
```

---

## Deployment

### Vercel (recommended)

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm run build
# drag & drop the dist/ folder to netlify.com/drop
```

### GitHub Pages

```bash
npm install --save-dev gh-pages
```

Add to `package.json`:
```json
"scripts": {
  "deploy": "gh-pages -d dist"
}
```

Then run:
```bash
npm run build && npm run deploy
```

---

## Contributing

Pull requests are welcome. For major changes, open an issue first.

1. Fork the repo
2. Create a branch: `git checkout -b feature/my-feature`
3. Commit: `git commit -m 'Add my feature'`
4. Push: `git push origin feature/my-feature`
5. Open a Pull Request

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

<p align="center">Built with ⚡ by <a href="https://github.com/your-username">your-username</a></p>
