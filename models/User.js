const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'users.json');

function readUsers() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeUsers(users) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

function findByEmail(email) {
  const users = readUsers();
  return users.find(u => u.email === email.toLowerCase().trim());
}

function findById(id) {
  const users = readUsers();
  return users.find(u => u.id === id);
}

function createUser(userData) {
  const users = readUsers();
  const user = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    email: userData.email.toLowerCase().trim(),
    phone: userData.phone.trim(),
    firstName: userData.firstName.trim(),
    lastName: userData.lastName.trim(),
    passwordHash: userData.passwordHash,
    emailVerified: false,
    verificationToken: userData.verificationToken || null,
    verificationExpiry: userData.verificationExpiry || null,
    createdAt: new Date().toISOString(),
    lastLogin: null,
    loginAttempts: 0,
    lockUntil: null
  };
  users.push(user);
  writeUsers(users);
  return user;
}

function updateUser(id, updates) {
  const users = readUsers();
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) return null;
  users[idx] = { ...users[idx], ...updates };
  writeUsers(users);
  return users[idx];
}

module.exports = { readUsers, findByEmail, findById, createUser, updateUser };
