/**
 * Sci-Classroom 2026 - Game Engine (Cooperative Multiplayer)
 * จัดการแผนที่ความก้าวหน้าแบบ Candy Crush Nodes และฉากต่อสู้แบบ Co-Op RPG
 * ซิงค์คำสั่งครูผู้ควบคุมห้องเรียนหลัก และโหวต/คำตอบของนักเรียนทุกคน
 */

// ==========================================================================
// 1. กำหนดท่าต่อสู้โปเกมอน (Combat Moves) และค่าพิกัด Node แผนที่
// ==========================================================================
const MOVES = {
  laser:   { key: "laser", label: "⚡ เลเซอร์บีม [Laser Bolt]", detail: "พลังโจมตี 20 | PP: ∞ | แม่นยำ: 100% | โจทย์: ง่าย", difficulty: "easy", dmg: 20, type: "attack", color: "#00ff66", maxPp: Infinity, accuracy: 1.0, critChance: 0.10 },
  emp:     { key: "emp", label: "☄️ พลังงานคลื่นชีพจร [EMP Blast]", detail: "พลังโจมตี 45 | PP: 8 | แม่นยำ: 90% | โจทย์: ปานกลาง", difficulty: "medium", dmg: 45, type: "attack", color: "#00f3ff", maxPp: 8, accuracy: 0.90, critChance: 0.15 },
  quantum: { key: "quantum", label: "🌀 พายุควอนตัมอเวจี [Quantum Storm]", detail: "พลังโจมตี 85 | PP: 4 | แม่นยำ: 80% | โจทย์: ยาก", difficulty: "hard", dmg: 85, type: "attack", color: "#8f00ff", maxPp: 4, accuracy: 0.80, critChance: 0.20 },
  nanobot: { key: "nanobot", label: "🛡️ เกราะนาโนบอทฟื้นฟู [Nanobot Shield]", detail: "ฟื้นพลังชีวิต +45 HP | PP: 5 | แม่นยำ: 100% | โจทย์: ยาก", difficulty: "hard", dmg: 0, type: "heal", color: "#ffae00", maxPp: 5, accuracy: 1.0, critChance: 0.0 }
};

// ตำแหน่งทางเดินคดเคี้ยวสไตล์ Candy Crush บน Canvas (% ของความกว้าง/ความสูง)
const NODE_POSITIONS = {
  node1:  { x: 0.10, y: 0.50 },
  node2:  { x: 0.20, y: 0.30 },
  node3:  { x: 0.30, y: 0.60 },
  node4:  { x: 0.40, y: 0.40 },
  node5:  { x: 0.50, y: 0.70 },
  node6:  { x: 0.60, y: 0.30 },
  node7:  { x: 0.70, y: 0.60 },
  node8:  { x: 0.80, y: 0.40 },
  node9:  { x: 0.90, y: 0.70 },
  node10: { x: 0.95, y: 0.50 }
};

const NODE_KEYS = ["node1", "node2", "node3", "node4", "node5", "node6", "node7", "node8", "node9", "node10"];

// ระลอกศัตรูแต่ละด่าน (Waves of Enemies - Pokemon Trainer Style)
const NODE_ENEMIES = {
  node1: [
    { name: "บอทไฟฟ้าขยะอวกาศ", maxHp: 50, sprite: "assets/enemy_electric.png", emoji: "🤖", subject: "ฟิสิกส์ & พลังงาน" },
    { name: "หุ่นยนต์ไฟฟ้าเทอร์โบ", maxHp: 100, sprite: "assets/enemy_electric.png", emoji: "⚡", subject: "ฟิสิกส์ & ไฟฟ้า" }
  ],
  node2: [
    { name: "เครื่องปั่นกระแสไฟป่า", maxHp: 60, sprite: "assets/enemy_electric.png", emoji: "🔋", subject: "ฟิสิกส์ & ไฟฟ้า" },
    { name: "เมก้าหุ่นยนต์ไดนาโม", maxHp: 110, sprite: "assets/enemy_electric.png", emoji: "🔌", subject: "ฟิสิกส์ & ไฟฟ้า" }
  ],
  node3: [
    { name: "หยดกรดเบสเจือจาง", maxHp: 50, sprite: "assets/enemy_chemical.png", emoji: "🧪", subject: "เคมี & สารละลาย" },
    { name: "อสุรกายน้ำกรดกัดกร่อน", maxHp: 100, sprite: "assets/enemy_chemical.png", emoji: "🧪", subject: "เคมี & สารละลาย" }
  ],
  node4: [
    { name: "ก๊าซพิษลอยฟุ้ง", maxHp: 60, sprite: "assets/enemy_chemical.png", emoji: "💨", subject: "เคมี & ของเหลว" },
    { name: "อสุรกายกรดพิษเขียว", maxHp: 110, sprite: "assets/enemy_chemical.png", emoji: "🟢", subject: "เคมี & ของเหลว" }
  ],
  node5: [
    { name: "สปอร์พิษลอยลม", maxHp: 50, sprite: "assets/enemy_plant.png", emoji: "🍄", subject: "ระบบนิเวศ & พืช" },
    { name: "เถาหนามป่ามรณะ", maxHp: 100, sprite: "assets/enemy_plant.png", emoji: "🌿", subject: "ระบบนิเวศ & พืช" }
  ],
  node6: [
    { name: "มอนสเตอร์ไม้กินแมลง", maxHp: 60, sprite: "assets/enemy_plant.png", emoji: "🥀", subject: "ระบบนิเวศ & พืช" },
    { name: "อสูรพฤกษาเพชฌฆาต", maxHp: 110, sprite: "assets/enemy_plant.png", emoji: "🌲", subject: "ระบบนิเวศ & พืช" }
  ],
  node7: [
    { name: "พลาสมิดก้าวร้าว", maxHp: 60, sprite: "assets/enemy_virus.png", emoji: "🧬", subject: "เซลล์ & สิ่งมีชีวิต" },
    { name: "อสุรกายเซลล์กลายพันธุ์", maxHp: 110, sprite: "assets/enemy_virus.png", emoji: "🧬", subject: "เซลล์ & สิ่งมีชีวิต" }
  ],
  node8: [
    { name: "โมเลกุลไวรัสจำลอง", maxHp: 70, sprite: "assets/enemy_virus.png", emoji: "🦠", subject: "เซลล์ & สิ่งมีชีวิต" },
    { name: "ไวรัสนาโนกลายพันธุ์ยักษ์", maxHp: 120, sprite: "assets/enemy_virus.png", emoji: "🦠", subject: "เซลล์ & พันธุกรรม" }
  ],
  node9: [
    { name: "เศษขยะดาวเทียมเก่า", maxHp: 70, sprite: "assets/enemy_space.png", emoji: "📡", subject: "ดาราศาสตร์ & คลื่น" },
    { name: "อสุรกายคลื่นความร้อนอวกาศ", maxHp: 120, sprite: "assets/enemy_space.png", emoji: "☄️", subject: "ดาราศาสตร์ & คลื่น" }
  ],
  node10: [
    { name: "อุกกาบาตลูกเล็ก", maxHp: 60, sprite: "assets/enemy_space.png", emoji: "☄️", subject: "โลก & ดาราศาสตร์" },
    { name: "ยานรบต่างดาวทมิฬ", maxHp: 80, sprite: "assets/enemy_space.png", emoji: "🛸", subject: "โลก & ดาราศาสตร์" },
    { name: "โกเลมอุกกาบาตอัคคี", maxHp: 150, sprite: "assets/enemy_space.png", emoji: "👹", subject: "โลก & ดาราศาสตร์" }
  ]
};

let activeQuestionObj = null;
let quizSecondsLeft = 90;
let quizTimerInterval = null;

// เก็บ ID คำถามที่ถูกใช้ไปแล้วในรอบการสู้ครั้งนี้ (กันคำถามซ้ำ)
let usedQuestionIds = new Set();

// สารพัดตัวแปรกระสุนเวทมนตร์แคนวาส 2D
let combatCanvas = null;
let combatCtx = null;
let combatAnimFrameId = null;
let spellsList = [];
let battleSceneTime = 0;
let battleAmbientParticles = [];

// ชื่อเล่นของนักเรียนแท็บนี้ (สำหรับโหมดจอย Controller)
let myNickname = sessionStorage.getItem("sci_quest_nickname") || null;

// ระดับชั้นเรียนที่เลือกสแตนบายก่อนเล่นเกม
let selectedGradeForInit = "p4";

// ==========================================================================
// 2. ฟังก์ชันหน้าจอแผนที่ Candy Crush (Node Map Controller)
// ==========================================================================
function renderNodeMap() {
  const modules = App.getModuleStates();
  const wrapper = document.getElementById("rpg-nodes-wrapper");
  if (!wrapper) return;
  
  wrapper.innerHTML = "";
  
  const nodeEmojis = {
    node1: "⚡",
    node2: "🔋",
    node3: "🧪",
    node4: "🧪",
    node5: "🌿",
    node6: "🌲",
    node7: "🧬",
    node8: "🦠",
    node9: "📡",
    node10: "🛸"
  };

  NODE_KEYS.forEach(key => {
    const mod = modules[key];
    const pos = NODE_POSITIONS[key];
    
    const nodeEl = document.createElement("div");
    nodeEl.className = `map-node ${mod.status}`;
    nodeEl.setAttribute("data-node-key", key);
    nodeEl.style.left = `${pos.x * 100}%`;
    nodeEl.style.top = `${pos.y * 100}%`;
    nodeEl.style.position = "absolute";
    nodeEl.style.transform = "translate(-50%, -50%);
    
    if (mod.repaired) {
      nodeEl.className = `map-node repaired`;
      nodeEl.innerHTML = `✅`;
    } else if (mod.status === "unlocked") {
      nodeEl.innerHTML = nodeEmojis[key];
    } else {
      nodeEl.innerHTML = `🔒`;
    }
    
    const labelEl = document.createElement("div");
    labelEl.className = "map-node-label";
    labelEl.style.textAlign = "center";
    labelEl.innerHTML = `
      <div style="font-size:0.9rem; font-weight:700;">${mod.label}</div>
      <small style="font-weight:normal; opacity:0.85;">(${mod.subject})</small>
    `;
    nodeEl.appendChild(labelEl);
    
    // คลิกปุ่มด่าน
    nodeEl.onclick = function() {
      if (mod.status === "locked" && !mod.repaired) {
        SoundFX.playAlarm();
        App.showToast("⚠️ ด่านนี้ยังล็อคอยู่! คุณครูต้องควบคุมห้องเรียนผ่านด่านก่อนหน้าก่อน", true);
        return;
      }
      SoundFX.playClick();
      startClassroomBattle(key);
    };
    
    wrapper.appendChild(nodeEl);
  });
  
  // วาดเส้นเชื่อมระหว่าง Node
  setTimeout(drawNodePath, 50);
}

function drawNodePath() {
  const canvas = document.getElementById("rpg-node-map-canvas");
  if (!canvas) return;
  
  const ctx = canvas.getContext("2d");
  const container = canvas.parentElement;
  
  // Guard: skip if container has no dimensions (not yet laid out)
  if (!container || container.clientWidth === 0 || container.clientHeight === 0) {
    requestAnimationFrame(drawNodePath);
    return;
  }
  
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  const points = [];
  NODE_KEYS.forEach(key => {
    const el = document.querySelector(`[data-node-key="${key}"]`);
    if (el) {
      const parentRect = container.getBoundingClientRect();
      const rect = el.getBoundingClientRect();
      points.push({
        x: (rect.left - parentRect.left) + rect.width / 2,
        y: (rect.top - parentRect.top) + rect.height / 2
      });
    }
  });
  
  if (points.length < 2) return;
  
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i+1];
    const xc = (p0.x + p1.x) / 2;
    const yc = (p0.y + p1.y) / 2;
    ctx.quadraticCurveTo(p0.x, p0.y, xc, yc);
  }
  ctx.lineTo(points[points.length-1].x, points[points.length-1].y);
  
  ctx.strokeStyle = "rgba(0, 243, 255, 0.4);
  ctx.lineWidth = 6;
  ctx.setLineDash([10, 15]);
  ctx.shadowBlur = 12;
  ctx.shadowColor = "#00f3ff";
  ctx.stroke();
  
  ctx.shadowBlur = 0;
  ctx.setLineDash([]);
}

