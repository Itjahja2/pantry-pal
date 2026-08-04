"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { ChefHatIcon, SendIcon, XIcon } from "lucide-react";
import { toast } from "sonner";

import { sendChatMessage, type ChatMessage } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type DisplayMessage = ChatMessage & { id: string };

const GREETING: DisplayMessage = {
  id: "greeting",
  role: "assistant",
  content:
    "Hi! I'm your kitchen assistant. Ask me for a recipe idea and I'll check what's in your pantry.",
};

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<DisplayMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [isPending, startTransition] = useTransition();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open, isPending]);

  function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || isPending) return;

    const userMessage: DisplayMessage = { id: crypto.randomUUID(), role: "user", content: trimmed };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");

    startTransition(async () => {
      const result = await sendChatMessage(
        nextMessages
          .filter((message) => message.id !== "greeting")
          .map(({ role, content }) => ({ role, content }))
      );
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      setMessages((current) => [
        ...current,
        { id: crypto.randomUUID(), role: "assistant", content: result.reply },
      ]);
    });
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  return (
    <>
      <div
        className={cn(
          "shrink-0 overflow-hidden border-r bg-card transition-[width] duration-200 ease-out",
          open ? "w-[28rem]" : "w-0"
        )}
      >
        <div className="flex h-full w-[28rem] flex-col">
          <div className="flex items-center justify-between gap-2 bg-[#C96A3D] px-4 py-3">
            <div className="flex items-center gap-2 text-white">
              <ChefHatIcon className="size-5" />
              <p className="font-heading text-base font-semibold">Kitchen Assistant</p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Close chat"
              onClick={() => setOpen(false)}
              className="text-white hover:bg-white/20 hover:text-white"
            >
              <XIcon />
            </Button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-3 py-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[85%] whitespace-pre-wrap rounded-lg px-3 py-2 text-sm",
                    message.role === "user"
                      ? "bg-[#C96A3D] text-white"
                      : "bg-muted text-foreground"
                  )}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isPending ? (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
                  Thinking…
                </div>
              </div>
            ) : null}
          </div>

          <div className="flex items-end gap-2 border-t px-3 py-3">
            <Textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask for a recipe idea..."
              disabled={isPending}
              className="min-h-9 flex-1 resize-none py-2 text-sm"
              rows={1}
            />
            <Button
              type="button"
              size="icon"
              aria-label="Send message"
              disabled={isPending || !input.trim()}
              onClick={handleSend}
              className="shrink-0 bg-[#C96A3D] hover:bg-[#C96A3D]/85"
            >
              <SendIcon />
            </Button>
          </div>
        </div>
      </div>

      {!open ? (
        <Button
          type="button"
          aria-label="Open kitchen assistant chat"
          onClick={() => setOpen(true)}
          className="fixed bottom-6 left-6 z-40 h-12 gap-2 rounded-full bg-[#C96A3D] px-5 text-base text-white shadow-lg hover:bg-[#C96A3D]/85"
        >
          <ChefHatIcon className="size-5" />
          Chat
        </Button>
      ) : null}
    </>
  );
}