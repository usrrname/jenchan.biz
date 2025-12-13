/**
 * URL validation utilities to prevent SSRF attacks
 */

/**
 * Validates that an ID is a safe positive integer
 * @param id - The ID to validate
 * @returns The validated ID as a number, or throws an error
 */
export function validateArticleId(id: unknown): number {
  // Ensure id is a number
  // validate int 32 bit positive integer (max 2147483647, min 0)
  if (typeof id !== 'number' || (!Number.isInteger(id) || id <= 0 || !Number.isFinite(id) || id > 2147483647)) {
    throw new Error(`Invalid article ID: ${id}`)
  }

  return id
}

/**
 * Validates and sanitizes a URL to ensure it only points to allowed domains
 * @param url - The URL to validate
 * @param allowedDomains - Array of allowed domain names (e.g., ['dev.to', 'api.github.com'])
 * @returns The validated URL string, or throws an error
 */
export function validateUrl(url: string, allowedDomains: string[]): string {
  let parsedUrl: URL

  try {
    parsedUrl = new URL(url)
  } catch (error) {
    throw new Error(`Invalid URL format: ${url}`)
  }

  // Only allow HTTPS protocol
  if (parsedUrl.protocol !== 'https:') {
    throw new Error(`Invalid URL protocol: only HTTPS is allowed`)
  }

  // Check if the hostname matches any allowed domain
  const hostname = parsedUrl.hostname.toLowerCase()
  const isAllowed = allowedDomains.some((domain) => {
    const normalizedDomain = domain.toLowerCase()
    return hostname === normalizedDomain || hostname.endsWith(`.${normalizedDomain}`)
  })

  if (!isAllowed) {
    throw new Error(`URL hostname not allowed: ${hostname}`)
  }

  // Block private/internal IP addresses (additional safety)
  if (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '0.0.0.0' ||
    hostname.startsWith('192.168.') ||
    hostname.startsWith('10.') ||
    hostname.startsWith('172.16.') ||
    hostname.startsWith('172.17.') ||
    hostname.startsWith('172.18.') ||
    hostname.startsWith('172.19.') ||
    hostname.startsWith('172.20.') ||
    hostname.startsWith('172.21.') ||
    hostname.startsWith('172.22.') ||
    hostname.startsWith('172.23.') ||
    hostname.startsWith('172.24.') ||
    hostname.startsWith('172.25.') ||
    hostname.startsWith('172.26.') ||
    hostname.startsWith('172.27.') ||
    hostname.startsWith('172.28.') ||
    hostname.startsWith('172.29.') ||
    hostname.startsWith('172.30.') ||
    hostname.startsWith('172.31.')
  ) {
    throw new Error(`Private/internal IP addresses are not allowed`)
  }

  return url
}

/**
 * Validates GitHub owner and repo names to prevent path traversal and injection
 * @param owner - GitHub owner/username
 * @param repo - GitHub repository name
 * @returns Object with validated owner and repo, or throws an error
 */
export function validateGithubOwnerRepo(owner: string, repo: string): {
  owner: string
  repo: string
} {
  // GitHub username/repo validation rules:
  // - Alphanumeric, hyphens, underscores only
  // - Cannot start or end with hyphen
  // - Max length 39 characters (GitHub limit)
  // - Cannot be empty

  const githubNamePattern = /^[a-zA-Z0-9]([a-zA-Z0-9_-]*[a-zA-Z0-9])?$/

  if (!owner || typeof owner !== 'string') {
    throw new Error('Invalid GitHub owner: must be a non-empty string')
  }

  if (!repo || typeof repo !== 'string') {
    throw new Error('Invalid GitHub repo: must be a non-empty string')
  }

  if (owner.length > 39 || repo.length > 39) {
    throw new Error('Invalid GitHub owner/repo: exceeds maximum length of 39 characters')
  }

  if (!githubNamePattern.test(owner)) {
    throw new Error(`Invalid GitHub owner format: ${owner}`)
  }

  if (!githubNamePattern.test(repo)) {
    throw new Error(`Invalid GitHub repo format: ${repo}`)
  }

  // Additional safety: check for path traversal attempts
  if (owner.includes('..') || owner.includes('/') || owner.includes('\\')) {
    throw new Error('Invalid GitHub owner: contains illegal characters')
  }

  if (repo.includes('..') || repo.includes('/') || repo.includes('\\')) {
    throw new Error('Invalid GitHub repo: contains illegal characters')
  }

  return { owner, repo }
}

/**
 * Validates a slug to prevent injection attacks
 * @param slug - The slug to validate
 * @returns The validated slug, or throws an error
 */
export function validateSlug(slug: string): string {
  if (!slug || typeof slug !== 'string') {
    throw new Error('Invalid slug: must be a non-empty string')
  }

  // Slugs should only contain alphanumeric characters, hyphens, underscores, and forward slashes
  // This is a reasonable pattern for blog post slugs
  const slugPattern = /^[a-zA-Z0-9/_-]+$/

  if (!slugPattern.test(slug)) {
    throw new Error(`Invalid slug format: ${slug}`)
  }

  // Prevent path traversal
  if (slug.includes('..') || slug.startsWith('/') || slug.includes('//')) {
    throw new Error('Invalid slug: contains path traversal characters')
  }

  // Reasonable length limit
  if (slug.length > 500) {
    throw new Error('Invalid slug: exceeds maximum length')
  }

  return slug
}
