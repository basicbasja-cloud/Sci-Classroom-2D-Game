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
let selectedSlotForInit = 1;

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
    nodeEl.style.transform = "translate(-50%, -50%)";
    
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
  
  ctx.strokeStyle = "rgba(0, 243, 255, 0.4)";
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
    
    // เพิ่ม/อัปเดตตัวบ่งชี้เซฟ (แสดงถ้ามีเซฟในช่องใดช่องหนึ่ง)
    if (window.App.hasSaveData(grade)) {
      if (!saveIndicator) {
        const indicator = document.createElement("div");
        indicator.className = "save-indicator";
        indicator.style.cssText = "position:absolute;top:-6px;right:-6px;background:var(--neon-emerald);color:#000;font-size:0.65rem;font-weight:bold;padding:2px 7px;border-radius:10px;box-shadow:0 0 8px var(--neon-emerald-glow);";
        indicator.textContent = "\u{1F4BE}";
        card.style.position = "relative";
        card.appendChild(indicator);
      }
    } else if (saveIndicator) {
      saveIndicator.remove();
    }
    
    card.onclick = function() {
      SoundFX.playClick();
      selectedGradeForInit = grade;
      selectedSlotForInit = 1;
      setupLevelSelectUI(); 
    };
  });
  
  // แสดงปุ่มเลือกช่องเซฟ (3 slots) สำหรับเกรดที่เลือก
  const slotContainer = document.getElementById("save-slot-container");
  if (slotContainer) {
    slotContainer.innerHTML = "";
    const gradeHasSave = window.App.hasSaveData(selectedGradeForInit);
    for (let s = 1; s <= 3; s++) {
      const hasSlotSave = window.App.hasSaveDataInSlot(selectedGradeForInit, s);
      const slotBtn = document.createElement("button");
      slotBtn.className = "save-slot-btn";
      if (s === selectedSlotForInit) {
        slotBtn.classList.add("active");
      }
      let label = hasSlotSave ? `💾 ช่อง ${s}` : `📂 ช่อง ${s}`;
      if (hasSlotSave) {
        // แสดงจำนวนด่านที่ผ่าน
        const modulesKey = `sci_quest_modules_${selectedGradeForInit}_slot${s}`;
        try {
          const mods = JSON.parse(localStorage.getItem(modulesKey));
          if (mods) {
            let repaired = 0;
            for (let k in mods) { if (mods[k].repaired) repaired++; }
            label += ` (${repaired}/10)`;
          }
        } catch(e) {}
      }
      slotBtn.textContent = label;
      slotBtn.onclick = function() {
        SoundFX.playClick();
        selectedSlotForInit = s;
        setupLevelSelectUI();
      };
      slotContainer.appendChild(slotBtn);
    }
  }
  
  const confirmBtn = document.getElementById("btn-confirm-level");
  if (confirmBtn) {
    const hasSlotSave = window.App.hasSaveDataInSlot(selectedGradeForInit, selectedSlotForInit);
    if (hasSlotSave) {
      confirmBtn.textContent = `▶️ โหลดช่อง ${selectedSlotForInit} (มีเซฟ)`;
      confirmBtn.style.borderColor = "var(--neon-emerald)";
      confirmBtn.style.color = "var(--neon-emerald)";
    } else {
      confirmBtn.textContent = `▶️ เริ่มเกม (ช่อง ${selectedSlotForInit}: ใหม่)`;
      confirmBtn.style.borderColor = "var(--neon-cyan)";
      confirmBtn.style.color = "var(--neon-cyan)";
    }
    
    confirmBtn.onclick = function() {
      SoundFX.playBeep(880, 0.25);
      
      const settings = App.getSystemSettings();
      settings.activeGrade = selectedGradeForInit;
      settings.activeSlot = selectedSlotForInit;
      App.saveSystemSettings(settings);
      
      App.setGamePhase("map");
      localStorage.setItem(gk("sci_quest_level_confirmed"), "true");
      
      window.dispatchEvent(new CustomEvent("settings-changed", { detail: settings }));
      updatePhaseUI("map");
      
      addShipLog(`ยินดีต้อนรับระดับวิชาใหม่! เริ่มทริปผจณภัยสำหรับชั้นเรียน: ${selectedGradeForInit.toUpperCase()} ช่อง ${selectedSlotForInit}`, "system");
    };
  }
}

const TRANSPARENT_SPRITE_CACHE = {};

