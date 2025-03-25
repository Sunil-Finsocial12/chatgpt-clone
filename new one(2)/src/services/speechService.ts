const processText = async (language: string, text: string) => {
  try {
    // First, set the language
    await fetch("http://127.0.0.1:7860/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: [language] }),
    });

    // Then submit the text for processing
    const response = await fetch("http://127.0.0.1:7860/run/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: [text]
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data[0];
  } catch (error) {
    console.error('Error processing speech:', error);
    throw error;
  }
};

export default processText;
