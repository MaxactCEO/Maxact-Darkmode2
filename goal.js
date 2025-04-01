document.addEventListener("DOMContentLoaded", function() {
    const goalForm = document.getElementById("goalForm");
    const calorieResult = document.getElementById("calorieResult");
    const savedResultsContent = document.getElementById("savedResultsContent");
    const editGoalButton = document.getElementById("editGoalButton");
    const deleteGoalButton = document.getElementById("deleteGoalButton");

    goalForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const currentWeight = parseFloat(document.getElementById("currentWeight").value);
        const desiredWeight = parseFloat(document.getElementById("desiredWeight").value);
        const goal = document.getElementById("goal").value;
        const timeFrame = parseFloat(document.getElementById("timeFrame").value);
        const today = new Date().toISOString().split("T")[0];

        let dailyCalories = 0;
        const weightDifference = desiredWeight - currentWeight;
        const totalCaloriesNeeded = weightDifference * 7700; // 1 kg fett motsvarar cirka 7700 kalorier
        const dailyCalorieChange = totalCaloriesNeeded / (timeFrame * 7); // Fördela över antal dagar

        if (goal === "GåUpp") {
            dailyCalories = 2500 + dailyCalorieChange; // Basalbehov + extra kalorier
        } else if (goal === "GåNer") {
            dailyCalories = 2500 - dailyCalorieChange; // Basalbehov - kalorier
        } else {
            dailyCalories = 2500; // Basalbehov för att behålla vikten
        }

        const resultText = `Du behöver äta ${dailyCalories.toFixed(2)} kalorier per dag för att nå ditt mål.`;
        calorieResult.textContent = resultText;

        const savedResult = {
            currentWeight,
            desiredWeight,
            dailyCalories: dailyCalories.toFixed(2),
            date: today
        };

        saveResult(savedResult);
        renderSavedResults();
        toggleFormVisibility(false);
    });

    function saveResult(result) {
        localStorage.setItem('savedResult', JSON.stringify(result));
    }

    function renderSavedResults() {
        const savedResult = JSON.parse(localStorage.getItem('savedResult'));
        if (savedResult) {
            savedResultsContent.innerHTML = `
                <div class="result-box full-width">
                    <h3>Kalorier per dag</h3>
                    <p>${savedResult.dailyCalories} kcal</p>
                </div>
                <div class="result-box-container">
                    <div class="result-box half-width">
                        <h3>Nuvarande vikt</h3>
                        <p>${savedResult.currentWeight} kg</p>
                    </div>
                    <div class="result-box half-width">
                        <h3>Målvikt</h3>
                        <p>${savedResult.desiredWeight} kg</p>
                    </div>
                </div>
                <p>Datum: ${savedResult.date}</p>
            `;
            toggleFormVisibility(false);
        } else {
            savedResultsContent.innerHTML = '';
            toggleFormVisibility(true);
        }
    }

    function toggleFormVisibility(showForm) {
        goalForm.style.display = showForm ? 'block' : 'none';
        editGoalButton.style.display = showForm ? 'none' : 'block';
        deleteGoalButton.style.display = showForm ? 'none' : 'block';
    }

    editGoalButton.addEventListener("click", function() {
        const savedResult = JSON.parse(localStorage.getItem('savedResult'));
        if (savedResult) {
            document.getElementById("currentWeight").value = savedResult.currentWeight;
            document.getElementById("desiredWeight").value = savedResult.desiredWeight;
            document.getElementById("goal").value = savedResult.goal;
            document.getElementById("timeFrame").value = savedResult.timeFrame;
            toggleFormVisibility(true);
        }
    });

    deleteGoalButton.addEventListener("click", function() {
        localStorage.removeItem('savedResult');
        renderSavedResults();
    });

    renderSavedResults();
});
