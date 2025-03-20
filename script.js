document.addEventListener("DOMContentLoaded", function () {
    const recipeList = document.getElementById("recipe-list");
    const searchInput = document.getElementById("search");
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
                            recipeCard.classList.add("recipe-card", "p-3");

                            recipeCard.innerHTML = `
                                <h2><i class="fa-solid fa-utensils icon"></i> ${recipe.name}</h2>
                                <p><strong><i class="fa-solid fa-tags icon"></i> Tags:</strong> ${recipe.tags.join(", ")}</p>
                                <p><strong><i class="fa-solid fa-clock icon"></i> Prep Time:</strong> ${recipe.prep_time}</p>
                                <p><strong><i class="fa-solid fa-clock icon"></i> Rest Time:</strong> ${recipe.rest_time || "None"}</p>
                                <p><strong><i class="fa-solid fa-fire icon"></i> Cook Time:</strong> ${recipe.cook_time}</p>
                                <p><strong><i class="fa-solid fa-users icon"></i> Servings:</strong> ${recipe.servings}</p>
                                <a href="recipe.html?name=${encodeURIComponent(recipe.name)}"><i class="fa-solid fa-book-open icon"></i> View Recipe</a>
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