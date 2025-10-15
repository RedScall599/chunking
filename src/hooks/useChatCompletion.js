import { useMutation } from "@tanstack/react-query";

export function useChatCompletion() {
  return useMutation({
    mutationFn: async (payload) => {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      if (!apiKey) throw new Error("Missing OpenAI API key");
      // Only send model and messages to OpenAI API
      const requestBody = {
        model: "gpt-4o", // or "gpt-3.5-turbo" if you don't have access to gpt-4o
        messages: payload.messages,
      };
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Assistant unavailable");
      }

      return response.json();
    },
  });
}
