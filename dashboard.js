/**
 * Sci-Quest 2026 - Teacher Backstage (Question CRUD Manager)
 * จัดการเพิ่ม ลบ แก้ไข คำถามวิทยาศาสตร์ (ป.4 - ม.3) ผ่านคลังข้อมูล ScienceDB
 */

const GRADE_LABELS = {
  "p4": "ประถมศึกษาปีที่ 4 (ป.4)",
  "p5": "ประถมศึกษาปีที่ 5 (ป.5)",
  "p6": "ประถมศึกษาปีที่ 6 (ป.6)",
  "m1": "มัธยมศึกษาปีที่ 1 (ม.1)",
  "m2": "มัธยมศึกษาปีที่ 2 (ม.2)",
  "m3": "มัธยมศึกษาปีที่ 3 (ม.3)"
};

let editingQuestionId = null;

// เริ่มต้นจัดการหน้าหลังร้านครู
function initTeacherDashboard() {
  bindDashboardDOMEvents();
  renderClassProgress();
  renderQuestionsView();
  
  window.addEventListener("questions-updated", function() {
    renderQuestionsView();
  });

  window.addEventListener("score-changed", function() {
    renderClassProgress();
  });

  window.addEventListener("modules-changed", function() {
    renderClassProgress();
  });
}

// ผูกอีเวนต์สำหรับเครื่องมือแก้ไขโจทย์
function bindDashboardDOMEvents() {
  // สลับการเลือกฟิลเตอร์ระดับชั้น
  const qGradeSelect = document.getElementById("q-grade-filter");
  if (qGradeSelect) {
    qGradeSelect.addEventListener("change", function() {
      window.SoundFX.playClick();
      renderQuestionsView();
    });
  }

  // ค้นหาข้อความคำค้น
  const qSearchInput = document.getElementById("q-search-input");
  if (qSearchInput) {
    qSearchInput.addEventListener("input", function() {
      renderQuestionsView();
    });
  }

  // ฟิลเตอร์สาระวิชา
  const qSubjectFilter = document.getElementById("q-subject-filter");
  if (qSubjectFilter) {
    qSubjectFilter.addEventListener("change", function() {
      window.SoundFX.playClick();
      renderQuestionsView();
    });
  }

  // ฟิลเตอร์ระดับความยาก
  const qDiffFilter = document.getElementById("q-diff-filter");
  if (qDiffFilter) {
    qDiffFilter.addEventListener("change", function() {
      window.SoundFX.playClick();
      renderQuestionsView();
    });
  }

  // เรียงลำดับคำถาม
  const qSortBy = document.getElementById("q-sort-by");
  if (qSortBy) {
    qSortBy.addEventListener("change", function() {
      window.SoundFX.playClick();
      renderQuestionsView();
    });
  }

  // ยกเลิกฟอร์มแก้ไข
  const cancelQBtn = document.getElementById("btn-cancel-question");
  if (cancelQBtn) {
    cancelQBtn.addEventListener("click", function() {
      window.SoundFX.playClick();
      const modal = document.getElementById("modal-question-editor");
      if (modal) modal.classList.remove("active");
    });
  }

  // ส่งฟอร์มเพื่อบันทึก
  const qForm = document.getElementById("form-question-edit");
  if (qForm) {
    qForm.addEventListener("submit", function(e) {
      e.preventDefault();
      saveQuestionFromUI();
    });
  }

  // เปิดปุ่มเพิ่มโจทย์
  const btnAddQ = document.getElementById("btn-add-new-question");
  if (btnAddQ) {
    btnAddQ.addEventListener("click", function() {
      window.SoundFX.playClick();
      openQuestionModalForAdd();
    });
  }

  // ผูกการสลับแท็บ
  const tabBtns = document.querySelectorAll(".tab-btn");
  tabBtns.forEach(btn => {
    btn.addEventListener("click", function() {
      window.SoundFX.playClick();
      tabBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      const views = document.querySelectorAll(".dashboard-view");
      views.forEach(v => v.classList.remove("active"));
      
      const targetView = document.getElementById(btn.dataset.tab);
      if (targetView) {
        targetView.classList.add("active");
      }
      
      if (btn.dataset.tab === "class-progress-tab") {
        renderClassProgress();
      }
    });
  });
}

