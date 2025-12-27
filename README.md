# lnkshortner

A simple, modern URL shortener that lets you use your own custom aliases instead of being forced into random strings.

Have you ever wanted to shorten links but still keep clean, readable, memorable URLs?  
lnkshortner gives you full control over your links.

Live instance : https://s.vicilabs.dev 

---

## Overview

lnkshortner is a lightweight URL shortening service designed around ownership and simplicity.  
You choose the slug. You control the domain. There is no third-party branding or enforced naming scheme.

This project is built for personal use, internal tools, and branded links where clarity matters.

---

## Features

- Custom, human-readable aliases
- Fast and reliable redirects
- Minimal and maintainable codebase
- Production deployment ready
- No forced branding or random IDs

---

## Tech Stack

- TypeScript
- JavaScript
- CSS

---

## Project Structure

```txt
.
├── lnkstr/        Core shortener logic
├── wker/          Worker and redirect handling
├── .gitignore
└── README.md
````

---

## Getting Started

Clone the repository

```bash
git clone https://github.com/Aditya-Baindur/lnkshortner.git
cd lnkshortner
```

Install dependencies

```bash
npm install
```

Run locally

```bash
npm run dev
```

If deploying, ensure required environment variables and deployment configuration are set correctly for the Cloudflare worker.


---

## Design Philosophy

lnkshortner is intentionally minimal.

* You own the domain
* You define the aliases
* You control the infrastructure

No unnecessary analytics, no vendor lock-in, and no complexity beyond what is required.

---

## License

Private repository. All rights reserved.

---

## Author

Aditya Baindur
