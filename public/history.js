const STORAGE_KEY = 'history';

export function saveMessage(message) {
  const history = getHistory();
  history.push({ message, date: new Date().toISOString() });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    // local storage is messed up; oh well
    return [];
  }
}

export function clear() {
  localStorage.removeItem(STORAGE_KEY);
}

export function copyToClipboard() {
  // todo [albina]:
}