// เรนเดอร์รายการคำถามวิทยาศาสตร์ในคลัง
function renderQuestionsView() {
  const gradeSelect = document.getElementById("q-grade-filter");
  if (!gradeSelect) return;

  const currentGrade = gradeSelect.value;
  const questionsData = window.ScienceDB.getQuestions();
  const listContainer = document.getElementById("questions-editor-list");
  
  if (!listContainer) return;
  listContainer.innerHTML = "";

  const questions = questionsData[currentGrade] || [];

  if (questions.length === 0) {
    listContainer.innerHTML = `
      <div class="text-center" style="grid-column: 1/-1; padding: 40px; color: var(--text-muted); font-style: italic;">
        ไม่พบคำถามวิทยาศาสตร์ในระดับชั้นนี้ กรุณากดปุ่ม "เพิ่มคำถามวิทยาศาสตร์ใหม่" เพื่อสร้างคำถามข้อแรก
      </div>
    `;
    return;
  }

  // อ่านค่าฟิลเตอร์และค้นหาจากหน้าจอ
  const searchInput = document.getElementById("q-search-input");
  const subjectSelect = document.getElementById("q-subject-filter");
  const diffSelect = document.getElementById("q-diff-filter");
  const sortBySelect = document.getElementById("q-sort-by");

  const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
  const subjectFilter = subjectSelect ? subjectSelect.value : "all";
  const diffFilter = diffSelect ? diffSelect.value : "all";
  const sortBy = sortBySelect ? sortBySelect.value : "default";

  let filteredQuestions = [...questions];

  // 1. ฟิลเตอร์ตามหัวข้อสาระวิชา
  if (subjectFilter !== "all") {
    filteredQuestions = filteredQuestions.filter(q => {
      const topic = (q.topic || "").toLowerCase();
      if (subjectFilter === "bio") {
        return topic.includes("ชีววิทยา") || topic.includes("bio");
      } else if (subjectFilter === "chem") {
        return topic.includes("เคมี") || topic.includes("chem");
      } else if (subjectFilter === "phys") {
        return topic.includes("ฟิสิกส์") || topic.includes("phys") || topic.includes("แรง") || topic.includes("เสียง") || topic.includes("แสง") || topic.includes("ไฟฟ้า") || topic.includes("ความร้อน") || topic.includes("อุณหภูมิ");
      } else if (subjectFilter === "space") {
        return topic.includes("โลก") || topic.includes("อวกาศ") || topic.includes("สุริยะ") || topic.includes("ดาราศาสตร์") || topic.includes("บรรยากาศ") || topic.includes("ดาว");
      } else if (subjectFilter === "other") {
        const matchesAny = topic.includes("ชีววิทยา") || topic.includes("bio") ||
                            topic.includes("เคมี") || topic.includes("chem") ||
                            topic.includes("ฟิสิกส์") || topic.includes("phys") || topic.includes("แรง") || topic.includes("เสียง") || topic.includes("แสง") || topic.includes("ไฟฟ้า") || topic.includes("ความร้อน") || topic.includes("อุณหภูมิ") ||
                            topic.includes("โลก") || topic.includes("อวกาศ") || topic.includes("สุริยะ") || topic.includes("ดาราศาสตร์") || topic.includes("บรรยากาศ") || topic.includes("ดาว");
        return !matchesAny;
      }
      return true;
    });
  }

  // 2. ฟิลเตอร์ตามระดับความยาก
  if (diffFilter !== "all") {
    filteredQuestions = filteredQuestions.filter(q => q.difficulty === diffFilter);
  }

  // 3. ค้นหาด้วยคำค้น (ค้นในโจทย์, ตัวเลือก, คำใบ้, และหัวข้อ)
  if (query) {
    filteredQuestions = filteredQuestions.filter(q => {
      const qText = (q.question || "").toLowerCase();
      const qTopic = (q.topic || "").toLowerCase();
      const qHint = (q.hint || "").toLowerCase();
      const optionsMatch = q.options.some(opt => (opt || "").toLowerCase().includes(query));
      return qText.includes(query) || qTopic.includes(query) || qHint.includes(query) || optionsMatch;
    });
  }

  // 4. จัดเรียงลำดับ (Sorting)
  if (sortBy === "topic-asc") {
    filteredQuestions.sort((a, b) => (a.topic || "").localeCompare(b.topic || "", "th"));
  } else if (sortBy === "topic-desc") {
    filteredQuestions.sort((a, b) => (b.topic || "").localeCompare(a.topic || "", "th"));
  } else if (sortBy === "question-asc") {
    filteredQuestions.sort((a, b) => (a.question || "").localeCompare(b.question || "", "th"));
  } else if (sortBy === "diff-asc") {
    const diffWeight = { "easy": 1, "medium": 2, "hard": 3 };
    filteredQuestions.sort((a, b) => (diffWeight[a.difficulty] || 0) - (diffWeight[b.difficulty] || 0));
  } else if (sortBy === "diff-desc") {
    const diffWeight = { "easy": 1, "medium": 2, "hard": 3 };
    filteredQuestions.sort((a, b) => (diffWeight[b.difficulty] || 0) - (diffWeight[a.difficulty] || 0));
  }

  // เรนเดอร์ส่วนแสดงจำนวนผลลัพธ์
  const statusEl = document.createElement("div");
  statusEl.style.cssText = "font-size: 0.95rem; color: var(--text-primary); margin-bottom: 5px; font-weight: 500; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed var(--border-light); padding-bottom: 8px;";
  statusEl.innerHTML = `
    <span>🔍 ผลลัพธ์การกรอง: พบข้อสอบ <strong style="color: var(--neon-cyan);">${filteredQuestions.length}</strong> ข้อ (จากทั้งหมดในชั้นเรียน ${questions.length} ข้อ)</span>
    <span style="font-size: 0.8rem; color: var(--text-muted);">ระดับชั้น: ${(GRADE_LABELS[currentGrade] || currentGrade).split(" (")[0]}</span>
  `;
  listContainer.appendChild(statusEl);

  if (filteredQuestions.length === 0) {
    const noResultsEl = document.createElement("div");
    noResultsEl.className = "text-center";
    noResultsEl.style.cssText = "grid-column: 1/-1; padding: 40px; color: var(--text-muted); font-style: italic;";
    noResultsEl.textContent = "ไม่พบข้อสอบที่ตรงตามเงื่อนไขตัวกรองและการค้นหาของคุณ";
    listContainer.appendChild(noResultsEl);
    return;
  }

  filteredQuestions.forEach((q, idx) => {
    const card = document.createElement("div");
    card.className = "q-editor-card glass-panel";
    card.style.background = "rgba(18, 18, 30, 0.4)";
    
    let optionsHTML = "";
    q.options.forEach((opt, optIdx) => {
      const isCorrect = optIdx === q.correct;
      optionsHTML += `
        <div class="opt-preview-item ${isCorrect ? 'correct' : ''}" style="padding: 6px; font-size: 0.95rem; border-left: 2px solid ${isCorrect ? 'var(--neon-emerald)' : 'transparent'}; margin-bottom: 4px; background:${isCorrect ? 'rgba(0, 255, 102, 0.05)' : 'transparent'};">
          ${isCorrect ? '✓' : '•'} ${opt || '(ว่าง)'}
        </div>
      `;
    });

    const diffText = q.difficulty === "easy" ? "ง่าย" : q.difficulty === "medium" ? "ปานกลาง" : "ยาก";
    const diffColor = q.difficulty === "easy" ? "var(--neon-emerald)" : q.difficulty === "medium" ? "var(--neon-cyan)" : "var(--neon-purple)";
    const diffBg = q.difficulty === "easy" ? "rgba(0, 255, 102, 0.1)" : q.difficulty === "medium" ? "rgba(0, 243, 255, 0.1)" : "rgba(143, 0, 255, 0.1)";

    card.innerHTML = `
      <div class="q-card-header" style="border-bottom: 1px solid var(--border-light); padding-bottom: 10px; margin-bottom: 10px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
          <div class="q-card-badge-row" style="display:flex; gap:6px;">
            <span class="badge-q" style="background:rgba(0,243,255,0.1); color:var(--neon-cyan); border:1px solid rgba(0,243,255,0.2); padding:2px 8px; border-radius:4px; font-size:0.75rem;">${(GRADE_LABELS[currentGrade] || currentGrade).split(" (")[0]}</span>
            <span class="badge-q" style="background:rgba(255,255,255,0.05); color:var(--text-primary); border:1px solid var(--border-light); padding:2px 8px; border-radius:4px; font-size:0.75rem;">${q.topic}</span>
            <span class="badge-q" style="background:${diffBg}; color:${diffColor}; border:1px solid ${diffColor}44; padding:2px 8px; border-radius:4px; font-size:0.75rem;">ความยาก: ${diffText}</span>
          </div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">ID: ${q.id}</div>
        </div>
        <div class="q-card-title" style="margin-top: 10px; font-weight:700; font-size:1.1rem; line-height:1.4;">
          ${idx + 1}. ${q.question}
        </div>
      </div>
      
      <div class="q-card-options-preview" style="background:rgba(0,0,0,0.2); padding:10px; border-radius:8px; border:1px solid var(--border-light);">
        ${optionsHTML}
      </div>

      <div style="margin-top: 12px; font-size: 0.85rem; border-left: 2px solid var(--neon-amber); padding-left: 10px; color: #ffe8b3;">
        <strong>คำใบ้เฉลย:</strong> ${q.hint || 'ไม่มีคำใบ้'}
      </div>

      <div style="margin-top: 8px; font-size: 0.85rem; border-left: 2px solid var(--neon-emerald); padding-left: 10px; color: #cbd5e1; line-height:1.4;">
        <strong>เหตุผลความรู้:</strong> ${q.reason || 'ไม่มีคำอธิบายประกอบ'}
      </div>

      <div class="q-card-action-bar" style="margin-top: 15px; display:flex; gap:10px; justify-content:flex-end; border-top: 1px solid var(--border-light); padding-top: 10px;">
        <button class="btn-neon btn-neon-purple" style="padding: 6px 15px; font-size: 0.8rem;" onclick="window.openQuestionModalForEdit('${currentGrade}', '${q.id}')">
          📝 แก้ไขข้อสอบ
        </button>
        <button class="btn-neon btn-neon-red" style="padding: 6px 15px; font-size: 0.8rem;" onclick="window.deleteQuestionClick('${currentGrade}', '${q.id}')">
          🗑️ ลบออก
        </button>
      </div>
    `;
    listContainer.appendChild(card);
  });
}

