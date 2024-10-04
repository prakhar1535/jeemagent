(function () {
  function initChatbot(chatbotId) {
    const chatbotContainer = document.createElement("div");
    chatbotContainer.id = "embeddable-chatbot";
    chatbotContainer.style.position = "fixed";
    chatbotContainer.style.bottom = "20px";
    chatbotContainer.style.right = "0px";
    chatbotContainer.style.zIndex = "1000";
    document.body.appendChild(chatbotContainer);

    const iframe = document.createElement("iframe");
    iframe.src = `http://localhost:3000/chatbot/${chatbotId}`;
    iframe.style.border = "none";
    iframe.style.width = "416px";
    iframe.style.height = "57.5dvh";
    iframe.style.borderRadius = "15px";
    iframe.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
    chatbotContainer.appendChild(iframe);
  }

  window.initChatbot = initChatbot;
})();
