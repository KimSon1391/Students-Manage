class Student {
  constructor(name, birth) {
    this.name = name;
    this.birth = birth;
    this.id = new Date().toISOString();
  }
}

//UI
class UI {
  add(student) {
    const store = new Store();
    const students = store.getStudents();
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${students.length + 1}</td>
      <td>${student.name}</td>
      <td>${student.birth}</td>
      <td>
        <button class = "btn btn-sm btn-danger btn-remove" data-id = ${
          student.id
        }>Remove</button>
      </td>
    `;

    document.querySelector("table tbody").appendChild(tr);
    document.getElementById("name").value = "";
    document.getElementById("birth").value = "";
  }

  renderALll() {
    const store = new Store();
    const students = store.getStudents();
    const html = students.reduce((result, current, currentIndex) => {
      return (
        result +
        `
        <tr>
          <td>${currentIndex + 1}</td>
          <td>${current.name}</td>
          <td>${current.birth}</td>
          <td>
            <button class = "btn btn-sm btn-danger btn-remove" data-id = ${
              current.id
            }>Remove</button></td>
        </tr>
      `
      );
    }, "");
    document.querySelector("table tbody").innerHTML = html;
  }
  clear() {
    document.querySelector("table tbody").innerHTML = "";
  }
  alert(message, type = "success") {
    const alert = document.createElement("div");
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    document.getElementById("notification").appendChild(alert);
    setTimeout(() => {
      alert.remove();
    }, 2000);
  }
}

// localStorage
class Store {
  getStudents() {
    return JSON.parse(localStorage.getItem("students")) || [];
  }
  add(student) {
    const students = this.getStudents();
    students.push(student);
    localStorage.setItem("students", JSON.stringify(students));
  }
  remove(id) {
    const students = this.getStudents();
    const index = students.findIndex((student) => student.id === id);
    students.splice(index, 1);
    localStorage.setItem("students", JSON.stringify(students));
  }
  getStudent(id) {
    return this.getStudents().find((student) => student.id === id);
  }
}

//Submit form to add
document.querySelector("form").addEventListener("submit", (e) => {
  const store = new Store();
  const ui = new UI();

  e.preventDefault();

  const name = document.getElementById("name").value;
  const birth = document.getElementById("birth").value;
  const students = new Student(name, birth);
  ui.add(students);
  store.add(students);
});

//Render Item when reload page
window.addEventListener("DOMContentLoaded", function () {
  const ui = new UI();
  ui.renderALll();
});

//Remove
document.querySelector("table tbody").addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-remove")) {
    const ui = new UI();
    const store = new Store();
    const id = e.target.dataset.id;
    const student = store.getStudent(id);
    const isConfirmed = confirm(`Do you want to remove ${student.id}`);
    if (isConfirmed) {
      ui.clear();
      store.remove(id);
      ui.renderALll();
      ui.alert(`Success!`);
    }
  }
});