// ครูเริ่มด่านต่อสู้
function startClassroomBattle(nodeKey) {
  const modules = App.getModuleStates();
  const mod = modules[nodeKey];
  
  // รีเซ็ตคำถามที่ใช้แล้วสำหรับรอบการสู้ครั้งนี้
  usedQuestionIds = new Set();
  
  App.setActiveNode(nodeKey);
  App.clearVotesAndResponses();
  
  const nodeEnemies = NODE_ENEMIES[nodeKey] || [];
  let enemyIndex = 0;
  let currentBossHp = 0;
  let maxBossHp = 100;
  let ppState = {
    laser: Infinity,
    emp: MOVES.emp.maxPp,
    quantum: MOVES.quantum.maxPp,
    nanobot: MOVES.nanobot.maxPp
  };
  let comboCount = 0;
  
  // เช็คว่ามีข้อมูลบันทึกการเล่นค้างไว้หรือไม่
  if (mod.bossHp !== undefined && mod.bossHp > 0) {
    enemyIndex = mod.enemyIndex || 0;
    currentBossHp = mod.bossHp;
    const activeEnemy = nodeEnemies[enemyIndex] || nodeEnemies[0];
    maxBossHp = activeEnemy.maxHp;
    
    if (mod.movesPp) {
      try {
        ppState = JSON.parse(mod.movesPp);
      } catch(e) {}
    }
    comboCount = mod.comboCount || 0;
    
    addShipLog(`คุณครูเปิดระบบกู้คืนต่อสู้: ${mod.label} (เล่นต่อจากคลื่นศัตรูที่ ${enemyIndex + 1}, HP: ${currentBossHp}/${maxBossHp})`, "system");
    App.showToast(`💾 โหลดด่านบันทึกความคืบหน้าเดิมสำเร็จ!`);
  } else {
    // เริ่มต้นใหม่ทั้งหมด
    enemyIndex = 0;
    const activeEnemy = nodeEnemies[0];
    currentBossHp = activeEnemy.maxHp;
    maxBossHp = activeEnemy.maxHp;
    
    addShipLog(`คุณครูเริ่มระบบต่อสู้: ${mod.label} ปะทะศัตรูระลอกแรก: ${activeEnemy.name}!`, "system");
  }
  
  localStorage.setItem(gk("sci_quest_battle_enemy_index"), enemyIndex);
  localStorage.setItem(gk("sci_quest_boss_hp"), currentBossHp);
  localStorage.setItem(gk("sci_quest_boss_max_hp"), maxBossHp);
  localStorage.setItem(gk("sci_quest_moves_pp"), JSON.stringify(ppState));
  localStorage.setItem(gk("sci_quest_combo_count"), comboCount);
  
  App.setGamePhase("voting");
}

// ==========================================================================
// 3. ฟังก์ชันอัปเดตสถานะ Interface ครู/นักเรียน (Phase Management)
// ==========================================================================
function updatePhaseUI(phase) {
  const levelConfirmed = localStorage.getItem(gk("sci_quest_level_confirmed")) === "true";
  
  const levelSelectEl = document.getElementById("rpg-level-select");
  const sidebarEl = document.querySelector(".game-sidebar");
  
  // หากยังไม่ยืนยันระดับชั้น บังคับให้ครูเลือกชั้นเรียนก่อน
  if (!levelConfirmed) {
    if (levelSelectEl) levelSelectEl.style.display = "flex";
    if (sidebarEl) sidebarEl.style.display = "none";
    document.getElementById("rpg-node-map").style.display = "none";
    document.getElementById("rpg-battle-overlay").style.display = "none";
    document.getElementById("game-over-overlay").classList.remove("active");
    document.getElementById("victory-overlay-screen").classList.remove("active");
    
    stopCombatCanvasLoop();
    setupLevelSelectUI();
    return;
  }
  
  // ซ่อนแผงเลือกชั้น และแสดงแถบเมนูด้านข้างปกติ
  if (levelSelectEl) levelSelectEl.style.display = "none";
  if (sidebarEl) sidebarEl.style.display = "flex";
  
  if (phase === "map") {
    document.getElementById("rpg-node-map").style.display = "block";
    document.getElementById("rpg-battle-overlay").style.display = "none";
    document.getElementById("game-over-overlay").classList.remove("active");
    document.getElementById("victory-overlay-screen").classList.remove("active");
    
    stopCombatCanvasLoop();
    renderNodeMap();
  } 
  else if (phase === "voting") {
    document.getElementById("rpg-node-map").style.display = "none";
    document.getElementById("rpg-battle-overlay").style.display = "flex";
    document.getElementById("game-over-overlay").classList.remove("active");
    document.getElementById("victory-overlay-screen").classList.remove("active");
    
    document.getElementById("proj-voting-panel").style.display = "block";
    document.getElementById("proj-quiz-panel").style.display = "none";
    
    const lockBtn = document.getElementById("btn-proj-lock-votes");
    if (lockBtn) lockBtn.style.display = "none";
    
    const votingTitle = document.querySelector("#proj-voting-panel h3");
    if (votingTitle) votingTitle.innerHTML = "🗳️ มติห้องเรียน: คุณครูคลิกเลือกท่าต่อสู้โดยตรง";
    
    setupBattleArenaUI();
    renderVoteBars();
    startCombatCanvasLoop();
  }
  else if (phase === "quiz") {
    document.getElementById("rpg-node-map").style.display = "none";
    document.getElementById("rpg-battle-overlay").style.display = "flex";
    
    document.getElementById("proj-voting-panel").style.display = "none";
    document.getElementById("proj-quiz-panel").style.display = "block";
    document.getElementById("proj-explanation-area").style.display = "none";
    document.getElementById("proj-skip-row").style.display = "flex";
    
    setupBattleArenaUI();
    renderProjectorQuestion();
    startProjectorTimer();
  }
  else if (phase === "explanation") {
    document.getElementById("rpg-node-map").style.display = "none";
    document.getElementById("rpg-battle-overlay").style.display = "flex";
    
    document.getElementById("proj-voting-panel").style.display = "none";
    document.getElementById("proj-quiz-panel").style.display = "block";
    document.getElementById("proj-explanation-area").style.display = "block";
    document.getElementById("proj-skip-row").style.display = "none";
    
    setupBattleArenaUI();
    renderProjectorExplanation();
  }
  else if (phase === "victory") {
    document.getElementById("rpg-node-map").style.display = "none";
    document.getElementById("rpg-battle-overlay").style.display = "none";
    document.getElementById("victory-overlay-screen").classList.add("active");
    document.getElementById("game-over-overlay").classList.remove("active");
  }
  else if (phase === "gameover") {
    document.getElementById("rpg-node-map").style.display = "none";
    document.getElementById("rpg-battle-overlay").style.display = "none";
    document.getElementById("game-over-overlay").classList.add("active");
    document.getElementById("victory-overlay-screen").classList.remove("active");
  }
  
  updateStudentControllerUI();
}

// ตั้งค่าและผูกตัวเลือกสำหรับการเริ่มต้นเลือกระดับชั้นเรียนของครู (Save Slot Menu)
function setupLevelSelectUI() {
  const cards = document.querySelectorAll(".level-card-item");
  cards.forEach(card => {
    const grade = card.getAttribute("data-grade");
    const hasSave = window.App.hasSaveData(grade);
    const saveIndicator = card.querySelector(".save-indicator");
    
    if (grade === selectedGradeForInit) {
      card.style.borderColor = "var(--neon-cyan)";
      card.style.boxShadow = "0 0 15px var(--neon-cyan-glow)";
      card.style.background = "radial-gradient(circle, rgba(0, 243, 255, 0.15) 0%, rgba(18, 18, 28, 0.95) 75%)";
    } else {
      card.style.borderColor = "var(--border-light)";
      card.style.boxShadow = "none";
      card.style.background = "rgba(0,0,0,0.3)";
    }
    
    // เพิ่ม/อัปเดตตัวบ่งชี้เซฟ
    if (hasSave) {
      if (!saveIndicator) {
        const indicator = document.createElement("div");
        indicator.className = "save-indicator";
        indicator.style.cssText = "position:absolute;top:-6px;right:-6px;background:var(--neon-emerald);color:#000;font-size:0.65rem;font-weight:bold;padding:2px 7px;border-radius:10px;box-shadow:0 0 8px var(--neon-emerald-glow);";
        indicator.textContent = "💾";
        card.style.position = "relative";
        card.appendChild(indicator);
      }
    } else if (saveIndicator) {
      saveIndicator.remove();
    }
    
    card.onclick = function() {
      SoundFX.playClick();
      selectedGradeForInit = grade;
      setupLevelSelectUI(); 
    };
  });
  
  const confirmBtn = document.getElementById("btn-confirm-level");
  if (confirmBtn) {
    const hasSave = window.App.hasSaveData(selectedGradeForInit);
    if (hasSave) {
      confirmBtn.textContent = "▶️ เล่นต่อ (โหลดเซฟเดิม)";
      confirmBtn.style.borderColor = "var(--neon-emerald)";
      confirmBtn.style.color = "var(--neon-emerald)";
    } else {
      confirmBtn.textContent = "🎮 เริ่มใหม่ (ระดับนี้ยังไม่มีเซฟ)";
      confirmBtn.style.borderColor = "var(--neon-cyan)";
      confirmBtn.style.color = "var(--neon-cyan)";
    }
    
    confirmBtn.onclick = function() {
      SoundFX.playBeep(880, 0.25);
      
      const settings = App.getSystemSettings();
      settings.activeGrade = selectedGradeForInit;
      App.saveSystemSettings(settings);
      
      // รีเซ็ต phase เป็น map เมื่อเลือกชั้นเรียน
      App.setGamePhase("map");
      localStorage.setItem(gk("sci_quest_level_confirmed"), "true");
      
      window.dispatchEvent(new CustomEvent("settings-changed", { detail: settings }));
      updatePhaseUI("map");
      
      addShipLog(`ยินดีต้อนรับระดับวิชาใหม่! เริ่มทริปผจญภัยสำหรับชั้นเรียน: ${selectedGradeForInit.toUpperCase()}`, "system");
    };
  }
}

const TRANSPARENT_SPRITE_CACHE = {};

// ลบพื้นหลังขาวออกจากภาพ PNG ให้โปร่งใส
function getTransparentSprite(imgUrl, callback) {
  if (TRANSPARENT_SPRITE_CACHE[imgUrl]) {
    callback(TRANSPARENT_SPRITE_CACHE[imgUrl]);
    return;
  }
  
  const img = new Image();
  img.onload = function() {
    // Limit processing size to avoid quota/memory issues
    const MAX_SIZE = 512;
    let w = img.width;
    let h = img.height;
    if (w > MAX_SIZE || h > MAX_SIZE) {
      const ratio = Math.min(MAX_SIZE / w, MAX_SIZE / h);
      w = Math.round(w * ratio);
      h = Math.round(h * ratio);
    }
    
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, w, h);
    
    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      
      // ลบพิกเซลสีขาว/เกือบขาวออก (Threshold 200) - ทำให้โปร่งใส
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i+1];
        const b = data[i+2];
        // ถ้าพิกเซลสว่างมาก (ขาว/เกือบขาว) => ตั้งค่า Alpha = 0
        if (r > 200 && g > 200 && b > 200) {
          data[i+3] = 0;
        }
      }
      
      ctx.putImageData(imgData, 0, 0);
      const dataUrl = canvas.toDataURL();
      TRANSPARENT_SPRITE_CACHE[imgUrl] = dataUrl;
      callback(dataUrl);
    } catch (e) {
      console.warn("getTransparentSprite: canvas processing failed (" + e.message + "), falling back to original");
      callback(imgUrl);
    }
  };
  img.onerror = function() {
    callback(imgUrl);
  };
  img.src = imgUrl;
}

// ==========================================================================
// 4b. ใช้ getTransparentSprite สำหรับ sprite asset PNG
// ==========================================================================

