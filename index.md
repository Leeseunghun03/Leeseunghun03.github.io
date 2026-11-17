---
layout: default
title: "Seunghun Lee"
permalink: /
home: true
description: "Seunghun Lee, M.S. student in Robotics at KAIST. SLAM, multimodal state estimation, and autonomous navigation."
---

<section id="about" class="intro" aria-labelledby="intro-title">
  <div class="intro-copy">
    <div class="intro-identity">
      <h1 id="intro-title">Seunghun Lee</h1>
      <p class="role">M.S. Student in Robotics<br><a href="https://urobot.kaist.ac.kr/">Urban Robotics Lab</a> · KAIST</p>
    </div>
    <div class="bio">
      <p>I am an M.S. student in the Robotics Program at <a href="https://www.kaist.ac.kr/en/">KAIST</a>, advised by <a href="https://urobot.kaist.ac.kr/url_teams/prof-hyunmyung/">Prof. Hyun Myung</a> in the Urban Robotics Lab.</p>
      <p>My research focuses on SLAM, multimodal state estimation, and autonomous navigation in challenging real-world environments.</p>
    </div>
    <div class="contact-links" aria-label="Contact and profiles">
      <a class="contact-link contact-link--email" href="mailto:{{ site.author.email }}">{% include ui-icon.html name="email" %}<span>Email</span></a>
      <a class="contact-link contact-link--github" href="https://github.com/{{ site.author.github }}">{% include ui-icon.html name="github" %}<span>GitHub</span></a>
      <a class="contact-link contact-link--cv" href="{{ '/files/seunghun-lee-cv.pdf' | relative_url }}">{% include ui-icon.html name="document" %}<span>CV (PDF)</span></a>
      <a class="contact-link contact-link--linkedin" href="https://www.linkedin.com/in/{{ site.author.linkedin }}/">{% include ui-icon.html name="linkedin" %}<span>LinkedIn</span></a>
    </div>
    <div class="interests">
      <h2>Research interests</h2>
      <ul>{% for interest in site.data.profile.interests %}<li>{{ interest }}</li>{% endfor %}</ul>
    </div>
  </div>
  <figure class="portrait">
    <img src="{{ '/images/profile.jpg' | relative_url }}" alt="Seunghun Lee" width="196" height="196" fetchpriority="high">
  </figure>
</section>
<section id="publications" class="home-section" aria-labelledby="publications-heading">
  <div class="section-heading"><h2 id="publications-heading"><span class="section-symbol" aria-hidden="true">{% include ui-icon.html name="book" %}</span><span>Publications</span></h2></div>
  <div class="research-list">
    {% assign papers = site.publications | sort: "date" | reverse %}
    {% for paper in papers %}{% include research-card.html paper=paper motion=true %}{% endfor %}
  </div>
  <p class="contribution-note">* Equal contribution.</p>
  <span class="sr-only" data-copy-status role="status" aria-live="polite" aria-atomic="true"></span>
</section>
<section id="background" class="home-section" aria-labelledby="background-heading">
  <div class="section-heading"><h2 id="background-heading"><span class="section-symbol" aria-hidden="true">{% include ui-icon.html name="education" %}</span><span>Education &amp; Experience</span></h2></div>
  <div id="education" class="background-group">
    <h3>Education</h3>
    {% for item in site.data.profile.education %}
    <div class="cv-entry">
      <a class="organization-mark{% if item.mark_style %} organization-mark--{{ item.mark_style }}{% endif %}" href="{{ item.url }}" aria-label="{{ item.logo_alt | escape }} website">
        <img src="{{ item.logo | relative_url }}" alt="{{ item.logo_alt | escape }}" width="112" height="72" loading="lazy">
      </a>
      <div class="cv-entry-main">
        <div class="entry-heading"><h4><a href="{{ item.url }}">{{ item.institution }}</a></h4><p class="cv-date">{{ item.dates }}</p></div>
        <p>{{ item.degree }}</p><p class="cv-subtitle">{{ item.location }}</p><p>{{ item.description }}</p>
      </div>
    </div>
    {% endfor %}
  </div>
  <div id="experience" class="background-group">
    <h3>Research &amp; engineering experience</h3>
    {% for item in site.data.profile.experience %}
    <div class="cv-entry cv-entry--plain">
      <div class="cv-entry-main">
        <div class="entry-heading"><h4>{{ item.title }}</h4><p class="cv-date">{{ item.dates }}</p></div>
        <p class="cv-subtitle"><a href="{{ item.url }}">{{ item.organization }}</a>{% if item.support %}<br>{{ item.support }}{% endif %}{% if item.role %}<br>{{ item.role }}{% endif %}</p>{% if item.description != blank %}<p>{{ item.description }}</p>{% endif %}
        {% if item.video_url %}<div class="entry-resources"><a class="video-link" href="{{ item.video_url }}" aria-label="Watch {{ item.title | escape }} video on YouTube">{% include ui-icon.html name="video" %}<span>Video</span></a></div>{% endif %}
      </div>
    </div>
    {% endfor %}
  </div>
</section>
<section id="honors" class="home-section" aria-labelledby="honors-heading">
  <div class="section-heading"><h2 id="honors-heading"><span class="section-symbol" aria-hidden="true">{% include ui-icon.html name="trophy" %}</span><span>Honors &amp; Awards</span></h2></div>
  <ul class="honors-list">
    {% for honor in site.data.profile.honors %}
    {% unless honor.show_on_home == false %}
    <li{% if honor.logos %} class="honor--illustrated"{% endif %}>
      <time>{{ honor.dates }}</time>
      <div class="honor-content">
        <div class="honor-copy">
          <p class="honor-title">{{ honor.title }}</p>
          <p class="honor-event">{% if honor.url %}<a href="{{ honor.url }}">{{ honor.event }}</a>{% else %}{{ honor.event }}{% endif %}</p>
          {% if honor.description %}<p class="honor-description">{{ honor.description }}</p>{% endif %}
          {% if honor.result_url %}<a class="honor-results" href="{{ honor.result_url }}">Official results <span aria-hidden="true">↗</span></a>{% endif %}
          {% if honor.video_url %}<a class="video-link" href="{{ honor.video_url }}" aria-label="Watch {{ honor.event | escape }} video on YouTube">{% include ui-icon.html name="video" %}<span>Video</span></a>{% endif %}
        </div>
        {% if honor.logos %}
        <a class="honor-mark" href="{{ honor.url }}" aria-label="{{ honor.event | escape }} website">
          {% for logo in honor.logos %}<img src="{{ logo.src | relative_url }}" alt="{{ logo.alt | escape }}" width="132" height="42" loading="lazy">{% endfor %}
        </a>
        {% endif %}
      </div>
    </li>
    {% endunless %}
    {% endfor %}
  </ul>
</section>
