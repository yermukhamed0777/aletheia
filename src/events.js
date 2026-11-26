/* Content-free pilot counters. No question text, no document text, no account
 * data, no network transmission and no persistence: this is a plain in-memory
 * integer map, safe to read with EVENT_SNAPSHOT() during a guided session.
 */
const EVENT_ALLOW = Object.freeze([
  'ask_started', 'answer_shown', 'abstain_shown', 'citation_opened',
  'upload_processed', 'upload_failed', 'gap_logged', 'tour_started', 'lang_changed',
]);
const EVENT_LOG = Object.create(null);
function track(name) {
  if (!EVENT_ALLOW.includes(name)) return false;
  EVENT_LOG[name] = (EVENT_LOG[name] || 0) + 1;
  return true;
}
function EVENT_SNAPSHOT() { return { ...EVENT_LOG }; }