// อัปเดตข้อมูล UI เลย์เอาต์บอสและตัวละคร
function setupBattleArenaUI() {
  const activeNodeKey = App.getActiveNode();
  if (!activeNodeKey) return;
  
  const modules = App.getModuleStates();
  const activeMod = modules[activeNodeKey];
  if (!activeMod) return;
  
  const nodeEnemies = NODE_ENEMIES[activeNodeKey] || [];
  const enemyIndex = parseInt(localStorage.getItem(gk("sci_quest_battle_enemy_index"))) || 0;
  const activeEnemy = nodeEnemies[enemyIndex] || nodeEnemies[0] || { name: activeMod.bossName, maxHp: 100, emoji: "👹", subject: activeMod.subject };
  
  // แสดงชื่อศัตรู พร้อมแถบความก้าวหน้าระลอก
  document.getElementById("battle-enemy-name").textContent = `${activeEnemy.name} (คลื่นที่ ${enemyIndex + 1}/${nodeEnemies.length})`;
  document.getElementById("battle-enemy-subject").textContent = `สาระวิชา: ${activeEnemy.subject}`;
  
  // อัปเดต Sprite ตัวละครหลัก (ใช้ sprite sheet 4×4 พร้อม Frame Animation)
  const playerSpriteEl = document.getElementById("battle-player-sprite");
  if (playerSpriteEl) {
    getTransparentSprite("assets/player_hero.png", function(url) {
      playerSpriteEl.innerHTML = "";
      playerSpriteEl.style.backgroundImage = `url('${url}')`;
      playerSpriteEl.style.backgroundSize = "512px 512px";
      playerSpriteEl.style.backgroundRepeat = "no-repeat";
      playerSpriteEl.style.backgroundPosition = "0 0";
      playerSpriteEl.classList.remove("hero-idle", "hero-attack", "hero-hurt");
      playerSpriteEl.classList.add("hero-idle", "sprite-float");
    });
  }
  
  // อัปเดต Sprite ศัตรู (ใช้ img แบบเดี่ยว ไม่ใช่ sprite sheet)
  const enemySpriteEl = document.getElementById("battle-enemy-sprite");
  if (enemySpriteEl) {
    if (activeEnemy.sprite) {
      getTransparentSprite(activeEnemy.sprite, function(url) {
        enemySpriteEl.innerHTML = `<img src="${url}" alt="Enemy" style="width: 100%; height: 100%; object-fit: contain;">`;
        enemySpriteEl.style.backgroundImage = "none";
        enemySpriteEl.classList.add("sprite-float");
      });
    } else {
      enemySpriteEl.innerHTML = `<span style="font-size: 4rem; line-height: 1;">${activeEnemy.emoji || "👹"}</span>`;
    }
  }
  
  // The canvas now draws the background - just reset the class
  const arena = document.querySelector(".rpg-battle-window .battle-arena");
  arena.className = "battle-arena";
  
  // Add background theme based on node (each node zone has unique atmosphere)
  const bgThemeMap = {
    node1: "reactor", node2: "reactor",
    node3: "water", node4: "water",
    node5: "botanic", node6: "botanic",
    node7: "genetics", node8: "genetics",
    node9: "bridge", node10: "bridge"
  };
  const theme = bgThemeMap[activeNodeKey] || "reactor";
  arena.classList.add(`battle-bg-${theme}`);
  
  updateBattleHPBars();
}

function updateBattleHPBars() {
  const bossHp = parseInt(localStorage.getItem(gk("sci_quest_boss_hp"))) || 0;
  const bossMaxHp = parseInt(localStorage.getItem(gk("sci_quest_boss_max_hp"))) || 100;
  const studentScore = App.getStudentScore();
  const playerHp = studentScore.hp;
  const playerMaxHp = studentScore.maxHp;
  
  const enemyPercent = Math.max(0, (bossHp / bossMaxHp) * 100);
  const playerPercent = Math.max(0, (playerHp / playerMaxHp) * 100);
  
  document.getElementById("battle-enemy-hp").style.width = `${enemyPercent}%`;
  document.getElementById("battle-enemy-hp-text").textContent = `${bossHp}/${bossMaxHp}`;
  
  document.getElementById("battle-player-hp").style.width = `${playerPercent}%`;
  document.getElementById("battle-player-hp-text").textContent = `${playerHp}/${playerMaxHp}`;
  
  document.getElementById("hud-hp-val").textContent = `${playerHp}/${playerMaxHp}`;
  document.getElementById("hud-score-val").textContent = studentScore.score;
  
  let repairedCount = 0;
  const modules = App.getModuleStates();
  for (let key in modules) {
    if (modules[key].repaired) repairedCount++;
  }
  const totalCount = Object.keys(modules).length || 10;
  document.getElementById("hud-correct-val").textContent = `${repairedCount}/${totalCount}`;
  
  // Update or create combo badge
  const comboCount = parseInt(localStorage.getItem(gk("sci_quest_combo_count"))) || 0;
  let comboBadge = document.getElementById("battle-combo-badge");
  if (!comboBadge) {
    // Create badge dynamically if not in HTML
    comboBadge = document.createElement("div");
    comboBadge.id = "battle-combo-badge";
    comboBadge.style.cssText = "position: absolute; top: 10px; left: 50%; transform: translateX(-50%); z-index: 110; display: none; background: rgba(255,174,0,0.15); border: 1px solid var(--neon-amber); border-radius: 20px; padding: 3px 16px; font-weight: 800; font-size: 0.9rem; color: var(--neon-amber); box-shadow: 0 0 15px rgba(255,174,0,0.4); white-space: nowrap; animation: logo-pulse 1.2s infinite alternate;";
    comboBadge.innerHTML = `🔥 COMBO x<span id="battle-combo-count">0</span>`;
    const battleWindow = document.querySelector(".rpg-battle-window");
    if (battleWindow) battleWindow.appendChild(comboBadge);
  }
  const comboCountEl = document.getElementById("battle-combo-count");
  if (comboBadge && comboCountEl) {
    if (comboCount >= 2) {
      comboBadge.style.display = "block";
      comboCountEl.textContent = comboCount;
    } else {
      comboBadge.style.display = "none";
    }
  }
}

// ครูสั่งคลิกปุ่มเลือกท่าต่อสู้โดยตรง (มติจากการยกมือตอบในห้องเรียน)
function renderVoteBars() {
  const wrapper = document.getElementById("proj-vote-bars-wrapper");
  if (!wrapper) return;
  wrapper.innerHTML = "";
  
  const ppState = JSON.parse(localStorage.getItem(gk("sci_quest_moves_pp"))) || {};
  
  for (let key in MOVES) {
    const move = MOVES[key];
    // Fix: JSON.stringify converts Infinity to null. Restore Infinity for moves with infinite PP.
    const rawPp = ppState[key] !== undefined ? ppState[key] : move.maxPp;
    const pp = (rawPp === null && move.maxPp === Infinity) ? Infinity : rawPp;
    const isExhausted = pp <= 0;
    
    const btnEl = document.createElement("button");
    btnEl.className = "btn-neon";
    btnEl.style.width = "100%";
    btnEl.style.textAlign = "left";
    btnEl.style.padding = "14px 20px";
    btnEl.style.border = `2px solid ${isExhausted ? '#475569' : move.color}`;
    btnEl.style.background = isExhausted ? "rgba(30, 30, 40, 0.4) : "rgba(0,0,0,0.5);
    btnEl.style.cursor = isExhausted ? "not-allowed" : "pointer";
    btnEl.style.color = isExhausted ? "#64748b" : "white";
    btnEl.style.borderRadius = "12px";
    btnEl.style.transition = "all 0.25s ease-out";
    btnEl.style.opacity = isExhausted ? "0.5" : "1.0";
    btnEl.disabled = isExhausted;
    
    if (!isExhausted) {
      btnEl.onmouseover = () => {
        btnEl.style.background = move.color;
        btnEl.style.color = "var(--text-dark);
        btnEl.style.boxShadow = `0 0 25px ${move.color}, inset 0 0 10px rgba(255,255,255,0.2)`;
        btnEl.style.transform = "translateY(-2px);
      };
      btnEl.onmouseout = () => {
        btnEl.style.background = "rgba(0,0,0,0.5);
        btnEl.style.color = "white";
        btnEl.style.boxShadow = "none";
        btnEl.style.transform = "translateY(0);
      };
      
      btnEl.onclick = function() {
        SoundFX.playClick();
        selectMoveByTeacher(key);
      };
    }
    
    const ppDisplay = pp === Infinity ? "∞" : `${pp}/${move.maxPp}`;
    
    btnEl.innerHTML = `
      <div style="font-weight:bold; font-size:1.2rem; display:flex; justify-content:space-between; align-items:center;">
        <span>${move.label}</span>
        <span style="font-size:0.8rem; background:rgba(255,255,255,0.15); padding:3px 10px; border-radius:6px; font-weight:bold; color:inherit;">
          ${isExhausted ? 'PP หมดแล้ว ❌' : `PP: ${ppDisplay} ➔`}
        </span>
      </div>
      <div style="font-size:0.85rem; opacity:0.85; margin-top:6px; font-weight:normal;">${move.detail}</div>
    `;
    
    wrapper.appendChild(btnEl);
  }
}

// ครูเลือกท่าโจมตี ดึงข้อสอบวิทยาศาสตร์ระดับความยากนั้นออกมา
function selectMoveByTeacher(key) {
  const chosenMove = MOVES[key];
  App.saveActiveMove(chosenMove);
  
  // หักค่า PP ของท่าพิเศษ (ยกเว้น Laser Bolt)
  if (key !== "laser") {
    const ppState = JSON.parse(localStorage.getItem(gk("sci_quest_moves_pp"))) || {};
    if (ppState[key] !== undefined) {
      ppState[key] = Math.max(0, ppState[key] - 1);
    } else {
      ppState[key] = chosenMove.maxPp - 1;
    }
    localStorage.setItem(gk("sci_quest_moves_pp"), JSON.stringify(ppState));
  }
  
  const settings = App.getSystemSettings();
  const db = window.ScienceDB.getQuestions();
  const activeGrade = settings.activeGrade;
  const activeSubject = localStorage.getItem(gk("sci_quest_active_subject")) || "all";
  
  const questionsList = db[activeGrade] || [];
  
  // กรองตามความยาก และ สาระวิชาที่ครูต้องการสอนคาบนี้
  // และไม่เอาโจทย์ที่ถูกใช้ไปแล้วในรอบนี้
  let filtered = questionsList.filter(q => {
    // 1. ข้ามคำถามที่ถูกใช้ไปแล้วในรอบการสู้ครั้งนี้
    if (usedQuestionIds.has(q.id)) return false;
    
    // 2. ตรวจสอบความยากของท่า
    if (q.difficulty !== chosenMove.difficulty) return false;
    
    // 3. ตรวจสอบความสอดคล้องกับสาระวิชาที่ครูเลือก
    if (activeSubject === "biology") return q.topic.includes("ชีววิทยา");
    if (activeSubject === "chemistry") return q.topic.includes("เคมี");
    if (activeSubject === "physics") return q.topic.includes("ฟิสิกส์");
    if (activeSubject === "space") return q.topic.includes("โลก") || q.topic.includes("อวกาศ");
    
    return true; // "all"
  });
  
  let question = filtered[Math.floor(Math.random() * filtered.length)];
  
  // Fallback 1: หากไม่พบข้อสอบในวิชานี้ที่ตรงกับความยากที่เลือก ให้ดึงจากวิชานี้ที่ความยากใดก็ได้
  if (!question && activeSubject !== "all") {
    filtered = questionsList.filter(q => {
      if (activeSubject === "biology") return q.topic.includes("ชีววิทยา");
      if (activeSubject === "chemistry") return q.topic.includes("เคมี");
      if (activeSubject === "physics") return q.topic.includes("ฟิสิกส์");
      if (activeSubject === "space") return q.topic.includes("โลก") || q.topic.includes("อวกาศ");
      return true;
    });
    question = filtered[Math.floor(Math.random() * filtered.length)];
    if (question) {
      App.showToast("ℹ️ สุ่มข้อสอบวิชาที่เน้นแต่ความยากอื่น เนื่องจากหมดระดับความยากนี้");
    }
  }
  
  // Fallback 2: หากไม่มีข้อสอบวิชานี้เลย ให้สุ่มความยากเดียวกันแต่ต่างวิชา
  if (!question) {
    filtered = questionsList.filter(q => q.difficulty === chosenMove.difficulty);
    question = filtered[Math.floor(Math.random() * filtered.length)];
    if (question) {
      App.showToast("ℹ️ สุ่มต่างหัวข้อวิชาในระดับความยากเดียวกันมาแทน");
    }
  }
  
  // Fallback 3: สุ่มข้อใดก็ได้ในเกรดนี้
  if (!question) {
    question = questionsList[Math.floor(Math.random() * questionsList.length)];
  }
  
  if (!question) {
    SoundFX.playAlarm();
    App.showToast("⚠️ ไม่พบคำถามวิทย์ตรงความยากเกรดนี้ในคลัง! กรุณาเพิ่มโจทย์ก่อน", true);
    return;
  }
  
  // เก็บ ID คำถามที่ใช้ไปแล้วเพื่อกันซ้ำ
  usedQuestionIds.add(question.id);
  
  localStorage.setItem(gk("sci_quest_active_question_id"), question.id);
  window.dispatchEvent(new CustomEvent("active-question-changed", { detail: question.id }));
  
  addShipLog(`ครูเลือกใช้ท่า: "${chosenMove.label}" ดึงโจทย์เรื่อง "${question.topic}" ระดับ "${chosenMove.difficulty === 'easy' ? 'ง่าย' : chosenMove.difficulty === 'medium' ? 'ปานกลาง' : 'ยาก'}"`, "system");
  
  App.setGamePhase("quiz");
}

