document.addEventListener("DOMContentLoaded", function() {
    const calorieCountElement = document.getElementById("calorieCount");
    const burnedCalorieCountElement = document.getElementById("burnedCalorieCount");
    const netCalorieCountElement = document.getElementById("netCalorieCount");
    const remainingCalorieCountElement = document.getElementById("remainingCalorieCount");
    const remainingCaloriesTextElement = document.getElementById("remainingCaloriesText");
    const remainingCaloriesChartElement = document.getElementById("remainingCaloriesChart").getContext('2d');
    const recentHabits = JSON.parse(localStorage.getItem('recentHabits')) || [];
    const savedResult = JSON.parse(localStorage.getItem('savedResult'));
    const today = new Date().toISOString().split("T")[0];

    let totalCalories = 0;
    let totalBurnedCalories = 0;

    recentHabits.forEach(habit => {
        if (habit.Kategori === "Kost" && habit.Datum === today) {
            totalCalories += parseInt(habit.Kalorier, 10) || 0;
        }
        if (habit.Kategori === "Träning" && habit.Datum === today) {
            totalBurnedCalories += parseInt(habit["Brända Kalorier"], 10) || 0;
        }
        if (habit.Kategori === "Dryck" && habit.Datum === today) {
            totalCalories += parseInt(habit.Kalorier, 10) || 0;
        }
        if (habit.Kategori === "Fotbollsträning" && habit.Datum === today) {
            totalBurnedCalories += parseInt(habit["Brända Kalorier"], 10) || 0;
        }
        if (habit.Kategori === "Fysisk aktivitet" && habit.Datum === today) {
            totalBurnedCalories += parseInt(habit["Brända Kalorier"], 10) || 0;
        }
    });

    const netCalories = totalCalories - totalBurnedCalories;
    const remainingCalories = savedResult ? savedResult.dailyCalories - totalCalories : 0;
    const consumedCaloriesPercentage = savedResult ? (totalCalories / savedResult.dailyCalories) * 100 : 0;
    const remainingCaloriesPercentage = 100 - consumedCaloriesPercentage;

    calorieCountElement.textContent = `${totalCalories} kcal`;
    burnedCalorieCountElement.textContent = `${totalBurnedCalories} kcal`;
    netCalorieCountElement.textContent = `${netCalories} kcal`;
    remainingCaloriesTextElement.textContent = `${Math.round(remainingCalories)} kcal`; // Round to nearest integer

    new Chart(remainingCaloriesChartElement, {
        type: 'doughnut',
        data: {
            labels: ['Kvarvarande Kalorier', 'Förbrukade Kalorier'],
            datasets: [{
                data: [remainingCaloriesPercentage, consumedCaloriesPercentage],
                backgroundColor: ['#171946', '#b7e659'], // Updated colors to match the dark theme
                hoverBackgroundColor: ['#171946', '#b7e659'], // Updated hover colors to match the dark theme
                borderWidth: 1 // Remove the border line
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
});
