TrainerMate website - GitHub Pages ready build

What changed in this fixed version:
1. Added .nojekyll so GitHub Pages does not process or skip files unexpectedly.
2. Added CNAME so the custom domain remains www.trainermate.xyz when pushed.
3. Kept assets/styles.css, but also embedded the same CSS inside every HTML page so the site still displays correctly even if GitHub/browser caching or a stylesheet path causes issues.
4. Added a cache-busting stylesheet URL: ./assets/styles.css?v=20260513.

How to publish:
1. Open your GitHub repository.
2. Upload/replace the contents of this zip at the root of the branch/folder that GitHub Pages publishes from.
   - If GitHub Pages is set to main / root, these files go directly in the repo root.
   - If GitHub Pages is set to main / docs, put these files directly inside docs.
3. Commit the changes.
4. Wait a minute or two for GitHub Pages to deploy.
5. Open https://www.trainermate.xyz/ and press Ctrl + F5 for a hard refresh.

Important:
Do not upload the enclosing folder itself if GitHub Pages expects the files at root. The files index.html, CNAME, .nojekyll, and the assets folder should sit directly in the publishing root.

Before going fully live:
- Replace the download placeholder with the real installer URL.
- Confirm your support email and legal/trading details.
- Review privacy/terms against your exact payment provider, hosting setup and support workflow.