// แสดงโจทย์วิทยาศาสตร์บนจอหลักโปรเจกเตอร์
function renderProjectorQuestion() {
  const qId = localStorage.getItem(gk("sci_quest_active_question_id"));
  if (!qId) return;
  
  const questionsData = window.ScienceDB.getQuestions();
  let qObj = null;
  for (let grade in questionsData) {
    qObj = questionsData[grade].find(item => item.id === qId);
    if (qObj) break;
  }
  
  if (!qObj) return;
  activeQuestionObj = qObj;
  
  const activeMove = App.getActiveMove();
  
  document.getElementById("proj-quiz-topic").innerHTML = `⚔️ ภารกิจตอบคำถามวิทยาศาสตร์: <span style="color:${activeMove.color};">${qObj.topic} (ระดับ: ${activeMove.difficulty === 'easy' ? 'ง่าย' : activeMove.difficulty === 'medium' ? 'ปานกลาง' : 'ยาก'})</span>`;
  document.getElementById("proj-question-text").textContent = qObj.question;
  
  const optionsGrid = document.getElementById("proj-options-grid");
  optionsGrid.innerHTML = "";
  
  const prefixes = ["ก.", "ข.", "ค.", "ง."];
  qObj.options.forEach((opt, idx) => {
    const optEl = document.createElement("button");
    optEl.className = "btn-neon";
    optEl.style.width = "100%";
    optEl.style.textAlign = "left";
    optEl.style.padding = "10px 16px";
    optEl.style.fontSize = "1.1rem";
    optEl.style.border = "1px solid var(--border-light);
    optEl.style.background = "rgba(0,0,0,0.4);
    optEl.style.cursor = "pointer";
    optEl.style.color = "white";
    optEl.style.borderRadius = "12px";
    optEl.style.transition = "all 0.2s ease";
    
    optEl.onmouseover = () => {
      optEl.style.borderColor = "var(--neon-cyan);
      optEl.style.boxShadow = "0 0 15px rgba(0, 243, 255, 0.35);
      optEl.style.transform = "translateY(-1px);
    };
    optEl.onmouseout = () => {
      optEl.style.borderColor = "var(--border-light);
      optEl.style.boxShadow = "none";
      optEl.style.transform = "translateY(0);
    };
    
    optEl.onclick = () => {
      SoundFX.playClick();
      resolveClassroomDirectChoice(idx);
    };
    
    optEl.innerHTML = `<strong style="color:var(--neon-cyan); margin-right:10px;">${prefixes[idx]}</strong> ${opt}`;
    optionsGrid.appendChild(optEl);
  });
}

// ตัวจับเวลาสำหรับคุณครูปล่อยเวลาทำโจทย์
function startProjectorTimer() {
  if (quizTimerInterval) clearInterval(quizTimerInterval);
  
  const settings = App.getSystemSettings();
  quizSecondsLeft = settings.timerLimit || 90;
  
  const timerValEl = document.getElementById("proj-timer-val");
  if (timerValEl) {
    timerValEl.textContent = `${quizSecondsLeft}s`;
    timerValEl.style.color = "var(--neon-red);
  }
  
  quizTimerInterval = setInterval(() => {
    quizSecondsLeft--;
    if (quizSecondsLeft <= 0) {
      clearInterval(quizTimerInterval);
      if (timerValEl) timerValEl.textContent = `หมดเวลา!`;
      SoundFX.playAlarm();
      resolveClassroomDirectChoice(-1); // -1 หมายถึงหมดเวลา
    } else {
      if (timerValEl) timerValEl.textContent = `${quizSecondsLeft}s`;
      if (quizSecondsLeft <= 5) {
        SoundFX.playBeep(440, 0.08, "triangle"); 
      }
    }
  }, 1000);
}

// คำนวณผลลัพธ์จากการกดตอบของครูโดยตรง (Single-Device Resolution)
function resolveClassroomDirectChoice(chosenIdx) {
  if (quizTimerInterval) clearInterval(quizTimerInterval);
  
  const qObj = activeQuestionObj;
  if (!qObj) return;
  
  localStorage.setItem(gk("sci_quest_class_choice"), chosenIdx);
  
  const isCorrect = chosenIdx === qObj.correct;
  const activeMove = App.getActiveMove();
  const activeNodeKey = App.getActiveNode();
  
  const ppState = JSON.parse(localStorage.getItem(gk("sci_quest_moves_pp"))) || {};
  const currentPP = ppState[activeMove.key] !== undefined ? ppState[activeMove.key] : activeMove.maxPp;
  
  if (isCorrect) {
    // เพิ่มสะสมคอมโบเมื่อตอบถูกต้องต่อเนื่อง
    const comboCount = (parseInt(localStorage.getItem(gk("sci_quest_combo_count"))) || 0) + 1;
    localStorage.setItem(gk("sci_quest_combo_count"), comboCount);
    
    if (activeMove.type === "attack") {
      const baseDmg = activeMove.dmg;
      const comboMultiplier = 1.0 + Math.min(0.5, (comboCount - 1) * 0.1); // สูงสุด +50% ที่ combo x6
      
      // คำนวณอัตราความแม่นยำ (Accuracy Check)
      const accuracy = activeMove.accuracy !== undefined ? activeMove.accuracy : 1.0;
      const isHit = Math.random() <= accuracy;
      
      if (!isHit) {
        // โจมตีพลาด (Missed)
        window.SoundFX.playPlayerDamage(); // เสียงพลาดเลี่ยนมาใช้คลื่นพัง
        
        // แอนิเมชันโจมตีของฝั่งผู้เล่น
        const playerSpriteEl = document.getElementById("battle-player-sprite");
        if (playerSpriteEl) {
          playerSpriteEl.classList.add("player-attack-dash");
          playerSpriteEl.classList.replace("hero-idle", "hero-attack");
          setTimeout(() => {
            playerSpriteEl.classList.remove("player-attack-dash");
            playerSpriteEl.classList.replace("hero-attack", "hero-idle");
          }, 500);
        }
        
        shootCombatProjectile(true, "rgba(100,100,100,0.3), () => {
          triggerDamageEffect(true, "MISS!");
          updateBattleHPBars();
        });
        
        addShipLog(`มติตอบถูก! คอมโบ x${comboCount} ➔ ร่ายท่า "${activeMove.label}" แต่การโจมตี [พลาดเป้า]! (Missed)`, "alert");
        App.showToast("💨 การโจมตีพลาดเป้า (Missed!));
      } else {
        // โจมตีโดน -> คำนวณคริติคอล (Critical Check)
        const critChance = activeMove.critChance !== undefined ? activeMove.critChance : 0.1;
        const isCrit = Math.random() <= critChance;
        const finalDmg = Math.round(baseDmg * comboMultiplier * (isCrit ? 1.5 : 1.0));
        
        let bossHp = parseInt(localStorage.getItem(gk("sci_quest_boss_hp"))) || 0;
        bossHp = Math.max(0, bossHp - finalDmg);
        localStorage.setItem(gk("sci_quest_boss_hp"), bossHp);
        
        // อัปเดตข้อมูลความคืบหน้าบอสลงโมดูล
        const modules = App.getModuleStates();
        if (modules[activeNodeKey]) {
          modules[activeNodeKey].bossHp = bossHp;
          App.saveModuleStates(modules);
        }
        
        const scoreObj = App.getStudentScore();
        scoreObj.score += 25;
        scoreObj.correct += 1;
        App.saveStudentScore(scoreObj);
        
        window.SoundFX.playSlash();
        
        // แอนิเมชันโจมตีของฝั่งผู้เล่น
        const playerSpriteEl = document.getElementById("battle-player-sprite");
        if (playerSpriteEl) {
          playerSpriteEl.classList.add("player-attack-dash");
          playerSpriteEl.classList.replace("hero-idle", "hero-attack");
          setTimeout(() => {
            playerSpriteEl.classList.remove("player-attack-dash");
            playerSpriteEl.classList.replace("hero-attack", "hero-idle");
          }, 500);
        }
        
        shootCombatProjectile(true, activeMove.color, () => {
          triggerDamageEffect(true, isCrit ? `💥 CRIT! -${finalDmg}` : `-${finalDmg}`);
          
          // แอนิเมชันได้รับความเสียหายของฝั่งศัตรู
          const enemySpriteEl = document.getElementById("battle-enemy-sprite");
          if (enemySpriteEl) {
            enemySpriteEl.classList.add("damaged-shake");
            setTimeout(() => enemySpriteEl.classList.remove("damaged-shake"), 500);
          }
          
          updateBattleHPBars();
        });
        
        if (isCrit) {
          addShipLog(`🔥 มติตอบถูก! คอมโบ x${comboCount} [Critical!] ➔ ใช้ท่า "${activeMove.label}" โจมตีคริติคอลสร้างความเสียหาย -${finalDmg}!`, "success");
          App.showToast(`💥 คริติคอล! โจมตีแรงขึ้น -${finalDmg}`);
        } else {
          addShipLog(`มติตอบถูก! คอมโบ x${comboCount} ➔ ใช้ท่า "${activeMove.label}" โจมตีสร้างความเสียหาย -${finalDmg}!`, "success");
        }
      }
    } 
    else if (activeMove.type === "heal") {
      const healVal = 45;
      const scoreObj = App.getStudentScore();
      scoreObj.hp = Math.min(scoreObj.maxHp, scoreObj.hp + healVal);
      scoreObj.correct += 1;
      App.saveStudentScore(scoreObj);
      
      window.SoundFX.playChest();
      
      // แอนิเมชันรักษาตัวของฝั่งผู้เล่น
      const playerSpriteEl = document.getElementById("battle-player-sprite");
      if (playerSpriteEl) {
        playerSpriteEl.classList.add("heal-bounce");
        playerSpriteEl.classList.replace("hero-idle", "hero-attack");
        setTimeout(() => {
          playerSpriteEl.classList.remove("heal-bounce");
          playerSpriteEl.classList.replace("hero-attack", "hero-idle");
        }, 600);
      }
      
      shootHealShieldRing(() => {
        triggerDamageEffect(false, `+${healVal} HP`);
        updateBattleHPBars();
      });
      
      addShipLog(`มติตอบถูก! คอมโบ x${comboCount} ➔ ร่ายบาเรียฟื้นฟูปาร์ตี้ +${healVal} HP!`, "success");
    }
  } 
  else {
    // ตอบผิด -> รีเซ็ตคอมโบ
    localStorage.setItem(gk("sci_quest_combo_count"), 0);
    
    const scoreObj = App.getStudentScore();
    scoreObj.wrong += 1;
    App.saveStudentScore(scoreObj);
    
    const isTimeout = (chosenIdx === -1);
    
    // ถ้าหมดเวลา: ไม่มีการโจมตีใดๆ (turn-based รอให้บอสโจมตี)
    // ถ้าตอบผิด: ฮีโร่โจมตี 7% แม่นยำ, 30% ดาเมจ
    if (activeMove.type === "attack" && !isTimeout) {
      const desperateAccuracy = 0.07;
      const desperateDmgMultiplier = 0.30;
      const isDesperateHit = Math.random() <= desperateAccuracy;
      
      // แอนิเมชันโจมตีของฝั่งผู้เล่น (แสดงเฉพาะตอบผิด ไม่ใช่หมดเวลา)
      const playerSpriteEl = document.getElementById("battle-player-sprite");
      if (playerSpriteEl) {
        playerSpriteEl.classList.add("player-attack-dash");
        playerSpriteEl.classList.replace("hero-idle", "hero-attack");
        setTimeout(() => {
          playerSpriteEl.classList.remove("player-attack-dash");
          playerSpriteEl.classList.replace("hero-attack", "hero-idle");
        }, 500);
      }
      
      if (isDesperateHit) {
        // โจมตีติด! 30% ดาเมจ
        const finalDmg = Math.max(3, Math.round(activeMove.dmg * desperateDmgMultiplier));
        let bossHp = parseInt(localStorage.getItem(gk("sci_quest_boss_hp"))) || 0;
        bossHp = Math.max(0, bossHp - finalDmg);
        localStorage.setItem(gk("sci_quest_boss_hp"), bossHp);
        
        shootCombatProjectile(true, activeMove.color, () => {
          triggerDamageEffect(true, `-${finalDmg} (7%)`);
          updateBattleHPBars();
        });
        
        addShipLog(`ตอบผิด! ปาฏิหาริย์ฮีโร่โจมตีติด -${finalDmg} DMG (7%)`, "warning");
        App.showToast(`✨ ปาฏิหาริย์! ติด -${finalDmg} DMG`);
      } else {
        // พลาด
        shootCombatProjectile(true, "rgba(200,200,200,0.3), () => {
          triggerDamageEffect(true, "MISS!");
          updateBattleHPBars();
        });
        
        addShipLog(`ตอบผิด! ฮีโร่โจมตีพลาด (เหลือโอกาส 7%)`, "alert");
        App.showToast("❌ ฮีโร่โจมตีพลาด! บอสกำลังจะโจมตี", true);
      }
    } else if (isTimeout) {
      // หมดเวลา -> ไม่มีการโจมตีใดๆ
      addShipLog(`หมดเวลา! ไม่มีการโจมตี รอบตกเป็นของบอส`, "alert");
      App.showToast("⏱️ หมดเวลา! บอสกำลังจะโจมตี", true);
    }
    
    // ตั้งค่าเทิร์นของบอส
    localStorage.setItem(gk("sci_quest_boss_turn_pending"), "true");
  }
  
  App.setGamePhase("explanation");
}

