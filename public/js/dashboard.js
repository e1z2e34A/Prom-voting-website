const ctx = document.getElementById("voteChart");

new Chart(ctx, {
  type: "bar",

  data: {
    labels: ["MR PDSSA", "MISS PDSSA", "BEST DRESSED"],

    datasets: [
      {
        label: "Votes",

        data: [12, 18, 9],

        backgroundColor: ["#FFD700", "#00C2FF", "#FF5C8A"],

        borderRadius: 10,
      },
    ],
  },

  options: {
    responsive: true,

    plugins: {
      legend: {
        display: false,
      },
    },

    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

function showAddCategory() {
  document.getElementById("categoryForm").style.display = "block";

  document.getElementById("candidateForm").style.display = "none";
}

function showAddCandidate() {
  document.getElementById("candidateForm").style.display = "block";

  document.getElementById("categoryForm").style.display = "none";
}

async function addCategory() {
  const name = document.getElementById("newCategory").value.trim();

  if (!name) {
    alert("Please enter a category name.");
    return;
  }

  try {
    const response = await fetch("/categories", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        name,
      }),
    });

    const result = await response.json();

    if (result.success) {
      alert("✅ Category added successfully!");
      loadDashboardStats();

      document.getElementById("newCategory").value = "";

      //   loadDashboard();
      loadCategoryDropdown();
    } else {
      alert(result.message);
    }
  } catch (err) {
    console.error(err);

    alert("Unable to add category.");
  }
}
async function loadCategoryDropdown() {
  const select = document.getElementById("candidateCategory");

  const response = await fetch("/categories");

  const categories = await response.json();

  select.innerHTML = "";

  categories.forEach((category) => {
    select.innerHTML += `
            <option value="${category.name}">
                ${category.name}
            </option>
        `;
  });
}

loadCategoryDropdown();

async function addCandidate() {
  const name = document.getElementById("candidateName").value.trim();
  const studentClass = document.getElementById("candidateClass").value.trim();
  const category = document.getElementById("candidateCategory").value;

  if (!name || !studentClass || !category) {
    alert("Please complete all fields.");
    return;
  }

  try {
    const response = await fetch("/candidates", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        class: studentClass,
        category: category,
      }),
    });

    const result = await response.json();

    if (result.success) {
      alert("✅ Candidate added successfully!");

      document.getElementById("candidateName").value = "";
      document.getElementById("candidateClass").value = "";

      loadCandidatesTable();
      loadDashboardStats();
    } else {
      alert(result.message);
    }
  } catch (err) {
    console.error(err);

    alert("Unable to add candidate.");
  }
}

async function loadCandidatesTable() {
  const table = document.getElementById("candidateTable");

  const response = await fetch("/candidates");

  const candidates = await response.json();

  table.innerHTML = "";

  candidates.forEach((candidate) => {
    table.innerHTML += `

        <tr>

            <td>${candidate.name}</td>

            <td>${candidate.class}</td>

            <td>${candidate.category}</td>

            <td>

                <button>Edit</button>

                <button>Delete</button>

            </td>

        </tr>

        `;
  });
}

loadCandidatesTable();

const dashboardSection = document.getElementById("dashboardSection");
const categorySection = document.getElementById("categorySection");
const candidateSection = document.getElementById("candidateSection");
const resultsSection = document.getElementById("resultsSection");
const settingsSection = document.getElementById("settingsSection");

function hideAllSections() {
  dashboardSection.style.display = "none";
  categorySection.style.display = "none";
  candidateSection.style.display = "none";
  resultsSection.style.display = "none";

  if (settingsSection) settingsSection.style.display = "none";
}

document.getElementById("dashboardBtn").onclick = () => {
  hideAllSections();

  dashboardSection.style.display = "block";
};

document.getElementById("categoriesBtn").onclick = () => {
  hideAllSections();

  categorySection.style.display = "block";
};

document.getElementById("candidatesBtn").onclick = () => {
  hideAllSections();

  candidateSection.style.display = "block";
};

