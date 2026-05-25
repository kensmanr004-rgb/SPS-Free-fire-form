// script.js

// ════════════════════════════════════════════════
//  วาง URL Apps Script ของคุณตรงนี้
// ════════════════════════════════════════════════
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycby0e_65BKQdSUGuUrpiwQ4LZ01fiE0SDJSsh1u2gPzvnFRNB8yVlnscRDdGIaZW_nTC/exec";
// ════════════════════════════════════════════════

function toggleSub() {
  const btn  = document.getElementById("toggleBtn");
  const wrap = document.getElementById("subWrap");
  const text = document.getElementById("tText");
  const isOpen = wrap.classList.toggle("open");
  btn.classList.toggle("active", isOpen);
  text.textContent = isOpen
    ? "ซ่อนข้อมูลตัวสำรอง"
    : "เพิ่มข้อมูลตัวสำรอง (ไม่บังคับ)";
}

function val(id) {
  return (document.getElementById(id)?.value ?? "").trim();
}

function clearErrors() {
  document.querySelectorAll(".err").forEach(el => el.classList.remove("show"));
  document.querySelectorAll("input").forEach(el => el.classList.remove("has-error"));
}

function showFieldError(id) {
  const input = document.getElementById(id);
  const err   = document.getElementById("err-" + id);
  if (input) input.classList.add("has-error");
  if (err)   err.classList.add("show");
}

function validate() {
  clearErrors();
  const required = ["teamName","name1","room1","name2","room2","name3","room3","name4","room4"];
  let first = null;
  for (const id of required) {
    if (!val(id)) {
      showFieldError(id);
      if (!first) first = id;
    }
  }
  if (first) {
    document.getElementById(first)?.scrollIntoView({ behavior: "smooth", block: "center" });
    return false;
  }
  return true;
}

function resetForm() {
  document.querySelectorAll("input[type='text']").forEach(el => el.value = "");
  clearErrors();
  document.getElementById("subWrap")?.classList.remove("open");
  document.getElementById("toggleBtn")?.classList.remove("active");
  document.getElementById("tText").textContent = "เพิ่มข้อมูลตัวสำรอง (ไม่บังคับ)";
}

async function submitForm() {
  if (!SCRIPT_URL || SCRIPT_URL === "YOUR_APPS_SCRIPT_URL_HERE") {
    showAlert("error", "⚠ ยังไม่ได้วาง SCRIPT_URL — เปิดไฟล์ script.js แล้วแก้บรรทัดแรก");
    return;
  }
  if (!validate()) return;

  const btn = document.getElementById("submitBtn");
  const txt = document.getElementById("btnText");
  btn.classList.add("loading");
  btn.disabled = true;
  txt.textContent = "กำลังส่งข้อมูล...";
  hideAlerts();

  const payload = {
    teamName: val("teamName"),
    name1: val("name1"), room1: val("room1"),
    name2: val("name2"), room2: val("room2"),
    name3: val("name3"), room3: val("room3"),
    name4: val("name4"), room4: val("room4"),
    sub1:  val("sub1"),  subRoom1: val("subRoom1"),
    sub2:  val("sub2"),  subRoom2: val("subRoom2"),
  };

  try {
    await fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    document.getElementById("okTeam").textContent = `ทีม "${payload.teamName}"`;
    showAlert("success");
    resetForm();
  } catch (err) {
    showAlert("error", "ส่งข้อมูลไม่สำเร็จ กรุณาตรวจสอบ SCRIPT_URL");
    console.error(err);
  } finally {
    btn.classList.remove("loading");
    btn.disabled = false;
    txt.textContent = "🔥 ยืนยันการสมัคร";
  }
}

function showAlert(type, msg = "") {
  hideAlerts();
  if (type === "success") {
    document.getElementById("alertOk").classList.add("show");
  } else {
    if (msg) document.getElementById("errMsg").textContent = msg;
    document.getElementById("alertErr").classList.add("show");
  }
}

function hideAlerts() {
  document.getElementById("alertOk")?.classList.remove("show");
  document.getElementById("alertErr")?.classList.remove("show");
}