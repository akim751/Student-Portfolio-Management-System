const $ = (id) => document.getElementById(id);
let mode = "login";
let portfolio = null;

function showMessage(id, message, isError = false) {
  const el = $(id);
  el.textContent = message || "";
  el.style.color = isError ? "#b91c1c" : "#2563eb";
}

async function api(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    credentials: "same-origin"
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Something went wrong.");
  return data;
}

function setMode(nextMode) {
  mode = nextMode;
  $("loginTab").classList.toggle("active", mode === "login");
  $("registerTab").classList.toggle("active", mode === "register");
  $("nameLabel").classList.toggle("hidden", mode !== "register");
  $("name").required = mode === "register";
  $("authTitle").textContent = mode === "login" ? "Welcome back" : "Create your account";
  $("authSubmit").textContent = mode === "login" ? "Login" : "Register";
  showMessage("authMessage", "");
}

$("loginTab").addEventListener("click", () => setMode("login"));
$("registerTab").addEventListener("click", () => setMode("register"));

$("authForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const body = {
    name: $("name").value.trim(),
    email: $("email").value.trim(),
    password: $("password").value
  };
  try {
    const result = await api(`/api/auth/${mode}`, { method: "POST", body: JSON.stringify(body) });
    showMessage("authMessage", result.message);
    await loadPortfolio();
  } catch (error) {
    showMessage("authMessage", error.message, true);
  }
});

$("logoutBtn").addEventListener("click", async () => {
  try {
    await api("/api/auth/logout", { method: "POST" });
    portfolio = null;
    $("appSection").classList.add("hidden");
    $("authSection").classList.remove("hidden");
    $("logoutBtn").classList.add("hidden");
    $("authForm").reset();
    setMode("login");
  } catch (error) {
    showMessage("appMessage", error.message, true);
  }
});

async function loadPortfolio() {
  const result = await api("/api/portfolio");
  portfolio = result.student;
  $("authSection").classList.add("hidden");
  $("appSection").classList.remove("hidden");
  $("logoutBtn").classList.remove("hidden");
  render();
}

function render() {
  if (!portfolio) return;
  $("welcomeName").textContent = `Hello, ${portfolio.name}`;
  $("profileName").value = portfolio.name || "";
  $("headline").value = portfolio.headline || "";
  $("phone").value = portfolio.phone || "";
  $("location").value = portfolio.location || "";
  $("about").value = portfolio.about || "";
  $("projectCount").textContent = portfolio.projects.length;
  $("skillCount").textContent = portfolio.skills.length;
  $("achievementCount").textContent = portfolio.achievements.length;

  $("educationList").innerHTML = portfolio.education.map(item => `
    <div class="item"><div><strong>${escapeHtml(item.qualification)} — ${escapeHtml(item.institution)}</strong><small>${escapeHtml(item.year)} · ${escapeHtml(item.grade)}</small></div>
    <div class="item-actions"><button data-delete-education="${item._id}">Delete</button></div></div>`).join("") || "<small>No education records added yet.</small>";

  $("skillsList").innerHTML = portfolio.skills.map((skill, index) =>
    `<span class="chip">${escapeHtml(skill)} <button title="Remove skill" data-delete-skill="${index}">×</button></span>`
  ).join("") || "<small>No skills added yet.</small>";

  $("projectsList").innerHTML = portfolio.projects.map(item => `
    <div class="item"><div><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.technologies)}<br>${escapeHtml(item.description)}</small></div>
    <div class="item-actions"><button data-edit-project="${item._id}">Edit</button><button data-delete-project="${item._id}">Delete</button></div></div>`).join("") || "<small>No projects added yet.</small>";

  $("achievementsList").innerHTML = portfolio.achievements.map(item => `
    <div class="item"><div><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.date)} · ${escapeHtml(item.description)}</small></div>
    <div class="item-actions"><button data-edit-achievement="${item._id}">Edit</button><button data-delete-achievement="${item._id}">Delete</button></div></div>`).join("") || "<small>No achievements added yet.</small>";
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[char]);
}

