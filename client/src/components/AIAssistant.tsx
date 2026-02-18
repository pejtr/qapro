import { useState, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Send, Sparkles, Wrench, Zap, ChevronUp, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { Streamdown } from "streamdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function AIAssistant() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "👋 Hi! I'm your QA Automation assistant. I can help you:\n\n• Suggest workflow automations\n• Fix script errors\n• Optimize your test scripts\n• Generate scripts from descriptions\n\nWhat would you like to automate today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatMutation = trpc.ai.chat.useMutation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsStreaming(true);

    try {
      const response = await chatMutation.mutateAsync({
        messages: [...messages, userMessage].map(m => ({
          role: m.role,
          content: m.content
        })),
        systemPrompt: `You are an expert QA automation assistant for a browser automation platform. 
Help users create, debug, and optimize their automation scripts. 
Provide practical, actionable advice. 
When suggesting workflows, describe them step-by-step.
Be concise but thorough. Use markdown formatting for code and lists.`
      });

      const assistantMessage: Message = {
        role: "assistant",
        content: typeof response.content === 'string' ? response.content : JSON.stringify(response.content)
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast.error("Failed to get response from AI assistant");
      console.error(error);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleQuickAction = async (action: string) => {
    const prompts = {
      suggest: "Suggest 3 popular automation workflows I could create for social media management",
      fix: "What are the most common errors in browser automation scripts and how do I fix them?",
      optimize: "Give me 5 tips to optimize my automation scripts for better performance and reliability"
    };

    setInput(prompts[action as keyof typeof prompts]);
  };

  return (
    <div className="flex flex-col bg-slate-900/50 border-t border-slate-700/50">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between px-4 py-3 hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-purple-400" />
          <span className="text-sm font-medium text-slate-200">AI Assistant</span>
          <Sparkles className="h-3 w-3 text-purple-400 animate-pulse" />
        </div>
        {isExpanded ? (
          <ChevronDown className="h-4 w-4 text-slate-400" />
        ) : (
          <ChevronUp className="h-4 w-4 text-slate-400" />
        )}
      </button>

      {/* Chat Panel */}
      {isExpanded && (
        <div className="flex flex-col border-t border-slate-700/50" style={{ height: 'calc(33vh)' }}>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-purple-400" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-800 text-slate-200"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <Streamdown>{message.content}</Streamdown>
                  ) : (
                    message.content
                  )}
                </div>
                {message.role === "user" && (
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold">
                    U
                  </div>
                )}
              </div>
            ))}
            {isStreaming && (
              <div className="flex gap-3 justify-start">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-purple-400 animate-pulse" />
                </div>
                <div className="bg-slate-800 rounded-lg px-3 py-2 text-sm text-slate-400">
                  Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="px-4 py-2 border-t border-slate-700/50 flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleQuickAction("suggest")}
              disabled={isStreaming}
              className="text-xs"
            >
              <Sparkles className="h-3 w-3 mr-1" />
              Suggest
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleQuickAction("fix")}
              disabled={isStreaming}
              className="text-xs"
            >
              <Wrench className="h-3 w-3 mr-1" />
              Fix
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleQuickAction("optimize")}
              disabled={isStreaming}
              className="text-xs"
            >
              <Zap className="h-3 w-3 mr-1" />
              Optimize
            </Button>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-700/50">
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask me anything about automation..."
                className="min-h-[60px] resize-none bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-500"
                disabled={isStreaming}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isStreaming}
                size="icon"
                className="flex-shrink-0 bg-purple-600 hover:bg-purple-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
