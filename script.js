let members = JSON.parse(localStorage.getItem('heesayMembers')) || [];

function saveToStorage() {
  localStorage.setItem('heesayMembers', JSON.stringify(members));
}

function displayMembers(filter = '') {
  const memberList = document.getElementById('memberList');
  memberList.innerHTML = '';

  members
    .filter(member => member.fullname.toLowerCase().includes(filter.toLowerCase()))
    .forEach(member => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><img src="${member.photo}" alt="Profile Picture"></td>
        <td>${member.fullname}</td>
        <td>${member.username}</td>
        <td>${member.id}</td>
        <td>${member.birthdate}</td>
        <td><a href="${member.facebook}" target="_blank">Facebook</a></td>
        <td>${member.talents.join(', ')}</td>
      `;
      memberList.appendChild(row);
    });
}

document.getElementById('memberForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const fullname = document.getElementById('fullname').value.trim();
  const username = document.getElementById('username').value.trim();
  const id = document.getElementById('id').value.trim();
  const birthdate = document.getElementById('birthdate').value;
  const facebook = document.getElementById('facebook').value.trim();

  const talents = Array.from(document.querySelectorAll('input[name="talent"]:checked'))
    .map(cb => cb.value);

  const photoFile = document.getElementById('photo').files[0];
  const reader = new FileReader();

  reader.onload = function() {
    const photoData = reader.result;

    members.push({
      fullname,
      username,
      id,
      birthdate,
      facebook,
      talents,
      photo: photoData
    });

    saveToStorage();
    displayMembers();
    document.getElementById('memberForm').reset();
  };

  if (photoFile) {
    reader.readAsDataURL(photoFile);
  }
});

document.getElementById('search').addEventListener('input', function () {
  displayMembers(this.value);
});

function exportToExcel() {
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Full Name,Username,ID,Birthdate,Facebook,Talents\n";

  members.forEach(member => {
    const row = [
      member.fullname,
      member.username,
      member.id,
      member.birthdate,
      member.facebook,
      member.talents.join('|')
    ].join(",");
    csvContent += row + "\n";
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "heesay_members.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

displayMembers();

if (document.referrer.indexOf("login.html") === -1) {
  alert("Please login first.");
  window.location.href = "login.html";
}

