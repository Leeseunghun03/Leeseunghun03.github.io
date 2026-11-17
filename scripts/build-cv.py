#!/usr/bin/env python3
"""Build the downloadable Awesome-CV PDF from the website's content data."""

from pathlib import Path
import re
import shutil
import subprocess
import sys

import yaml


ROOT = Path(__file__).resolve().parent.parent
ESCAPES = {
    '\\': r'\textbackslash{}', '{': r'\{', '}': r'\}',
    '$': r'\$', '&': r'\&', '#': r'\#', '%': r'\%',
    '_': r'\_', '^': r'\textasciicircum{}', '~': r'\textasciitilde{}',
}


def tex(value):
    """Escape plain content for LaTeX without changing unicode punctuation."""
    return re.sub(r'[\\{}$&#%_^~]', lambda match: ESCAPES[match[0]], str(value))


def frontmatter(path):
    return yaml.safe_load(path.read_text().split('---', 2)[1])


def entry(role, title, organization, dates, description):
    fields = [role, title, organization, dates]
    header = '\\cventry\n' + '\n'.join('  {' + tex(value) + '}' for value in fields)
    if not description:
        return header + '\n  {}'
    return header + '\n  {\\begin{cvitems}\\item ' + tex(description) + '\\end{cvitems}}'


def main():
    profile = yaml.safe_load((ROOT / '_data/profile.yml').read_text())
    config = yaml.safe_load((ROOT / '_config.yml').read_text())
    papers = sorted((frontmatter(p) for p in (ROOT / '_publications').glob('*.md')),
                    key=lambda paper: paper['order'])
    education = [entry(i['degree'], i['institution'], i['location'], i['dates'], i['description'])
                 for i in profile['education']]
    experience = [entry(i.get('role') or i.get('support', ''), i['title'],
                        i['organization'], i['dates'], i['description'])
                  for i in profile['experience']]
    publications = []
    for paper in papers:
        authors = re.sub(r'<sup>(.*?)</sup>', r'\1', paper['authors']).replace('**', '')
        authors = tex(authors).replace('Seunghun Lee', r'\textbf{Seunghun Lee}')
        authors = authors.replace('Lee*', r'Lee\textsuperscript{*}').replace('Nam*', r'Nam\textsuperscript{*}')
        # The bold name ends with a brace, so apply its contribution mark separately.
        authors = authors.replace('Lee}*', r'Lee}\textsuperscript{*}')
        publications.append(r'\item ' + authors + ', ``' + tex(paper['title']) + ",'' "
                            + r'\textit{' + tex(paper['venue']) + '}.')
    honors = []
    for honor in profile['honors']:
        event = honor['event']
        if honor.get('description'):
            event += ' — ' + honor['description']
        honors.append(r'\cvhonor{' + tex(honor['title']) + '}{' + tex(event)
                      + '}{}{' + tex(honor['dates']) + '}')
    replacements = {
        'EMAIL': tex(config['author']['email']),
        'GITHUB': tex(config['author']['github']),
        'SUMMARY': tex(profile['summary']),
        'EDUCATION': '\n\n'.join(education),
        'EXPERIENCE': '\n\n'.join(experience),
        'PUBLICATIONS': '\n'.join(publications),
        'HONORS': '\n'.join(honors),
    }
    source = (ROOT / 'cv-source/cv.tex').read_text()
    for key, value in replacements.items():
        source = source.replace('@@' + key + '@@', value)
    if re.search(r'@@[A-Z]+@@', source):
        raise RuntimeError('Unfilled CV content placeholder')
    build = ROOT / '.bundle/cv-build'
    build.mkdir(parents=True, exist_ok=True)
    generated = build / 'cv.tex'
    generated.write_text(source)
    compiler = shutil.which('xelatex')
    if not compiler:
        raise RuntimeError('XeLaTeX is required to build the downloadable CV')
    log_path = build / 'xelatex-output.log'
    with log_path.open('w') as log:
        for _ in range(2):
            result = subprocess.run([compiler, '-no-shell-escape', '-interaction=nonstopmode',
                                     '-halt-on-error', '-file-line-error',
                                     '-output-directory=' + str(build), str(generated)],
                                    cwd=ROOT / 'cv-source', stdout=log, stderr=subprocess.STDOUT)
            if result.returncode:
                raise RuntimeError('CV compilation failed; inspect ' + str(log_path))
    output = ROOT / 'files/seunghun-lee-cv.pdf'
    temporary = output.with_suffix('.pdf.tmp')
    shutil.copyfile(build / 'cv.pdf', temporary)
    temporary.replace(output)
    print('Updated files/seunghun-lee-cv.pdf from profile and publication data.')


if __name__ == '__main__':
    try:
        main()
    except (OSError, RuntimeError, yaml.YAMLError) as error:
        print(error, file=sys.stderr)
        sys.exit(1)
