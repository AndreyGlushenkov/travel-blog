// Session storage preserves a reload, but does not persist beyond this tab's session.
const KEY = 'travelblog.session';
let memoryToken = null;

export const tokenStorage = {
  get() {
    try { return sessionStorage.getItem(KEY) || memoryToken; } catch { return memoryToken; }
  },
  set(token) {
    memoryToken = token || null;
    try { token ? sessionStorage.setItem(KEY, token) : sessionStorage.removeItem(KEY); } catch { /* Storage can be unavailable in private browsing. */ }
  },
};
