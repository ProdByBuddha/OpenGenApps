// script.js

document.addEventListener('DOMContentLoaded', () => {
    const generateButton = document.getElementById('generateButton');
    const descriptionInput = document.getElementById('description');
    const outputFrame = document.getElementById('outputFrame');

    function decodeHTMLEntities(text) {
        const textarea = document.createElement('textarea');
        textarea.innerHTML = text;
        return textarea.value;
    }

    generateButton.addEventListener('click', () => {
        const description = descriptionInput.value;
        console.log('Description:', description); // Debugging

        fetch('https://geminiserver-cloudcorprecord.replit.app/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt: description, model: 'gemini-1.5-flash' })
        })
        .then(response => {
            console.log('Response status:', response.status); // Debugging
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Data received:', data); // Debugging
            if (data && data.text) {
                const decodedHTML = decodeHTMLEntities(data.text);
                console.log('Decoded HTML Content:', decodedHTML); // Debugging
                // Update the iframe with the generated HTML:
                const iframeDocument = outputFrame.contentDocument || outputFrame.contentWindow.document;
                iframeDocument.open();
                iframeDocument.write(decodedHTML);
                iframeDocument.close();
            } else {
                throw new Error('Invalid data received from the API');
            }
        })
        .catch(error => {
            console.error('Error fetching or displaying code:', error);
            const iframeDocument = outputFrame.contentDocument || outputFrame.contentWindow.document;
            iframeDocument.open();
            iframeDocument.write("<p>An error occurred. Please try again.</p>");
            iframeDocument.write("<p>Error: " + error.message + "</p>"); // Display error message
            iframeDocument.close();
        });
    });
});