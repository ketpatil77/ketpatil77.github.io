# Ketan Patil Portfolio

Personal portfolio website for Ketan Patil, presenting AI/ML systems, cybersecurity work, full-stack projects, research, and production platforms.

## Local preview

This repository is a static website. Serve the repository root with any local static HTTP server, then open the reported local URL in a browser.

For example, with Python:

```bash
python -m http.server 8000
```

Open `http://127.0.0.1:8000/`.

## Deployment

The repository is configured as a GitHub Pages-style static site. `index.html` is the site entry point and references the generated assets under `assets/` and images under `images/`.

## Notes

- The site requires JavaScript for its interactive experience.
- Social preview metadata and the canonical URL are defined in `index.html`.
- The page uses versioned query parameters for cache-busting after deployments.
- Keep generated asset filenames referenced by `index.html` synchronized with the deployed asset directory.

## License

No license file is currently included. Unless a license is added, the site's original content and assets should be treated as all rights reserved.
