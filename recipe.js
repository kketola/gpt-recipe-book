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
                if (!recipe) return;

                const details = document.getElementById("recipe-details");
                details.innerHTML = `
                    <h1>${recipe.name}</h1>
                    <p><strong>Tags:</strong> ${recipe.tags.join(", ")}</p>
                    <h2>Ingredients</h2>
                    <ul>${recipe.ingredients.map(ing => 
    			`<li>${ing.amount} (${ing.grams}g) - ${ing.ingredient}</li>`).join("")}
                    </ul>
                    <h2>Instructions</h2>
                    <ol>${recipe.instructions.map(step => `<li>${step}</li>`).join("")}</ol>
                    <h2>Storage Tips</h2>
                    <p><strong>Room Temperature:</strong> ${recipe.storage_tips.room_temp}</p>
                    <p><strong>Freezing Dough:</strong> ${recipe.storage_tips.freezing_dough}</p>
                    <p><strong>Freezing Cookies:</strong> ${recipe.storage_tips.freezing_cookies}</p>
                `;
            });
        });
});
