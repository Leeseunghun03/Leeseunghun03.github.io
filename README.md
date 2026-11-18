# Seunghun Lee

Personal academic website: https://leeseunghun03.github.io/

Built with Jekyll. The homepage contains a short introduction, publications,
education, research experience, and selected honors.

## Edit

- `index.md`: homepage structure and introduction.
- `_data/profile.yml`: education, experience, and honors.
- `_publications/`: publication metadata and BibTeX.
- `assets/css/site.css`: styles; `assets/js/site.js`: interactions.
- `files/`: CV, paper PDFs, and citation files.
- `images/social-card.svg`: source for the link preview card; export as
  `images/social-card.png` at 1200 × 630 after editing. Sharing metadata is in
  `_layouts/default.html`.

## Preview

```sh
bundle install
bundle exec jekyll serve --host 127.0.0.1
```

Use `bundle3.0` if that is the installed Bundler command. Open localhost:4000.

## Publish

Push `main` to this repository, then choose **Settings → Pages → Deploy from a
branch → main → /(root)**. Later pushes rebuild the site automatically.

## CV

Run `python3 scripts/build-cv.py` to rebuild the PDF. Requires PyYAML and XeLaTeX.

Third-party copyright and license notices are preserved in [NOTICE.md](NOTICE.md).
