const STORAGE_KEY = 'history';

window.addEventListener('load', () => {
  updateHistory();

  document.querySelector('#clear-history-button').addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEY);
    updateHistory();
  });
});

export function saveMessage(message) {
  const history = getHistory();
  history.push({ message, date: new Date().toISOString() });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  updateHistory();
}

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    // local storage is messed up; oh well
    return [];
  }
}

export function copyToClipboard() {
  // todo [albina]:
}

function updateHistory() {
  const history = getHistory();
  const historyPre = document.querySelector('#history-pre');

  if (history.length === 0) {
    historyPre.innerText = 'History will show up here';
    return;
  }

  history.reverse();
  historyPre.innerHTML = history
    .reduce((acc, { message, date }) => {
      acc.push(`${getSeparator(date)}<div>${message}</div>`);
      return acc;
    }, [])
    .join('');
}

function getSeparator(date) {
  return `<fieldset><legend>${date}</legend></fieldset>`;
}
