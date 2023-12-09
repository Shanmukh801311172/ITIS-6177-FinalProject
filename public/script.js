document.getElementById('textToSpeechForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const textInput = document.getElementById('textInput').value;
    const selectedVoice = document.getElementById('voiceDropdown').value;
    const loadingSpinner = document.getElementById('loadingOverlay');
    loadingSpinner.style.display = 'block';
    fetch('/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: textInput, voice: selectedVoice }),
    })
        .then(response => {
            if (response.status === 400) {
                response.text().then(text => alert(text));
                throw new Error('Bad request');
            }
            return response.blob();
        })
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const audioPlayer = document.getElementById('audioPlayer');
            audioPlayer.src = url;
            audioPlayer.hidden = false;
            loadingSpinner.style.display = 'none';
        })
        .catch(error => {
            console.error('Error:', error);
            loadingSpinner.style.display = 'none';
        });
});
document.addEventListener('DOMContentLoaded', function () {
    fetch('voicesShrinked.json')
        .then(response => response.json())
        .then(data => populateDropdown(data))
        .catch(error => console.error('Error:', error));
});

function populateDropdown(voices) {
    const dropdown = document.getElementById('voiceDropdown');
    voices.forEach(voice => {
        const option = document.createElement('option');
        option.textContent = voice.DisplayName + " | " + voice.ShortName;
        option.value = voice.ShortName;
        if (voice.ShortName == 'en-US-JennyMultilingualNeural')
            option.selected = true;
        dropdown.appendChild(option);
    });
}