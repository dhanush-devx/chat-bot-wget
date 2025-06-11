let isChatVisible = false;

function toggleChat() {
    const chatBody = document.getElementById('chatBody');
    isChatVisible = !isChatVisible;
    chatBody.style.display = isChatVisible ? 'block' : 'none';
}

async function sendMessage() {
    const userInput = document.getElementById('userInput');
    const message = userInput.value.trim();
    if (!message) return;

    appendMessage('user', message);
    userInput.value = '';

    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ message })
        });
        
        const data = await response.json();
        appendMessage('bot', data.response);
    } catch (error) {
        appendMessage('bot', 'Sorry, there was an error processing your request.');
    }
}

function appendMessage(sender, text) {
    const history = document.getElementById('chatHistory');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    messageDiv.textContent = text;
    history.appendChild(messageDiv);
    history.scrollTop = history.scrollHeight;
}

function handleEnter(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
}

// Initial chat visibility
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.chat-container').style.display = 'block';
});
