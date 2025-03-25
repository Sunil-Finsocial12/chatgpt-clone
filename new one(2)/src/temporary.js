async function sendMessage() {
    const url = 'http://saveai.tech/chat';
    const data = {
        username: "hi",
        message: "hello",
        language: "eng_Latn",
        search_enabled: false
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log(result);
    } catch (error) {
        console.error('Error:', error);
    }
}

sendMessage();
