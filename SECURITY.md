# Security Policy

## Important Notice

This repository is primarily a reference implementation for a Shadowrun Anarchy GPT assistant. While we appreciate security reports, please understand that active support and rapid response to security issues may be limited.

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| Latest  | ⚠️ Limited support |
| Older   | ❌ Not supported   |

## Reporting a Vulnerability

If you discover a security vulnerability in this project:

### For Critical Security Issues

1. **DO NOT** create a public GitHub issue
2. Email details to the repository owner through GitHub's private communication features
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Any suggested fixes

### For Non-Critical Issues

1. Create a GitHub issue with the `security` label
2. Provide the same information as above

## Response Expectations

Due to the limited support nature of this repository:

- **Response time**: May range from days to weeks, or longer
- **Resolution time**: Depends on severity and complexity
- **Updates**: Will be provided when possible

## Security Best Practices

When using this code:

### For Developers

- Review all code before implementation
- Keep dependencies updated
- Use environment variables for sensitive configuration
- Implement proper input validation
- Follow security best practices for your target platform

### For GPT Integration

- Never expose sensitive data through the GPT interface
- Validate all inputs from the GPT
- Implement rate limiting where appropriate
- Monitor for unusual usage patterns

## Known Considerations

- This code may contain patterns suitable for demonstration but not production
- Security measures may be simplified for clarity
- Always conduct your own security review before production use

## Dependencies

Monitor dependencies for security updates:

- Check `package.json` for Node.js dependencies
- Review `requirements.txt` for Python dependencies
- Check `.csproj` files for .NET dependencies

## Scope

This security policy covers:

- Code in this repository
- Dependencies explicitly included
- Configuration examples

This policy does NOT cover:

- Third-party services mentioned in documentation
- User implementations based on this code
- The OpenAI GPT platform itself

## Disclaimer

This is reference code with limited support. Users are responsible for their own security assessments and implementations.
