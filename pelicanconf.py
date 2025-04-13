AUTHOR = 'Samuel wågbrant, Herman Heljelid'
SITENAME = 'SweF1'
SITEURL = ""

PATH = "content"

TIMEZONE = 'Europe/Stockholm'

DEFAULT_LANG = 'en'

# filepath: /home/samuel/github/F1-website/pelicanconf.py
THEME = "themes/notmyidea"

# Feed generation is usually not desired when developing
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None

# Blogroll
LINKS = (
    ("Pelican", "https://getpelican.com/"),
    ("Python.org", "https://www.python.org/"),
    ("Jinja2", "https://palletsprojects.com/p/jinja/"),
    ("You can modify those links in your config file", "#"),
)

# Social widget
SOCIAL = (
    ("You can add links in your config file", "#"),
    ("Another social link", "#"),
)

DEFAULT_PAGINATION = False

import json

with open("content/standings_and_predictions.json", "r") as f:
    STANDINGS_DATA = json.load(f)

JINJA_GLOBALS = {
    "standings": STANDINGS_DATA
}

# filepath: /home/samuel/github/F1-website/pelicanconf.py
IGNORE_FILES = ["output/*"]

# Uncomment following line if you want document-relative URLs when developing
# RELATIVE_URLS = True
