/**
 * VALEXA — account data layer
 *
 * This runs entirely in the browser using localStorage, so the site is
 * fully clickable end-to-end without a server. Every function is written
 * as if it already talked to a backend (it returns { ok, error, data }),
 * so the only change needed to go live is swapping the localStorage reads
 * and writes below for real HTTP calls to your auth API — nothing in the
 * pages that call these functions would need to change.
 *
 * Passwords are hashed (SHA-256 + per-user salt) before storage so a
 * plaintext password never sits in localStorage — but browser storage is
 * still not a substitute for a real authentication server. Do not treat
 * this layer as production security on its own.
 */

const VALEXA_USERS_KEY = "valexa_users";
const VALEXA_SESSION_KEY = "valexa_session";
const VALEXA_CASHBACK_PREFIX = "valexa_cashback_";

function readUsers() {
  try {
    return JSON.parse(localStorage.getItem(VALEXA_USERS_KEY)) || [];
  } catch {
    return [];
  }
}

function writeUsers(users) {
  localStorage.setItem(VALEXA_USERS_KEY, JSON.stringify(users));
}

async function hashPassword(password, salt) {
  const enc = new TextEncoder().encode(salt + ":" + password);
  const digest = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function randomSalt() {
  return Array.from(crypto.getRandomValues(new Uint8Array(16))).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function registerUser({ name, email, phone, password }) {
  name = (name || "").trim();
  email = (email || "").trim().toLowerCase();
  phone = (phone || "").trim();

  if (name.length < 2) return { ok: false, error: "Enter your full name." };
  if (!isValidEmail(email)) return { ok: false, error: "Enter a valid email address." };
  if (phone && !/^[6-9]\d{9}$/.test(phone)) return { ok: false, error: "Enter a valid 10-digit Indian mobile number." };
  if (!password || password.length < 8) return { ok: false, error: "Password must be at least 8 characters." };

  const users = readUsers();
  if (users.some((u) => u.email === email)) {
    return { ok: false, error: "An account with this email already exists." };
  }

  const salt = randomSalt();
  const passwordHash = await hashPassword(password, salt);
  const user = {
    id: "u_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    name,
    email,
    phone,
    salt,
    passwordHash,
    joinedAt: new Date().toISOString(),
  };
  users.push(user);
  writeUsers(users);
  localStorage.setItem(VALEXA_CASHBACK_PREFIX + user.id, JSON.stringify([]));
  setSession(user.id);
  return { ok: true, data: publicUser(user) };
}

async function loginUser({ email, password }) {
  email = (email || "").trim().toLowerCase();
  const users = readUsers();
  const user = users.find((u) => u.email === email);
  if (!user) return { ok: false, error: "No account found with this email." };

  const attemptHash = await hashPassword(password || "", user.salt);
  if (attemptHash !== user.passwordHash) {
    return { ok: false, error: "Incorrect password. Please try again." };
  }
  setSession(user.id);
  return { ok: true, data: publicUser(user) };
}

function setSession(userId) {
  localStorage.setItem(VALEXA_SESSION_KEY, JSON.stringify({ userId }));
}

function logoutUser() {
  localStorage.removeItem(VALEXA_SESSION_KEY);
}

function getCurrentUser() {
  try {
    const session = JSON.parse(localStorage.getItem(VALEXA_SESSION_KEY));
    if (!session || !session.userId) return null;
    const user = readUsers().find((u) => u.id === session.userId);
    return user ? publicUser(user) : null;
  } catch {
    return null;
  }
}

function publicUser(user) {
  const { passwordHash, salt, ...safe } = user;
  return safe;
}

function updateProfile(userId, updates) {
  const users = readUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) return { ok: false, error: "Account not found." };

  if (updates.name !== undefined) {
    if (updates.name.trim().length < 2) return { ok: false, error: "Enter your full name." };
    users[idx].name = updates.name.trim();
  }
  if (updates.phone !== undefined) {
    if (updates.phone && !/^[6-9]\d{9}$/.test(updates.phone)) {
      return { ok: false, error: "Enter a valid 10-digit Indian mobile number." };
    }
    users[idx].phone = updates.phone.trim();
  }
  writeUsers(users);
  return { ok: true, data: publicUser(users[idx]) };
}

async function changePassword(userId, currentPassword, newPassword) {
  const users = readUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) return { ok: false, error: "Account not found." };

  const currentHash = await hashPassword(currentPassword || "", users[idx].salt);
  if (currentHash !== users[idx].passwordHash) {
    return { ok: false, error: "Current password is incorrect." };
  }
  if (!newPassword || newPassword.length < 8) {
    return { ok: false, error: "New password must be at least 8 characters." };
  }
  const salt = randomSalt();
  users[idx].salt = salt;
  users[idx].passwordHash = await hashPassword(newPassword, salt);
  writeUsers(users);
  return { ok: true };
}

function requireAuth() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = "login.html?next=" + encodeURIComponent(window.location.pathname.split("/").pop());
  }
  return user;
}

function getCashbackHistory(userId) {
  try {
    return JSON.parse(localStorage.getItem(VALEXA_CASHBACK_PREFIX + userId)) || [];
  } catch {
    return [];
  }
}

function cashbackSummary(userId) {
  const records = getCashbackHistory(userId);
  const sum = (status) => records.filter((r) => r.status === status).reduce((a, r) => a + r.amount, 0);
  return {
    pending: sum("pending"),
    confirmed: sum("confirmed"),
    credited: sum("credited"),
    total: records.length,
  };
}
