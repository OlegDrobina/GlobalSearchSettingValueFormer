function processReceivedObject() {
  const passedString = document.getElementById("metadataBody").value;
  const isJsonValue = isJson(passedString);
  if (isJsonValue) {
    internalStartProcessing(passedString);
  } else {
    alert("Valid JSON should be provided");
  }
}

function isJson(item) {
  let value = typeof item !== "string" ? JSON.stringify(item) : item;
  try {
    value = JSON.parse(value);
  } catch (e) {
    return false;
  }

  return typeof value === "object" && value !== null;
}

function internalStartProcessing(passedString) {
  const passedStringJson = JSON.parse(passedString);
  const hasValidProperties = internalCheckForProperties(passedStringJson);
  if (hasValidProperties) {
    internalExecute(passedStringJson);
  } else {
    alert('Something is wrong with the string. It has no "Columns" property');
  }
}

function internalCheckForProperties(passedStringJson) {
  return passedStringJson?.MetaData?.Schema?.hasOwnProperty("Columns");
}

function internalExecute(passedStringJson) {
  const columnObjectsArray = passedStringJson.MetaData.Schema.Columns;
  let columnNames = columnObjectsArray
    .map(function (item) {
      return item.Name;
    })
    .filter(excludeIdNameColumns);
  const columnNamesJoined = `"${columnNames.join('","')}"`;
  document.getElementById("resultBody").value = columnNamesJoined;
}

function excludeIdNameColumns(passedArrayElement) {
  if (passedArrayElement == "Id" || passedArrayElement == "Name") {
    return false;
  }
  return true;
}
