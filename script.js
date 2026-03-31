const input = document.getElementById("input");
const output = document.getElementById("output");
const editor = document.getElementById("editor");

let currentFile = "program.tr";
let fs = {
  root: {
    "program.tr": "file",
    "photos": {
      "type": "folder",
      "files": [
        "photos/img1.jpg",
        "photos/img2.jpg"
      ]
    }
  }
};

// Fake file system
let files = {
  "program.tr": 'yaz "Merhaba"\neger 5 > 3:\nyaz "Sol taraftaki sayı sağ taraftaki sayıdan büyüktür"\ndegilse:\nyaz "Sol taraftaki sayı sağ taraftaki sayıdan küçüktür"'
};

// PRINT
function print(text) {
  output.innerHTML += `<div>> ${text}</div>`;
  output.scrollTop = output.scrollHeight;
}

// OPEN APP
function openApp(app) {
  document.getElementById("terminalWindow").classList.add("hidden");
  document.getElementById("editorWindow").classList.add("hidden");

  if (app === "terminal") {
    document.getElementById("terminalWindow").classList.remove("hidden");
  }

  if (app === "editor") {
    document.getElementById("editorWindow").classList.remove("hidden");
    editor.value = files[currentFile] || "";
  }

  if (app === "photos") {
    document.getElementById("photosWindow").classList.remove("hidden");
    loadPhotos();
  }
}

// SAVE FILE
function saveFile() {
  files[currentFile] = editor.value;
  alert("Saved!");
}

// TURKISH INTERPRETER
function runTurkishCode(code) {
  const lines = code.split("\n");
  let condition = null;
  let skipElse = false;

  lines.forEach(line => {
    line = line.trim();

    // IF → eger
    if (line.startsWith("eger")) {
      let conditionExp = line.replace("eger", "").replace(":", "").trim();
      condition = eval(conditionExp);
      skipElse = condition;
    }

    // ELSE → degilse
    else if (line.startsWith("degilse")) {
      condition = !skipElse;
    }

    // EXECUTE if allowed
    else if (condition === null || condition === true) {

      // yaz
      if (line.startsWith("yaz")) {
        let text = line.replace("yaz", "").trim().replace(/"/g, "");
        print(text);
      }

      // topla
      else if (line.startsWith("topla")) {
        let [, a, b] = line.split(" ");
        print(Number(a) + Number(b));
      }

      // cikar
      else if (line.startsWith("cikar")) {
        let [, a, b] = line.split(" ");
        print(Number(a) - Number(b));
      }
    }
  });
}

// COMMAND
input.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    const cmd = input.value;
    print(cmd);

    const parts = cmd.split(" ");

    switch (parts[0]) {

      case "help":
        print("kullanabilir komutlar: help, dir, run, edit");
        break;

      case "dir":
        Object.keys(fs.root).forEach(item => {
            const value = fs.root[item];

            if (value.type === "folder") {
            print(item + "/");
            } else {
            print(item);
            }
        });
        break;

      case "edit":
        currentFile = parts[1] || "program.tr";
        openApp("editor");
        break;

      case "run":
        const file = parts[1] || currentFile;
        if (files[file]) {
          runTurkishCode(files[file]);
        } else {
          print("Dosya yok");
        }
        break;

      default:
        print("Bilinmeyen komut");
    }

    input.value = "";
  }

});

//PHOTO / FILE MANAGER APP
const photos = [
  "photos/5244a8e87b69c47c851e953048110fe6.jpg",
  "photos/shutterstock_1279844665_480x480.jpg",
  "photos/microsoft-edge-1N49Cn7P0Fg-unsplash.jpg"
];

const photoList = document.getElementById("photoList");
const viewerImg = document.getElementById("viewerImg");

// Load folder (list foto)
photos.forEach(src => {
  const img = document.createElement("img");
  img.src = src;

  img.onclick = () => {
    viewerImg.src = src;
  };

  photoList.appendChild(img);
});

// LOAD PHOTOS
function loadPhotos() {
  const container = document.getElementById("photoList");
  container.innerHTML = "";

  photos.forEach(src => {
    const img = document.createElement("img");
    img.src = src;

    img.onclick = () => openViewer(src);

    container.appendChild(img);
  });
}

// OPEN VIEWER
function openViewer(src) {
  document.getElementById("viewerWindow").classList.remove("hidden");
  document.getElementById("viewerImg").src = src;
}

// CLOSE VIEWER
function closeViewer() {
  document.getElementById("viewerWindow").classList.add("hidden");
}

//global close
function closeApp(app) {
  if (app === "terminal") {
    document.getElementById("terminalWindow").classList.add("hidden");
  }

  if (app === "editor") {
    document.getElementById("editorWindow").classList.add("hidden");
  }

  if (app === "photos") {
    document.getElementById("photosWindow").classList.add("hidden");
  }
}