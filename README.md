# Grammar Flow

Grammar Flow is an interactive platform for studying English grammar.

## Documentation

Full documentation of features and project structure can be found in [documentation.md](./documentation.md).

## Deployment

### Vercel

This project is configured for deployment on Vercel.

1.  **Install Vercel CLI** (Optional, for local deployment):
    ```bash
    npm i -g vercel
    ```

2.  **Deploy**:
    Run the following command in the root directory:
    ```bash
    vercel
    ```

3.  **Configuration**:
    The project includes a `vercel.json` file optimized for static serving:
    - Clean URLs (e.g., `/pages/verbs` instead of `/pages/verbs.html`)
    - Static asset handling

### Manual

Start a local server using Python:
```bash
python -m http.server 8000
```
Then access [http://localhost:8000](http://localhost:8000).
