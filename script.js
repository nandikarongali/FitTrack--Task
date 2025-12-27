const activityName = document.getElementById("activity-name");
const activitySteps = document.getElementById("activity-steps");
const addBtn = document.getElementById("add-activity");
const activitiesList = document.getElementById("activities");
const progressFill = document.getElementById("progress-fill");
const progressText = document.getElementById("progress-text");
const toggleTheme = document.getElementById("toggle-theme");
const badgeSection = document.getElementById("badge-section");

let barChart, pieChart, lineChart, doughnutChart;
let activities = JSON.parse(localStorage.getItem("activities")) || [];

// Render activities list
function renderActivities() {
  activitiesList.innerHTML = "";
  activities.forEach((act, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${act.name} - ${act.steps} steps</span>
      <div>
        <button class="complete" onclick="completeActivity(${index})">✔</button>
        <button class="edit" onclick="editActivity(${index})">✏</button>
        <button class="delete" onclick="deleteActivity(${index})">🗑</button>
      </div>
    `;
    if (act.completed) li.style.textDecoration = "line-through";
    activitiesList.appendChild(li);
  });
  updateProgress();
  renderCharts();
}

// Add new activity
function addActivity() {
  if (activityName.value.trim() && activitySteps.value.trim()) {
    activities.push({
      name: activityName.value.trim(),
      steps: parseInt(activitySteps.value.trim()),
      completed: false
    });
    localStorage.setItem("activities", JSON.stringify(activities));
    activityName.value = "";
    activitySteps.value = "";
    renderActivities();
  } else {
    alert("Please enter both activity name and steps!");
  }
}

// Delete activity
function deleteActivity(index) {
  activities.splice(index, 1);
  localStorage.setItem("activities", JSON.stringify(activities));
  renderActivities();
}

// Edit activity
function editActivity(index) {
  const newName = prompt("Edit activity name:", activities[index].name);
  const newSteps = prompt("Edit steps:", activities[index].steps);
  if (newName && newSteps) {
    activities[index].name = newName;
    activities[index].steps = parseInt(newSteps);
    localStorage.setItem("activities", JSON.stringify(activities));
    renderActivities();
  }
}

// Mark activity complete
function completeActivity(index) {
  activities[index].completed = !activities[index].completed;
  localStorage.setItem("activities", JSON.stringify(activities));
  renderActivities();
}

// Update progress bar and badges
function updateProgress() {
  const total = activities.length;
  const completed = activities.filter(act => act.completed).length;
  const percent = total ? Math.round((completed / total) * 100) : 0;
  progressFill.style.width = percent + "%";
  progressText.textContent = `${percent}% Completed`;

  // Achievement badges
  badgeSection.innerHTML = "";
  if (completed >= 1 && completed < 3) {
    badgeSection.innerHTML = "🏅 Fitness Enthusiast Badge!";
  } else if (completed >= 3) {
    badgeSection.innerHTML = "🥇 Fitness Champion Badge!";
  }
}

// Render charts
function renderCharts() {
  const labels = activities.map(a => a.name);
  const steps = activities.map(a => a.steps);
  const completedCount = activities.filter(a => a.completed).length;
  const pendingCount = activities.length - completedCount;

  // Destroy old charts
  if (barChart) barChart.destroy();
  if (pieChart) pieChart.destroy();
  if (lineChart) lineChart.destroy();
  if (doughnutChart) doughnutChart.destroy();

  if (activities.length === 0) return; // avoid empty chart errors

  // Bar Chart (balanced colors)
  barChart = new Chart(document.getElementById("barChart"), {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Steps/Reps",
        data: steps,
        backgroundColor: ["#2196F3", "#FF9800", "#9C27B0", "#26A69A", "#FFC107"]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Steps per Activity"
        }
      }
    }
  });

  // Line Chart (blue accent)
  lineChart = new Chart(document.getElementById("lineChart"), {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Progress Trend",
        data: activities.map(a => a.completed ? 1 : 0),
        borderColor: "#42A5F5",
        fill: false
      }]
    },
    options: {
      aspectRatio: 1.2,
      plugins: {
        title: {
          display: true,
          text: "Completion Trend"
        }
      }
    }
  });

  // Pie Chart (blue + orange)
  pieChart = new Chart(document.getElementById("pieChart"), {
    type: "pie",
    data: {
      labels: ["Completed", "Pending"],
      datasets: [{
        data: [completedCount, pendingCount],
        backgroundColor: ["#42A5F5", "#FF7043"]
      }]
    },
    options: {
      aspectRatio: 1.1,
      plugins: {
        title: {
          display: true,
          text: "Completion Status"
        }
      }
    }
  });

  // Doughnut Chart (multi-color palette)
  doughnutChart = new Chart(document.getElementById("doughnutChart"), {
    type: "doughnut",
    data: {
      labels,
      datasets: [{
        data: steps,
        backgroundColor: ["#42A5F5", "#FF7043", "#9C27B0", "#26A69A", "#FFC107"]
      }]
    },
    options: {
      aspectRatio: 1.1,
      plugins: {
        title: {
          display: true,
          text: "Activity Distribution"
        }
      }
    }
  });
}

// Dark/Light Mode Toggle
toggleTheme.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// Event Listener
addBtn.addEventListener("click", addActivity);

// Initial Render
renderActivities();