
// Security validation utilities
export class SecurityValidator {
  // Allowed video domains for URL validation
  private static readonly ALLOWED_VIDEO_DOMAINS = [
    'youtube.com',
    'www.youtube.com',
    'youtu.be',
    'vimeo.com',
    'www.vimeo.com',
    'player.vimeo.com',
    'wistia.com',
    'fast.wistia.net',
    'loom.com',
    'www.loom.com'
  ];

  // Validate video URL
  static validateVideoUrl(url: string): { isValid: boolean; error?: string } {
    if (!url || typeof url !== 'string') {
      return { isValid: false, error: 'URL is required' };
    }

    try {
      const urlObj = new URL(url);
      
      // Check if domain is in allowed list
      const isAllowedDomain = this.ALLOWED_VIDEO_DOMAINS.some(domain => 
        urlObj.hostname === domain || urlObj.hostname.endsWith('.' + domain)
      );

      if (!isAllowedDomain) {
        return { 
          isValid: false, 
          error: `Domain not allowed. Allowed domains: ${this.ALLOWED_VIDEO_DOMAINS.join(', ')}` 
        };
      }

      // Check for HTTPS
      if (urlObj.protocol !== 'https:') {
        return { isValid: false, error: 'Only HTTPS URLs are allowed' };
      }

      return { isValid: true };
    } catch (error) {
      return { isValid: false, error: 'Invalid URL format' };
    }
  }

  // Sanitize text input to prevent XSS
  static sanitizeText(input: string): string {
    if (!input || typeof input !== 'string') return '';
    
    return input
      .replace(/[<>'"&]/g, (char) => {
        const entities: Record<string, string> = {
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#x27;',
          '&': '&amp;'
        };
        return entities[char] || char;
      })
      .trim()
      .slice(0, 1000); // Limit length
  }

  // Validate email format
  static validateEmail(email: string): { isValid: boolean; error?: string } {
    if (!email || typeof email !== 'string') {
      return { isValid: false, error: 'Email is required' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, error: 'Invalid email format' };
    }

    if (email.length > 254) {
      return { isValid: false, error: 'Email too long' };
    }

    return { isValid: true };
  }

  // Validate image URL for logos
  static validateImageUrl(url: string): { isValid: boolean; error?: string } {
    if (!url || typeof url !== 'string') {
      return { isValid: false, error: 'Image URL is required' };
    }

    try {
      const urlObj = new URL(url);
      
      // Check for HTTPS
      if (urlObj.protocol !== 'https:') {
        return { isValid: false, error: 'Only HTTPS URLs are allowed for images' };
      }

      // Check file extension
      const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
      const hasValidExtension = allowedExtensions.some(ext => 
        urlObj.pathname.toLowerCase().endsWith(ext)
      );

      if (!hasValidExtension) {
        return { 
          isValid: false, 
          error: `Invalid image format. Allowed: ${allowedExtensions.join(', ')}` 
        };
      }

      return { isValid: true };
    } catch (error) {
      return { isValid: false, error: 'Invalid image URL format' };
    }
  }

  // Rate limiting helper (simple in-memory implementation)
  private static rateLimitStore = new Map<string, { count: number; resetTime: number }>();

  static checkRateLimit(key: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
    const now = Date.now();
    const record = this.rateLimitStore.get(key);

    if (!record || now > record.resetTime) {
      this.rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }

    if (record.count >= maxRequests) {
      return false;
    }

    record.count++;
    return true;
  }

  // Clean expired rate limit entries
  static cleanupRateLimit(): void {
    const now = Date.now();
    for (const [key, record] of this.rateLimitStore.entries()) {
      if (now > record.resetTime) {
        this.rateLimitStore.delete(key);
      }
    }
  }
}