// เปิดหน้าต่าง Modal สำหรับเพิ่มข้อสอบ
function openQuestionModalForAdd() {
  editingQuestionId = null;
  
  document.getElementById("modal-editor-title").textContent = "🚀 เพิ่มคำถามวิทยาศาสตร์ข้อใหม่";
  
  document.getElementById("txt-q-question").value = "";
  document.getElementById("txt-q-topic").value = "วิทยาศาสตร์ทั่วไป";
  document.getElementById("select-q-difficulty").value = "easy";
  document.getElementById("txt-q-opt0").value = "";
  document.getElementById("txt-q-opt1").value = "";
  document.getElementById("txt-q-opt2").value = "";
  document.getElementById("txt-q-opt3").value = "";
  document.getElementById("select-q-correct").value = "0";
  document.getElementById("txt-q-hint").value = "";
  document.getElementById("txt-q-reason").value = "";

  const modal = document.getElementById("modal-question-editor");
  if (modal) modal.classList.add("active");
}

// เปิดหน้าต่าง Modal สำหรับแก้ไขข้อสอบ
function openQuestionModalForEdit(grade, questionId) {
  editingQuestionId = questionId;
  const questionsData = window.ScienceDB.getQuestions();
  const q = questionsData[grade].find(item => item.id === questionId);
  
  if (!q) return;

  document.getElementById("modal-editor-title").textContent = "📝 แก้ไขข้อสอบวิทยาศาสตร์";
  
  document.getElementById("txt-q-question").value = q.question;
  document.getElementById("txt-q-topic").value = q.topic;
  document.getElementById("select-q-difficulty").value = q.difficulty || "medium";
  document.getElementById("txt-q-opt0").value = q.options[0] || "";
  document.getElementById("txt-q-opt1").value = q.options[1] || "";
  document.getElementById("txt-q-opt2").value = q.options[2] || "";
  document.getElementById("txt-q-opt3").value = q.options[3] || "";
  document.getElementById("select-q-correct").value = q.correct.toString();
  document.getElementById("txt-q-hint").value = q.hint || "";
  document.getElementById("txt-q-reason").value = q.reason || "";

  const modal = document.getElementById("modal-question-editor");
  if (modal) modal.classList.add("active");
}