$("profileForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    await api("/api/portfolio/profile", { method: "PUT", body: JSON.stringify({
      name: $("profileName").value.trim(), headline: $("headline").value.trim(),
      phone: $("phone").value.trim(), location: $("location").value.trim(), about: $("about").value.trim()
    })});
    await loadPortfolio();
    showMessage("appMessage", "Profile saved successfully.");
  } catch (error) { showMessage("appMessage", error.message, true); }
});

$("educationForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    await api("/api/portfolio/education", { method: "POST", body: JSON.stringify({
      qualification: $("eduQualification").value.trim(), institution: $("eduInstitution").value.trim(),
      year: $("eduYear").value.trim(), grade: $("eduGrade").value.trim()
    })});
    $("educationForm").reset(); await loadPortfolio(); showMessage("appMessage", "Education added.");
  } catch (error) { showMessage("appMessage", error.message, true); }
});

$("skillForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    await api("/api/portfolio/skills", { method: "POST", body: JSON.stringify({ skill: $("skillInput").value.trim() })});
    $("skillForm").reset(); await loadPortfolio(); showMessage("appMessage", "Skill added.");
  } catch (error) { showMessage("appMessage", error.message, true); }
});

$("projectForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    await api("/api/portfolio/projects", { method: "POST", body: JSON.stringify({
      title: $("projectTitle").value.trim(), technologies: $("projectTech").value.trim(),
      description: $("projectDescription").value.trim(), link: $("projectLink").value.trim()
    })});
    $("projectForm").reset(); await loadPortfolio(); showMessage("appMessage", "Project added.");
  } catch (error) { showMessage("appMessage", error.message, true); }
});

$("achievementForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    await api("/api/portfolio/achievements", { method: "POST", body: JSON.stringify({
      title: $("achievementTitle").value.trim(), date: $("achievementDate").value.trim(),
      description: $("achievementDescription").value.trim()
    })});
    $("achievementForm").reset(); await loadPortfolio(); showMessage("appMessage", "Achievement added.");
  } catch (error) { showMessage("appMessage", error.message, true); }
});

document.addEventListener("click", async (event) => {
  const target = event.target;
  try {
    if (target.dataset.deleteEducation) {
      await api(`/api/portfolio/education/${target.dataset.deleteEducation}`, { method: "DELETE" });
      await loadPortfolio(); showMessage("appMessage", "Education deleted.");
    }
    if (target.dataset.deleteSkill !== undefined) {
      await api(`/api/portfolio/skills/${target.dataset.deleteSkill}`, { method: "DELETE" });
      await loadPortfolio(); showMessage("appMessage", "Skill deleted.");
    }
    if (target.dataset.deleteProject) {
      await api(`/api/portfolio/projects/${target.dataset.deleteProject}`, { method: "DELETE" });
      await loadPortfolio(); showMessage("appMessage", "Project deleted.");
    }
    if (target.dataset.deleteAchievement) {
      await api(`/api/portfolio/achievements/${target.dataset.deleteAchievement}`, { method: "DELETE" });
      await loadPortfolio(); showMessage("appMessage", "Achievement deleted.");
    }
    if (target.dataset.editProject) {
      const item = portfolio.projects.find(x => x._id === target.dataset.editProject);
      const title = prompt("Project title:", item.title);
      if (title === null) return;
      const description = prompt("Project description:", item.description || "");
      const technologies = prompt("Technologies:", item.technologies || "");
      await api(`/api/portfolio/projects/${item._id}`, { method: "PUT", body: JSON.stringify({ title, description, technologies }) });
      await loadPortfolio(); showMessage("appMessage", "Project updated.");
    }
    if (target.dataset.editAchievement) {
      const item = portfolio.achievements.find(x => x._id === target.dataset.editAchievement);
      const title = prompt("Achievement title:", item.title);
      if (title === null) return;
      const description = prompt("Description:", item.description || "");
      const date = prompt("Date:", item.date || "");
      await api(`/api/portfolio/achievements/${item._id}`, { method: "PUT", body: JSON.stringify({ title, description, date }) });
      await loadPortfolio(); showMessage("appMessage", "Achievement updated.");
    }
  } catch (error) { showMessage("appMessage", error.message, true); }
});

(async function checkExistingLogin() {
  try { await loadPortfolio(); } catch (_) { /* User is not logged in yet. */ }
})();
