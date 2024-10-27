UPDATED VERSION OF THE GLOBAL SEARCH SYSTEM SETTING FORMER

INSTRUCTION:

1. Place the files into any directory in your local PC
2. Open index.html file (this will open the page in the browser)
3. Input the needed object name (code, like UsrAccountTest) into the "Input object name to process" field (for example we need to modify the system setting value for the "Product" object then we need to specify "Product" in the field).
4. Copy the current value of the "GlobalSearchIndexedDataConfig" system setting into the "GlobalSearchIndexedDataConfig original value:" field.
   IMPORTANT!!: backup the current value somewhere, for example paste it into the "Description" column of the system setting in the application of the customer.
5. Open the metadata of the needed object from the "Custom" package (or from the last package in the hierarchy).
6. Copy the value from the "Metadata (Read-Only)" section of the metadata.
7. Paste the value from step 6 into the "Paste metadata (read-only) here:" field.
8. Specify columns that shouldn't be included to the system setting in the "Columns that should be left:" columns using a comma separator (example: UsrTest1, UsrTest2, UsrTest3). If the column value is empty - "Id" and "Name" columns won't be added to the result system setting by default.
9. Hit the "Process" button.
10. Wait for the value to appear in the "Result:" field.
11. Verify the received value from step 9 in the site link to which is provided in the "Please validate the result using this link" message.
12. Use the value from the "Result:" field as a new value for the "GlobalSearchIndexedDataConfig" system setting (but don't forget to modify it in accordance with the customer's requirements to the list of columns that should remain in the setting).
13. You can also use the "Copy" button to copy the content of the "Result:" field to the clipboard.

IMPROVEMENTS:

1. There is no need to manually modify the existing "GlobalSearchIndexedDataConfig" system setting value (string itself, not the system setting value in the customer's application). The utility will do it automatically.
2. If the "Input object name to process" field has empty spaces left by accident before or after the text that is input - the utility will remove it.
3. Verification link is added to the utility.

PLANS FOR ADDITIONAL IMPROVEMENTS:

1. Add additional fields where cookies container can be pasted so that the value for the system setting in the customer's app would be automatically updated once the "Process" button is pressed.