// แสดงหน้าต่างเฉลยเหตุผลวิทยาศาสตร์
function renderProjectorExplanation() {
  const qObj = activeQuestionObj;
  if (!qObj) return;
  
  const chosenIdx = parseInt(localStorage.getItem(gk("sci_quest_class_choice")));
  const isCorrect = chosenIdx === qObj.correct;
  
  document.getElementById("proj-exp-title").innerHTML = isCorrect
    ? `✓ คำตอบของห้องเรียนถูกต้อง! <span style="color:var(--neon-emerald);">(ผ่านการกู้ภัยด่าน)</span>`
    : chosenIdx === -1 
      ? `✗ ตอบคำถามไม่ทันเวลา! <span style="color:var(--neon-red);">(ระบบล้มเหลว)</span>`
      : `✗ คำตอบของห้องเรียนยังไม่ถูกต้อง! <span style="color:var(--neon-red);">(ระบบกู้ภัยผิดพลาด)</span>`;
  
  document.getElementById("proj-exp-text").innerHTML = `💡 <strong>วิทยาศาสตร์เบื้องหลังคำตอบ:</strong> ${qObj.hint}`;
  document.getElementById("proj-exp-reason").innerHTML = `📚 <strong>ความสำคัญของการเรียนรู้:</strong> ${qObj.reason}`;
  
  const statsEl = document.getElementById("proj-exp-stats");
  if (statsEl) {
    if (chosenIdx === -1) {
      statsEl.innerHTML = `มติห้องเรียน: <strong style="color:var(--neon-red); font-size:1.1rem;">ส่งคำตอบไม่ทันเวลา</strong>`;
    } else {
      statsEl.innerHTML = `มติห้องเรียนเลือกข้อ: <strong style="color:${isCorrect ? 'var(--neon-emerald)' : 'var(--neon-red)'}; font-size:1.1rem;">ข้อ ${['ก (A)','ข (B)','ค (C)','ง (D)'][chosenIdx]}</strong>`;
    }
    
    // ถ้าตอบผิดและกำลังจะมีบอสเทิร์น ให้แสดงข้อความเตือน
    const bossTurnPending = localStorage.getItem(gk("sci_quest_boss_turn_pending")) === "true";
    const nextBtn = document.getElementById("btn-proj-next-turn");
    if (!isCorrect && bossTurnPending && nextBtn) {
      nextBtn.textContent = "⚔️ รับมือบอสโจมตี!";
      nextBtn.className = "btn-neon btn-neon-red";
      nextBtn.style.animation = "logo-pulse 0.8s infinite alternate";
    } else if (nextBtn) {
      nextBtn.textContent = "ดำเนินการต่อไป ➔";
      nextBtn.className = "btn-neon btn-neon-emerald";
      nextBtn.style.animation = "";
    }
  }
  
  const optionsGrid = document.getElementById("proj-options-grid");
  optionsGrid.innerHTML = "";
  
  const prefixes = ["ก (A).", "ข (B).", "ค (C).", "ง (D)."];
  qObj.options.forEach((opt, idx) => {
    const optEl = document.createElement("div");
    optEl.className = "glass-panel";
    optEl.style.padding = "10px 14px";
    optEl.style.fontSize = "1.1rem";
    optEl.style.border = "1px solid var(--border-light);
    optEl.style.background = "rgba(0,0,0,0.2);
    
    if (idx === qObj.correct) {
      optEl.style.borderColor = "var(--neon-emerald);
      optEl.style.boxShadow = "0 0 15px rgba(0, 255, 102, 0.25);
      optEl.style.background = "rgba(0, 255, 102, 0.05);
    } else if (idx === chosenIdx) {
      optEl.style.borderColor = "var(--neon-red);
      optEl.style.boxShadow = "0 0 15px rgba(255, 46, 93, 0.25);
      optEl.style.background = "rgba(255, 46, 93, 0.05);
    } else {
      optEl.style.borderColor = "var(--border-light);
    }
    
    optEl.innerHTML = `
      <div>
        <strong style="color:${idx === qObj.correct ? 'var(--neon-emerald)' : idx === chosenIdx ? 'var(--neon-red)' : 'var(--neon-cyan)'}; margin-right:10px;">${prefixes[idx]}</strong> ${opt}
      </div>
      ${idx === chosenIdx ? `<div style="font-size:0.8rem; margin-top:6px; color:${isCorrect ? 'var(--neon-emerald)' : 'var(--neon-red)'}; font-weight:bold;">👉 มติคำตอบที่ห้องเรียนร่วมกันเลือก</div>` : ''}
    `;
    
    optionsGrid.appendChild(optEl);
  });
}

