var db2 = new sqlite3.Database('/Users/mymac/Downloads/window_electron\ 2/window_electron\ 2/window_electron/trac_user.sqlite');

let newRowCounter = 0;
const optionValues = [];

  function fetchDataAndCompare() {
    db2.all('SELECT * FROM person', (err, rows) => {
      if (err) {
        console.error(err.message);
        return;
      }

      // check for new rows
      const tableBody = document.querySelector('#myTable tbody');
      const existingRows = tableBody.querySelectorAll('tr');
      const existingData = Array.from(existingRows).map(row => ({
        time: row.cells[0].textContent,
        windowName: row.cells[1].textContent,
        event: row.cells[2].textContent
      }));

      const newData = rows.filter(row => !existingData.some(data => (
        data.time === row.time &&
        data.windowName === row.windowName &&
        data.event === row.event
      )));
      console.log(newData)

    
      // generate HTML code for new rows
      const newRows = newData.map(row => `
      <tr id="tab" class="tab">
        <td >${row.time}</td>
        <td>${row.windowName}</td>
        <td>${row.event}</td>
        <td></td>
        <td>
          <select id="mySelect" value="${row.value}" onchange="saveOption(event)" dataid="${row.id}">
            <option></option>
            <option value="work" ${row.value === 'work' ? 'selected' : ''}>work</option>
            <option value="leasure" ${row.value === 'leasure' ? 'selected' : ''}>leasure</option>
            <option value="learning" ${row.value === 'learning' ? 'selected' : ''}>learning</option>
          </select>
        </td>
      </tr>
    `);


    if (newRows.length > 0) {
      tableBody.insertAdjacentHTML('beforeend', newRows.join(''));
      newRowCounter += newRows.length;
      optionValues.push(...newData.map(row => row.value));
      
      updateRowColors();

      // Check if 10 new rows have been added and their select options have values
      if (newRowCounter >= 10) {
        if (optionValues.every(value => value !== '')) {
          // const icon = document.getElementById('myIcon');
          // icon.style.color = 'transparent';
          ipcRenderer.send('not-new-rows-added');

        } else {
          ipcRenderer.send('new-rows-added');

          // const icon = document.getElementById('myIcon');
          // icon.style.color = 'red';
        }
        newRowCounter = 0;
        optionValues.length = 0;
      }
    }
    
    });

    function updateRowColors() {
      const allSelects = document.querySelectorAll('#mySelect');
    
      allSelects.forEach(selectElement => {
        const selectedValue = selectElement.value;
        const tableRow = selectElement.closest('tr');
        if (selectedValue === '') {
          tableRow.style.backgroundColor = 'lightgray';
        } else {
          tableRow.style.backgroundColor = 'transparent';
        }
      });
    }
    


  }
  setInterval(fetchDataAndCompare,5000)

