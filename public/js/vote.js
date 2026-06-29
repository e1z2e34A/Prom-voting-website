const categorySelect = document.getElementById("category");
const candidateContainer = document.getElementById("candidateContainer");

// ==========================
// Load Categories
// ==========================
async function loadCategories() {
  try {
    const response = await fetch("/categories");

    if (!response.ok) {
      throw new Error("Failed to load categories");
    }

    const categories = await response.json();

    categorySelect.innerHTML = `
            <option value="">Choose Category</option>
        `;

    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.name;
      option.textContent = category.name;
      categorySelect.appendChild(option);
    });
  } catch (error) {
    console.error(error);
    alert("Unable to load categories.");
  }
}

// ==========================
// Load Candidates
// ==========================
async function loadCandidates() {
  candidateContainer.innerHTML = "";

  const selectedCategory = categorySelect.value;

  if (!selectedCategory) return;

  try {
    const response = await fetch(
      `/candidates/${encodeURIComponent(selectedCategory)}`,
    );

    if (!response.ok) {
      throw new Error("Failed to load candidates");
    }

    const candidates = await response.json();

    if (candidates.length === 0) {
      candidateContainer.innerHTML = `
                <h3>No candidates found in this category.</h3>
            `;
      return;
    }

    candidates.forEach((candidate) => {
      const card = document.createElement("div");

      card.className = "candidate-card";

      card.innerHTML = `
                <h2>${candidate.name}</h2>
                <p>${candidate.class}</p>

<button onclick="vote('${candidate.category}','${candidate.name}')">
    Vote
</button>
            `;

      candidateContainer.appendChild(card);
    });
  } catch (error) {
    console.error(error);

    candidateContainer.innerHTML = `
            <h3>Failed to load candidates.</h3>
        `;
  }
}

async function vote(category, candidate) {
  // Check if this category has already been voted
  if (localStorage.getItem(category) === "voted") {
    alert("❌ You have already voted in this category.");
    return;
  }

  try {
    const response = await fetch("/vote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        category,
        candidate,
      }),
    });

    const result = await response.json();

    if (result.success) {
      // Save that this category has been voted
      localStorage.setItem(category, "voted");

      alert(`✅ Your vote for "${candidate}" has been recorded successfully!`);

      // Remove the category from the dropdown
      categorySelect.querySelector(`option[value="${category}"]`)?.remove();

      // Reset the page
      categorySelect.value = "";
      candidateContainer.innerHTML = "";
    } else {
      alert(result.message);
    }
  } catch (err) {
    console.error(err);

    alert("An error occurred while voting.");
  }
}

// ==========================
// Event Listener
// ==========================
categorySelect.addEventListener("change", loadCandidates);

// ==========================
// Start App
// ==========================
loadCategories();
