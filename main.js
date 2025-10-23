document.addEventListener("DOMContentLoaded", (event) => {
  const processDataButtonEl = document.getElementById("processInputData");
  const copyDataButtonEl = document.getElementById("copyProcessedData");
  if (processDataButtonEl) {
    processDataButtonEl.addEventListener("click", (event) => {
      event.stopPropagation();
      processReceivedData();
    });
  }
  if (copyDataButtonEl) {
    copyDataButtonEl.addEventListener("click", function (event) {
      event.stopPropagation();
      const resultBodyEl = document.getElementById("resultBody");
      navigator.clipboard.writeText(resultBodyEl.value);
    });
  }
});

function processReceivedData() {
  const isObjectNameValid = validateReceivedObjectName();
  const isSysSettingValueValid = validateReceivedSysSettingValue();
  const isMetaDataValid = validateReceivedMetaData();
  let validationMessage = "";
  if (
    isObjectNameValid !== true ||
    isSysSettingValueValid !== true ||
    isMetaDataValid != true
  ) {
    validationMessage = formValidationMessage(
      isObjectNameValid,
      isSysSettingValueValid,
      isMetaDataValid
    );
    alert(validationMessage);
  } else {
    internalProcess();
  }
}

function formValidationMessage(
  isObjectNameValid,
  isSysSettingValueValid,
  isMetaDataValid
) {
  let errorMessage = "";
  if (isObjectNameValid != true) {
    errorMessage = isObjectNameValid;
  } else if (isSysSettingValueValid != true) {
    errorMessage = isSysSettingValueValid;
  } else {
    errorMessage = isMetaDataValid;
  }
  return errorMessage;
}

// Validators region start

//  Process received object name start (entityName tag)
function validateReceivedObjectName() {
  const receivedObjectName = getInputObjectName();
  const isObjectNameFilledIn = verifyObjectNameFilledIn(receivedObjectName);
  return isObjectNameFilledIn ? true : "Object name is empty";
}

function getInputObjectName() {
  const objectNameEl = document.getElementById("entityName");
  const objectNameVal = objectNameEl?.value.trim();
  return objectNameVal;
}

function verifyObjectNameFilledIn(objectName) {
  return objectName?.trim()?.length !== 0;
}
//  Process received object name end (entityName tag)

//  Process received system setting value start (gsSettingOriginalVal tag)

function validateReceivedSysSettingValue() {
  const sysSettingValue = getSysSettingOrigValue();
  const beautifiedValue = beautifyPassedSysSettingValue(sysSettingValue);
  const isValidSysSettingValue = verifySysSettingOrigValue(beautifiedValue);
  return isValidSysSettingValue;
}

function getSysSettingOrigValue() {
  const sysSettingOrigValueEl = document.getElementById("gsSettingOriginalVal");
  const sysSettingValue = sysSettingOrigValueEl.value;
  return sysSettingValue;
}

function beautifyPassedSysSettingValue(value) {
  let beautifiedValue = value.replaceAll("\t", "");
  beautifiedValue = beautifiedValue.replaceAll(
    "IgnoredColumns",
    '"IgnoredColumns"'
  );
  return beautifiedValue;
}

function verifySysSettingOrigValue(sysSettingValue) {
  return isJson(sysSettingValue)
    ? true
    : "Provided SysSettingValue is not a valid JSON";
}

//  Process received system setting value end (gsSettingOriginalVal tag)

// Process received metadata start (metadataBody tag)

function validateReceivedMetaData() {
  const metaDataValue = getReceivedMetaData();
  const isValidMetaData = verifyReceivedMetaData(metaDataValue);
  return isValidMetaData;
}

function getReceivedMetaData() {
  const metadataBodyEl = document.getElementById("metadataBody");
  const passedString = metadataBodyEl.value;
  return passedString;
}

function verifyReceivedMetaData(metaDataValue) {
  return isJson(metaDataValue)
    ? verifyMetaDataColumnsProp(metaDataValue)
    : "Provided metadata is not a JSON string";
}

function verifyMetaDataColumnsProp(metaDataValue) {
  const metaDataValueJSON = JSON.parse(metaDataValue);
  return metaDataValueJSON.MetaData?.Schema?.hasOwnProperty("Columns")
    ? true
    : 'Provided metadata has no "Columns" property';
}

// Process received metadata end (metadataBody tag)

/*
  Checks if the passed value is a JSON string or not
**/
function isJson(item) {
  let value = typeof item !== "string" ? JSON.stringify(item) : item;
  try {
    value = JSON.parse(value);
  } catch (e) {
    return false;
  }

  return typeof value === "object" && value !== null;
}

//Validators region end

function internalProcess() {
  const passedObjectName = getInputObjectName();

  const passedSysSettingValue = getSysSettingOrigValue();
  const processedSysSettingValue = beautifyPassedSysSettingValue(
    passedSysSettingValue
  );
  const processedSysSettingValueObj = JSON.parse(processedSysSettingValue);

  const passedMetaData = getReceivedMetaData();
  const processedMetaDataValueObj = JSON.parse(passedMetaData);

  const ignoreColumnNames = formIgnoredColumns(processedMetaDataValueObj);
  const resultSysSettingValueJSON = checkIfObjectExistsInTheSetting(
    passedObjectName,
    processedSysSettingValueObj
  )
    ? addIngoredColumnsIntoObjectProperty(
        passedObjectName,
        processedSysSettingValueObj,
        ignoreColumnNames
      )
    : createProperyInSysSettingValue(
        passedObjectName,
        processedSysSettingValueObj,
        ignoreColumnNames
      );

  const resultSysSettingValue = JSON.stringify(resultSysSettingValueJSON);
  document.getElementById("resultBody").value = resultSysSettingValue;
}

function checkIfObjectExistsInTheSetting(objectName, sysSettingValue) {
  return sysSettingValue.hasOwnProperty(objectName);
}

function addIngoredColumnsIntoObjectProperty(
  objectName,
  sysSettingValue,
  ignoredColumns
) {
  sysSettingValue[objectName].IgnoredColumns = ignoredColumns;
  return sysSettingValue;
}

function createProperyInSysSettingValue(
  objectName,
  sysSettingValue,
  ignoredColumns
) {
  sysSettingValue[objectName] = {};
  sysSettingValue[objectName].IgnoredColumns = ignoredColumns;
  return sysSettingValue;
}

function formIgnoredColumns(passedObj) {
  const columnObjectsArray = passedObj.MetaData.Schema.Columns;
  const columnNames = columnObjectsArray
    .map((item) => item.Name)
    .filter(ignoredColumnsFiltration);
  return columnNames;
}

function getIgnoredColumns() {
  const ignoredColumnsEl = document.getElementById("columnsToBeLeft");
  const ignoredColumns = ignoredColumnsEl.value;
  return ignoredColumns;
}

function getHasIgnoredColumns() {
  const ignoredColumns = getIgnoredColumns();
  return ignoredColumns.length != 0;
}

function ignoredColumnsFiltration(item) {
  if (getHasIgnoredColumns()) {
    const ignoredColumns = getIgnoredColumns();
    return item != "Id" && item != "Name" && !ignoredColumns.includes(item);
  } else {
    return item != "Id" && item != "Name";
  }
}