// ==========================================================================
// 4. ระบบจำลองแอนิเมชันปะทะบนแคนวาส (2D Combat Canvas Effects)
// ==========================================================================
function startCombatCanvasLoop() {
  combatCanvas = document.getElementById("rpg-battle-canvas");
  if (!combatCanvas) return;
  
  combatCtx = combatCanvas.getContext("2d");
  combatCanvas.width = combatCanvas.clientWidth;
  combatCanvas.height = combatCanvas.clientHeight;
  
  spellsList = [];
  battleSceneTime = 0;
  
  // Spawn ambient atmospheric particles
  battleAmbientParticles = [];
  for (let i = 0; i < 25; i++) {
    battleAmbientParticles.push({
      x: Math.random() * combatCanvas.width,
      y: Math.random() * combatCanvas.height * 0.65,
      vx: (Math.random() - 0.5) * 0.35,
      vy: -Math.random() * 0.4 - 0.15,
      size: Math.random() * 1.8 + 0.4,
      baseAlpha: Math.random() * 0.35 + 0.08,
      color: Math.random() > 0.6 ? "0,243,255" : Math.random() > 0.5 ? "143,0,255" : "255,255,255"
    });
  }

  if (combatAnimFrameId) cancelAnimationFrame(combatAnimFrameId);

  function drawScene() {
    const W = combatCanvas.width;
    const H = combatCanvas.height;
    const groundY = H * 0.65;
    
    // Sky gradient
    const skyGrad = combatCtx.createLinearGradient(0, 0, 0, groundY);
    skyGrad.addColorStop(0, "#06060f");
    skyGrad.addColorStop(0.5, "#0c0c1e");
    skyGrad.addColorStop(1, "#131328");
    combatCtx.fillStyle = skyGrad;
    combatCtx.fillRect(0, 0, W, groundY);
    
    // Ground gradient
    const groundGrad = combatCtx.createLinearGradient(0, groundY, 0, H);
    groundGrad.addColorStop(0, "#1a1a2e");
    groundGrad.addColorStop(0.5, "#0e0e1c");
    groundGrad.addColorStop(1, "#07070f");
    combatCtx.fillStyle = groundGrad;
    combatCtx.fillRect(0, groundY, W, H - groundY);
    
    // Horizon glow line
    const lineGrad = combatCtx.createLinearGradient(0, 0, W, 0);
    lineGrad.addColorStop(0, "transparent");
    lineGrad.addColorStop(0.25, "rgba(0,243,255,0.25));
    lineGrad.addColorStop(0.5, "rgba(143,0,255,0.6));
    lineGrad.addColorStop(0.75, "rgba(0,243,255,0.25));
    lineGrad.addColorStop(1, "transparent");
    combatCtx.beginPath();
    combatCtx.moveTo(0, groundY);
    combatCtx.lineTo(W, groundY);
    combatCtx.strokeStyle = lineGrad;
    combatCtx.lineWidth = 2;
    combatCtx.shadowBlur = 12;
    combatCtx.shadowColor = "rgba(143,0,255,0.8);
    combatCtx.stroke();
    combatCtx.shadowBlur = 0;
    
    // Perspective grid on ground
    combatCtx.globalAlpha = 0.06;
    combatCtx.strokeStyle = "rgba(0,243,255,1);
    combatCtx.lineWidth = 1;
    const vx = W * 0.5, vy = groundY;
    for (let i = 0; i <= 10; i++) {
      const bx = (W / 10) * i;
      combatCtx.beginPath();
      combatCtx.moveTo(vx, vy);
      combatCtx.lineTo(bx, H);
      combatCtx.stroke();
    }
    for (let i = 1; i <= 4; i++) {
      const y = groundY + (H - groundY) * (i / 4);
      combatCtx.beginPath();
      combatCtx.moveTo(0, y);
      combatCtx.lineTo(W, y);
      combatCtx.stroke();
    }
    combatCtx.globalAlpha = 1;
    
    // Twinkling stars
    for (let i = 0; i < 35; i++) {
      const sx = ((i * 131 + 57) % (W - 10)) + 5;
      const sy = ((i * 79 + 23) % (groundY * 0.9)) + 5;
      const twinkle = 0.3 + 0.7 * Math.abs(Math.sin(battleSceneTime * 0.025 + i * 1.2));
      combatCtx.globalAlpha = twinkle * 0.5;
      combatCtx.fillStyle = "white";
      combatCtx.shadowBlur = 3;
      combatCtx.shadowColor = "white";
      combatCtx.beginPath();
      combatCtx.arc(sx, sy, 0.8, 0, Math.PI * 2);
      combatCtx.fill();
    }
    combatCtx.globalAlpha = 1;
    combatCtx.shadowBlur = 0;
    
    // Ambient particles
    for (const p of battleAmbientParticles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.y < -5) { p.y = groundY; p.x = Math.random() * W; }
      if (p.x < -5) p.x = W + 5;
      if (p.x > W + 5) p.x = -5;
      const pa = p.baseAlpha * (0.5 + 0.5 * Math.sin(battleSceneTime * 0.03 + p.x * 0.01));
      combatCtx.globalAlpha = pa;
      combatCtx.fillStyle = `rgb(${p.color})`;
      combatCtx.shadowBlur = 5;
      combatCtx.shadowColor = `rgba(${p.color},0.8)`;
      combatCtx.beginPath();
      combatCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      combatCtx.fill();
    }
    combatCtx.globalAlpha = 1;
    combatCtx.shadowBlur = 0;
  }

  function loop() {
    if (!combatCtx || !combatCanvas) return;
    battleSceneTime++;
    
    drawScene();

    for (let i = spellsList.length - 1; i >= 0; i--) {
      const s = spellsList[i];
      s.progress += s.speed;

      const currentX = s.x1 + (s.x2 - s.x1) * s.progress;
      const currentY = s.y1 + (s.y2 - s.y1) * s.progress;

      if (s.isShield) {
        const radius = s.progress * 80;
        combatCtx.beginPath();
        combatCtx.arc(currentX, currentY, radius, 0, Math.PI * 2);
        combatCtx.strokeStyle = `rgba(0, 255, 102, ${(1 - s.progress) * 0.9})`;
        combatCtx.lineWidth = 5;
        combatCtx.shadowBlur = 20;
        combatCtx.shadowColor = "rgba(0, 255, 102, 0.8);
        combatCtx.stroke();
        combatCtx.beginPath();
        combatCtx.arc(currentX, currentY, radius * 0.7, 0, Math.PI * 2);
        combatCtx.strokeStyle = `rgba(0, 255, 102, ${(1 - s.progress) * 0.4})`;
        combatCtx.lineWidth = 8;
        combatCtx.stroke();
        combatCtx.shadowBlur = 0;
      } else if (!s.isBurst) {
        // Projectile particle trail
        for (let t = 1; t <= 8; t++) {
          const tp = Math.max(0, s.progress - t * 0.016);
          const tx = s.x1 + (s.x2 - s.x1) * tp;
          const ty = s.y1 + (s.y2 - s.y1) * tp;
          combatCtx.globalAlpha = (1 - t / 9) * 0.55;
          combatCtx.fillStyle = s.color;
          combatCtx.shadowBlur = 8;
          combatCtx.shadowColor = s.color;
          combatCtx.beginPath();
          combatCtx.arc(tx, ty, Math.max(0.5, s.size * (1 - t / 10)), 0, Math.PI * 2);
          combatCtx.fill();
        }
        combatCtx.globalAlpha = 1;
        
        // Main orb
        combatCtx.beginPath();
        combatCtx.arc(currentX, currentY, s.size, 0, Math.PI * 2);
        combatCtx.fillStyle = s.color;
        combatCtx.shadowBlur = 30;
        combatCtx.shadowColor = s.color;
        combatCtx.fill();
        // Bright white core
        combatCtx.beginPath();
        combatCtx.arc(currentX, currentY, s.size * 0.4, 0, Math.PI * 2);
        combatCtx.fillStyle = "rgba(255,255,255,0.95);
        combatCtx.shadowBlur = 10;
        combatCtx.shadowColor = "white";
        combatCtx.fill();
        combatCtx.shadowBlur = 0;
        
        // Impact burst particles
        if (s.progress >= 0.88 && !s._burst) {
          s._burst = true;
          for (let b = 0; b < 14; b++) {
            const angle = (b / 14) * Math.PI * 2;
            const spd = Math.random() * 2.5 + 1;
            spellsList.push({
              x1: currentX, y1: currentY,
              x2: currentX + Math.cos(angle) * 55,
              y2: currentY + Math.sin(angle) * 55,
              progress: 0, speed: 0.09,
              size: Math.random() * 3 + 1,
              color: s.color, isBurst: true, onHit: null
            });
          }
        }
      } else {
        // Burst fragment
        combatCtx.globalAlpha = 1 - s.progress;
        combatCtx.beginPath();
        combatCtx.arc(currentX, currentY, s.size, 0, Math.PI * 2);
        combatCtx.fillStyle = s.color;
        combatCtx.shadowBlur = 12;
        combatCtx.shadowColor = s.color;
        combatCtx.fill();
        combatCtx.shadowBlur = 0;
        combatCtx.globalAlpha = 1;
      }

      if (s.progress >= 1.0) {
        spellsList.splice(i, 1);
        if (s.onHit) s.onHit();
      }
    }
    combatCtx.globalAlpha = 1;
    combatCtx.shadowBlur = 0;

    combatAnimFrameId = requestAnimationFrame(loop);
  }
  loop();
}

function stopCombatCanvasLoop() {
  if (combatAnimFrameId) cancelAnimationFrame(combatAnimFrameId);
  combatCtx = null;
  combatCanvas = null;
}

// ยิงแสงกระสุนโจมตี
function shootCombatProjectile(isPlayerAttacking, color, onHitCallback) {
  if (!combatCanvas) {
    if (onHitCallback) onHitCallback();
    return;
  }

  // Player is bottom-left, enemy is top-right (proper Pokemon layout)
  const playerX = combatCanvas.width * 0.12;
  const playerY = combatCanvas.height * 0.80;
  
  const bossX = combatCanvas.width * 0.83;
  const bossY = combatCanvas.height * 0.22;

  const startX = isPlayerAttacking ? playerX : bossX;
  const startY = isPlayerAttacking ? playerY : bossY;
  
  const endX = isPlayerAttacking ? bossX : playerX;
  const endY = isPlayerAttacking ? bossY : playerY;

  const activeMove = App.getActiveMove();
  const projSize = isPlayerAttacking 
    ? (activeMove.difficulty === 'hard' ? 16 : activeMove.difficulty === 'medium' ? 12 : 9)
    : 10;

  spellsList.push({
    x1: startX, y1: startY,
    x2: endX, y2: endY,
    progress: 0,
    speed: 0.035,
    size: projSize,
    color: color,
    isBurst: false,
    onHit: onHitCallback
  });
}

// ปล่อยเกราะฟื้นฟูสีเขียวขยาย
function shootHealShieldRing(onHealCallback) {
  if (!combatCanvas) {
    if (onHealCallback) onHealCallback();
    return;
  }
  const playerX = combatCanvas.width * 0.12;
  const playerY = combatCanvas.height * 0.80;

  spellsList.push({
    x1: playerX, y1: playerY,
    x2: playerX, y2: playerY,
    progress: 0,
    speed: 0.04,
    size: 12,
    color: "rgba(0, 255, 102, 0.7),
    isShield: true,
    isBurst: false,
    onHit: onHealCallback
  });
}

// ตัวแจ้งตัวเลขความเสียหายแบบลอยตัวพิกัด
function triggerDamageEffect(isAttackingBoss, dmg) {
  const popup = document.getElementById(isAttackingBoss ? "enemy-damage-popup" : "player-damage-popup");
  if (!popup) return;
  
  popup.textContent = typeof dmg === 'number' ? `-${dmg}` : dmg;
  popup.className = `damage-number damage-pop-active`;
  
  if (isAttackingBoss) {
    popup.classList.add("damage-green");
  } else {
    const activeMove = App.getActiveMove();
    if (activeMove && activeMove.type === "teal") {
      popup.className = `damage-number damage-pop-active damage-green`; 
    } else {
      popup.classList.add("damage-red"); 
    }
  }
  
  setTimeout(() => {
    popup.classList.remove("damage-pop-active");
  }, 900);

  if (!isAttackingBoss) {
    const activeMove = App.getActiveMove();
    if (activeMove && activeMove.type !== "heal") {
      const arena = document.querySelector(".rpg-battle-window .battle-arena");
      if (arena) {
        arena.classList.add("shake-effect");
        setTimeout(() => {
          arena.classList.remove("shake-effect");
        }, 450);
      }
    }
  }
}

// ==========================================================================
// 5. จัดการจอยควบคุมของนักเรียน (Student Clicker Controller)
// ==========================================================================
function updateStudentControllerUI() {
  if (!myNickname) {
    document.getElementById("rem-join-panel").style.display = "block";
    document.getElementById("rem-wait-panel").style.display = "none";
    document.getElementById("rem-vote-panel").style.display = "none";
    document.getElementById("rem-quiz-panel").style.display = "none";
    document.getElementById("rem-explanation-panel").style.display = "none";
    document.getElementById("remote-player-hp-badge").style.display = "none";
    return;
  }
  
  const hpBadge = document.getElementById("remote-player-hp-badge");
  if (hpBadge) {
    const studentScore = App.getStudentScore();
    hpBadge.style.display = "block";
    hpBadge.textContent = `🔋 HP ห้องเรียน: ${studentScore.hp}`;
  }
  
  document.getElementById("rem-join-panel").style.display = "none";
  
  const phase = App.getGamePhase();
  
  if (phase === "map") {
    document.getElementById("rem-wait-panel").style.display = "block";
    document.getElementById("rem-wait-title").textContent = "🗺️ กำลังสแตนบายหน้าแผนที่หลัก";
    document.getElementById("rem-wait-student-name").textContent = `นักเรียน: ${myNickname}`;
    
    document.getElementById("rem-vote-panel").style.display = "none";
    document.getElementById("rem-quiz-panel").style.display = "none";
    document.getElementById("rem-explanation-panel").style.display = "none";
  } 
  else if (phase === "voting") {
    document.getElementById("rem-wait-panel").style.display = "none";
    document.getElementById("rem-vote-panel").style.display = "block";
    document.getElementById("rem-quiz-panel").style.display = "none";
    document.getElementById("rem-explanation-panel").style.display = "none";
    
    const container = document.getElementById("rem-vote-buttons-wrapper");
    if (container) container.innerHTML = "";
    
    const statusLabel = document.getElementById("rem-voted-status-lbl");
    if (statusLabel) {
      statusLabel.style.color = "var(--neon-cyan);
      statusLabel.style.fontSize = "1.05rem";
      statusLabel.style.lineHeight = "1.6";
      statusLabel.innerHTML = `
        <div style="font-size: 3.5rem; margin-bottom: 12px; animation: logo-pulse 2s infinite alternate;">🙋‍♂️🗳️</div>
        <strong style="font-size:1.15rem; color:#fff;">ร่วมกันยกมือโหวตเลือกท่าต่อสู้ในห้องเรียน!</strong><br>
        จากนั้นรอคุณครูคลิกเลือกปุ่มสวิตช์ท่าต่อสู้บนหน้าจอโปรเจกเตอร์หลักเพื่อดึงโจทย์คำถามวิทยาศาสตร์ข้อถัดไป
      `;
    }
  }
  else if (phase === "quiz") {
    document.getElementById("rem-wait-panel").style.display = "none";
    document.getElementById("rem-vote-panel").style.display = "none";
    document.getElementById("rem-quiz-panel").style.display = "block";
    document.getElementById("rem-explanation-panel").style.display = "none";
    
    renderStudentQuizButtons();
  }
  else if (phase === "explanation") {
    document.getElementById("rem-wait-panel").style.display = "none";
    document.getElementById("rem-vote-panel").style.display = "none";
    document.getElementById("rem-quiz-panel").style.display = "none";
    document.getElementById("rem-explanation-panel").style.display = "block";
    
    renderStudentExplanationPanel();
  }
  else if (phase === "victory" || phase === "gameover") {
    document.getElementById("rem-wait-panel").style.display = "block";
    document.getElementById("rem-wait-title").textContent = phase === "victory" ? "🏆 ชนะบอสสำเร็จ 5 ด่าน!" : "💀 พ่ายแพ้พลังชีวิตหมด";
    document.getElementById("rem-wait-student-name").textContent = `เก่งมากทุกคน! (${myNickname})`;
    
    document.getElementById("rem-vote-panel").style.display = "none";
    document.getElementById("rem-quiz-panel").style.display = "none";
    document.getElementById("rem-explanation-panel").style.display = "none";
  }
}

// วาดตัวเลือกข้อสอบวิทยาศาสตร์บนจอย
function renderStudentQuizButtons() {
  const qId = localStorage.getItem(gk("sci_quest_active_question_id"));
  const container = document.getElementById("rem-quiz-options-wrapper");
  if (!container) return;
  
  if (!qId) {
    container.innerHTML = "กำลังดึงข้อมูลข้อสอบร่วม...";
    return;
  }
  
  const questionsData = window.ScienceDB.getQuestions();
  let qObj = null;
  for (let grade in questionsData) {
    qObj = questionsData[grade].find(item => item.id === qId);
    if (qObj) break;
  }
  
  if (!qObj) {
    container.innerHTML = "ไม่พบโจทย์ข้อสอบวิทยาศาสตร์...";
    return;
  }
  
  const responses = App.getStudentResponses() || {};
  const myResponse = responses[myNickname];
  
  const activeMove = App.getActiveMove();
  const diffTag = document.getElementById("rem-quiz-difficulty-tag");
  if (diffTag) {
    diffTag.textContent = `โจทย์สำหรับท่า: ${activeMove.label}`;
    diffTag.style.color = activeMove.color;
  }
  
  container.innerHTML = "";
  const prefixes = ["ก.", "ข.", "ค.", "ง."];
  
  qObj.options.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.className = "btn-neon";
    btn.style.width = "100%";
    btn.style.textAlign = "left";
    btn.style.fontSize = "1.05rem";
    btn.style.border = "1px solid var(--border-light);
    
    if (myResponse !== undefined && myResponse !== null) {
      btn.disabled = true;
      if (myResponse === idx) {
        btn.style.background = "var(--neon-cyan);
        btn.style.color = "var(--text-dark);
        btn.style.boxShadow = "0 0 10px var(--neon-cyan-glow);
        btn.style.borderColor = "var(--neon-cyan);
      } else {
        btn.style.background = "rgba(0,0,0,0.5);
        btn.style.opacity = "0.45";
      }
    } else {
      btn.style.background = "rgba(0,0,0,0.45);
      btn.style.color = "white";
      
      btn.onclick = function() {
        SoundFX.playBeep(650, 0.1, "sine");
        App.submitStudentResponse(myNickname, idx);
      };
    }
    
    btn.innerHTML = `<strong style="color:${myResponse === idx ? 'inherit' : 'var(--neon-cyan)'}; margin-right:8px;">${prefixes[idx]}</strong> ${opt}`;
    container.appendChild(btn);
  });
  
  const statusLabel = document.getElementById("rem-answer-status-lbl");
  if (statusLabel) {
    if (myResponse !== undefined && myResponse !== null) {
      statusLabel.style.color = "var(--neon-emerald);
      statusLabel.textContent = `ส่งคำตอบข้อ ${prefixes[myResponse].replace('.','')} แล้ว! รอการเฉลยหน้าห้องเรียน`;
    } else {
      statusLabel.style.color = "var(--neon-cyan);
      statusLabel.textContent = "วิเคราะห์ให้ดี แล้วกดคลิกเลือกตัวเลือกกู้พลังงาน!";
    }
  }
}

