(function () {
  function initChatbot(chatbotId) {
    const chatbotContainer = document.createElement("div");
    chatbotContainer.id = "embeddable-chatbot";
    chatbotContainer.style.position = "fixed";
    chatbotContainer.style.bottom = "20px";
    chatbotContainer.style.right = "20px";
    chatbotContainer.style.zIndex = "1000";
    document.body.appendChild(chatbotContainer);

    const iframe = document.createElement("iframe");
    iframe.src = `https://jeemagent.vercel.app/chatbot/${chatbotId}`;
    iframe.style.border = "none";
    iframe.style.width = "400px";
    iframe.style.height = "auto";
    iframe.style.borderRadius = "10px";
    iframe.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
    chatbotContainer.appendChild(iframe);
  }

  window.initChatbot = initChatbot;
})();
