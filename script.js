async function loadModel() {
  try {
    const response = await fetch("http://127.0.0.1:8080/phishing_model.json");
      console.log("Response:", response); // Log the response object
      const modelParams = await response.json();
      console.log("Model params:", modelParams); // Log the parsed JSON data
      return modelParams;
  } catch (error) {
      console.error("Error loading the model parameters:", error);
      return null;
  }
}

// Custom hashing function to convert URL and feature to decimal value
function hashCode(str) {
  var hash = 0;
  if (str.length == 0) {
      return hash;
  }
  for (var i = 0; i < str.length; i++) {
      var char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
  }
  return hash;

}

// Custom function to get the feature value using hashCode
function getFeatureValue(url, feature) {
  // Combine URL and feature for hashing
  const combinedValue = url + feature;
  return hashCode(combinedValue);
  
}

console.log("Calling getFeatureValue");

function predictPhishing(url, node) {
  // Base case: if the node is a target_class, return the prediction
  if ("target_class" in node) {
      return node.target_class;
  }

  const feature = node.feature;
  const threshold = node.threshold;

 // Get the feature value using the custom function
 const featureValue = getFeatureValue(url, feature);
 

  // Traverse the tree based on the feature value and threshold
  if (featureValue <= threshold) {
      return predictPhishing(url, node.left);
  } else {
      return predictPhishing(url, node.right);
  }
}

document.getElementById("checkButton").addEventListener("click", async () => {
  const url = document.getElementById("url").value;

  const modelParams = await loadModel();

  if (modelParams) {
      const prediction = predictPhishing(url, modelParams);

      const resultElement = document.getElementById("result");
      if (prediction === "phishing") {
          resultElement.innerText = "This URL is likely phishing!";
      } else {
          resultElement.innerText = "This URL is safe.";
      }
  } else {
      const resultElement = document.getElementById("result");
      resultElement.innerText = "Model parameters couldn't be loaded. Please try again later.";
  }
});