const trucks = [
  {
    id: 1,
    placa: "ABC-1234",
    status: "ok",
    planned: [{x:50,y:50},{x:150,y:80},{x:250,y:120}],
    real: [{x:50,y:50},{x:140,y:90},{x:260,y:160}]
  },
  {
    id: 2,
    placa: "XYZ-5678",
    status: "risk",
    planned: [{x:30,y:60},{x:120,y:100},{x:220,y:140}],
    real: [{x:30,y:60},{x:200,y:200},{x:300,y:250}]
  }
];

let currentTruck = null;
let alerts = [];
let chat = [];

function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(screenId).classList.add("active");
}

function renderTrucks() {
  const list = document.getElementById("truckList");
  list.innerHTML = "";

  trucks.forEach(truck => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      🚚 ${truck.placa}
      <div class="status ${truck.status}">
        ${truck.status.toUpperCase()}
      </div>
    `;

    div.onclick = () => openDetail(truck);
    list.appendChild(div);
  });
}

function openDetail(truck) {
  currentTruck = truck;
  showScreen("detail");

  const map = document.getElementById("map");
  map.innerHTML = "";

  truck.planned.forEach(p => {
    const dot = document.createElement("div");
    dot.className = "point planned";
    dot.style.left = p.x + "px";
    dot.style.top = p.y + "px";
    map.appendChild(dot);
  });

  truck.real.forEach(p => {
    const dot = document.createElement("div");
    dot.className = "point real";
    dot.style.left = p.x + "px";
    dot.style.top = p.y + "px";
    map.appendChild(dot);
  });

  detectDeviation(truck);
}

function detectDeviation(truck) {
  const deviation = Math.abs(truck.planned[1].x - truck.real[1].x);

  if (deviation > 40) {
    const alert = {
      text: `Desvio detectado no caminhão ${truck.placa}`
    };
    alerts.push(alert);
    renderAlerts();
  }
}

function renderAlerts() {
  const list = document.getElementById("alertList");
  list.innerHTML = "";

  alerts.forEach(a => {
    const div = document.createElement("div");
    div.textContent = a.text;
    list.appendChild(div);
  });
}

function sendMessage() {
  const input = document.getElementById("msgInput");
  if (!input.value) return;

  chat.push("Gestor: " + input.value);
  input.value = "";
  renderChat();
}

function renderChat() {
  const box = document.getElementById("chatBox");
  box.innerHTML = chat.map(m => `<div>${m}</div>`).join("");
}

function simulateUpdate() {
  trucks.forEach(t => {
    t.real.forEach(p => {
      p.x += Math.random() * 5;
      p.y += Math.random() * 5;
    });
  });
}

setInterval(() => {
  simulateUpdate();
}, 3000);

renderTrucks();

