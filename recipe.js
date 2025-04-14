document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const recipeName = params.get("name");
    const darkModeToggle = document.getElementById("dark-mode-toggle");
    const body = document.body;

    // Check saved theme preference
    if (localStorage.getItem("darkMode") === "enabled") {
        body.classList.add("dark-mode");
        darkModeToggle.innerHTML = `<i class="fa-solid fa-sun"></i> Light Mode`;
    }

    // Toggle dark mode
    darkModeToggle.addEventListener("click", function () {
        body.classList.toggle("dark-mode");

        if (body.classList.contains("dark-mode")) {
            localStorage.setItem("darkMode", "enabled");
            darkModeToggle.innerHTML = `<i class="fa-solid fa-sun"></i> Light Mode`;
        } else {
            localStorage.setItem("darkMode", "disabled");
            darkModeToggle.innerHTML = `<i class="fa-solid fa-moon"></i> Dark Mode`;
        }
    });

    fetch("recipes/index.json?v=" + Date.now())
        .then(response => response.json())
        .then(files => {
            const filePromises = files.map(file =>
                fetch(`recipes/${file}?v=${Date.now()}`).then(response => response.json())
            );

            Promise.all(filePromises).then(recipes => {
                const recipe = recipes.find(r => r.name === recipeName);
                if (!recipe) {
                    document.getElementById("recipe-details").innerHTML = "<p>Recipe not found.</p>";
                    return;
                }

                let detailsHTML = `<h1><i class="fa-solid fa-utensils"></i> ${recipe.name}</h1>`;

                // Display tags
                if (recipe.tags && recipe.tags.length) {
                    detailsHTML += `<p><strong><i class="fa-solid fa-tags"></i> Tags:</strong> ${recipe.tags.join(", ")}</p>`;
                }

                // Display cooking details
                detailsHTML += `<p><strong><i class="fa-solid fa-users"></i> Servings:</strong> ${recipe.servings}</p>`;
                if (recipe.prep_time) detailsHTML += `<p><strong><i class="fa-solid fa-clock"></i> Prep Time:</strong> ${recipe.prep_time}</p>`;
                if (recipe.rest_time) detailsHTML += `<p><strong><i class="fa-solid fa-clock"></i> Rest Time:</strong> ${recipe.rest_time}</p>`;
                if (recipe.cook_time) detailsHTML += `<p><strong><i class="fa-solid fa-fire"></i> Cook Time:</strong> ${recipe.cook_time}</p>`;
                if (recipe.chill_time) detailsHTML += `<p><strong><i class="fa-solid fa-snowflake"></i> Chill Time:</strong> ${recipe.chill_time}</p>`;
				
				// Display Equipment
				if (recipe.equipment) {
					detailsHTML += "<h2><i class='fa-solid fa-toolbox'></i> Equipment</h2>";
					if (recipe.equipment.required && recipe.equipment.required.length > 0) {
						detailsHTML += "<h4>Required</h4><ul>";
						detailsHTML += recipe.equipment.required.map(item => `<li>${item}</li>`).join("");
						detailsHTML += "</ul>";
					}
					if (recipe.equipment.optional && recipe.equipment.optional.length > 0) {
						detailsHTML += "<h4>Optional</h4><ul>";
						detailsHTML += recipe.equipment.optional.map(item => `<li>${item}</li>`).join("");
						detailsHTML += "</ul>";
					}
				}

                // Display Ingredients
                if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
                    detailsHTML += "<h2><i class='fa-solid fa-list'></i> Ingredients</h2><ul>";
                    detailsHTML += recipe.ingredients.map(ing => {
						const gramsText = (ing.grams !== null && ing.grams !== undefined) ? ` (${ing.grams}g)` : "";
						return `<li>${ing.amount}${gramsText} - ${ing.ingredient}</li>`;
					}).join("");
                    detailsHTML += "</ul>";
                }

                // Display Instructions
                if (recipe.instructions && Array.isArray(recipe.instructions)) {
                    detailsHTML += "<h2><i class='fa-solid fa-book'></i> Instructions</h2><ol>";
                    detailsHTML += recipe.instructions.map(step => `<li>${step}</li>`).join("");
                    detailsHTML += "</ol>";
                }

                // Display Storage Tips
                if (recipe.storage_tips) {
                    detailsHTML += "<h2><i class='fa-solid fa-box'></i> Storage Tips</h2>";
                    for (const [key, value] of Object.entries(recipe.storage_tips)) {
                        detailsHTML += `<p><strong>${key.replace("_", " ")}:</strong> ${value}</p>`;
                    }
                }

                document.getElementById("recipe-details").innerHTML = detailsHTML;
            });
        });
});
