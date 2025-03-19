document.addEventListener("DOMContentLoaded", function () {
    const recipeList = document.getElementById("recipe-list");
    const searchInput = document.getElementById("search");

    fetch(`recipes/index.json?v=${Date.now()}`)
        .then(response => response.json())
        .then(files => {
            const recipePromises = files.map(file =>
                fetch(`recipes/${file}?v=${Date.now()}`).then(response => response.json())
            );

            Promise.all(recipePromises).then(recipes => {
                function displayRecipes(filter = "") {
                    recipeList.innerHTML = "";
                    recipes
                        .filter(recipe => {
                            const nameMatch = recipe.name.toLowerCase().includes(filter.toLowerCase());
                            const tagMatch = recipe.tags.some(tag => tag.toLowerCase().includes(filter.toLowerCase()));
                            return nameMatch || tagMatch;
                        })
                        .forEach(recipe => {
                            let recipeCard = document.createElement("div");
                            recipeCard.classList.add("recipe-card");
                            recipeCard.innerHTML = `
                                <h2>${recipe.name}</h2>
                                <p><strong>Tags:</strong> ${recipe.tags.join(", ")}</p>
                                <p><strong>Prep Time:</strong> ${recipe.prep_time}</p>
                                <p><strong>Cook Time:</strong> ${recipe.cook_time}</p>
                                <p><strong>Servings:</strong> ${recipe.servings}</p>
                                <a href="recipe.html?name=${encodeURIComponent(recipe.name)}">View Recipe</a>
                            `;
                            recipeList.appendChild(recipeCard);
                        });
                }

                searchInput.addEventListener("input", () => {
                    displayRecipes(searchInput.value);
                });

                displayRecipes();
            });
        });
});
