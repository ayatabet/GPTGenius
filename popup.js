var openDB = async () => {
  return new Promise((resolve, reject) => {
    var request = window.indexedDB.open("PromptDB", 1);

    request.onerror = (event) => {
      reject(`Error opening database: ${event.target.errorCode}`);
    };

    request.onsuccess = (event) => {
      var db = event.target.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      const objectStore = db.createObjectStore("Prompts", { keyPath: "id", autoIncrement: true});
      
      objectStore.createIndex("newprompt", "newprompt", { unique: false });
      objectStore.createIndex("category", "category", { unique: false });
      
      const objectStore1 = db.createObjectStore("Favorites", { keyPath: "id", autoIncrement: true});
      
      objectStore1.createIndex("fave", "fave", { unique: true });
      objectStore1.createIndex("category", "category", { unique: false });
      
      const objectStore2 = db.createObjectStore("Categories", { keyPath: "id", autoIncrement: true});
      objectStore2.createIndex("category", "category", { unique:true });
    };
  });
};

  //save prompts
  var insertData = async () => {
    const db = await openDB();
    const transaction = db.transaction(["Prompts"], "readwrite");
    const objectStore = transaction.objectStore("Prompts");
    
    const newprompt = document.getElementById("newprompt").value;
    const category = document.getElementById("categories").value;
    
    const data = { newprompt, category };
    const request = objectStore.add(data);
    
    request.onsuccess = () => {
      console.log("Data inserted successfully!");
    };    
    request.onerror = (event) => {
      console.error(`Error inserting data: ${event.target.error}`);
    };
};
  
  //create Categories
  var createCategory = async () => {
    const db = await openDB();
    const transaction = db.transaction(["Categories"], "readwrite");
    const objectStore = transaction.objectStore("Categories");
    
    const category = document.getElementById("category").value;
  
    const data = { category };
    const request = objectStore.add(data);
  
    request.onsuccess = () => {
      console.log("Data inserted successfully!");
    };
  
    request.onerror = (event) => {
      console.error(`Error inserting data: ${event.target.error}`);
    };
  };
  
  //update prompts
  var updateData = async () => {
    const db = await openDB();
    const transaction = db.transaction(["Prompts"], "readwrite");
    const objectStore = transaction.objectStore("Prompts");
    
    const newprompt = document.getElementById("manage").value;
    const category = document.getElementById("categories").value;
     
    const data = { newprompt, category };
  
    // Get the existing record by username
    const getRequest = objectStore.index("newprompt").get(category);
  
    getRequest.onsuccess = (event) => {
      const existingData = event.target.result;
  
      if (existingData) {
        // Update the existing record with the new data
        existingData.newprompt = data.newprompt;
  
        // Use put without specifying the key to update the record
        const updateRequest = objectStore.put(existingData);
  
        updateRequest.onsuccess = () => {
          console.log("Data updated successfully!");
        };
  
        updateRequest.onerror = (event) => {
          console.error(`Error updating data: ${event.target.error}`);
        };
      } else {
        console.error("Record not found for Prompts:", newprompt);
      }
    };
  
    getRequest.onerror = (event) => {
      console.error(`Error getting data for prompt ${newprompt}: ${event.target.error}`);
    };
  };
  
  //delete prompts
  var deletePrompt = async () => {
    const db = await openDB();
  const transaction = db.transaction(["Prompts"], "readwrite");
  const objectStore = transaction.objectStore("Prompts");
  
  const newprompt = document.getElementById("manage").value;
  const category = document.getElementById("categories").value;
  
  if (!newprompt.trim()) {
                alert("Please enter a prompt to delete.");
                return;
            }
  const index = objectStore.index("newprompt");
  const getRequest = index.getKey(newprompt);

  getRequest.onsuccess = function(event) {
      const key = event.target.result;
      if (key !== undefined) {
          // If key is found, delete the record
          const deleteRequest = objectStore.delete(key);
          deleteRequest.onsuccess = function(event) {
              console.log("Record deleted successfully");
          };
          deleteRequest.onerror = function(event) {
              console.error("Error deleting record: " + event.target.errorCode);
          };
      } else {
          console.log("Record not found");
      }
  };
  getRequest.onerror = function(event) {
      console.error("Error finding record: " + event.target.errorCode);
  };
  };
  
  
  var deleteCategory = async () => {
    const db = await openDB();
    const transaction = db.transaction(["Categories"], "readwrite");
    const objectStore = transaction.objectStore("Categories");
    const index = objectStore.index("category");

     var select = document.getElementById("categories");
            var selectedCategory = select.options[select.selectedIndex].value;
            
            if (!selectedCategory.trim()) {
                alert("Please select a category to delete.");
                return;
            }

    const getRequest = index.openCursor(IDBKeyRange.only(selectedCategory));
    
     getRequest.onsuccess = function(event) {
                var cursor = event.target.result;
                if (cursor) {
                    // If cursor is not null, delete the record
                    var deleteRequest = cursor.delete();
                    deleteRequest.onsuccess = function(event) {
                        console.log("Record deleted successfully");
                    };
                    deleteRequest.onerror = function(event) {
                        console.error("Error deleting record: " + event.target.errorCode);
                    };
                } else {
                    console.log("Record not found");
                }
            };

            getRequest.onerror = function(event) {
                console.error("Error finding record: " + event.target.errorCode);
            };
  };
  
  var deleteData = async () => {
     const db = await openDB();
  const transaction = db.transaction(["Prompts"], "readwrite");
  const objectStore = transaction.objectStore("Prompts");
  
  const request = objectStore.clear();

  request.onsuccess = () => {
    console.log("All data deleted successfully!");
   // listData(); // Refresh the displayed list after deletion
  };

  request.onerror = (event) => {
    console.error(`Error deleting all data: ${event.target.error}`);
  }; 
  }
  
  //add prompt to favorites 
  var addToFav = async () => {
      const db = await openDB();
    const transaction = db.transaction(["Favorites"], "readwrite");
    const objectStore = transaction.objectStore("Favorites");
    
    const fave = document.getElementById("newprompt").value;
    const category = document.getElementById("categories").value;
  
    const data = { fave, category };
    const request = objectStore.add(data);
  
    request.onsuccess = () => {
      console.log("Data inserted successfully to favorites!");
    };
  
    request.onerror = (event) => {
      console.error(`Error inserting data: ${event.target.error}`);
    };
  }
  
  //Function to copy
  //Find the copy button in the HTML page by its ID
  const copyButton = document.getElementById('copy');
  // Attach a click event listener to the copy button
  
  copyButton.addEventListener('click', async () => {
  try {
    // Find the text area in the HTML page by its ID
    const textarea = document.getElementById('newprompt');

    // Get the text from the text area
    const textToCopy = textarea.value;

    // Write the text to the clipboard
    await navigator.clipboard.writeText(textToCopy);

    console.log('Text copied to clipboard successfully');
  } catch (error) {
    console.error('Error copying text to clipboard:', error);
  }
});


