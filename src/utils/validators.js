/**
 * Centralized validators for emails & domains.
 */
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

export const isValidEmail = (email) => !!email && emailRegex.test(String(email).trim());

export const extractDomain = (email) => {
  if (!email) return "";
  const parts = String(email).trim().split("@");
  return parts[1] ? parts[1].toLowerCase() : "";
};

export const isAllowedDomain = (email, allowedDomains = []) => {
  if (!allowedDomains || allowedDomains.length === 0) return true;
  const d = extractDomain(email);
  const normalized = allowedDomains.map(x => String(x).toLowerCase().trim());
  return normalized.includes(d);
};

export const normalizeEmails = (text = "") =>
  String(text)
    .split(/[\s,;]+/)
    .map(e => e.trim())
    .filter(Boolean);