// สรุปเฉลยวิทยาศาสตร์หลังตอบคำถามบนจอย
function renderStudentExplanationPanel() {
  const qId = localStorage.getItem(gk("sci_quest_active_question_id"));
  if (!qId) return;
  
  const questionsData = window.ScienceDB.getQuestions();
  let qObj = null;
  for (let grade in questionsData) {
    qObj = questionsData[grade].find(item => item.id === qId);
    if (qObj) break;
  }
  
  if (!qObj) return;
  
  const responses = App.getStudentResponses() || {};
  const myResponse = responses[myNickname];
  
  const isCorrect = myResponse === qObj.correct;
  
  const iconEl = document.getElementById("rem-exp-result-icon");
  const titleEl = document.getElementById("rem-exp-result-title");
  
  if (myResponse === undefined || myResponse === null) {
    iconEl.textContent = "⏱️";
    iconEl.style.color = "var(--neon-amber);
    titleEl.textContent = "คุณส่งคำตอบไม่ทันเวลา!";
    titleEl.style.color = "var(--neon-amber);
  } 
  else if (isCorrect) {
    iconEl.textContent = "✓";
    iconEl.style.color = "var(--neon-emerald);
    titleEl.textContent = "คำตอบของคุณถูกต้อง!";
    titleEl.style.color = "var(--neon-emerald);
  } 
  else {
    iconEl.textContent = "✗";
    iconEl.style.color = "var(--neon-red);
    titleEl.textContent = "คำตอบของคุณยังไม่ถูก!";
    titleEl.style.color = "var(--neon-red);
  }
  
  document.getElementById("rem-exp-fact-text").innerHTML = `
    <strong>ตัวเลือกที่ถูก:</strong> ${['ก (A)','ข (B)','ค (C)','ง (D)'][qObj.correct]}<br>
    <strong>คำใบ้วิทยาศาสตร์:</strong> ${qObj.hint}
  `;
}

// ==========================================================================
// 6. ซิงค์รายชื่อนักเรียนสด และบันทึกกิจกรรม Co-Op (Projector & Sidebars)
// ==========================================================================
function updateOnlineStudentsList() {
  const students = App.getStudentList() || [];
  
  const countEl = document.getElementById("classroom-online-count");
  if (countEl) countEl.textContent = `${students.length} คน`;
  
  const listEl = document.getElementById("classroom-online-list");
  if (listEl) {
    listEl.innerHTML = "";
    if (students.length === 0) {
      listEl.innerHTML = `<div style="color:var(--text-muted); font-style:italic; padding: 5px;">ยังไม่มีนักเรียนลงทะเบียนเชื่อมต่อ...</div>`;
    } else {
      // โชว์เฉพาะความก้าวหน้า/สถานะของคลาสร่วมกัน (ตามคำขอ show only class)
      listEl.innerHTML = `
        <div style="width:100%; text-align:center; padding:12px; color:var(--neon-emerald); font-weight:bold; border:1px dashed var(--neon-emerald-glow); border-radius:8px; background:rgba(0,255,102,0.05); font-size:0.9rem; animation: logo-pulse 2s infinite alternate;">
          🟢 คลาสพร้อมรบร่วมกัน (${students.length} คน)
        </div>
      `;
    }
  }
}

function addShipLog(message, type = "system") {
  const logList = document.getElementById("ship-log-list");
  if (!logList) return;
  
  const item = document.createElement("div");
  item.className = `log-item ${type}`;
  
  const time = new Date().toLocaleTimeString('th-TH', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  item.innerHTML = `<span style="color:var(--text-muted); font-size:0.75rem; margin-right:8px;">[${time}]</span> ${message}`;
  
  logList.appendChild(item);
  logList.scrollTop = logList.scrollHeight;
}

// ==========================================================================
// 7. อีเวนต์ควบคุมพฤติกรรม ซิงค์เรียลไทม์ (Real-Time Sync Bindings)
// ==========================================================================
window.addEventListener("phase-changed", function(e) {
  updatePhaseUI(e.detail);
});

window.addEventListener("students-updated", function(e) {
  updateOnlineStudentsList();
  updateAnsweredCountUI();
  updateStudentControllerUI();
});

window.addEventListener("votes-updated", function(e) {
  if (App.getGamePhase() === "voting") {
    renderVoteBars();
  }
  updateStudentControllerUI();
});

window.addEventListener("responses-updated", function(e) {
  if (App.getGamePhase() === "quiz") {
    updateAnsweredCountUI();
  }
  updateStudentControllerUI();
});

window.addEventListener("settings-changed", function(e) {
  const settings = e.detail;
  const gradeSel = document.getElementById("select-student-grade");
  if (gradeSel) gradeSel.value = settings.activeGrade;
  updateOnlineStudentsList();
  
  // โหลดข้อมูลและ UI ของเกรดใหม่ทันที
  const currentPhase = App.getGamePhase();
  updatePhaseUI(currentPhase);
});

window.addEventListener("score-changed", function(e) {
  updateBattleHPBars();
  updateStudentControllerUI();
});

window.addEventListener("game-reset", function() {
  sessionStorage.removeItem("sci_quest_nickname");
  myNickname = null;
  localStorage.setItem(gk("sci_quest_level_confirmed"), "false");
  
  const logList = document.getElementById("ship-log-list");
  if (logList) logList.innerHTML = `<div class="log-item system">ระบบ: รอครูเปิดด่านผจญภัยด่าน 1 เครื่องยนต์ปฏิกรณ์ไฟฟ้า</div>`;
  
  updatePhaseUI("map");
  updateOnlineStudentsList();
});

// เปลี่ยนระดับชั้นจากจอยหลักโปรเจกเตอร์ครู
window.saveGradeFromProjector = function(grade) {
  const settings = App.getSystemSettings();
  settings.activeGrade = grade;
  App.saveSystemSettings(settings);
  App.showToast(`📚 คุณครูเปลี่ยนชั้นเรียนเป็น: ${grade.toUpperCase()}`);
  addShipLog(`คุณครูปรับระดับคำถามคลังวิทย์ห้องเรียนเป็น: ${grade.toUpperCase()}`, "system");
  
  // โหลดหน้าแสดงแผนที่ตามระดับชั้นใหม่ทันที
  updatePhaseUI("map");
};

// ==========================================================================
// 8. เริ่มต้นเมื่อหน้าจอเว็บเสร็จสมบูรณ์ (Initialization)
// ==========================================================================
document.addEventListener("DOMContentLoaded", function() {
  initGameMultiplayer();
});

function initGameMultiplayer() {
  const currentPhase = App.getGamePhase() || "map";
  updatePhaseUI(currentPhase);
  updateOnlineStudentsList();
  
  // Redraw node path canvas on window resize (debounced)
  let resizeTimeout;
  window.addEventListener("resize", function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
      const mapDisplay = document.getElementById("rpg-node-map");
      if (mapDisplay && mapDisplay.style.display !== "none") {
        drawNodePath();
      }
    }, 300);
  });
  
  const btnJoin = document.getElementById("btn-join-room-submit");
  if (btnJoin) {
    btnJoin.onclick = handleStudentJoin;
  }
  
  const btnForceSubmit = document.getElementById("btn-proj-force-submit");
  if (btnForceSubmit) {
    btnForceSubmit.onclick = handleTeacherForceSubmit;
  }
  
  const btnNextTurn = document.getElementById("btn-proj-next-turn");
  if (btnNextTurn) {
    btnNextTurn.onclick = handleTeacherNextTurn;
  }
  
  const btnBackHome = document.getElementById("btn-proj-back-home");
  if (btnBackHome) {
    btnBackHome.onclick = function() {
      SoundFX.playClick();
      App.showView("home-view");
    };
  }

  const btnVictoryHome = document.getElementById("btn-victory-home");
  if (btnVictoryHome) {
    btnVictoryHome.onclick = function() {
      SoundFX.playClick();
      document.getElementById('victory-overlay-screen').classList.remove('active');
      App.showView("home-view");
    };
  }

  const settings = App.getSystemSettings();
  const select = document.getElementById("select-student-grade");
  if (select) select.value = settings.activeGrade;

  const activeSubject = localStorage.getItem(gk("sci_quest_active_subject")) || "all";
  const subjectSelect = document.getElementById("select-question-subject");
  if (subjectSelect) subjectSelect.value = activeSubject;
}

