export const CONTACT_EMAIL = "brivix.agency@outlook.com";

const SUBJECT = "New project inquiry — Brivix";

const BODY = [
  "Hi Brivix team,",
  "",
  "I'd like to talk about a project.",
  "",
  "Name:",
  "Company:",
  "What we're building:",
  "Timeline:",
  "Contact Number:",
  "Social Media Links:",
  "",
  "Thanks,",
].join("\n");

/**
 * `mailto:` is kept as the canonical href on every contact link — it is the
 * correct semantic target, and it is what middle-click, "copy link", and
 * keyboard users get. But it cannot be the *only* path: on a machine with no
 * registered mail handler (stock Windows) the browser claims the protocol
 * itself and drops the visitor on a blank tab, silently killing the contact
 * route. So a left-click opens a chooser (see ContactLink) offering these
 * webmail compose URLs alongside it. Every option carries the same prefilled
 * subject and body.
 */
export const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
  SUBJECT
)}&body=${encodeURIComponent(BODY)}`;

export const CONTACT_GMAIL_URL =
  "https://mail.google.com/mail/?view=cm&fs=1" +
  `&to=${encodeURIComponent(CONTACT_EMAIL)}` +
  `&su=${encodeURIComponent(SUBJECT)}` +
  `&body=${encodeURIComponent(BODY)}`;

export const CONTACT_OUTLOOK_URL =
  "https://outlook.live.com/mail/0/deeplink/compose?" +
  `to=${encodeURIComponent(CONTACT_EMAIL)}` +
  `&subject=${encodeURIComponent(SUBJECT)}` +
  `&body=${encodeURIComponent(BODY)}`;
