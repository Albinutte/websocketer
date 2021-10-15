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
      const separator = getSeparator(date);
      acc.push(
        `<div class="mb-4 history-element">${separator}<div class="history-element--content">${message}</div></div>`
      );
      return acc;
    }, [])
    .join('');

  document.querySelectorAll('.copy-button').forEach((button) => {
    button.addEventListener('click', () => {
      const historyElement = button.closest('.history-element');
      const content = historyElement.querySelector('.history-element--content').innerText;
      navigator.clipboard.writeText(content).then(() => {
        alert('Copied to clipboard');
      });
    });
  });
}

function getSeparator(date) {
  return `<fieldset><legend>${date}<button class="copy-button btn btn-sm btn-secondary mx-2">📋</button></legend></fieldset>`;
}
