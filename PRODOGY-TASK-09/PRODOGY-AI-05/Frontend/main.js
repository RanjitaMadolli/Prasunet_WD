async function detectFaces() {
    const fileInput = document.getElementById('fileInput');
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (!fileInput.files.length) {
        resultsDiv.innerHTML = '<p>No file selected.</p>';
        return;
    }

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    try {
        const response = await fetch('/detect', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to detect faces.');
        }

        const data = await response.json();

        data.results.forEach(result => {
            const { x, y, width, height } = result.bbox;
            const embedding = result.embedding;
            resultsDiv.innerHTML += `<p>Detected face: (${x}, ${y}), Width: ${width}, Height: ${height}</p>`;
            resultsDiv.innerHTML += `<p>Face Embedding: ${embedding.join(', ')}</p>`;
        });

    } catch (error) {
        console.error('Error detecting faces:', error);
        resultsDiv.innerHTML = '<p>Error detecting faces. Please try again.</p>';
    }
}