// ลบสีดำออกจากภาพเพื่อสร้างโปร่งใสแบบ real transparent PNG
function getTransparentSprite(imgUrl, callback) {
  if (TRANSPARENT_SPRITE_CACHE[imgUrl]) {
    callback(TRANSPARENT_SPRITE_CACHE[imgUrl]);
    return;
  }
  
  const img = new Image();
  // No crossOrigin needed - all sprites are same-origin local assets
  img.onload = function() {
    // Limit processing size to avoid quota/memory issues on large sprites
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
          data[i+3] = 0; // ตั้งค่า Alpha = 0 (โปร่งใส)
        }
      }
      
      ctx.putImageData(imgData, 0, 0);
      const dataUrl = canvas.toDataURL();
      TRANSPARENT_SPRITE_CACHE[imgUrl] = dataUrl;
      callback(dataUrl);
    } catch (e) {
      console.warn("getTransparentSprite: canvas processing failed (" + e.message + "), falling back to original image");
      // Fall back to original URL - no transparency but still works
      callback(imgUrl);
    }
  };
  img.onerror = function() {
    callback(imgUrl);
  };
  img.src = imgUrl;
}

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
  
  // อัปเดต Sprite ตัวละครหลัก (Sprite Sheet พร้อม Frame Animation)
  const playerSpriteEl = document.getElementById("battle-player-sprite");
  if (playerSpriteEl) {
    playerSpriteEl.classList.add("hero-idle", "sprite-float");
    getTransparentSprite("assets/player_hero.png", function(url) {
      const img = new Image();
      img.onload = function() {
        const w = img.width;
        const h = img.height;
        playerSpriteEl.innerHTML = "";
        playerSpriteEl.style.backgroundImage = `url('${url}')`;
        playerSpriteEl.style.backgroundSize = `${w}px ${h}px`;
        playerSpriteEl.style.backgroundRepeat = "no-repeat";
        playerSpriteEl.style.backgroundPosition = "0 0";
        // Store sprite dimensions for animation
        playerSpriteEl.dataset.spriteW = w;
        playerSpriteEl.dataset.spriteH = h;
      };
      img.src = url;
    });
  }
  
  // อัปเดต Sprite ศัตรู (ใช้ img เฉยๆ เพราะเป็นรูปเดี่ยว)
  const enemySpriteEl = document.getElementById("battle-enemy-sprite");
  if (enemySpriteEl) {
    enemySpriteEl.classList.add("sprite-float");
    if (activeEnemy.sprite) {
      getTransparentSprite(activeEnemy.sprite, function(url) {
        enemySpriteEl.innerHTML = `<img src="${url}" alt="Enemy" style="width: 100%; height: 100%; object-fit: contain;">`;
        enemySpriteEl.style.backgroundImage = "none";
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
  
  // Update or create combo badge (Enhanced — fire animation)
  const comboCount = parseInt(localStorage.getItem(gk("sci_quest_combo_count"))) || 0;
  let comboBadge = document.getElementById("battle-combo-badge");
  if (!comboBadge) {
    // Create badge dynamically if not in HTML
    comboBadge = document.createElement("div");
    comboBadge.id = "battle-combo-badge";
    comboBadge.style.cssText = "position: absolute; top: 10px; left: 50%; transform: translateX(-50%); z-index: 110; display: none; background: rgba(255,174,0,0.15); border: 1px solid var(--neon-amber); border-radius: 20px; padding: 3px 16px; font-weight: 800; font-size: 0.9rem; color: var(--neon-amber); box-shadow: 0 0 15px rgba(255,174,0,0.4); white-space: nowrap;";
    comboBadge.innerHTML = `🔥 COMBO x<span id="battle-combo-count">0</span>`;
    const battleWindow = document.querySelector(".rpg-battle-window");
    if (battleWindow) battleWindow.appendChild(comboBadge);
  }
  const comboCountEl = document.getElementById("battle-combo-count");
  if (comboBadge && comboCountEl) {
    if (comboCount >= 2) {
      comboBadge.style.display = "block";
      comboCountEl.textContent = comboCount;
      // Fire animation intensity scales with combo
      const fireIntensity = Math.min(1, (comboCount - 1) * 0.2);
      comboBadge.style.animation = `combo-fire ${1.5 - fireIntensity * 0.5}s infinite alternate`;
      comboBadge.style.boxShadow = `0 0 ${10 + fireIntensity * 20}px rgba(255,174,0,${0.3 + fireIntensity * 0.5}), 0 0 ${5 + fireIntensity * 15}px rgba(255,50,0,${fireIntensity * 0.4})`;
    } else {
      comboBadge.style.display = "none";
      comboBadge.style.animation = '';
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
    btnEl.style.background = isExhausted ? "rgba(30, 30, 40, 0.4)" : "rgba(0,0,0,0.5)";
    btnEl.style.cursor = isExhausted ? "not-allowed" : "pointer";
    btnEl.style.color = isExhausted ? "#64748b" : "white";
    btnEl.style.borderRadius = "12px";
    btnEl.style.transition = "all 0.25s ease-out";
    btnEl.style.opacity = isExhausted ? "0.5" : "1.0";
    btnEl.disabled = isExhausted;
    
    if (!isExhausted) {
      btnEl.onmouseover = () => {
        btnEl.style.background = move.color;
        btnEl.style.color = "var(--text-dark)";
        btnEl.style.boxShadow = `0 0 25px ${move.color}, inset 0 0 10px rgba(255,255,255,0.2)`;
        btnEl.style.transform = "translateY(-2px)";
      };
      btnEl.onmouseout = () => {
        btnEl.style.background = "rgba(0,0,0,0.5)";
        btnEl.style.color = "white";
        btnEl.style.boxShadow = "none";
        btnEl.style.transform = "translateY(0)";
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
    // 0. ข้ามคำถามที่ถูกใช้ไปแล้วในรอบการสู้ครั้งนี้
    if (usedQuestionIds.has(q.id)) return false;
    
    // 1. ตรวจสอบความยากของท่า
    if (q.difficulty !== chosenMove.difficulty) return false;
    
    // 2. ตรวจสอบความสอดคล้องกับสาระวิชาที่ครูเลือก
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
    optEl.style.border = "1px solid var(--border-light)";
    optEl.style.background = "rgba(0,0,0,0.4)";
    optEl.style.cursor = "pointer";
    optEl.style.color = "white";
    optEl.style.borderRadius = "12px";
    optEl.style.transition = "all 0.2s ease";
    
    optEl.onmouseover = () => {
      optEl.style.borderColor = "var(--neon-cyan)";
      optEl.style.boxShadow = "0 0 15px rgba(0, 243, 255, 0.35)";
      optEl.style.transform = "translateY(-1px)";
    };
    optEl.onmouseout = () => {
      optEl.style.borderColor = "var(--border-light)";
      optEl.style.boxShadow = "none";
      optEl.style.transform = "translateY(0)";
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
    timerValEl.style.color = "var(--neon-red)";
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
    
    // Play combo sound for combo >= 2
    if (comboCount >= 2) {
      window.SoundFX.playComboUp(comboCount);
    }
    
    if (activeMove.type === "attack") {
      const baseDmg = activeMove.dmg;
      const comboMultiplier = 1.0 + Math.min(0.5, (comboCount - 1) * 0.1); // สูงสุด +50% ที่ combo x6
      
      // Map player skill key to actionType for unique projectile
      const skillActionMap = {
        laser: 'laser',
        emp: 'emp',
        quantum: 'quantum'
      };
      const playerActionType = skillActionMap[activeMove.key] || 'laser';
      
      // เล่นเสียงเฉพาะของแต่ละท่า
      const skillSoundMap = {
        laser: 'playLaserBeam',
        emp: 'playEMPBlast',
        quantum: 'playQuantumStorm'
      };
      const soundFn = skillSoundMap[activeMove.key];
      if (window.SoundFX[soundFn]) window.SoundFX[soundFn]();
      
      // คำนวณอัตราความแม่นยำ (Accuracy Check)
      const accuracy = activeMove.accuracy !== undefined ? activeMove.accuracy : 1.0;
      const isHit = Math.random() <= accuracy;
      
      if (!isHit) {
        // โจมตีพลาด (Missed)
        window.SoundFX.playMiss();
        
        // แอนิเมชันโจมตีของฝั่งผู้เล่น
        const playerSpriteEl = document.getElementById("battle-player-sprite");
        if (playerSpriteEl) {
          playerSpriteEl.classList.add("player-attack-dash");
          setTimeout(() => playerSpriteEl.classList.remove("player-attack-dash"), 500);
        }
        
        shootCombatProjectile(true, 'miss', () => {
          triggerDamageEffect(true, 'MISS!', 'miss');
          updateBattleHPBars();
        });
        
        addShipLog(`มติตอบถูก! คอมโบ x${comboCount} ➔ ร่ายท่า "${activeMove.label}" แต่การโจมตี [พลาดเป้า]! (Missed)`, "alert");
        App.showToast("💨 การโจมตีพลาดเป้า (Missed!)");
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
        
        if (isCrit) {
          window.SoundFX.playCritHit();
        }
        
        // Unique attack animation per skill type
        const playerSpriteEl = document.getElementById("battle-player-sprite");
        if (playerSpriteEl) {
          playerSpriteEl.classList.remove("player-attack-dash", "hero-attack-laser", "hero-attack-emp", "hero-attack-quantum");
          const attackClassMap = { laser: 'hero-attack-laser', emp: 'hero-attack-emp', quantum: 'hero-attack-quantum' };
          playerSpriteEl.classList.add(attackClassMap[activeMove.key] || 'player-attack-dash');
          setTimeout(() => {
            playerSpriteEl.classList.remove(attackClassMap[activeMove.key] || 'player-attack-dash');
          }, 550);
        }
        
        // Fire unique projectile per skill type
        shootCombatProjectile(true, playerActionType, () => {
          triggerDamageEffect(true, finalDmg, isCrit ? 'crit' : 'normal');
          
          // แอนิเมชันได้รับความเสียหายของฝั่งศัตรู — unique per skill
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
      
      window.SoundFX.playNanobotHeal();
      
      // แอนิเมชันรักษาตัวของฝั่งผู้เล่น
      const playerSpriteEl = document.getElementById("battle-player-sprite");
      if (playerSpriteEl) {
        playerSpriteEl.classList.add("heal-bounce");
        setTimeout(() => playerSpriteEl.classList.remove("heal-bounce"), 600);
      }
      
      shootHealShieldRing(() => {
        triggerDamageEffect(false, healVal, 'heal');
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
      
      // Map skill to action type
      const skillActionMap = { laser: 'laser', emp: 'emp', quantum: 'quantum' };
      const playerActionType = skillActionMap[activeMove.key] || 'laser';
      
      // Unique attack animation per skill type (wrong answer desperate hit)
      const playerSpriteEl = document.getElementById("battle-player-sprite");
      if (playerSpriteEl) {
        playerSpriteEl.classList.remove("player-attack-dash", "hero-attack-laser", "hero-attack-emp", "hero-attack-quantum");
        const attackClassMap = { laser: 'hero-attack-laser', emp: 'hero-attack-emp', quantum: 'hero-attack-quantum' };
        playerSpriteEl.classList.add(attackClassMap[activeMove.key] || 'player-attack-dash');
        playerSpriteEl.classList.replace("hero-idle", "hero-attack");
        setTimeout(() => {
          playerSpriteEl.classList.remove(attackClassMap[activeMove.key] || 'player-attack-dash');
          playerSpriteEl.classList.replace("hero-attack", "hero-idle");
        }, 550);
      }
      
      if (isDesperateHit) {
        // โจมตีติด! 30% ดาเมจ
        const finalDmg = Math.max(3, Math.round(activeMove.dmg * desperateDmgMultiplier));
        let bossHp = parseInt(localStorage.getItem(gk("sci_quest_boss_hp"))) || 0;
        bossHp = Math.max(0, bossHp - finalDmg);
        localStorage.setItem(gk("sci_quest_boss_hp"), bossHp);
        
        window.SoundFX.playSlash(); // Use slash for desperate hit
        
        shootCombatProjectile(true, playerActionType, () => {
          triggerDamageEffect(true, finalDmg, 'normal');
          updateBattleHPBars();
        });
        
        addShipLog(`ตอบผิด! ปาฏิหาริย์ฮีโร่โจมตีติด -${finalDmg} DMG (7%)`, "warning");
        App.showToast(`✨ ปาฏิหาริย์! ติด -${finalDmg} DMG`);
      } else {
        // พลาด
        window.SoundFX.playMiss();
        
        shootCombatProjectile(true, 'miss', () => {
          triggerDamageEffect(true, 'MISS!', 'miss');
          updateBattleHPBars();
        });
        
        addShipLog(`ตอบผิด! ฮีโร่โจมตีพลาด (เหลือโอกาส 7%)`, "alert");
        App.showToast("❌ ฮีโร่โจมตีพลาด! บอสกำลังจะโจมตี", true);
      }
    } else if (isTimeout) {
      // หมดเวลา -> ไม่มีการโจมตีใดๆ
      window.SoundFX.playAlarm();
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
  }
  
  const optionsGrid = document.getElementById("proj-options-grid");
  optionsGrid.innerHTML = "";
  
  const prefixes = ["ก (A).", "ข (B).", "ค (C).", "ง (D)."];
  qObj.options.forEach((opt, idx) => {
    const optEl = document.createElement("div");
    optEl.className = "glass-panel";
    optEl.style.padding = "10px 14px";
    optEl.style.fontSize = "1.1rem";
    optEl.style.border = "1px solid var(--border-light)";
    optEl.style.background = "rgba(0,0,0,0.2)";
    
    if (idx === qObj.correct) {
      optEl.style.borderColor = "var(--neon-emerald)";
      optEl.style.boxShadow = "0 0 15px rgba(0, 255, 102, 0.25)";
      optEl.style.background = "rgba(0, 255, 102, 0.05)";
    } else if (idx === chosenIdx) {
      optEl.style.borderColor = "var(--neon-red)";
      optEl.style.boxShadow = "0 0 15px rgba(255, 46, 93, 0.25)";
      optEl.style.background = "rgba(255, 46, 93, 0.05)";
    } else {
      optEl.style.borderColor = "var(--border-light)";
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
  
  // Determine zone for particle theming
  const activeNodeKey = App.getActiveNode() || 'node1';
  const zoneThemeMap = {
    node1: 'reactor', node2: 'reactor',
    node3: 'water', node4: 'water',
    node5: 'botanic', node6: 'botanic',
    node7: 'genetics', node8: 'genetics',
    node9: 'bridge', node10: 'bridge'
  };
  const currentZone = zoneThemeMap[activeNodeKey] || 'reactor';
  const zoneParticleColors = {
    reactor: ['255,100,50', '255,60,30', '200,50,20'],
    water: ['0,200,255', '50,180,255', '100,220,255'],
    botanic: ['50,255,100', '100,255,150', '0,200,80'],
    genetics: ['200,100,255', '180,60,255', '220,150,255'],
    bridge: ['255,200,100', '200,150,255', '255,220,150']
  };
  const colors = zoneParticleColors[currentZone] || zoneParticleColors.reactor;
  
  // Spawn ambient atmospheric particles (zone-colored)
  battleAmbientParticles = [];
  for (let i = 0; i < 25; i++) {
    battleAmbientParticles.push({
      x: Math.random() * combatCanvas.width,
      y: Math.random() * combatCanvas.height * 0.65,
      vx: (Math.random() - 0.5) * 0.35,
      vy: -Math.random() * 0.4 - 0.15,
      size: Math.random() * 1.8 + 0.4,
      baseAlpha: Math.random() * 0.35 + 0.08,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }

  if (combatAnimFrameId) cancelAnimationFrame(combatAnimFrameId);

  function drawScene() {
    const W = combatCanvas.width;
    const H = combatCanvas.height;
    const groundY = H * 0.65;
    
    // Determine zone theme for color palette
    const activeNodeKey = App.getActiveNode() || 'node1';
    const zoneThemeMap = {
      node1: 'reactor', node2: 'reactor',
      node3: 'water', node4: 'water',
      node5: 'botanic', node6: 'botanic',
      node7: 'genetics', node8: 'genetics',
      node9: 'bridge', node10: 'bridge'
    };
    const currentZone = zoneThemeMap[activeNodeKey] || 'reactor';
    
    // Zone-specific color palettes
    const zoneColors = {
      reactor: { sky: ['#1a0808', '#0c0c1e', '#131328'], ground: ['#2e1a1a', '#1c0e0e', '#0f0707'], horizon: ['#ff4444', '#ff8844', '#ff4444'] },
      water:   { sky: ['#061a24', '#0c1820', '#131e28'], ground: ['#1a2e30', '#0e1c1e', '#070f10'], horizon: ['#00d4ff', '#44ccff', '#00d4ff'] },
      botanic: { sky: ['#0a1a0a', '#0c1a14', '#122014'], ground: ['#1a2e1a', '#0e1c12', '#070f08'], horizon: ['#44ff88', '#66ffaa', '#44ff88'] },
      genetics:{ sky: ['#1a0a24', '#140c1e', '#181328'], ground: ['#2e1a30', '#1a0e1c', '#0f0710'], horizon: ['#aa44ff', '#cc66ff', '#aa44ff'] },
      bridge:  { sky: ['#0a0a1a', '#0c0c20', '#101028'], ground: ['#1a1a30', '#0e0e1e', '#080810'], horizon: ['#ffaa00', '#cc66ff', '#ffaa00'] }
    };
    const zc = zoneColors[currentZone] || zoneColors.reactor;
    
    // Sky gradient
    const skyGrad = combatCtx.createLinearGradient(0, 0, 0, groundY);
    skyGrad.addColorStop(0, zc.sky[0]);
    skyGrad.addColorStop(0.5, zc.sky[1]);
    skyGrad.addColorStop(1, zc.sky[2]);
    combatCtx.fillStyle = skyGrad;
    combatCtx.fillRect(0, 0, W, groundY);
    
    // Ground gradient
    const groundGrad = combatCtx.createLinearGradient(0, groundY, 0, H);
    groundGrad.addColorStop(0, zc.ground[0]);
    groundGrad.addColorStop(0.5, zc.ground[1]);
    groundGrad.addColorStop(1, zc.ground[2]);
    combatCtx.fillStyle = groundGrad;
    combatCtx.fillRect(0, groundY, W, H - groundY);
    
    // Horizon glow line (zone-colored)
    const lineGrad = combatCtx.createLinearGradient(0, 0, W, 0);
    lineGrad.addColorStop(0, "transparent");
    lineGrad.addColorStop(0.25, `rgba(${parseInt(zc.horizon[0].slice(1,3),16)},${parseInt(zc.horizon[0].slice(3,5),16)},${parseInt(zc.horizon[0].slice(5,7),16)},0.25)`);
    lineGrad.addColorStop(0.5, `rgba(${parseInt(zc.horizon[1].slice(1,3),16)},${parseInt(zc.horizon[1].slice(3,5),16)},${parseInt(zc.horizon[1].slice(5,7),16)},0.5)`);
    lineGrad.addColorStop(0.75, `rgba(${parseInt(zc.horizon[0].slice(1,3),16)},${parseInt(zc.horizon[0].slice(3,5),16)},${parseInt(zc.horizon[0].slice(5,7),16)},0.25)`);
    lineGrad.addColorStop(1, "transparent");
    combatCtx.beginPath();
    combatCtx.moveTo(0, groundY);
    combatCtx.lineTo(W, groundY);
    combatCtx.strokeStyle = lineGrad;
    combatCtx.lineWidth = 2;
    combatCtx.shadowBlur = 12;
    combatCtx.shadowColor = zc.horizon[1];
    combatCtx.stroke();
    combatCtx.shadowBlur = 0;
    
    // Perspective grid on ground
    combatCtx.globalAlpha = 0.06;
    combatCtx.strokeStyle = "rgba(0,243,255,1)";
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
    
    // Zone-specific star and particle colors
    const starColorMap = {
      reactor: ['255,200,150', '255,150,100', '255,100,50'],
      water:   ['150,220,255', '100,200,255', '200,240,255'],
      botanic: ['150,255,200', '100,255,150', '200,255,200'],
      genetics:['220,150,255', '180,100,255', '255,200,255'],
      bridge:  ['255,255,200', '200,200,255', '255,200,150']
    };
    const starColors = starColorMap[currentZone] || starColorMap.bridge;
    const zoneParticleColorMap = {
      reactor: '255,100,50',
      water: '0,200,255',
      botanic: '50,255,100',
      genetics: '200,100,255',
      bridge: '255,200,100'
    };
    const zoneParticleColor = zoneParticleColorMap[currentZone] || '0,243,255';
    
    // Twinkling stars (zone-colored)
    for (let i = 0; i < 35; i++) {
      const sx = ((i * 131 + 57) % (W - 10)) + 5;
      const sy = ((i * 79 + 23) % (groundY * 0.9)) + 5;
      const twinkle = 0.3 + 0.7 * Math.abs(Math.sin(battleSceneTime * 0.025 + i * 1.2));
      combatCtx.globalAlpha = twinkle * 0.5;
      combatCtx.fillStyle = starColors[i % starColors.length];
      combatCtx.shadowBlur = 3;
      combatCtx.shadowColor = starColors[i % starColors.length];
      combatCtx.beginPath();
      combatCtx.arc(sx, sy, 0.8, 0, Math.PI * 2);
      combatCtx.fill();
    }
    combatCtx.globalAlpha = 1;
    combatCtx.shadowBlur = 0;
    
    // Ambient particles (zone-colored)
    for (const p of battleAmbientParticles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.y < -5) { p.y = groundY; p.x = Math.random() * W; }
      if (p.x < -5) p.x = W + 5;
      if (p.x > W + 5) p.x = -5;
      const pa = p.baseAlpha * (0.5 + 0.5 * Math.sin(battleSceneTime * 0.03 + p.x * 0.01));
      combatCtx.globalAlpha = pa;
      combatCtx.fillStyle = `rgb(${zoneParticleColor})`;
      combatCtx.shadowBlur = 5;
      combatCtx.shadowColor = `rgba(${zoneParticleColor},0.8)`;
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
        // ===== NANOBOT SHIELD — Hexagonal expanding ring =====
        const radius = s.progress * 80;
        const alpha = (1 - s.progress) * 0.9;
        
        // Hexagon outline
        combatCtx.beginPath();
        for (let h = 0; h < 6; h++) {
          const angle = (h / 6) * Math.PI * 2 - Math.PI / 2;
          const hx = currentX + Math.cos(angle) * radius;
          const hy = currentY + Math.sin(angle) * radius;
          if (h === 0) combatCtx.moveTo(hx, hy);
          else combatCtx.lineTo(hx, hy);
        }
        combatCtx.closePath();
        combatCtx.strokeStyle = `rgba(0, 255, 102, ${alpha})`;
        combatCtx.lineWidth = 4;
        combatCtx.shadowBlur = 20;
        combatCtx.shadowColor = "rgba(0, 255, 102, 0.8)";
        combatCtx.stroke();
        
        // Inner hex ring
        combatCtx.beginPath();
        for (let h = 0; h < 6; h++) {
          const angle = (h / 6) * Math.PI * 2 - Math.PI / 2;
          const hx = currentX + Math.cos(angle) * radius * 0.65;
          const hy = currentY + Math.sin(angle) * radius * 0.65;
          if (h === 0) combatCtx.moveTo(hx, hy);
          else combatCtx.lineTo(hx, hy);
        }
        combatCtx.closePath();
        combatCtx.strokeStyle = `rgba(0, 255, 102, ${alpha * 0.5})`;
        combatCtx.lineWidth = 6;
        combatCtx.stroke();
        
        // Floating nanobot dots around ring
        for (let n = 0; n < 8; n++) {
          const nAngle = (n / 8) * Math.PI * 2 + battleSceneTime * 0.05;
          const nr = radius * (0.8 + 0.2 * Math.sin(battleSceneTime * 0.1 + n));
          const nx = currentX + Math.cos(nAngle) * nr;
          const ny = currentY + Math.sin(nAngle) * nr;
          combatCtx.beginPath();
          combatCtx.arc(nx, ny, 2, 0, Math.PI * 2);
          combatCtx.fillStyle = `rgba(0, 255, 102, ${alpha * (0.5 + 0.5 * Math.sin(battleSceneTime * 0.08 + n))})`;
          combatCtx.shadowBlur = 8;
          combatCtx.shadowColor = "rgba(0, 255, 102, 0.6)";
          combatCtx.fill();
        }
        combatCtx.shadowBlur = 0;
        
        // Rising plus signs
        if (s.progress > 0.2 && s.progress < 0.8) {
          for (let p = 0; p < 3; p++) {
            const px = currentX + (Math.random() - 0.5) * 60;
            const py = currentY - Math.random() * 40 * s.progress;
            combatCtx.font = '14px sans-serif';
            combatCtx.fillStyle = `rgba(0, 255, 102, ${0.3 + 0.3 * Math.sin(battleSceneTime * 0.1 + p)})`;
            combatCtx.fillText('+', px, py);
          }
        }
      } else if (s.isLaser) {
        // ===== LASER BOLT — Thin bright beam with photon trail =====
        const beamProgress = s.progress;
        const beamX = currentX;
        const beamY = currentY;
        
        // Main beam line from start to current position
        combatCtx.beginPath();
        combatCtx.moveTo(s.x1, s.y1);
        combatCtx.lineTo(beamX, beamY);
        combatCtx.strokeStyle = `rgba(0, 243, 255, ${0.3 + 0.7 * (1 - beamProgress)})`;
        combatCtx.lineWidth = 4;
        combatCtx.shadowBlur = 20;
        combatCtx.shadowColor = '#00f3ff';
        combatCtx.stroke();
        
        // Thin inner core
        combatCtx.beginPath();
        combatCtx.moveTo(s.x1, s.y1);
        combatCtx.lineTo(beamX, beamY);
        combatCtx.strokeStyle = 'rgba(255,255,255,0.9)';
        combatCtx.lineWidth = 1.5;
        combatCtx.shadowBlur = 30;
        combatCtx.shadowColor = 'white';
        combatCtx.stroke();
        combatCtx.shadowBlur = 0;
        
        // Photon trail particles along beam
        for (let p = 0; p < 6; p++) {
          const tp = Math.max(0, beamProgress - p * 0.025);
          const px = s.x1 + (s.x2 - s.x1) * tp;
          const py = s.y1 + (s.y2 - s.y1) * tp;
          combatCtx.globalAlpha = (1 - p / 7) * 0.8;
          combatCtx.fillStyle = '#00f3ff';
          combatCtx.shadowBlur = 10;
          combatCtx.shadowColor = '#00f3ff';
          combatCtx.beginPath();
          combatCtx.arc(px, py, 3 - p * 0.3, 0, Math.PI * 2);
          combatCtx.fill();
        }
        combatCtx.globalAlpha = 1;
        combatCtx.shadowBlur = 0;
        
        // Impact burst at end
        if (s.progress >= 0.92 && !s._burst) {
          s._burst = true;
          // Sharp linear shatter fragments
          for (let b = 0; b < 10; b++) {
            const angle = (b / 10) * Math.PI * 2;
            const spd = Math.random() * 3 + 1.5;
            spellsList.push({
              x1: currentX, y1: currentY,
              x2: currentX + Math.cos(angle) * 45,
              y2: currentY + Math.sin(angle) * 45,
              progress: 0, speed: 0.12,
              size: Math.random() * 2.5 + 0.5,
              color: '#00f3ff', isBurst: true, onHit: null
            });
          }
        }
      } else if (s.isEMP) {
        // ===== EMP BLAST — Expanding energy ring with arcs =====
        const expand = s.progress * 1.2;
        const pulseAlpha = 0.6 + 0.4 * Math.sin(battleSceneTime * 0.3 + s.pulsePhase);
        
        // Expanding ring
        combatCtx.beginPath();
        combatCtx.arc(currentX, currentY, s.size * expand, 0, Math.PI * 2);
        combatCtx.strokeStyle = `rgba(0, 136, 255, ${(1 - s.progress * 0.5) * pulseAlpha})`;
        combatCtx.lineWidth = 4;
        combatCtx.shadowBlur = 25;
        combatCtx.shadowColor = '#0088ff';
        combatCtx.stroke();
        
        // Second ring
        combatCtx.beginPath();
        combatCtx.arc(currentX, currentY, s.size * expand * 0.6, 0, Math.PI * 2);
        combatCtx.strokeStyle = `rgba(100, 200, 255, ${(1 - s.progress) * pulseAlpha * 0.6})`;
        combatCtx.lineWidth = 2;
        combatCtx.stroke();
        combatCtx.shadowBlur = 0;
        
        // Electric arcs
        for (let a = 0; a < 4; a++) {
          const aAngle = (a / 4) * Math.PI * 2 + battleSceneTime * 0.1;
          const aLen = s.size * expand * 0.8;
          const aX = currentX + Math.cos(aAngle) * aLen;
          const aY = currentY + Math.sin(aAngle) * aLen;
          combatCtx.beginPath();
          combatCtx.moveTo(currentX, currentY);
          combatCtx.lineTo(aX, aY);
          combatCtx.strokeStyle = `rgba(200, 230, 255, ${(1 - s.progress) * 0.5})`;
          combatCtx.lineWidth = 1.5;
          combatCtx.shadowBlur = 15;
          combatCtx.shadowColor = '#0088ff';
          combatCtx.stroke();
          combatCtx.shadowBlur = 0;
        }
        
        // Sparks at impact
        if (s.progress >= 0.90 && !s._burst) {
          s._burst = true;
          for (let b = 0; b < 20; b++) {
            const angle = Math.random() * Math.PI * 2;
            const spd = Math.random() * 3 + 1;
            spellsList.push({
              x1: currentX, y1: currentY,
              x2: currentX + Math.cos(angle) * 70,
              y2: currentY + Math.sin(angle) * 70,
              progress: 0, speed: 0.08 + Math.random() * 0.06,
              size: Math.random() * 2 + 0.5,
              color: Math.random() > 0.5 ? '#0088ff' : '#66ddff',
              isBurst: true, onHit: null
            });
          }
        }
      } else if (s.isQuantum) {
        // ===== QUANTUM STORM — Swirling vortex =====
        s.spiralAngle += 0.15;
        const vortexProgress = s.progress;
        
        // Spiral trail
        for (let sp = 0; sp < 18; sp++) {
          const st = Math.max(0, vortexProgress - sp * 0.02);
          const sAngle = s.spiralAngle + sp * 0.4;
          const sRadius = st * s.size * 1.5;
          const sx = currentX + Math.cos(sAngle) * sRadius * st;
          const sy = currentY + Math.sin(sAngle) * sRadius * st;
          const sa = (1 - sp / 19) * 0.6;
          combatCtx.globalAlpha = sa;
          combatCtx.fillStyle = sp % 2 === 0 ? '#8f00ff' : '#bf60ff';
          combatCtx.shadowBlur = 15;
          combatCtx.shadowColor = '#8f00ff';
          combatCtx.beginPath();
          combatCtx.arc(sx, sy, 3 - sp * 0.12, 0, Math.PI * 2);
          combatCtx.fill();
        }
        combatCtx.globalAlpha = 1;
        combatCtx.shadowBlur = 0;
        
        // Core orb pulsing
        const coreSize = s.size * (0.8 + 0.2 * Math.sin(battleSceneTime * 0.2));
        combatCtx.beginPath();
        combatCtx.arc(currentX, currentY, coreSize, 0, Math.PI * 2);
        combatCtx.fillStyle = '#8f00ff';
        combatCtx.shadowBlur = 30;
        combatCtx.shadowColor = '#8f00ff';
        combatCtx.fill();
        combatCtx.beginPath();
        combatCtx.arc(currentX, currentY, coreSize * 0.35, 0, Math.PI * 2);
        combatCtx.fillStyle = 'rgba(255,255,255,0.85)';
        combatCtx.shadowBlur = 15;
        combatCtx.shadowColor = 'white';
        combatCtx.fill();
        combatCtx.shadowBlur = 0;
        
        // Star burst at impact
        if (s.progress >= 0.85 && !s._burst) {
          s._burst = true;
          for (let b = 0; b < 24; b++) {
            const angle = (b / 24) * Math.PI * 2;
            const spd = Math.random() * 2 + 1;
            spellsList.push({
              x1: currentX, y1: currentY,
              x2: currentX + Math.cos(angle) * 60,
              y2: currentY + Math.sin(angle) * 60,
              progress: 0, speed: 0.06 + Math.random() * 0.05,
              size: Math.random() * 3 + 1,
              color: b % 3 === 0 ? '#ffffff' : b % 3 === 1 ? '#8f00ff' : '#bf60ff',
              isBurst: true, onHit: null
            });
          }
        }
      } else if (s.isShockwave) {
        // ===== BOSS SHOCKWAVE — Expanding orange ring =====
        s.expandRatio = s.progress * 2.5;
        const swAlpha = (1 - s.progress) * 0.8;
        
        // Main shockwave ring
        combatCtx.beginPath();
        combatCtx.arc(currentX, currentY, s.size * s.expandRatio, 0, Math.PI * 2);
        combatCtx.strokeStyle = `rgba(255, 136, 68, ${swAlpha})`;
        combatCtx.lineWidth = 6 * (1 - s.progress * 0.7);
        combatCtx.shadowBlur = 25;
        combatCtx.shadowColor = '#ff8844';
        combatCtx.stroke();
        
        // Inner ring
        combatCtx.beginPath();
        combatCtx.arc(currentX, currentY, s.size * s.expandRatio * 0.65, 0, Math.PI * 2);
        combatCtx.strokeStyle = `rgba(255, 200, 100, ${swAlpha * 0.5})`;
        combatCtx.lineWidth = 3;
        combatCtx.stroke();
        combatCtx.shadowBlur = 0;
        
        // Impact burst
        if (s.progress >= 0.7 && !s._burst) {
          s._burst = true;
          for (let b = 0; b < 12; b++) {
            const angle = Math.random() * Math.PI * 2;
            const spd = Math.random() * 2 + 0.5;
            spellsList.push({
              x1: currentX, y1: currentY,
              x2: currentX + Math.cos(angle) * 50,
              y2: currentY + Math.sin(angle) * 50,
              progress: 0, speed: 0.07,
              size: Math.random() * 3 + 1,
              color: Math.random() > 0.5 ? '#ff8844' : '#ffaa66',
              isBurst: true, onHit: null
            });
          }
        }
      } else if (s.isPoison) {
        // ===== BOSS POISON BEAM — Thick beam with dripping trail =====
        s.dripTimer += 0.02;
        const beamWidth = 8 + 4 * Math.sin(s.dripTimer * 3);
        
        // Beam line
        combatCtx.beginPath();
        combatCtx.moveTo(s.x1, s.y1);
        combatCtx.lineTo(currentX, currentY);
        combatCtx.strokeStyle = `rgba(204, 68, 255, ${0.4 + 0.3 * Math.sin(s.dripTimer * 2)})`;
        combatCtx.lineWidth = beamWidth;
        combatCtx.shadowBlur = 20;
        combatCtx.shadowColor = '#cc44ff';
        combatCtx.stroke();
        
        // Green core
        combatCtx.beginPath();
        combatCtx.moveTo(s.x1, s.y1);
        combatCtx.lineTo(currentX, currentY);
        combatCtx.strokeStyle = `rgba(100, 255, 100, ${0.3 + 0.3 * Math.sin(s.dripTimer * 3 + 1)})`;
        combatCtx.lineWidth = beamWidth * 0.4;
        combatCtx.shadowBlur = 15;
        combatCtx.shadowColor = 'rgba(100,255,100,0.6)';
        combatCtx.stroke();
        combatCtx.shadowBlur = 0;
        
        // Drip particles falling
        for (let d = 0; d < 3; d++) {
          const dt = Math.max(0, s.progress - d * 0.05);
          const dx = s.x1 + (s.x2 - s.x1) * dt;
          const dy = s.y1 + (s.y2 - s.y1) * dt + 10 * Math.sin(s.dripTimer + d * 2);
          combatCtx.globalAlpha = 0.4 * (1 - dt);
          combatCtx.fillStyle = '#cc44ff';
          combatCtx.shadowBlur = 8;
          combatCtx.shadowColor = '#cc44ff';
          combatCtx.beginPath();
          combatCtx.arc(dx, dy, 2 + Math.sin(s.dripTimer + d), 0, Math.PI * 2);
          combatCtx.fill();
        }
        combatCtx.globalAlpha = 1;
        combatCtx.shadowBlur = 0;
        
        // Splash burst at impact
        if (s.progress >= 0.90 && !s._burst) {
          s._burst = true;
          for (let b = 0; b < 16; b++) {
            const angle = Math.random() * Math.PI * 2;
            const spd = Math.random() * 2 + 0.8;
            spellsList.push({
              x1: currentX, y1: currentY,
              x2: currentX + Math.cos(angle) * 45,
              y2: currentY + Math.sin(angle) * 45,
              progress: 0, speed: 0.09,
              size: Math.random() * 2 + 0.5,
              color: Math.random() > 0.5 ? '#cc44ff' : '#66ff66',
              isBurst: true, onHit: null
            });
          }
        }
      } else if (s.isLightning) {
        // ===== BOSS LIGHTNING PUNCH — Zigzag bolt =====
        // Generate zigzag segments on first draw
        if (s.segments.length === 0) {
          const steps = 6 + Math.floor(Math.random() * 4);
          for (let seg = 0; seg < steps; seg++) {
            const t = seg / steps;
            const nx = s.x1 + (s.x2 - s.x1) * t + (Math.random() - 0.5) * 50;
            const ny = s.y1 + (s.y2 - s.y1) * t + (Math.random() - 0.5) * 30;
            s.segments.push({ x: nx, y: ny });
          }
          s.segments.push({ x: s.x2, y: s.y2 });
        }
        
        // Draw zigzag
        const boltx = s.segments.length > 0 ? s.segments[Math.floor(s.progress * (s.segments.length - 1))].x : s.x1;
        const bolty = s.segments.length > 0 ? s.segments[Math.floor(s.progress * (s.segments.length - 1))].y : s.y1;
        
        combatCtx.beginPath();
        combatCtx.moveTo(s.x1, s.y1);
        for (let seg = 0; seg < s.segments.length && seg / s.segments.length <= s.progress; seg++) {
          combatCtx.lineTo(s.segments[seg].x, s.segments[seg].y);
        }
        combatCtx.strokeStyle = '#ffcc00';
        combatCtx.lineWidth = 5;
        combatCtx.shadowBlur = 30;
        combatCtx.shadowColor = '#ffcc00';
        combatCtx.stroke();
        
        // Inner bright core
        combatCtx.beginPath();
        combatCtx.moveTo(s.x1, s.y1);
        for (let seg = 0; seg < s.segments.length && seg / s.segments.length <= s.progress; seg++) {
          combatCtx.lineTo(s.segments[seg].x, s.segments[seg].y);
        }
        combatCtx.strokeStyle = 'rgba(255,255,255,0.9)';
        combatCtx.lineWidth = 2;
        combatCtx.shadowBlur = 40;
        combatCtx.shadowColor = 'white';
        combatCtx.stroke();
        combatCtx.shadowBlur = 0;
        
        // Spark burst at impact
        if (s.progress >= 0.95 && !s._burst) {
          s._burst = true;
          for (let b = 0; b < 15; b++) {
            const angle = Math.random() * Math.PI * 2;
            const spd = Math.random() * 4 + 1;
            spellsList.push({
              x1: currentX, y1: currentY,
              x2: currentX + Math.cos(angle) * 50,
              y2: currentY + Math.sin(angle) * 50,
              progress: 0, speed: 0.1 + Math.random() * 0.08,
              size: Math.random() * 2 + 0.5,
              color: '#ffcc00', isBurst: true, onHit: null
            });
          }
        }
      } else if (s.isDrain) {
        // ===== BOSS DRAIN — Red tendrils from player to boss =====
        s.tendrils = s.tendrils.length > 0 ? s.tendrils : [0, 1, 2, 3, 4];
        const drainAlpha = 0.3 + 0.3 * Math.sin(battleSceneTime * 0.15);
        
        // Multiple curved tendrils
        s.tendrils.forEach((t, idx) => {
          const tAngle = (idx / 5) * Math.PI * 0.6 - Math.PI * 0.3;
          const midX = (s.x1 + s.x2) / 2 + Math.cos(tAngle + battleSceneTime * 0.05) * 30;
          const midY = (s.y1 + s.y2) / 2 + Math.sin(tAngle + battleSceneTime * 0.05) * 30;
          
          combatCtx.beginPath();
          combatCtx.moveTo(s.x1, s.y1);
          combatCtx.quadraticCurveTo(midX, midY, currentX, currentY);
          combatCtx.strokeStyle = `rgba(255, 68, 170, ${drainAlpha * (1 - s.progress)})`;
          combatCtx.lineWidth = 2;
          combatCtx.shadowBlur = 12;
          combatCtx.shadowColor = '#ff44aa';
          combatCtx.stroke();
          combatCtx.shadowBlur = 0;
          
          // Suction particles along tendril
          if (s.progress > 0.3) {
            const pt = s.progress - 0.3;
            const px = s.x1 + (s.x2 - s.x1) * pt;
            const py = s.y1 + (s.y2 - s.y1) * pt;
            combatCtx.beginPath();
            combatCtx.arc(px, py, 1.5 + Math.sin(battleSceneTime * 0.2 + idx), 0, Math.PI * 2);
            combatCtx.fillStyle = `rgba(255, 68, 170, ${0.6 * (1 - s.progress)})`;
            combatCtx.shadowBlur = 6;
            combatCtx.shadowColor = '#ff44aa';
            combatCtx.fill();
            combatCtx.shadowBlur = 0;
          }
        });
      } else if (s.isMiss) {
        // ===== MISS — Faint gray puff =====
        const missAlpha = (1 - s.progress) * 0.4;
        combatCtx.globalAlpha = missAlpha;
        combatCtx.fillStyle = 'rgba(180, 180, 180, 0.3)';
        combatCtx.shadowBlur = 5;
        combatCtx.shadowColor = 'rgba(180,180,180,0.3)';
        combatCtx.beginPath();
        combatCtx.arc(currentX, currentY, s.size * (1 + s.progress * 2), 0, Math.PI * 2);
        combatCtx.fill();
        combatCtx.shadowBlur = 0;
        combatCtx.globalAlpha = 1;
        
        // Small puff at end
        if (s.progress >= 0.8 && !s._burst) {
          s._burst = true;
          for (let b = 0; b < 5; b++) {
            const angle = Math.random() * Math.PI * 2;
            spellsList.push({
              x1: currentX, y1: currentY,
              x2: currentX + Math.cos(angle) * 20,
              y2: currentY + Math.sin(angle) * 20,
              progress: 0, speed: 0.06,
              size: Math.random() * 2 + 1,
              color: 'rgba(180,180,180,0.3)', isBurst: true, onHit: null
            });
          }
        }
      } else {
        // ===== DEFAULT / LEGACY — Simple orb =====
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
        combatCtx.fillStyle = "rgba(255,255,255,0.95)";
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
      }

      // Handle burst fragments
      if (s.isBurst) {
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

// ======================================================================
// ENHANCED PROJECTILE SYSTEM — Each action type has unique shape & motion
// ======================================================================

// Build a unique projectile based on actionType
function buildProjectile(isPlayerAttacking, startX, startY, endX, endY, actionType, onHitCallback) {
  const base = {
    x1: startX, y1: startY,
    x2: endX, y2: endY,
    progress: 0,
    onHit: onHitCallback,
    actionType: actionType
  };

  switch (actionType) {
    case 'laser':
      return { ...base, speed: 0.045, size: 12, color: '#00f3ff', isBurst: false, isLaser: true, trailLen: 12 };
    case 'emp':
      return { ...base, speed: 0.028, size: 18, color: '#0088ff', isBurst: false, isEMP: true, pulsePhase: 0 };
    case 'quantum':
      return { ...base, speed: 0.022, size: 22, color: '#8f00ff', isBurst: false, isQuantum: true, spiralAngle: 0 };
    case 'boss_shockwave':
      return { ...base, speed: 0.038, size: 25, color: '#ff8844', isBurst: false, isShockwave: true, expandRatio: 0 };
    case 'boss_poison':
      return { ...base, speed: 0.030, size: 14, color: '#cc44ff', isBurst: false, isPoison: true, dripTimer: 0 };
    case 'boss_lightning':
      return { ...base, speed: 0.060, size: 10, color: '#ffcc00', isBurst: false, isLightning: true, segments: [] };
    case 'boss_drain':
      return { ...base, speed: 0.025, size: 8, color: '#ff44aa', isBurst: false, isDrain: true, tendrils: [] };
    case 'miss':
      return { ...base, speed: 0.050, size: 6, color: 'rgba(180,180,180,0.4)', isBurst: false, isMiss: true };
    default:
      return { ...base, speed: 0.035, size: 10, color: '#00f3ff', isBurst: false };
  }
}

// ยิงแสงกระสุนโจมตี (Enhanced — accepts actionType for unique shapes)
function shootCombatProjectile(isPlayerAttacking, colorOrAction, onHitCallback) {
  if (!combatCanvas) {
    if (onHitCallback) onHitCallback();
    return;
  }

  // If second param is a color string, treat as simple projectile (backward compat)
  // Otherwise it's an actionType string
  let actionType = 'default';
  let color = colorOrAction;
  if (typeof colorOrAction === 'string' && !colorOrAction.startsWith('rgba') && !colorOrAction.startsWith('#')) {
    actionType = colorOrAction;
    const colorMap = {
      laser: '#00f3ff', emp: '#0088ff', quantum: '#8f00ff',
      boss_shockwave: '#ff8844', boss_poison: '#cc44ff',
      boss_lightning: '#ffcc00', boss_drain: '#ff44aa', miss: 'rgba(180,180,180,0.4)'
    };
    color = colorMap[actionType] || '#00f3ff';
  } else if (typeof colorOrAction === 'string' && colorOrAction.startsWith('#')) {
    // Map hex colors to action types for backward compat
    const colorMap = {
      '#00ff66': 'laser', '#00f3ff': 'emp', '#8f00ff': 'quantum',
      '#ffae00': 'nanobot', '#ff8844': 'boss_shockwave',
      '#cc44ff': 'boss_poison', '#ffcc00': 'boss_lightning', '#ff44aa': 'boss_drain'
    };
    actionType = colorMap[colorOrAction] || 'default';
  }

  const playerX = combatCanvas.width * 0.12;
  const playerY = combatCanvas.height * 0.80;
  const bossX = combatCanvas.width * 0.83;
  const bossY = combatCanvas.height * 0.22;

  const startX = isPlayerAttacking ? playerX : bossX;
  const startY = isPlayerAttacking ? playerY : bossY;
  const endX = isPlayerAttacking ? bossX : playerX;
  const endY = isPlayerAttacking ? bossY : playerY;

  const proj = buildProjectile(isPlayerAttacking, startX, startY, endX, endY, actionType, onHitCallback);
  spellsList.push(proj);
}

// ปล่อยเกราะฟื้นฟูสีเขียวขยาย (Enhanced — Hexagonal nanobot shield)
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
    color: "rgba(0, 255, 102, 0.7)",
    isShield: true,
    isBurst: false,
    onHit: onHealCallback
  });
  
  // Also spawn floating + particles
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const dist = 20 + Math.random() * 30;
    setTimeout(() => {
      if (!combatCanvas) return;
      spellsList.push({
        x1: playerX, y1: playerY,
        x2: playerX + Math.cos(angle) * dist,
        y2: playerY + Math.sin(angle) * dist,
        progress: 0, speed: 0.03,
        size: 2, color: '#00ff66',
        isBurst: true, onHit: null
      });
    }, i * 40);
  }
  
  // Flash the player sprite green
  const playerSpriteEl = document.getElementById("battle-player-sprite");
  if (playerSpriteEl) {
    playerSpriteEl.style.transition = 'filter 0.1s';
    playerSpriteEl.style.filter = 'brightness(1.5) hue-rotate(90deg) drop-shadow(0 0 20px #00ff66)';
    setTimeout(() => {
      playerSpriteEl.style.filter = '';
    }, 400);
  }
}

// ตัวแจ้งตัวเลขความเสียหายแบบลอยตัวพิกัด (Enhanced — each damageType has unique style)
function triggerDamageEffect(isAttackingBoss, dmg, damageType) {
  damageType = damageType || 'normal';
  const popup = document.getElementById(isAttackingBoss ? "enemy-damage-popup" : "player-damage-popup");
  if (!popup) return;
  
  popup.textContent = typeof dmg === 'number' ? `-${dmg}` : dmg;
  popup.className = `damage-number`;
  
  switch (damageType) {
    case 'crit':
      // Gold, large, explosive
      popup.style.fontSize = '2.8rem';
      popup.style.color = '#ffd700';
      popup.style.textShadow = '0 0 20px rgba(255, 215, 0, 0.9), 0 0 40px rgba(255, 215, 0, 0.5)';
      popup.classList.add('damage-pop-active');
      // Screen gold flash
      const arena = document.querySelector('.rpg-battle-window .battle-arena');
      if (arena) {
        const flash = document.createElement('div');
        flash.style.cssText = 'position:absolute;inset:0;background:rgba(255,215,0,0.2);z-index:100;pointer-events:none;animation:flash-fade 0.4s forwards;';
        arena.appendChild(flash);
        setTimeout(() => flash.remove(), 500);
      }
      break;
    case 'miss':
      popup.style.fontSize = '1.6rem';
      popup.style.color = '#94a3b8';
      popup.style.textShadow = '0 0 5px rgba(148, 163, 184, 0.5)';
      popup.textContent = 'MISS! ✗';
      popup.classList.add('damage-pop-active');
      break;
    case 'heal':
      popup.style.fontSize = '2rem';
      popup.style.color = '#00ff66';
      popup.style.textShadow = '0 0 15px rgba(0, 255, 102, 0.8)';
      popup.textContent = typeof dmg === 'number' ? `+${dmg} HP` : dmg;
      popup.classList.add('damage-pop-active');
      break;
    case 'boss_heal':
      popup.style.fontSize = '1.8rem';
      popup.style.color = '#ff44aa';
      popup.style.textShadow = '0 0 15px rgba(255, 68, 170, 0.8)';
      popup.textContent = typeof dmg === 'number' ? `+${dmg}` : dmg;
      popup.classList.add('damage-pop-active');
      break;
    case 'combo':
      popup.style.fontSize = '2.2rem';
      popup.style.color = '#ffae00';
      popup.style.textShadow = '0 0 20px rgba(255, 174, 0, 0.9), 0 0 10px rgba(255, 100, 0, 0.5)';
      popup.textContent = `🔥 x${dmg} COMBO!`;
      popup.classList.add('damage-pop-active');
      break;
    default: // normal
      popup.style.fontSize = '1.8rem';
      if (isAttackingBoss) {
        popup.style.color = '#00ff66';
        popup.style.textShadow = '0 0 10px rgba(0, 255, 102, 0.6)';
      } else {
        popup.style.color = '#ff2e5d';
        popup.style.textShadow = '0 0 10px rgba(255, 46, 93, 0.6)';
      }
      popup.classList.add('damage-pop-active');
      break;
  }
  
  setTimeout(() => {
    popup.classList.remove('damage-pop-active');
  }, 900);

  // Screen shake — only for player taking damage, not for miss
  if (!isAttackingBoss && damageType !== 'miss') {
    const arena = document.querySelector(".rpg-battle-window .battle-arena");
    if (arena) {
      let shakeClass = 'shake-effect';
      // Different shake intensity per damage type
      if (damageType === 'crit') shakeClass = 'shake-effect-heavy';
      else if (damageType === 'heal') shakeClass = 'shake-effect-light';
      arena.classList.add(shakeClass);
      setTimeout(() => {
        arena.classList.remove(shakeClass);
      }, 450);
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
      statusLabel.style.color = "var(--neon-cyan)";
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
    btn.style.border = "1px solid var(--border-light)";
    
    if (myResponse !== undefined && myResponse !== null) {
      btn.disabled = true;
      if (myResponse === idx) {
        btn.style.background = "var(--neon-cyan)";
        btn.style.color = "var(--text-dark)";
        btn.style.boxShadow = "0 0 10px var(--neon-cyan-glow)";
        btn.style.borderColor = "var(--neon-cyan)";
      } else {
        btn.style.background = "rgba(0,0,0,0.5)";
        btn.style.opacity = "0.45";
      }
    } else {
      btn.style.background = "rgba(0,0,0,0.45)";
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
      statusLabel.style.color = "var(--neon-emerald)";
      statusLabel.textContent = `ส่งคำตอบข้อ ${prefixes[myResponse].replace('.','')} แล้ว! รอการเฉลยหน้าห้องเรียน`;
    } else {
      statusLabel.style.color = "var(--neon-cyan)";
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
    iconEl.style.color = "var(--neon-amber)";
    titleEl.textContent = "คุณส่งคำตอบไม่ทันเวลา!";
    titleEl.style.color = "var(--neon-amber)";
  } 
  else if (isCorrect) {
    iconEl.textContent = "✓";
    iconEl.style.color = "var(--neon-emerald)";
    titleEl.textContent = "คำตอบของคุณถูกต้อง!";
    titleEl.style.color = "var(--neon-emerald)";
  } 
  else {
    iconEl.textContent = "✗";
    iconEl.style.color = "var(--neon-red)";
    titleEl.textContent = "คำตอบของคุณยังไม่ถูก!";
    titleEl.style.color = "var(--neon-red)";
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
      // รีเซ็ต level confirmation เพื่อให้กลับมาเห็นหน้าเลือกชั้นเรียนอีกครั้ง
      localStorage.removeItem(gk("sci_quest_level_confirmed"));
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

// ฟังก์ชันให้บอสโจมตีผู้เล่น (turn-based) - สุ่มเลือกท่า (Enhanced — unique visuals per boss move)
function executeBossAttack() {
  localStorage.removeItem(gk("sci_quest_boss_turn_pending"));
  
  const scoreObj = App.getStudentScore();
  
  // สุ่มเลือกท่าของบอส
  const bossMove = BOSS_MOVES[Math.floor(Math.random() * BOSS_MOVES.length)];
  
  // Map boss move names to action types for unique projectile visuals
  const bossActionTypeMap = {
    "คลื่นกระแทก": "boss_shockwave",
    "ลำแสงพิษ": "boss_poison",
    "หมัดอัสนี": "boss_lightning",
    "ดูดพลัง": "boss_drain"
  };
  const actionType = bossActionTypeMap[bossMove.name] || "boss_shockwave";
  
  // Show boss move name floating above enemy
  const enemySpriteContainer = document.querySelector(".enemy-entity .entity-sprite-container");
  if (enemySpriteContainer) {
    const moveLabel = document.createElement("div");
    moveLabel.style.cssText = `position:absolute;top:-20px;left:50%;transform:translateX(-50%);font-size:1rem;font-weight:bold;color:${bossMove.color};text-shadow:0 0 10px ${bossMove.color};white-space:nowrap;animation:float-up 1s forwards;z-index:50;`;
    moveLabel.textContent = `⚔️ ${bossMove.name}!`;
    enemySpriteContainer.appendChild(moveLabel);
    setTimeout(() => moveLabel.remove(), 1000);
  }
  
  // ตรวจสอบความแม่นยำ
  const isBossHit = Math.random() <= bossMove.acc;
  
  if (!isBossHit) {
    // บอสโจมตีพลาด
    addShipLog(`🍃 บอสใช้ "${bossMove.name}" แต่โจมตีพลาด!`, "system");
    App.showToast(`🍃 บอสใช้ ${bossMove.name}... พลาด!`);
    
    // Show MISS on player side
    triggerDamageEffect(false, 'MISS!', 'miss');
    
    // Enemy still does the attack animation but it whiffs
    const enemySpriteEl = document.getElementById("battle-enemy-sprite");
    if (enemySpriteEl) {
      enemySpriteEl.classList.add("enemy-attack-dash");
      setTimeout(() => enemySpriteEl.classList.remove("enemy-attack-dash"), 500);
    }
  } else if (bossMove.healPct) {
    // บอสใช้ท่าดูดพลัง: รักษาตัว (Unique: Red tendrils)
    const bossHp = parseInt(localStorage.getItem(gk("sci_quest_boss_hp"))) || 0;
    const bossMaxHp = parseInt(localStorage.getItem(gk("sci_quest_boss_max_hp"))) || 100;
    const healAmt = Math.round(bossMaxHp * bossMove.healPct);
    const newBossHp = Math.min(bossMaxHp, bossHp + healAmt);
    localStorage.setItem(gk("sci_quest_boss_hp"), newBossHp);
    
    window.SoundFX.playBossDrain();
    
    // Drain visual: red tendrils from player TO boss (reverse direction)
    if (combatCanvas) {
      const playerX = combatCanvas.width * 0.12;
      const playerY = combatCanvas.height * 0.80;
      const bossX = combatCanvas.width * 0.83;
      const bossY = combatCanvas.height * 0.22;
      
      spellsList.push({
        x1: playerX, y1: playerY,
        x2: bossX, y2: bossY,
        progress: 0, speed: 0.03,
        size: 8, color: '#ff44aa',
        isDrain: true, tendrils: [0, 1, 2, 3],
        isBurst: false, onHit: null
      });
    }
    
    const enemySpriteEl = document.getElementById("battle-enemy-sprite");
    if (enemySpriteEl) {
      enemySpriteEl.classList.add("heal-bounce");
      setTimeout(() => enemySpriteEl.classList.remove("heal-bounce"), 600);
    }
    
// Player hurt animation (drained — unique per boss move)
    const playerSpriteEl = document.getElementById("battle-player-sprite");
    if (playerSpriteEl) {
      playerSpriteEl.classList.remove("damaged-shake", "hero-hurt-shockwave", "hero-hurt-poison", "hero-hurt-lightning", "hero-hurt-drain");
      const hurtClassMap = {
        boss_shockwave: 'hero-hurt-shockwave',
        boss_poison: 'hero-hurt-poison',
        boss_lightning: 'hero-hurt-lightning',
        boss_drain: 'hero-hurt-drain'
      };
      const hClass = hurtClassMap[actionType] || 'damaged-shake';
      playerSpriteEl.classList.add(hClass);
      playerSpriteEl.classList.replace("hero-idle", "hero-hurt");
      setTimeout(() => {
        playerSpriteEl.classList.remove(hClass);
        playerSpriteEl.classList.replace("hero-hurt", "hero-idle");
      }, 500);
    }
    
    updateBattleHPBars();
    addShipLog(`💜 บอสใช้ "${bossMove.name}" ดูดพลังชีวิต +${healAmt} HP`, "alert");
    App.showToast(`💜 บอสใช้ ${bossMove.name} ฟื้น HP`);
  } else {
    // บอสโจมตีโดน — unique projectile per move type
    const actualDmg = bossMove.dmg;
    scoreObj.hp = Math.max(0, scoreObj.hp - actualDmg);
    App.saveStudentScore(scoreObj);
    
    // Play the boss-specific sound
    const bossSoundMap = {
      "คลื่นกระแทก": "playBossShockwave",
      "ลำแสงพิษ": "playBossPoisonBeam",
      "หมัดอัสนี": "playBossLightningPunch",
      "ดูดพลัง": "playBossDrain"
    };
    const soundFn = bossSoundMap[bossMove.name];
    if (window.SoundFX[soundFn]) window.SoundFX[soundFn]();
    
    // Enemy attack animation — subtle variations per move
    const enemySpriteEl = document.getElementById("battle-enemy-sprite");
    if (enemySpriteEl) {
      enemySpriteEl.classList.add("enemy-attack-dash");
      setTimeout(() => enemySpriteEl.classList.remove("enemy-attack-dash"), 500);
      
      // Additional color flash per move type
      if (actionType === 'boss_lightning') {
        enemySpriteEl.style.filter = 'brightness(2) hue-rotate(-30deg)';
        setTimeout(() => { enemySpriteEl.style.filter = ''; }, 200);
      } else if (actionType === 'boss_poison') {
        enemySpriteEl.style.filter = 'brightness(0.7) hue-rotate(60deg) saturate(1.5)';
        setTimeout(() => { enemySpriteEl.style.filter = ''; }, 300);
      }
    }
    
    // Fire the unique projectile
    shootCombatProjectile(false, actionType, () => {
      // Player receives damage — unique hurt animation per boss move type
      const playerSpriteEl = document.getElementById("battle-player-sprite");
      if (playerSpriteEl) {
        playerSpriteEl.classList.remove("damaged-shake", "hero-hurt-shockwave", "hero-hurt-poison", "hero-hurt-lightning", "hero-hurt-drain");
        const hurtClassMap = {
          boss_shockwave: 'hero-hurt-shockwave',
          boss_poison: 'hero-hurt-poison',
          boss_lightning: 'hero-hurt-lightning',
          boss_drain: 'hero-hurt-drain'
        };
        const hClass = hurtClassMap[actionType] || 'damaged-shake';
        playerSpriteEl.classList.add(hClass);
        playerSpriteEl.classList.replace("hero-idle", "hero-hurt");
        
        // Additional filter effects per move
        if (actionType === 'boss_lightning') {
          playerSpriteEl.style.filter = 'brightness(2)';
          setTimeout(() => { playerSpriteEl.style.filter = ''; }, 250);
        } else if (actionType === 'boss_poison') {
          playerSpriteEl.style.filter = 'hue-rotate(90deg) saturate(0.5)';
          setTimeout(() => { playerSpriteEl.style.filter = ''; }, 400);
        }
        
        setTimeout(() => {
          playerSpriteEl.classList.remove(hClass);
      triggerDamageEffect(false, actualDmg, 'normal');
      updateBattleHPBars();
    });
    
    addShipLog(`💥 บอสใช้ "${bossMove.name}" โจมตีใส่ปาร์ตี้ -${actualDmg} HP! (${Math.round(bossMove.acc * 100)}%)`, "alert");
    App.showToast(`💥 บอสใช้ ${bossMove.name} -${actualDmg} HP`);
    
    // Screen color flash per boss move type
    const arena = document.querySelector(".rpg-battle-window .battle-arena");
    if (arena) {
      const flash = document.createElement('div');
      const flashColors = {
        boss_shockwave: 'rgba(255,136,68,0.15)',
        boss_poison: 'rgba(204,68,255,0.15)',
        boss_lightning: 'rgba(255,255,255,0.2)',
        boss_drain: 'rgba(255,68,170,0.12)'
      };
      flash.style.cssText = `position:absolute;inset:0;background:${flashColors[actionType] || 'rgba(255,0,0,0.1)'};z-index:100;pointer-events:none;animation:flash-fade 0.5s forwards;`;
      arena.appendChild(flash);
      setTimeout(() => flash.remove(), 600);
    }
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
      window.SoundFX.playVictoryFanfare();
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