window.openQuestionModalForEdit = openQuestionModalForEdit;

// บันทึกคำถาม (เพิ่มหรือแก้ไข) จากฟอร์ม UI
function saveQuestionFromUI() {
  const gradeSelect = document.getElementById("q-grade-filter");
  if (!gradeSelect) return;
  
  const currentGrade = gradeSelect.value;
  
  const questionText = document.getElementById("txt-q-question").value.trim();
  const topicText = document.getElementById("txt-q-topic").value.trim();
  const diffText = document.getElementById("select-q-difficulty").value;
  const opt0 = document.getElementById("txt-q-opt0").value.trim();
  const opt1 = document.getElementById("txt-q-opt1").value.trim();
  const opt2 = document.getElementById("txt-q-opt2").value.trim();
  const opt3 = document.getElementById("txt-q-opt3").value.trim();
  const correctVal = parseInt(document.getElementById("select-q-correct").value);
  const hintText = document.getElementById("txt-q-hint").value.trim();
  const reasonText = document.getElementById("txt-q-reason").value.trim();

  if (!questionText || !opt0 || !opt1 || !opt2 || !opt3) {
    alert("กรุณากรอกคำถามและตัวเลือกให้ครบทั้ง 4 ตัวเลือก");
    return;
  }

  const qObj = {
    difficulty: diffText,
    topic: topicText,
    question: questionText,
    options: [opt0, opt1, opt2, opt3],
    correct: correctVal,
    hint: hintText,
    reason: reasonText
  };

  if (editingQuestionId) {
    const success = window.ScienceDB.updateSingleQuestion(currentGrade, editingQuestionId, qObj);
    if (success) {
      window.App.showToast("แก้ไขข้อสอบเรียบร้อยแล้ว");
    }
  } else {
    window.ScienceDB.addQuestionToGrade(currentGrade, qObj);
    window.App.showToast("เพิ่มข้อสอบใหม่เรียบร้อยแล้ว");
  }

  const modal = document.getElementById("modal-question-editor");
  if (modal) modal.classList.remove("active");
  
  renderQuestionsView();
}

