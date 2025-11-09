# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Currently supported versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of what-the-fetch seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### Please do NOT:

- Open a public GitHub issue for security vulnerabilities
- Disclose the vulnerability publicly before it has been addressed

### Please DO:

**Report security vulnerabilities by email to: hi@khanh.id**

Please include the following information in your report:

- Type of vulnerability (e.g., XSS, injection, etc.)
- Full paths of source file(s) related to the vulnerability
- Location of the affected source code (tag/branch/commit or direct URL)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the vulnerability, including how an attacker might exploit it

### What to expect:

1. **Acknowledgment**: We will acknowledge receipt of your vulnerability report within 48 hours
2. **Communication**: We will keep you informed about our progress throughout the process
3. **Assessment**: We will investigate and confirm the vulnerability within 7 days
4. **Fix**: We will work on a fix and release timeline
5. **Disclosure**: Once the vulnerability is patched, we will publicly disclose it, crediting you (unless you prefer to remain anonymous)

## Security Best Practices

When using what-the-fetch in your applications:

1. **Keep Dependencies Updated**: Regularly update to the latest version of what-the-fetch to receive security patches
2. **Input Validation**: Always validate user input before passing it to API calls, even with schema validation enabled
3. **Use TypeScript**: Take advantage of TypeScript's type safety to catch potential issues at compile time
4. **Schema Validation**: Ensure your schemas properly validate all response data to prevent unexpected data from being processed

## Scope

The following are considered in scope for security reports:

- Schema validation bypass vulnerabilities
- Type safety violations
- URL injection vulnerabilities
- XSS vectors through API responses
- Data leakage through improper validation
- Any behavior that could lead to security issues in applications using what-the-fetch

## Out of Scope

The following are generally not considered security vulnerabilities:

- Issues requiring physical access to a user's device
- Social engineering attacks
- Issues in outdated/unsupported versions
- Theoretical vulnerabilities without proven exploit path

## Attribution

We believe in recognizing security researchers who help keep our project safe. If you report a valid security vulnerability, we will:

- Credit you in the release notes (unless you prefer to remain anonymous)
- List you in our security acknowledgments
- Provide updates on the fix and release timeline

## Contact

For any questions about this security policy, please contact: hi@khanh.id

## Learn More

For general bugs and feature requests, please use our [GitHub Issues](https://github.com/hckhanh/what-the-fetch/issues).
