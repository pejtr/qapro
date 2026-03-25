import { useState, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Send, Sparkles, Wrench, Zap, ChevronUp, ChevronDown, Briefcase, Code, User, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Streamdown } from "streamdown";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Message {
  role: "user" | "assistant";
  content: string;
}

type Persona = "marketing" | "technical" | "general";

export function AIAssistant() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [persona, setPersona] = useState<Persona>("general");
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const chatMutation = trpc.ai.chat.useMutation();
  const historyQuery = trpc.ai.getHistory.useQuery({ limit: 100 });
  const clearHistoryMutation = trpc.ai.clearHistory.useMutation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load conversation history on mount
  useEffect(() => {
    if (historyQuery.data && isLoadingHistory) {
      const loadedMessages: Message[] = historyQuery.data
        .filter(msg => msg.role !== 'system')
        .map(msg => ({
          role: msg.role as "user" | "assistant",
          content: msg.content
        }));
      
      if (loadedMessages.length > 0) {
        setMessages(loadedMessages);
      } else {
        // Show welcome message if no history
        setMessages([{
          role: "assistant",
          content: getWelcomeMessage(persona)
        }]);
      }
      setIsLoadingHistory(false);
    }
  }, [historyQuery.data, isLoadingHistory, persona]);

  const getWelcomeMessage = (currentPersona: Persona) => {
    const welcomeMessages = {
      marketing: "👋 Hi! I'm your **Marketing & Growth Expert** for QA Automation. I focus on:\n\n• **ROI & Business Metrics** - Reduce testing costs by 70%\n• **Viral Growth Strategies** - Automate engagement for 10x reach\n• **Conversion Optimization** - Increase success rates\n• **Campaign Performance** - Track and improve automation ROI\n\nHow can I help you achieve better business outcomes today?",
      
      technical: "👋 Hi! I'm your **Senior QA Engineer** specialized in test automation. I can help with:\n\n• **Playwright, Cypress, Selenium** - Framework expertise\n• **Code Debugging** - Fix errors and optimize scripts\n• **Architecture Patterns** - Best practices & design\n• **CI/CD Integration** - Jenkins, GitHub Actions, GitLab\n\nWhat technical challenge are you facing?",
      
      general: "👋 Hi! I'm your QA Automation assistant. I can help you:\n\n• Suggest workflow automations\n• Fix script errors\n• Optimize your test scripts\n• Generate scripts from descriptions\n\nWhat would you like to automate today?"
    };
    
    return welcomeMessages[currentPersona];
  };

  const handlePersonaChange = (newPersona: Persona) => {
    setPersona(newPersona);
    toast.success(`Switched to ${newPersona} persona`);
  };

  const handleClearHistory = async () => {
    try {
      await clearHistoryMutation.mutateAsync();
      setMessages([{
        role: "assistant",
        content: getWelcomeMessage(persona)
      }]);
      toast.success("Conversation history cleared");
    } catch (error) {
      toast.error("Failed to clear history");
      console.error(error);
    }
  };

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
        persona,
        saveToHistory: true,
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
      marketing: {
        suggest: "What are the top 3 automation strategies to increase social media engagement by 300%?",
        fix: "How can I improve my automation campaign ROI and reduce costs?",
        optimize: "Give me 5 growth hacking tactics using automation to go viral"
      },
      technical: {
        suggest: "Show me 3 advanced Playwright patterns for handling dynamic content",
        fix: "What are the most common Selenium WebDriver errors and their solutions?",
        optimize: "Give me 5 performance optimization techniques for Cypress tests"
      },
      general: {
        suggest: "Suggest 3 popular automation workflows I could create for social media management",
        fix: "What are the most common errors in browser automation scripts and how do I fix them?",
        optimize: "Give me 5 tips to optimize my automation scripts for better performance and reliability"
      }
    };

    setInput(prompts[persona][action as keyof typeof prompts.general]);
  };

  const personaIcons = {
    marketing: <Briefcase className="h-3.5 w-3.5" />,
    technical: <Code className="h-3.5 w-3.5" />,
    general: <User className="h-3.5 w-3.5" />
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
        <div className="flex flex-col border-t border-slate-700/50" style={{ height: '320px' }}>
          {/* Persona Selector & Clear History */}
          <div className="px-4 py-2 border-b border-slate-700/50 flex items-center justify-between gap-2">
            <Select value={persona} onValueChange={(value) => handlePersonaChange(value as Persona)}>
              <SelectTrigger className="w-[180px] h-8 text-xs bg-slate-800 border-slate-700">
                <div className="flex items-center gap-2">
                  {personaIcons[persona]}
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">
                  <div className="flex items-center gap-2">
                    <User className="h-3.5 w-3.5" />
                    General Assistant
                  </div>
                </SelectItem>
                <SelectItem value="marketing">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-3.5 w-3.5" />
                    Marketing Expert
                  </div>
                </SelectItem>
                <SelectItem value="technical">
                  <div className="flex items-center gap-2">
                    <Code className="h-3.5 w-3.5" />
                    Technical Engineer
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              size="sm"
              variant="ghost"
              onClick={handleClearHistory}
              className="h-8 text-xs text-slate-400 hover:text-red-400"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Clear
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {isLoadingHistory ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-slate-400 text-sm">Loading conversation...</div>
              </div>
            ) : (
              <>
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
              </>
            )}
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
                className="min-h-[60px] resize-none bg-slate-800 border-2 border-primary/40 focus:border-primary text-slate-200 placeholder:text-slate-500 transition-colors"
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
