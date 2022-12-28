# Diskussed

Diskussed is a browser extension (tested on Firefox only right now) that finds forums where the current url has been discussed.
Think for example you are reading a blog. The blog has been previously discussed on HackerNews. If you want, you can do a google search or even use Algolia to see if this has been discussed. But this is an extra action that is time consuming and takes up mental bandwidth.

Instead, while you are reading the blog, Diskussed will take the current url, strip the query parameters and computes its SHA256 and sends it to the backend service https://github.com/mrahul17/diskussed-backend/  which simply matches the hash in a pre-populated database. If it finds a match, Diskussed will notify you by showing a badge and on clicking it, you will see the list of urls where the link has been discussed.


As of today, the database has 50000 stories from HackerNews, starting November 16 2022, because that is the most recent data on HackerNews' BigQuery dataset.


This project is far from complete, but needs users to provide feedback and help in finding performance bottlenecks. So contributions are very much welcome.



Diskussed is licensed under **MIT License**
