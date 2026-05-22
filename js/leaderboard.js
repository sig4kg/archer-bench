(function () {
  function formatScore(value) {
    if (value === 0) {
      return '0';
    }
    return value.toFixed(2);
  }

  function assignRanks(entries) {
    var sorted = entries.slice().sort(function (a, b) {
      return b.test - a.test;
    });

    var rank = 0;
    for (var i = 0; i < sorted.length; i++) {
      if (i === 0 || sorted[i].test !== sorted[i - 1].test) {
        rank = i + 1;
      }
      sorted[i].rank = rank;
    }

    return sorted;
  }

  function createRow(entry) {
    var row = document.createElement('tr');

    var rankCell = document.createElement('td');
    var rankP = document.createElement('p');
    rankP.textContent = String(entry.rank);
    rankCell.appendChild(rankP);
    var dateSpan = document.createElement('span');
    dateSpan.className = 'date label label-default';
    dateSpan.textContent = entry.date;
    rankCell.appendChild(dateSpan);

    var modelCell = document.createElement('td');
    modelCell.style.wordBreak = 'break-word';
    var modelP = document.createElement('p');
    modelP.textContent = entry.model;
    var institutionP = document.createElement('p');
    institutionP.className = 'institution';
    institutionP.textContent = entry.institution;
    modelCell.appendChild(modelP);
    modelCell.appendChild(institutionP);

    var sizeCell = document.createElement('td');
    sizeCell.textContent = entry.size;

    var devCell = document.createElement('td');
    devCell.textContent = formatScore(entry.dev);

    var testCell = document.createElement('td');
    testCell.textContent = formatScore(entry.test);

    row.appendChild(rankCell);
    row.appendChild(modelCell);
    row.appendChild(sizeCell);
    row.appendChild(devCell);
    row.appendChild(testCell);

    return row;
  }

  function renderLeaderboard(entries, tbodyId) {
    var tbody = document.getElementById(tbodyId);
    if (!tbody) {
      return;
    }

    tbody.innerHTML = '';
    assignRanks(entries).forEach(function (entry) {
      tbody.appendChild(createRow(entry));
    });
  }

  function showError(tbodyId, message) {
    var tbody = document.getElementById(tbodyId);
    if (!tbody) {
      return;
    }

    tbody.innerHTML = '';
    var row = document.createElement('tr');
    var cell = document.createElement('td');
    cell.colSpan = 5;
    cell.textContent = message;
    row.appendChild(cell);
    tbody.appendChild(row);
  }

  document.addEventListener('DOMContentLoaded', function () {
    fetch('data/leaderboard.json')
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Failed to load leaderboard data');
        }
        return response.json();
      })
      .then(function (data) {
        renderLeaderboard(data.english || [], 'english-leaderboard');
        renderLeaderboard(data.chinese || [], 'chinese-leaderboard');
      })
      .catch(function () {
        showError('english-leaderboard', 'Unable to load leaderboard data.');
        showError('chinese-leaderboard', 'Unable to load leaderboard data.');
      });
  });
})();
