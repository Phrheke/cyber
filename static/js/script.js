document.addEventListener("DOMContentLoaded", () => {
    const scenarioSelector = document.getElementById("scenario-selector");
    const layers = document.querySelectorAll(".layer");
    const descriptionText = document.getElementById("description-text");
    const descriptionContainer = document.querySelector(".description");

    let currentScenario = "";
    let activeLayer = null; // Track the active (clicked) layer

    // Function to fetch and apply scenario data
    const fetchScenarioData = (scenario) => {
        fetch("/get_scenario_data", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ risk: scenario }),
        })
            .then((response) => response.json())
            .then((data) => {
                // Update layer descriptions
                layers.forEach((layer) => {
                    layer.dataset.description = data[layer.dataset.layer] || "No description available.";
                });

                // Reset description text
                descriptionText.textContent = "Select a layer to view details.";
            })
            .catch((error) => {
                console.error("Error fetching scenario data:", error);
                descriptionText.textContent = "An error occurred while fetching the data.";
            });
    };

    // Initial load with general pyramid
    fetchScenarioData("");

    // Handle scenario selection
    scenarioSelector.addEventListener("change", () => {
        currentScenario = scenarioSelector.value;
        fetchScenarioData(currentScenario);
    });

    // Define the original colors for each layer
    const originalColors = {
        foundation: "linear-gradient(45deg, #4CAF50, #81C784)", // Green gradient
        core: "linear-gradient(45deg, #FF9800, #FFB74D)", // Orange gradient
        adaptation: "linear-gradient(45deg, #2196F3, #64B5F6)", // Blue gradient
        integration: "linear-gradient(45deg, #9C27B0, #CE93D8)", // Purple gradient
        resilience: "linear-gradient(45deg, #F44336, #E57373)", // Red gradient
    };

    layers.forEach((layer) => {
        layer.addEventListener("click", () => {
            // Only show the description for the clicked layer if it's not the same as the last clicked one
            if (activeLayer !== layer) {
                // Reset all layers to their original styles
                layers.forEach((l) => {
                    l.style.backgroundImage = originalColors[l.dataset.layer]; // Reset background gradient
                    l.style.color = "white"; // Reset text color to white
                    l.classList.remove("selected"); // Remove "selected" class from all layers
                });

                // Highlight only the selected layer
                layer.style.backgroundImage = "linear-gradient(45deg, #ddd, #aaa)"; // Highlight with a new gradient
                layer.style.color = "black"; // Set text color to black for the clicked layer
                layer.classList.add("selected"); // Add "selected" class to the clicked layer

                // Show the description
                descriptionText.textContent = layer.dataset.description || "No description available.";
                descriptionContainer.style.backgroundImage = originalColors[layer.dataset.layer]; // Change description background gradient
                descriptionText.style.color = "white"; // Change text color to white

                // Position description next to the clicked layer
                descriptionContainer.style.position = "absolute"; // Position the description next to the layer
                descriptionContainer.style.top = `${layer.getBoundingClientRect().top}px`; // Align with the top of the layer
                descriptionContainer.style.left = `${layer.getBoundingClientRect().right + 10}px`; // Position to the right of the layer
                descriptionContainer.style.display = "block"; // Show the description container

                // Update the active layer
                activeLayer = layer;
            }
        });

        // Add hover effect to show description text next to the layer while it's hovered
        layer.addEventListener("mouseenter", () => {
            if (!activeLayer) {
                descriptionText.textContent = layer.dataset.description || "No description available.";
                descriptionContainer.style.backgroundImage = originalColors[layer.dataset.layer]; // Update background gradient
                descriptionContainer.style.position = "absolute"; // Position the description next to the layer
                descriptionContainer.style.top = `${layer.getBoundingClientRect().top}px`; // Align with the top of the layer
                descriptionContainer.style.left = `${layer.getBoundingClientRect().right + 10}px`; // Position to the right of the layer
                descriptionContainer.style.display = "block"; // Show the description container
            }
        });

        // Keep description visible on click but hide on mouse leave if no active layer
        layer.addEventListener("mouseleave", () => {
            if (activeLayer !== layer) {
                descriptionContainer.style.display = "none"; // Hide the description container when mouse leaves
            }
        });
    });

    // Close description on a new layer click or reset if no layer clicked
    descriptionContainer.addEventListener("click", () => {
        activeLayer = null;
        descriptionContainer.style.display = "none"; // Hide description when clicking outside
    });
});
