document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const recipeName = params.get("name");

    fetch("recipes/index.json")
        .then(response => response.json())
        .then(files => {
            const filePromises = files.map(file =>
                fetch(`recipes/${file}`).then(response => response.json())
            );

            Promise.all(filePromises).then(recipes => {
                const recipe = recipes.find(r => r.name === recipeName);
                if (!recipe) {
                    document.getElementById("recipe-details").innerHTML = "<p>Recipe not found.</p>";
                    return;
                }

                let detailsHTML = `<h1>${recipe.name}</h1>`;

                // Display tags (if available)
                if (recipe.tags && recipe.tags.length) {
                    detailsHTML += `<p><strong>Tags:</strong> ${recipe.tags.join(", ")}</p>`;
                }

                // Display cooking details
                detailsHTML += `<p><strong>Servings:</strong> ${recipe.servings}</p>`;
                if (recipe.prep_time) detailsHTML += `<p><strong>Prep Time:</strong> ${recipe.prep_time}</p>`;
                if (recipe.cook_time) detailsHTML += `<p><strong>Cook Time:</strong> ${recipe.cook_time}</p>`;
                if (recipe.chill_time) detailsHTML += `<p><strong>Chill Time:</strong> ${recipe.chill_time}</p>`;

                // Display Ingredients
                if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
                    detailsHTML += "<h2>Ingredients</h2><ul>";
                    detailsHTML += recipe.ingredients.map(ing => 
                        `<li>${ing.amount} (${ing.grams}g) - ${ing.ingredient}</li>`
                    ).join("");
                    detailsHTML += "</ul>";
                }

                // Display Instructions
                if (recipe.instructions && Array.isArray(recipe.instructions)) {
                    detailsHTML += "<h2>Instructions</h2><ol>";
                    detailsHTML += recipe.instructions.map(step => `<li>${step}</li>`).join("");
                    detailsHTML += "</ol>";
                }

                // Display Storage Tips (Only if they exist)
                if (recipe.storage_tips) {
                    detailsHTML += "<h2>Storage Tips</h2>";
                    for (const [key, value] of Object.entries(recipe.storage_tips)) {
                        detailsHTML += `<p><strong>${key.replace("_", " ")}:</strong> ${value}</p>`;
                    }
                }

                document.getElementById("recipe-details").innerHTML = detailsHTML;
            });
        });
});