// ลบคำถามออกจากระบบ
function deleteQuestionClick(grade, questionId) {
  if (confirm("คุณแน่ใจหรือไม่ที่จะลบคำถามข้อนี้ออกจากระบบอย่างถาวร?")) {
    window.SoundFX.playAlarm();
    const success = window.ScienceDB.deleteQuestionFromGrade(grade, questionId);
    if (success) {
      window.App.showToast("ลบข้อสอบเรียบร้อยแล้ว", true);
      renderQuestionsView();
    }
  }
}

window.deleteQuestionClick = deleteQuestionClick;

// เรนเดอร์การแสดงรายงานความก้าวหน้าของคลาสเรียนแบ่งตามระดับชั้น
function renderClassProgress() {
  const container = document.getElementById("class-progress-list");
  if (!container) return;
  
  container.innerHTML = "";
  
  const grades = ["p4", "p5", "p6", "m1", "m2", "m3"];
  const icons = { p4: "🎒", p5: "🧪", p6: "🔭", m1: "🧬", m2: "⚡", m3: "🛰️" };
  
  const currentSettings = window.App.getSystemSettings();
  const currentGrade = currentSettings.activeGrade;
  
  grades.forEach(g => {
    const modulesKey = `sci_quest_modules_${g}`;
    const scoreKey = `sci_quest_student_score_${g}`;
    
    const modules = JSON.parse(localStorage.getItem(modulesKey));
    const scoreObj = JSON.parse(localStorage.getItem(scoreKey));
    
    if (!modules || !scoreObj) return;
    
    let repairedCount = 0;
    for (let key in modules) {
      if (modules[key].repaired) repairedCount++;
    }
    
    const totalQuestions = scoreObj.correct + scoreObj.wrong;
    const accuracy = totalQuestions > 0 ? Math.round((scoreObj.correct / totalQuestions) * 100) : 0;
    
    const isActive = g === currentGrade;
    
    const card = document.createElement("div");
    card.className = "glass-panel";
    card.style.padding = "20px";
    card.style.display = "flex";
    card.style.flexDirection = "column";
    card.style.gap = "12px";
    card.style.position = "relative";
    
    if (isActive) {
      card.style.borderColor = "var(--neon-cyan)";
      card.style.boxShadow = "0 0 15px rgba(0, 243, 255, 0.15)";
      card.style.background = "radial-gradient(circle, rgba(0, 243, 255, 0.05) 0%, rgba(18, 18, 30, 0.85) 75%)";
    } else {
      card.style.borderColor = "var(--border-light)";
      card.style.background = "rgba(18, 18, 30, 0.4)";
    }
    
    // Status icons for nodes
    let nodesHTML = "";
    for (let key in modules) {
      const m = modules[key];
      const statusIcon = m.repaired ? "✅" : m.status === "unlocked" ? "🔓" : "🔒";
      const statusColor = m.repaired ? "var(--neon-emerald)" : m.status === "unlocked" ? "var(--neon-cyan)" : "var(--text-muted)";
      nodesHTML += `
        <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.8rem; background:rgba(0,0,0,0.2); padding: 4px 8px; border-radius:4px; border: 1px solid var(--border-light);">
          <span style="font-weight:600; color:${statusColor};">${m.label.split(":")[0]}</span>
          <span>${statusIcon}</span>
        </div>
      `;
    }
    
    const hpPercent = Math.max(0, (scoreObj.hp / scoreObj.maxHp) * 100);
    const totalNodesCount = Object.keys(modules).length || 1;
    const progressPercent = (repairedCount / totalNodesCount) * 100;
    
    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-light); padding-bottom:10px;">
        <h3 style="font-weight:700; font-size:1.15rem; color:${isActive ? 'var(--neon-cyan)' : 'white'};">
          ${icons[g]} ${GRADE_LABELS[g]}
        </h3>
        ${isActive ? '<span style="background:rgba(0, 243, 255, 0.15); color:var(--neon-cyan); border:1px solid var(--neon-cyan); padding:2px 8px; border-radius:12px; font-size:0.7rem; font-weight:bold; letter-spacing:0.5px;">กำลังใช้งาน</span>' : ''}
      </div>
      
      <!-- HP Bar -->
      <div>
        <div style="display:flex; justify-content:space-between; font-size:0.8rem; font-weight:bold; margin-bottom:4px;">
          <span>🔋 พลังชีวิตปาร์ตี้ (HP)</span>
          <span style="color:var(--neon-red);">${scoreObj.hp}/${scoreObj.maxHp} HP</span>
        </div>
        <div style="width:100%; height:8px; background:rgba(255, 255, 255, 0.05); border-radius:4px; border:1px solid var(--border-light); overflow:hidden;">
          <div style="width:${hpPercent}%; height:100%; background:linear-gradient(to right, var(--neon-red), #ef4444); box-shadow: 0 0 5px var(--neon-red-glow);"></div>
        </div>
      </div>

      <!-- Node progress Bar -->
      <div>
        <div style="display:flex; justify-content:space-between; font-size:0.8rem; font-weight:bold; margin-bottom:4px;">
          <span>🏆 ซ่อมแซมจุดเสียหายสำเร็จ</span>
          <span style="color:var(--neon-emerald);">${repairedCount}/${totalNodesCount} ด่าน</span>
        </div>
        <div style="width:100%; height:8px; background:rgba(255, 255, 255, 0.05); border-radius:4px; border:1px solid var(--border-light); overflow:hidden;">
          <div style="width:${progressPercent}%; height:100%; background:linear-gradient(to right, var(--neon-emerald), #10b981); box-shadow: 0 0 5px var(--neon-emerald-glow);"></div>
        </div>
      </div>
      
      <!-- Detailed nodes status -->
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 6px; margin: 4px 0;">
        ${nodesHTML}
      </div>
      
      <!-- Class Stats Summary -->
      <div style="background:rgba(0,0,0,0.3); border:1px solid var(--border-light); padding:10px; border-radius:8px; display:grid; grid-template-columns:1fr 1fr; gap:8px; font-size:0.8rem;">
        <div>คะแนนสะสม: <strong style="color:var(--neon-cyan);">${scoreObj.score}</strong></div>
        <div>ตอบถูกเฉลี่ย: <strong style="color:var(--neon-emerald);">${accuracy}%</strong></div>
        <div>ตอบถูกทั้งหมด: <strong style="color:var(--neon-emerald);">${scoreObj.correct} ข้อ</strong></div>
        <div>ตอบผิดทั้งหมด: <strong style="color:var(--neon-red);">${scoreObj.wrong} ข้อ</strong></div>
      </div>
      
      <!-- Actions buttons -->
      <div style="display:flex; gap:10px; margin-top:auto; border-top:1px solid var(--border-light); padding-top:12px;">
        <button class="btn-neon" style="flex:1; padding:6px 12px; font-size:0.8rem; ${isActive ? 'opacity:0.6; cursor:not-allowed;' : ''}" ${isActive ? 'disabled' : ''} onclick="window.activateGradeFromDashboard('${g}')">
          🎯 เลือกใช้สอนระดับนี้
        </button>
        <button class="btn-neon btn-neon-red" style="padding:6px 12px; font-size:0.8rem;" onclick="window.resetSingleGradeFromDashboard('${g}')">
          🔄 รีเซ็ตสถิติ
        </button>
      </div>
    `;
    
    container.appendChild(card);
  });
}

window.activateGradeFromDashboard = function(grade) {
  window.SoundFX.playBeep(880, 0.2);
  
  const settings = window.App.getSystemSettings();
  settings.activeGrade = grade;
  window.App.saveSystemSettings(settings);
  
  localStorage.setItem("sci_quest_level_confirmed", "true");
  
  // รีเซ็ตสถานะชั่วคราว Co-op
  localStorage.setItem("sci_quest_game_phase", "map");
  localStorage.setItem("sci_quest_active_node", "");
  localStorage.setItem("sci_quest_active_votes", JSON.stringify({}));
  localStorage.setItem("sci_quest_student_responses", JSON.stringify({}));
  
  window.dispatchEvent(new CustomEvent("settings-changed", { detail: settings }));
  window.dispatchEvent(new CustomEvent("phase-changed", { detail: "map" }));
  
  window.App.showToast(`🎯 สลับระดับชั้นการสอนเป็น: ${grade.toUpperCase()} และนำทางไปหน้าเกมแล้ว!`);
  
  // สลับไปหน้าต่างโปรเจกเตอร์ฉายทันที
  window.App.showView("projector-view");
};

window.resetSingleGradeFromDashboard = function(grade) {
  if (confirm(`คุณครูแน่ใจหรือไม่ที่จะล้างผลการทำโจทย์และสถิติทั้งหมดของระดับชั้น ${grade.toUpperCase()}?`)) {
    window.SoundFX.playAlarm();
    
    const modulesKey = `sci_quest_modules_${grade}`;
    const scoreKey = `sci_quest_student_score_${grade}`;
    
    const DEFAULT_MODULE_STATES = {
      node1: { repaired: false, key: "node1", label: "ด่าน 1: เตาปฏิกรณ์เริ่มต้น", bossName: "หุ่นยนต์ไมโครจิ๋ว", subject: "ฟิสิกส์ & พลังงาน", status: "unlocked" },
      node2: { repaired: false, key: "node2", label: "ด่าน 2: เครื่องกำเนิดไฟฟ้าหลัก", bossName: "หุ่นยนต์ไฟฟ้าเทอร์โบ", subject: "ฟิสิกส์ & ไฟฟ้า", status: "locked" },
      node3: { repaired: false, key: "node3", label: "ด่าน 3: ท่อน้ำกรดรั่วไหล", bossName: "ดรอปเคมีกัดกร่อน", subject: "เคมี & สารละลาย", status: "locked" },
      node4: { repaired: false, key: "node4", label: "ด่าน 4: ห้องแล็บแยกสารเคมี", bossName: "อสุรกายกรดพิษเขียว", subject: "เคมี & ของเหลว", status: "locked" },
      node5: { repaired: false, key: "node5", label: "ด่าน 5: สวนกระจกพฤกษาชั้นนอก", bossName: "เถาหนามมรณะ", subject: "ระบบนิเวศ & พืช", status: "locked" },
      node6: { repaired: false, key: "node6", label: "ด่าน 6: ป่าชื้นมรณะ", bossName: "อสูรพฤกษาเพชฌฆาต", subject: "ระบบนิเวศ & พืช", status: "locked" },
      node7: { repaired: false, key: "node7", label: "ด่าน 7: ตู้เก็บตัวอย่างวัคซีน", bossName: "เซลล์กลายพันธุ์", subject: "เซลล์ & สิ่งมีชีวิต", status: "locked" },
      node8: { repaired: false, key: "node8", label: "ด่าน 8: ศูนย์พันธุวิศวกรรม", bossName: "ไวรัสนาโนกลายพันธุ์", subject: "เซลล์ & พันธุกรรม", status: "locked" },
      node9: { repaired: false, key: "node9", label: "ด่าน 9: จานส่งสัญญาณดาวเทียม", bossName: "อสุรกายขยะอวกาศ", subject: "ดาราศาสตร์ & คลื่น", status: "locked" },
      node10: { repaired: false, key: "node10", label: "ด่าน 10: ห้องบังคับการสะพานยาน", bossName: "โกเลมอุกกาบาตอัคคี", subject: "โลก & ดาราศาสตร์", status: "locked" }
    };
    const DEFAULT_STUDENT_SCORE = {
      score: 0,
      correct: 0,
      wrong: 0,
      hp: 100,
      maxHp: 100
    };
    
    localStorage.setItem(modulesKey, JSON.stringify(DEFAULT_MODULE_STATES));
    localStorage.setItem(scoreKey, JSON.stringify(DEFAULT_STUDENT_SCORE));
    
    const activeSettings = window.App.getSystemSettings();
    if (activeSettings.activeGrade === grade) {
      localStorage.setItem("sci_quest_game_phase", "map");
      localStorage.setItem("sci_quest_active_node", "");
      localStorage.setItem("sci_quest_active_votes", JSON.stringify({}));
      localStorage.setItem("sci_quest_student_responses", JSON.stringify({}));
      window.dispatchEvent(new CustomEvent("phase-changed", { detail: "map" }));
    }
    
    window.dispatchEvent(new CustomEvent("modules-changed", { detail: DEFAULT_MODULE_STATES }));
    window.dispatchEvent(new CustomEvent("score-changed", { detail: DEFAULT_STUDENT_SCORE }));
    
    window.App.showToast(`🔄 รีเซ็ตความก้าวหน้าของระดับชั้น ${grade.toUpperCase()} สำเร็จ`, true);
    renderClassProgress();
  }
};

window.resetAllGradesProgress = function() {
  if (confirm("คุณครูต้องการล้างสถิติและความสำเร็จของวิชาวิทยาศาสตร์ห้องเรียน 'ทุกระดับชั้นเรียน (ป.4 - ม.3)' หรือไม่?")) {
    window.SoundFX.playAlarm();
    
    const grades = ["p4", "p5", "p6", "m1", "m2", "m3"];
    const DEFAULT_MODULE_STATES = {
      node1: { repaired: false, key: "node1", label: "ด่าน 1: เตาปฏิกรณ์เริ่มต้น", bossName: "หุ่นยนต์ไมโครจิ๋ว", subject: "ฟิสิกส์ & พลังงาน", status: "unlocked" },
      node2: { repaired: false, key: "node2", label: "ด่าน 2: เครื่องกำเนิดไฟฟ้าหลัก", bossName: "หุ่นยนต์ไฟฟ้าเทอร์โบ", subject: "ฟิสิกส์ & ไฟฟ้า", status: "locked" },
      node3: { repaired: false, key: "node3", label: "ด่าน 3: ท่อน้ำกรดรั่วไหล", bossName: "ดรอปเคมีกัดกร่อน", subject: "เคมี & สารละลาย", status: "locked" },
      node4: { repaired: false, key: "node4", label: "ด่าน 4: ห้องแล็บแยกสารเคมี", bossName: "อสุรกายกรดพิษเขียว", subject: "เคมี & ของเหลว", status: "locked" },
      node5: { repaired: false, key: "node5", label: "ด่าน 5: สวนกระจกพฤกษาชั้นนอก", bossName: "เถาหนามมรณะ", subject: "ระบบนิเวศ & พืช", status: "locked" },
      node6: { repaired: false, key: "node6", label: "ด่าน 6: ป่าชื้นมรณะ", bossName: "อสูรพฤกษาเพชฌฆาต", subject: "ระบบนิเวศ & พืช", status: "locked" },
      node7: { repaired: false, key: "node7", label: "ด่าน 7: ตู้เก็บตัวอย่างวัคซีน", bossName: "เซลล์กลายพันธุ์", subject: "เซลล์ & สิ่งมีชีวิต", status: "locked" },
      node8: { repaired: false, key: "node8", label: "ด่าน 8: ศูนย์พันธุวิศวกรรม", bossName: "ไวรัสนาโนกลายพันธุ์", subject: "เซลล์ & พันธุกรรม", status: "locked" },
      node9: { repaired: false, key: "node9", label: "ด่าน 9: จานส่งสัญญาณดาวเทียม", bossName: "อสุรกายขยะอวกาศ", subject: "ดาราศาสตร์ & คลื่น", status: "locked" },
      node10: { repaired: false, key: "node10", label: "ด่าน 10: ห้องบังคับการสะพานยาน", bossName: "โกเลมอุกกาบาตอัคคี", subject: "โลก & ดาราศาสตร์", status: "locked" }
    };
    const DEFAULT_STUDENT_SCORE = {
      score: 0,
      correct: 0,
      wrong: 0,
      hp: 100,
      maxHp: 100
    };
    
    grades.forEach(g => {
      const modulesKey = `sci_quest_modules_${g}`;
      const scoreKey = `sci_quest_student_score_${g}`;
      localStorage.setItem(modulesKey, JSON.stringify(DEFAULT_MODULE_STATES));
      localStorage.setItem(scoreKey, JSON.stringify(DEFAULT_STUDENT_SCORE));
    });
    
    localStorage.setItem("sci_quest_game_phase", "map");
    localStorage.setItem("sci_quest_active_node", "");
    localStorage.setItem("sci_quest_active_votes", JSON.stringify({}));
    localStorage.setItem("sci_quest_student_responses", JSON.stringify({}));
    localStorage.setItem("sci_quest_student_list", JSON.stringify([]));
    localStorage.setItem("sci_quest_level_confirmed", "false");
    
    const settings = window.App.getSystemSettings();
    settings.activeGrade = "p4";
    window.App.saveSystemSettings(settings);
    
    window.dispatchEvent(new CustomEvent("settings-changed", { detail: settings }));
    window.dispatchEvent(new CustomEvent("phase-changed", { detail: "map" }));
    window.dispatchEvent(new CustomEvent("game-reset"));
    
    window.App.showToast("🔄 รีเซ็ตสถิติห้องเรียนวิทย์ทุกระดับชั้นเรียบร้อยแล้ว", true);
    renderClassProgress();
  }
};

// รอหน้าจอพร้อม
document.addEventListener("DOMContentLoaded", function() {
  initTeacherDashboard();
});
