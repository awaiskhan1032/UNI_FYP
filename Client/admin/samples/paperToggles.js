document.addEventListener('DOMContentLoaded', () => {
        // Set session, teacher, class, and course info
        document.getElementById('sessionInfo').textContent = localStorage.getItem('session') || "No session selected";
        document.getElementById('teacherInfo').textContent = localStorage.getItem('teacher') || "No teacher selected";
        document.getElementById('classInfo').textContent = localStorage.getItem('class') || "No class selected";
        document.getElementById('courseInfo').textContent = localStorage.getItem('course') || "No course selected";
    const documentTypeSelect = document.getElementById('document-type');
    const taskSelectionDiv = document.getElementById('task-selection');
    const taskSelect = document.getElementById('task-select');
    const categorySelectionDiv = document.getElementById('category-selection');
    const categorySelect = document.getElementById('category-select');
    const uploadSection = document.getElementById('upload-section');
    const uploadBtn = document.getElementById('upload-btn');
    const sampleUpload = document.getElementById('sample-upload');

    // Handle document type change
    documentTypeSelect.addEventListener('change', (event) => {
        const selectedType = event.target.value;
        taskSelectionDiv.classList.remove('hidden');
        categorySelectionDiv.classList.add('hidden');
        uploadSection.classList.add('hidden');
        taskSelect.innerHTML = ''; // Clear previous options

        // Populate task options based on document type
        let options = [];
        if (selectedType === 'assignment') {
            options = ['Assignment 1', 'Assignment 2'];
        } else if (selectedType === 'quiz') {
            options = ['Quiz 1', 'Quiz 2'];
        } else if (selectedType === 'lab') {
            options = [];
            for (let i = 1; i <= 8; i++) {
                options.push(`Lab ${i}`);
            }
        }

        // Populate the task selection dropdown
        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.toLowerCase().replace(/\s+/g, '');
            optionElement.innerText = option;
            taskSelect.appendChild(optionElement);
        });
    });

    // Handle task selection
    taskSelect.addEventListener('change', () => {
        categorySelectionDiv.classList.remove('hidden');
        uploadSection.classList.add('hidden');
    });

    // Handle category selection
    categorySelect.addEventListener('change', () => {
        uploadSection.classList.remove('hidden');
    });

    // Handle file upload button click

    // Handle file selection
    sampleUpload.addEventListener('change', () => {
        const fileName = sampleUpload.files[0].name;
        alert(`You have selected the file: ${fileName}. Uploading...`);
    });
});