let notes = [];
const addBtn = document.querySelector('#add-note');
const container = document.querySelector('#container');
const template = document.querySelector('#note-template');
const removeBtn = document.querySelector('#remove-button');

const handlers = {
    dragStart: function(e) {
        dragStart(e)
    },

    allowDrop: function(e) {
        allowDrop(e)
    },

    drop: function(e) {
        drop(e)
    }
}

addBtn.addEventListener('click', () => addNote());
container.addEventListener("dragover", handlers.allowDrop);
container.addEventListener("drop", handlers.drop);

function getNextNoteId() {
    return notes.length ? notes.reduce((a, b) => a.id > b.id ? a : b).id + 1 : 0;
}

function addNote(title = "", text = "", positionX = "", positionY = "") {
    const addNewNote = function() {
        const clone = template.content.cloneNode(true);
        const id = getNextNoteId();
        const item = {
            title: title,
            text: text,
            positionX: positionX,
            positionY: positionY,
            id: id,
        };

        notesClone = clone.querySelector(".note");
        notesClone.setAttribute("id", id);

        clone.querySelector("#remove-button").addEventListener("click", removeNote);

        clone.querySelector(".title").value = item.title;
        clone.querySelector(".text").value = item.text;

        clone.querySelector(".title").addEventListener("input", (e) => {
            item.title = e.target.value;
            saveDataToLocalStorage();
        });

        clone.querySelector(".text").addEventListener("input", (e) => {
            item.text = e.target.value;
            saveDataToLocalStorage();
        });

        if (positionX !== "" && positionY !== "") {
            setPositionAbsolute(notesClone, item.positionX, item.positionY);
        }

        notes.push(item);
        saveDataToLocalStorage();
        return clone;
    };
    container.appendChild(addNewNote());
    initNoteDragStartEvent();
}

// DRAG&DROP 
function initNoteDragStartEvent() {
    const notesElements = document.querySelectorAll(".note");
    notesElements.forEach(note => {
        note.addEventListener("dragstart", handlers.dragStart);
    });
}

function dragStart(e) {
    const draggedItem = e.target;
    draggedItem.classList.add("dragged");
}

function allowDrop(e) {
    e.preventDefault();
}

function setPositionAbsolute(element, x, y) {
    element.style.position = "absolute";
    element.style.top = y;
    element.style.left = x;
}

function drop(e) {
    e.preventDefault();
    const noteDrag = document.querySelector(".dragged");
    setPositionAbsolute(noteDrag, e.clientX + "px", e.clientY + "px");

    const note = findNote(parseInt(noteDrag.getAttribute("id")));
    note.positionX = noteDrag.style.left;
    note.positionY = noteDrag.style.top;
    saveDataToLocalStorage()

    noteDrag.classList.remove("dragged")
}

function saveDataToLocalStorage() {
    localStorage.setItem("notes", JSON.stringify(notes));
}

function loadSavedNotes() {
    const notes = localStorage.getItem("notes") ? JSON.parse(localStorage.getItem("notes")) : [];
    notes.forEach((noteDrag) => {
        addNote(
            noteDrag.text,
            noteDrag.title,
            noteDrag.positionX,
            noteDrag.positionY,

        );
    });
}

function removeNote(e) {
    const removeBtn = e.target;
    removeBtn.parentElement.parentElement.remove();
    const x = parseInt(
        removeBtn.parentElement.parentElement.getAttribute("id")
    );
    notes.splice(x, 1);
    saveDataToLocalStorage();
}

function findNote(id) {
    return notes.find(note => note.id == id);
}

loadSavedNotes()