function handleStudentJoin() {
  const nicknameInput = document.getElementById("txt-student-nickname");
  const nickname = nicknameInput.value.trim();
  
  if (!nickname) {
    App.showToast("⚠️ กรุณากรอกชื่อเล่นภาษาไทยก่อนร่วมทาง", true);
    return;
  }
  
  const list = App.getStudentList() || [];
  if (list.includes(nickname)) {
    sessionStorage.setItem("sci_quest_nickname", nickname);
    myNickname = nickname;
    SoundFX.playBeep(880, 0.15);
    App.showToast(`⚡ เชื่อมต่อจอยสิทธิ์ชื่อเดิมสำเร็จ: ${nickname}`);
    updateStudentControllerUI();
  } else {
    const registered = App.registerStudent(nickname);
    if (registered) {
      sessionStorage.setItem("sci_quest_nickname", nickname);
      myNickname = nickname;
      SoundFX.playBeep(880, 0.15);
      App.showToast(`🎉 ลงทะเบียนจอยสำเร็จ! ยินดีต้อนรับ ${nickname}`);
      updateStudentControllerUI();
    } else {
      SoundFX.playAlarm();
      App.showToast("⚠️ ลงชื่อเชื่อมต่อล้มเหลว กรุณาลองใช้ชื่ออื่น", true);
    }
  }
}

function handleTeacherForceSubmit() {
  if (quizTimerInterval) clearInterval(quizTimerInterval);
  const timerVal = document.getElementById("proj-timer-val");
  if (timerVal) timerVal.textContent = `หมดเวลา!`;
  SoundFX.playAlarm();
  resolveClassroomDirectChoice(-1); // -1 = หมดเวลา ศัตรูสวนกลับ
}

// ==========================================================================
// 4c. ท่าโจมตีของบอส (สุ่มใช้แต่ละเทิร์น)
// ==========================================================================
const BOSS_MOVES = [
  { name: "คลื่นกระแทก", dmg: 15, acc: 0.95, color: "#ff8844", desc: "พลังโจมตี 15 | แม่นยำ 95%" },
  { name: "ลำแสงพิษ", dmg: 25, acc: 0.80, color: "#cc44ff", desc: "พลังโจมตี 25 | แม่นยำ 80%" },
  { name: "หมัดอัสนี", dmg: 35, acc: 0.60, color: "#ffcc00", desc: "พลังโจมตี 35 | แม่นยำ 60%" },
  { name: "ดูดพลัง", dmg: 0, healPct: 0.15, acc: 1.0, color: "#ff44aa", desc: "ดูดพลัง 15% HP บอส" }
];

// ฟังก์ชันให้บอสโจมตีผู้เล่น (turn-based) - สุ่มเลือกท่า
function executeBossAttack() {
  localStorage.removeItem(gk("sci_quest_boss_turn_pending"));
  
  const scoreObj = App.getStudentScore();
  
  // สุ่มเลือกท่าของบอส
  const bossMove = BOSS_MOVES[Math.floor(Math.random() * BOSS_MOVES.length)];
  
  // ตรวจสอบความแม่นยำ
  const isBossHit = Math.random() <= bossMove.acc;
  
  let actualDmg = 0;
  
  if (!isBossHit) {
    // บอสโจมตีพลาด
    addShipLog(`🍃 บอสใช้ "${bossMove.name}" แต่โจมตีพลาด!`, "system");
    App.showToast(`🍃 บอสใช้ ${bossMove.name}... พลาด!`);
  } else if (bossMove.healPct) {
    // บอสใช้ท่าดูดพลัง: รักษาตัว
    const bossHp = parseInt(localStorage.getItem(gk("sci_quest_boss_hp"))) || 0;
    const bossMaxHp = parseInt(localStorage.getItem(gk("sci_quest_boss_max_hp"))) || 100;
    const healAmt = Math.round(bossMaxHp * bossMove.healPct);
    const newBossHp = Math.min(bossMaxHp, bossHp + healAmt);
    localStorage.setItem(gk("sci_quest_boss_hp"), newBossHp);
    
    window.SoundFX.playChest();
    
    const enemySpriteEl = document.getElementById("battle-enemy-sprite");
    if (enemySpriteEl) {
      enemySpriteEl.classList.add("heal-bounce");
      setTimeout(() => enemySpriteEl.classList.remove("heal-bounce"), 600);
    }
    
    updateBattleHPBars();
    addShipLog(`💜 บอสใช้ "${bossMove.name}" ดูดพลังชีวิต +${healAmt} HP`, "alert");
    App.showToast(`💜 บอสใช้ ${bossMove.name} ฟื้น HP`);
    actualDmg = 0;
  } else {
    // บอสโจมตีโดน
    actualDmg = bossMove.dmg;
    scoreObj.hp = Math.max(0, scoreObj.hp - actualDmg);
    App.saveStudentScore(scoreObj);
    
    window.SoundFX.playPlayerDamage();
    
    // แอนิเมชันโจมตีของฝั่งศัตรู
    const enemySpriteEl = document.getElementById("battle-enemy-sprite");
    if (enemySpriteEl) {
      enemySpriteEl.classList.add("enemy-attack-dash");
      setTimeout(() => enemySpriteEl.classList.remove("enemy-attack-dash"), 500);
    }
    
    shootCombatProjectile(false, bossMove.color, () => {
      triggerDamageEffect(false, actualDmg);
      
      // แอนิเมชันได้รับความเสียหายของฝั่งผู้เล่น
      const playerSpriteEl = document.getElementById("battle-player-sprite");
      if (playerSpriteEl) {
        playerSpriteEl.classList.add("damaged-shake");
        playerSpriteEl.classList.replace("hero-idle", "hero-hurt");
        setTimeout(() => {
          playerSpriteEl.classList.remove("damaged-shake");
          playerSpriteEl.classList.replace("hero-hurt", "hero-idle");
        }, 500);
      }
      
      updateBattleHPBars();
    });
    
    addShipLog(`💥 บอสใช้ "${bossMove.name}" โจมตีใส่ปาร์ตี้ -${actualDmg} HP! (${Math.round(bossMove.acc * 100)}%)`, "alert");
    App.showToast(`💥 บอสใช้ ${bossMove.name} -${actualDmg} HP`);
  }
  
  // เช็คว่าผู้เล่นตายไหม
  if (scoreObj.hp <= 0) {
    setTimeout(() => {
      window.SoundFX.playGameOver();
      App.setGamePhase("gameover");
    }, 600);
  } else {
    // กลับสู่เฟสโหวต (Player Turn)
    setTimeout(() => {
      App.clearVotesAndResponses();
      App.setGamePhase("voting");
    }, 600);
  }
}

function handleTeacherNextTurn() {
  SoundFX.playClick();
  
  // เช็คว่ามีบอสเทิร์นที่รอการดำเนินการอยู่หรือไม่
  if (localStorage.getItem(gk("sci_quest_boss_turn_pending")) === "true") {
    executeBossAttack();
    return;
  }
  
  const bossHp = parseInt(localStorage.getItem(gk("sci_quest_boss_hp"))) || 0;
  const scoreObj = App.getStudentScore();
  
  if (bossHp <= 0) {
    const activeNodeKey = App.getActiveNode();
    const nodeEnemies = NODE_ENEMIES[activeNodeKey] || [];
    let enemyIndex = parseInt(localStorage.getItem(gk("sci_quest_battle_enemy_index"))) || 0;
    
    if (enemyIndex < nodeEnemies.length - 1) {
      // มีศัตรูระลอกถัดไป!
      enemyIndex++;
      const nextEnemy = nodeEnemies[enemyIndex];
      
      localStorage.setItem(gk("sci_quest_battle_enemy_index"), enemyIndex);
      localStorage.setItem(gk("sci_quest_boss_hp"), nextEnemy.maxHp);
      localStorage.setItem(gk("sci_quest_boss_max_hp"), nextEnemy.maxHp);
      
      // อัปเดตข้อมูลบอสลงในระดับชั้นเรียน/โมดูลเพื่อให้เซฟเกมถูกต้อง
      const modules = App.getModuleStates();
      if (modules[activeNodeKey]) {
        modules[activeNodeKey].enemyIndex = enemyIndex;
        modules[activeNodeKey].bossHp = nextEnemy.maxHp;
        App.saveModuleStates(modules);
      }
      
      window.SoundFX.playLevelUp();
      App.showToast(`🔥 ศัตรูตัวถัดไปปรากฏตัว! ${nextEnemy.name} (คลื่นที่ ${enemyIndex + 1}/${nodeEnemies.length})`);
      addShipLog(`ศัตรูถูกกำจัด! ตัวถัดไปโผล่ออกมา: ${nextEnemy.name} (คลื่นที่ ${enemyIndex + 1}/${nodeEnemies.length})`, "warning");
      
      // อัปเดตหน้าจอเพื่อดึงข้อมูลและรูปภาพตัวถัดไป
      setupBattleArenaUI();
      App.clearVotesAndResponses();
      App.setGamePhase("voting");
      return;
    }
    
    // ไม่มีระลอกถัดไปแล้ว (ด่านนี้ผ่านสมบูรณ์)
    const modules = App.getModuleStates();
    modules[activeNodeKey].repaired = true;
    modules[activeNodeKey].bossHp = 0; // เคลียร์เพื่อเริ่มใหม่ในรอบหน้า
    modules[activeNodeKey].enemyIndex = 0;
    
    const currentIdx = NODE_KEYS.indexOf(activeNodeKey);
    if (currentIdx !== -1 && currentIdx < NODE_KEYS.length - 1) {
      const nextKey = NODE_KEYS[currentIdx + 1];
      if (modules[nextKey].status === "locked") {
        modules[nextKey].status = "unlocked";
      }
    }
    
    App.saveModuleStates(modules);
    
    let allCleared = true;
    NODE_KEYS.forEach(k => {
      if (!modules[k].repaired) allCleared = false;
    });
    
    if (allCleared) {
      window.SoundFX.playLevelUp();
      App.setGamePhase("victory");
    } else {
      window.SoundFX.playExplosion();
      App.showToast(`🏆 ปราบศัตรูครบทุกระลอกในเขตนี้สำเร็จแล้ว! ปลดล็อกความก้าวหน้าด่านถัดไป`);
      addShipLog(`เขตพิกัด ${activeNodeKey.toUpperCase()} กู้คืนระบบเสร็จสมบูรณ์ 100%!`, "success");
      App.setGamePhase("map");
    }
  } 
  else if (scoreObj.hp <= 0) {
    window.SoundFX.playGameOver();
    App.setGamePhase("gameover");
  } 
  else {
    App.clearVotesAndResponses();
    App.setGamePhase("voting");
  }
}

window.saveSubjectFromProjector = function(subject) {
  SoundFX.playClick();
  localStorage.setItem(gk("sci_quest_active_subject"), subject);
  const text = document.getElementById("select-question-subject").selectedOptions[0].text;
  App.showToast(`📚 เปลี่ยนวิชาเน้นสอนเป็น: ${text}`);
  addShipLog(`คุณครูปรับหัวข้อคำถามที่จะเน้นสอนคาบนี้เป็น: ${text}`, "system");
};

window.saveAndExitBattle = function() {
  SoundFX.playBeep(600, 0.15);
  
  if (quizTimerInterval) clearInterval(quizTimerInterval);
  
  // บันทึกสถานะบอสลงในระดับชั้นเรียน
  const activeNodeKey = App.getActiveNode();
  if (activeNodeKey) {
    const modules = App.getModuleStates();
    const bossHp = parseInt(localStorage.getItem(gk("sci_quest_boss_hp"))) || 0;
    const enemyIndex = parseInt(localStorage.getItem(gk("sci_quest_battle_enemy_index"))) || 0;
    const movesPp = localStorage.getItem(gk("sci_quest_moves_pp")) || "";
    const comboCount = parseInt(localStorage.getItem(gk("sci_quest_combo_count"))) || 0;
    
    if (modules[activeNodeKey]) {
      modules[activeNodeKey].bossHp = bossHp;
      modules[activeNodeKey].enemyIndex = enemyIndex;
      modules[activeNodeKey].movesPp = movesPp;
      modules[activeNodeKey].comboCount = comboCount;
      App.saveModuleStates(modules);
    }
    
    addShipLog(`คุณครูกดพักรบ ด่าน "${modules[activeNodeKey].label}" ถูกบันทึกความคืบหน้า (HP: ${bossHp}, คลื่นที่: ${enemyIndex + 1}, คอมโบ: ${comboCount})`, "system");
  }
  
  App.clearVotesAndResponses();
  App.setGamePhase("map");
  App.showToast("💾 บันทึกความคืบหน้าการต่อสู้เรียบร้อย!");
};
