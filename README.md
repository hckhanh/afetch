# fast-url [![NPM Downloads](https://img.shields.io/npm/dw/fast-url)](https://www.npmjs.com/package/fast-url) [![JSR](https://jsr.io/badges/@hckhanh/fast-url/weekly-downloads)](https://jsr.io/@hckhanh/fast-url)

A folk version of the [urlcat](https://github.com/balazsbotond/urlcat) focuses on performance and simplicity.
Build correct URLs easily. A fast, minimal fork of urlcat focused on performance and simplicity.

[![Test](https://github.com/hckhanh/fast-url/actions/workflows/test.yml/badge.svg)](https://github.com/hckhanh/fast-url/actions/workflows/test.yml)
[![codecov](https://codecov.io/github/hckhanh/fast-url/graph/badge.svg?token=6W7S96H6OT)](https://codecov.io/github/hckhanh/fast-url)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=hckhanh_fast-url&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=hckhanh_fast-url)
[![Bundle Size](https://badgen.net/bundlephobia/minzip/fast-url)](https://bundlephobia.com/result?p=fast-url)
[![CodSpeed](https://img.shields.io/endpoint?url=https://codspeed.io/badge.json)](https://codspeed.io/hckhanh/fast-url)

fast-url is a tiny JavaScript/TypeScript library that makes building URLs convenient and prevents common mistakes.

## Features

- Lightweight: Only one dependency (fast-querystring) and minimal bundle size
- Type safe: Written in TypeScript with full type definitions
- URL safe: Automatically escapes parameters and handles edge cases
- Unicode-aware: Uses `codePointAt` for proper Unicode handling, including graceful encoding of lone surrogates
- Flexible: Multiple ways to build URLs for different use cases

## Installation

```bash
# Using JSR (recommended for Deno)
deno add jsr:@hckhanh/fast-url

# Using bun
bun add fast-url

# Using npm
npm install fast-url
```

## Usage

![Basic usage example](docs/urlcat-basic-usage.svg#gh-light-mode-only)
![Basic usage example (dark mode)](docs/urlcat-basic-usage-dark.svg#gh-dark-mode-only)

### Basic URL building

```javascript
import { createUrl } from "fast-url";

// Path parameters
createUrl("https://api.example.com", "/users/:id", { id: 123 });
// → 'https://api.example.com/users/123'

// Query parameters
createUrl("https://api.example.com", "/users", { limit: 10, offset: 20 });
// → 'https://api.example.com/users?limit=10&offset=20'

// Combined path and query parameters
createUrl("https://api.example.com", "/users/:id/posts", { id: 123, limit: 10 });
// → 'https://api.example.com/users/123/posts?limit=10'
```

### CommonJS

```javascript
const { createUrl } = require("fast-url");
```

### Utility functions

```javascript
import { query, subst, join } from "fast-url";

// Build query strings
query({ name: "John", age: 30 });
// → 'name=John&age=30'

// Substitute path parameters
subst("/users/:id/posts/:postId", { id: 123, postId: 456 });
// → '/users/123/posts/456'

// Join URL parts
join("https://api.example.com/", "/", "/users");
// → 'https://api.example.com/users'
```

## API

### `createUrl(baseUrl, pathTemplate, params?)`

Build a complete URL by combining a base URL, path template, and parameters.

### `createUrl(baseTemplate, params)`

Use a single template containing path parameters; unused params become query parameters.

### `query(params)`

Build a query string from an object of key-value pairs.

### `subst(template, params)`

Substitute path parameters in a template string.

### `join(part1, separator, part2)`

Join two URL parts with exactly one separator.

## Why fast-url?

Building URLs manually is error-prone:

```javascript
// ❌ Error-prone manual approach
const url = `${baseUrl}/users/${id}/posts?limit=${limit}&offset=${offset}`;
// Issues: double slashes, unescaped parameters, complex concatenation
```

```javascript
// ✅ Clean and safe with fast-url
const url = createUrl(baseUrl, "/users/:id/posts", { id, limit, offset });
```

fast-url handles:

- Automatic parameter escaping
- Proper URL segment joining
- Clean separation of path and query parameters

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
