const url = "https://jsonplaceholder.typicode.com/todos";
let toDoLists = [];

window.onload = () => responseServer(url);

function responseServer() {
  const requestURL = "https://jsonplaceholder.typicode.com/todos";
  const xhr = new XMLHttpRequest();
  xhr.open("GET", requestURL);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.responseType = "json";
  xhr.send();
  xhr.onload = function (event) {
    if (this.status !== 200) {
      console.log("Провал");
    } else {
      console.log("Успешно");
    }
  };
  xhr.onerror = () => {
    console.log("Error");
  };
  xhr.onreadystatechange = function (event) {
    if (event.target.readyState === 4 && event.target.status === 200) {
      let answersFromServer = xhr.response;
      let arrWithAnswer = [];
      for (let i = 0; i < answersFromServer.length; i++) {
        arrWithAnswer.push(answersFromServer[i]);
      }
      toDoLists.push(
        arrWithAnswer.filter((item) => item.userId === 2).slice(0, 5)
      );
      toDoLists.push(
        arrWithAnswer.filter((item) => item.userId === 4).slice(0, 5)
      );
      toDoLists.push(
        arrWithAnswer.filter((item) => item.userId === 6).slice(0, 5)
      );
    }
    createElements(toDoLists);
  };
}

function createElements(toDoLists) {
  toDoLists.forEach((toDoList) => {
    let divListToDo = document.createElement("div");
    document.body.appendChild(divListToDo);
    let titleH2 = document.createElement("h2");
    divListToDo.appendChild(titleH2);
    titleH2.innerText = `To-Do List for user № ${toDoList[0].userId}`;
    let btn = document.createElement("button");
    divListToDo.appendChild(btn);
    btn.innerText = "Add new Item";
    btn.className = "button-new-item";
    let divForAddItem = document.createElement("div");
    divListToDo.appendChild(divForAddItem);
    divForAddItem.style.display = "none";
    divForAddItem.className = "row";
    let textForAddItem = document.createElement("textarea");
    divForAddItem.appendChild(textForAddItem);
    textForAddItem.className = "col-10";
    textForAddItem.value;
    let btnAdd = document.createElement("button");
    divForAddItem.appendChild(btnAdd);
    btnAdd.textContent = "Add";
    btnAdd.className = "col-2 btn-add";
    btn.onclick = () => {
      if (divForAddItem.style.display == "block")
        divForAddItem.style.display = "none";
      else divForAddItem.style.display = "block";
    };
    let list = document.createElement("ol");
    divListToDo.appendChild(list);

    createInput(toDoList, list);
    addItem(toDoList, btnAdd, list,textForAddItem) 
  });
}

function createInput(toDoList, list) {
  toDoList.forEach(toDoItem => {
    let li = document.createElement("li");
    list.appendChild(li);
    let inp = document.createElement("input");
    inp.disabled = true;
    li.appendChild(inp);
    inp.value = `${toDoItem.title}`;
    let btnRemove = document.createElement("button");
    li.appendChild(btnRemove);
    btnRemove.textContent = "Remove";
    btnRemove.className = "btn-remove";
    removeItem(toDoList, list, btnRemove, toDoItem);
    let btnEdit = document.createElement('button');
    li.appendChild(btnEdit)
    btnEdit.textContent = 'Edit'
    btnEdit.className = 'btn-edit'
    editItem(btnEdit, toDoItem,inp)
  })
}


function removeItem(toDoList,list, btnRemove, toDoItem) {
  btnRemove.onclick = () => {
    const url = `https://jsonplaceholder.typicode.com/todos/${toDoItem.id}`;
    fetch(url, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then(() => {
        toDoList.splice(toDoList.indexOf(toDoItem), 1);
        (list.innerHTML = ""), createInput(toDoList, list);
      });
  };
}

function editItem(btnEdit,toDoItem, inp) {
  btnEdit.onclick = () => {
    if (inp.disabled == true) {
      inp.disabled = false
      inp.focus()
    } else {
      inp.disabled = true;
      const url = `https://jsonplaceholder.typicode.com/todos/${toDoItem.id}`
      let res
      fetch(url, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: inp.value
          })
        }).then((response) => response.json())
        .then((json) => res = json)
    }
  }
}

function addItem(toDoList, btnAdd, list,textForAddItem) {
  btnAdd.onclick = () => {
    if (!toDoList.length) {
      let newObjInputWithoutListToDoLength = {
        completed: false,
        id: toDoList.id = 0,
        title: `${textForAddItem.value}`,
        userId: toDoList.userId,
      }
      toDoList.unshift(newObjInputWithoutListToDoLength)
      const url = 'https://jsonplaceholder.typicode.com/todos'
      fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(toDoList[0]),
        }).then((response) => response.json())
        .then(() => {
          list.innerHTML = '',
          createInput(toDoList, list) 
        })
    } else {
      let newObjInput = {
        completed: false,
        id: toDoList[toDoList.length - 1].id + 1,
        title: `${textForAddItem.value}`,
        userId: toDoList[0].userId,
      }
      toDoList.unshift(newObjInput)
      const url = 'https://jsonplaceholder.typicode.com/todos'
      fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(toDoList[0]),
        }).then((response) => response.json())
        .then(() => {
          list.innerHTML = '',
          createInput(toDoList, list) 
        })
    }
  }
}
