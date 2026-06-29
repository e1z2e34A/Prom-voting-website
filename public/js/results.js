const resultsContainer = document.getElementById("resultsContainer");

async function loadResults() {
  try {
    const response = await fetch("/vote/results");

    const data = await response.json();

    resultsContainer.innerHTML = "";

    // Group by category
    const groupedResults = {};

    data.forEach((item) => {
      const category = item._id.category;

      if (!groupedResults[category]) {
        groupedResults[category] = [];
      }

      groupedResults[category].push(item);
    });

    // Display each category
    for (const category in groupedResults) {
      const section = document.createElement("div");
      section.className = "category";

      section.innerHTML = `
                <h2>${category}</h2>
            `;

      groupedResults[category].forEach((candidate, index) => {
        let medal = "";

        if (index === 0) medal = "🥇";
        else if (index === 1) medal = "🥈";
        else if (index === 2) medal = "🥉";

        section.innerHTML += `
                    <div class="result">
                        <span>${medal} ${candidate._id.candidate}</span>
                        <strong>${candidate.votes} Vote${candidate.votes > 1 ? "s" : ""}</strong>
                    </div>
                `;
      });

      resultsContainer.appendChild(section);
    }
  } catch (err) {
    console.error(err);

    resultsContainer.innerHTML = `
            <h3>Unable to load results.</h3>
        `;
  }
}

loadResults();

// Refresh every 10 seconds
setInterval(loadResults, 10000);