//Function to paste
  // Find the paste button in the HTML page by its ID
  const pasteButton = document.getElementById('paste');
  
  // Attach a click event listener to the paste button
  pasteButton.addEventListener('click', async () => {
  try {
      // Find the text area in the HTML page by its ID
    const textarea = document.getElementById('manage');
    
    // Read text from the clipboard
    const textFromClipboard = await navigator.clipboard.readText();

    // Paste the text into the textarea
    textarea.value = textFromClipboard;

    console.log('Text pasted from clipboard successfully');
  } catch (error) {
    console.error('Error pasting text from clipboard:', error);
  }
});


// Function to list all data
var listData = async () => {
  const db = await openDB();
  const transaction = db.transaction(["Prompts"], "readonly");
  const objectStore = transaction.objectStore("Prompts");

  const request = objectStore.getAll();
  
  request.onsuccess = (event) => {
    const data = event.target.result;
    displayDataAsList(data);
    console.log("List of Data:", data);
    // Display or process the data as needed
  };

  request.onerror = (event) => {
    console.error(`Error listing data: ${event.target.error}`);
  };
};

// Function to display data as an unordered list
var displayDataAsList = (data) => {
  const resultList = document.getElementById("promptdisplay");
  resultList.innerHTML = ""; // Clear previous results
  data.forEach((entry) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${entry.newprompt} (${entry.category})`;
    resultList.appendChild(listItem);
  });
};

// Function to list fave data
var listFav = async () => {
  const db = await openDB();
  const transaction = db.transaction(["Favorites"], "readonly");
  const objectStore = transaction.objectStore("Favorites");

  const request = objectStore.getAll();
  
  request.onsuccess = (event) => {
    const data = event.target.result;
    displayFaveAsList(data);
    console.log("List of Data:", data);
    // Display or process the data as needed
  };

  request.onerror = (event) => {
    console.error(`Error listing data: ${event.target.error}`);
  };
};
// Function to display data as an unordered list
var displayFaveAsList = (data) => {
  const resultList = document.getElementById("promptdisplay");
  resultList.innerHTML = ""; // Clear previous results

  data.forEach((entry) => {
    const listItem = document.createElement("li");
    listItem.textContent = `Favorite: ${entry.fave}, Category: ${entry.category}`;
    resultList.appendChild(listItem);
  });
};


//Function to add categories to select list dynamically
// Asynchronous function to open the IndexedDB database, retrieve data, and populate the select list
 var populateSelectList = async () => {
    // Retrieve data from the database
    const db = await openDB();
    const transaction = db.transaction(["Categories"], "readonly");
    const objectStore = transaction.objectStore("Categories");
    
    const selectList = document.getElementById("categories");
    const request = objectStore.getAll();
    
    console.log("y");
    request.onsuccess = (event) => {
    const data = event.target.result;
    populateList(data);
    console.log("Categories: ", data); 
    }; 
    
    request.onerror = (event) => {
    console.error(`Error listing data: ${event.target.error}`);
    };
};

//Function to display categories in list 
var populateList = (data) => {
        const selectList = document.getElementById("categories");
        selectList.innerHTML = "";
        data.forEach((entry) => {
          const optionElement = document.createElement("option");
          optionElement.textContent = `${entry.category}`; // Assuming 'categoryName' is the property containing the category name
          selectList.appendChild(optionElement);
        });
};

//FUNCTION TO DYNAMICALLY POPULATE CHECKBOXES 
var AddcheckBoxes = async () => {
    // Retrieve data from the database
    const db = await openDB();
    const transaction = db.transaction(["Prompts"], "readonly");
    const objectStore = transaction.objectStore("Prompts");
    const request = objectStore.openCursor();
    
    const form = document.getElementById("library");
    form.innerHTML = "";
      request.onsuccess = (event) => {
    const data = event.target.result;
      if (data){
    ShowBoxes(data);
    console.log("Categories: ", data); 
    }
    }; 
    
    request.onerror = (event) => {
    console.error(`Error listing data: ${event.target.error}`);
    };
};

//Function to display categories in list 
var ShowBoxes = (data) => {
      const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = data.value.id; // Assuming your object has an 'id' property
            checkbox.name = data.value.category;
            checkbox.id = 'checkbox_' + data.value.id; // Unique ID for each checkbox
            const label = document.createElement('label');
            label.htmlFor = checkbox.id;
            label.appendChild(document.createTextNode(data.value.category)); // Assuming your object has a 'name' property

            const container = document.getElementById('library'); // Get the container element in your HTML
            container.appendChild(checkbox);
            container.appendChild(label);
            container.appendChild(document.createElement('br'));

            data.continue();
};


// Function to filter suggestions based on user input
var searchByKeyword = async () => {
    // Retrieve data from the database
    const db = await openDB();
    const transaction = db.transaction(["Prompts"], "readonly");
    const objectStore = transaction.objectStore("Prompts");
    const index = objectStore.index('newprompt');
    
    const searchText = document.getElementById('searchbox').value.trim().toLowerCase();
    if (!searchText) {
        alert('Please enter search text');
        return;
    }
    
    const retrievedPrompts = [];
    
   index.openCursor().onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
            // Check if the prompt contains the search text
            if (cursor.value.newprompt.toLowerCase().includes(searchText)) {
                retrievedPrompts.push(cursor.value);
            }
            cursor.continue();
        } else {
            // All prompts have been retrieved, display them
            console.log(retrievedPrompts);
            displayPrompts(retrievedPrompts);
        }
    };

    index.openCursor().onerror = (event) => {
        console.error('Error retrieving prompts:', event.target.error);
    };
}

function displayPrompts(prompts) {
    const promptContainer = document.getElementById('suggestions');
    promptContainer.innerHTML = ''; // Clear previous content

    prompts.forEach(prompt => {
        const promptElement = document.createElement('li');
        promptElement.textContent = `${prompt.newprompt}`; // Assuming 'newprompt' is the property containing the prompt text
        promptContainer.appendChild(promptElement);
    });
}

//CODE OF IMPORT
document.getElementById('import').addEventListener('click', () => {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    
    if (file) {
        const reader = new FileReader();
        
        reader.onload = async (event) => {
            const content = event.target.result;
            
            if (file.name.endsWith('.csv')) {
                // Parse CSV content
                parseCSV(content);
            } else if (file.name.endsWith('.xlsx')||file.name.endsWith('.xls')) {
                // Parse Excel content
                parseExcel(content);
            } else {
                alert('Unsupported file format');
            }
        };        
        reader.readAsText(file);
     } else {
        alert('No file selected');
    }
});
var parseCSV = async (content) => {
    // Convert CSV string to array of arrays
   const rows = content.split('\r\n').map(row => row.split(','));

    // Extract column data
    const column1Data = [];
    const column2Data = [];
    rows.forEach(row => {
        column1Data.push(row[0]);
        column2Data.push(row[1]);
    });

    // Save column data to IndexedDB
    await saveToIndexedDB(column1Data, column2Data);
};
var parseExcel = async (content) => {
    const data = new Uint8Array(content);
    const workbook = XLSX.read(data, { type: 'array' });

    // Assuming the first sheet is the one of interest
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert sheet data to JSON
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    // Extract column data
    const column1Data = [];
    const column2Data = [];
    jsonData.forEach(row => {
        column1Data.push(row[0]);
        column2Data.push(row[1]);
    });

    // Save column data to IndexedDB
    await saveToIndexedDB(column1Data, column2Data);
};

var saveToIndexedDB = async (column1Data, column2Data) => {
     const db = await openDB();
    const transaction = db.transaction(["Prompts"], "readwrite");
    const objectStore = transaction.objectStore("Prompts");
    
    for (let i = 0; i < Math.max(column1Data.length, column2Data.length); i++) {
                const item = {};

                // Add data from the first column to "newprompt" index
                if (column1Data[i]) {
                    item.newprompt = column1Data[i];
                }

                // Add data from the second column to "category" index
                if (column2Data[i]) {
                    item.category = column2Data[i];
                }

                objectStore.add(item);
            }

            transaction.oncomplete = function() {
                console.log('Data saved to IndexedDB');
            };

            transaction.onerror = function(event) {
                console.error('Transaction error: ' + event.target.errorCode);
            };
        };

// Function to export data as CSV
document.getElementById('exportCSVButton').addEventListener('click', () => {
      const fileName = document.getElementById("filenameInput").value;
    exportToCSV(fileName);
});
// retrieveForExport and downloadFile functions remain unchanged
var exportToCSV = async (fileName) => {
      const db = await openDB();
    const transaction = db.transaction(["Prompts"], 'readonly');
    const objectStore = transaction.objectStore("Prompts");
     // Retrieve data from IndexedDB
         const request = objectStore.getAll();
         
        request.onsuccess = (event) => {
            // Extract data from the request result
            const data = event.target.result;
            if (data && data.length > 0) {
                // Format data into CSV
                let headers = ['id', 'newprompt', 'category'];
                let csv = headers.join(',') + '\n'; // Start with headers
                
                data.forEach(record => {
                const values = [
                    record.id,
                    Array.isArray(record.newprompt)? record.newprompt.join(', ') : record.newprompt,
                    Array.isArray(record.category)? record.category.join(', ') : record.category,
                    ].map(value => {
                    if (typeof value === 'object' && !(value instanceof Date)) {
                        return JSON.stringify(value);
                    } else {
                        console.log("Error");
                        return value; // invoking toString method
                    }
                    });
                csv += values.join(",") + "\n";
                });
                // Create Blob object
                const blob = new Blob([csv], { type: 'text/csv' });

                // Create URL for the Blob
                const url = URL.createObjectURL(blob);

                // Create link element to trigger download
                const link = document.createElement('a');
                link.href = url;
                link.download = fileName + '.csv';

                // Programmatically trigger click event on the link
                document.body.appendChild(link);
                link.click();

                // Clean up
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            } else {
                console.log("No data found in the object store.");
            }
        };
        request.onerror = (event) => {
            console.error("Error retrieving data from object store:", event.target.error);
        };
};

var retrievePrompts = async () => {
    const db = await openDB();
    const transaction = db.transaction('Prompts', 'readonly');
    const objectStore = transaction.objectStore('Prompts');
    
    const categories = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(input => input.name);
    const request = objectStore.getAll();

        request.onsuccess = function(event) {
            const prompts = event.target.result;
            // Filter prompts based on selected categories
            const filteredPrompts = prompts.filter(prompt => categories.includes(prompt.category));
            // Display filtered prompts on the HTML page
            displayFilteredPrompts(filteredPrompts);
        };
}
var displayFilteredPrompts = async (prompts) => {
   const container = document.getElementById('suggestions');
    container.innerHTML = ''; // Clear existing prompts
    prompts.forEach(prompt => {
        const p = document.createElement('li');
        p.textContent = `${prompt.newprompt}`; // Assuming each prompt has a 'text' property
        container.appendChild(p);
    });
}
   
function toggleDarkMode() {
            var body = document.body;

           if (body.classList.contains('dark-mode')) {
                body.classList.remove('dark-mode');
            } else {
                body.classList.add('dark-mode');
            }
        }
function clearCategories(){
    const checkboxes = document.getElementById("library");
    const list = document.getElementById("categories");
    const searchies = document.getElementById("suggestions");
    checkboxes.innerHTML = "";
    list.innerHTML = "";
    suggestions.innerHTML = "";
}        

  document.addEventListener('DOMContentLoaded', function () {
  // Button event listeners
  document.getElementById("savek").addEventListener("click", insertData);
  document.getElementById("edit").addEventListener("click", updateData);
  document.getElementById("delete").addEventListener("click", deletePrompt);
  document.getElementById("deletecat").addEventListener("click", deleteCategory);
  document.getElementById("fave").addEventListener("click", addToFav);
  document.getElementById("createcat").addEventListener("click", createCategory);
  document.getElementById("display").addEventListener("click", listData);
  document.getElementById("populate").addEventListener("click", populateSelectList); 
  document.getElementById("search").addEventListener("click", searchByKeyword); 
  document.getElementById("populate").addEventListener("click", AddcheckBoxes); 
  document.getElementById("filter").addEventListener("click", retrievePrompts);
  document.getElementById("dark").addEventListener("click", toggleDarkMode);
  document.getElementById("clear").addEventListener("click", clearCategories);
});