document.getElementById("resultsBtn").onclick = () => {
  hideAllSections();

  resultsSection.style.display = "block";
};

document.getElementById("settingsBtn").onclick = () => {
  hideAllSections();

  if (settingsSection) settingsSection.style.display = "block";
};

// ================================
// Load Candidate Table
// ================================

async function loadCandidatesTable() {
  const table = document.getElementById("candidateTable");

  try {
    const response = await fetch("/candidates");

    const candidates = await response.json();

    table.innerHTML = "";

    candidates.forEach((candidate) => {
      table.innerHTML += `
                <tr>
                    <td>${candidate.name}</td>
                    <td>${candidate.class}</td>
                    <td>${candidate.category}</td>
                    <td>
                    <button onclick="editCandidate(
'${candidate._id}',
'${candidate.name}',
'${candidate.class}',
'${candidate.category}'
)"> Edit </button>

                        <button onclick="deleteCandidate('${candidate._id}')">
                            Delete
                        </button>
                    </td>
                </tr>
            `;
    });
  } catch (err) {
    console.error(err);
  }
}

loadCandidatesTable();

// ================================
// Delete Candidate
// ================================

async function deleteCandidate(id) {
  const confirmDelete = confirm(
    "Are you sure you want to delete this candidate?",
  );

  if (!confirmDelete) return;

  try {
    const response = await fetch(`/candidates/${id}`, {
      method: "DELETE",
    });

    const result = await response.json();

    if (result.success) {
      alert("✅ Candidate deleted successfully!");

      loadCandidatesTable();
      loadDashboardStats();
    } else {
      alert(result.message);
    }
  } catch (err) {
    console.error(err);

    alert("Unable to delete candidate.");
  }
}

async function editCandidate(id, oldName, oldClass, oldCategory) {
  const name = prompt("Candidate Name:", oldName);

  if (name === null) return;

  const studentClass = prompt("Class:", oldClass);

  if (studentClass === null) return;

  const category = prompt("Category:", oldCategory);

  if (category === null) return;

  try {
    const response = await fetch(`/candidates/${id}`, {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        name,

        class: studentClass,

        category,
      }),
    });

    const result = await response.json();

    if (result.success) {
      alert("✅ Candidate updated!");

      loadCandidatesTable();
    }
  } catch (err) {
    console.error(err);

    alert("Unable to update candidate.");
  }
}

// ================================
// Load Dashboard Statistics
// ================================

async function loadDashboardStats() {
  try {
    const response = await fetch("/dashboard/stats");

    const stats = await response.json();

    document.getElementById("totalCategories").textContent =
      stats.totalCategories;

    document.getElementById("totalCandidates").textContent =
      stats.totalCandidates;

    document.getElementById("totalVotes").textContent = stats.totalVotes;
  } catch (err) {
    console.error(err);
  }
}

loadDashboardStats();

// ================================
// Load Election Results
// ================================

async function loadResults() {
  const container = document.getElementById("resultsContainer");

  try {
    const response = await fetch("/dashboard/results");

    const data = await response.json();

    container.innerHTML = "";

    let currentCategory = "";

    let position = 1;

    data.forEach((result) => {
      if (currentCategory !== result._id.category) {
        currentCategory = result._id.category;

        position = 1;

        container.innerHTML += `

                    <div class="result-category">

                        <h2>🏆 ${currentCategory}</h2>

                    </div>

                `;
      }

      let medal = "";

      if (position === 1) medal = "🥇";
      else if (position === 2) medal = "🥈";
      else if (position === 3) medal = "🥉";
      else medal = "⭐";

      container.innerHTML += `

                <div class="result-card">

                    <div>

                        <strong>${medal} ${result._id.candidate}</strong>

                    </div>

                    <div class="rest_vote">

                        ${result.votes} Vote${result.votes > 1 ? "s" : ""}

                    </div>

                </div>

            `;

      position++;
    });
  } catch (err) {
    console.error(err);
  }
}

loadResults();
