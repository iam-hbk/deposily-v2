"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChat } from "@ai-sdk/react";

export default function Page() {
  const { messages, input, handleInputChange, handleSubmit, status } = useChat({
    api: "/api/tester",
  });

  return (
    <div className="container mx-auto flex h-screen w-full flex-col justify-between border border-red-500 p-4">
      <div className="flex flex-col gap-2 bg-blue-100">
        {messages.map((message) => (
          <div key={message.id}>
            <div>{message.role === "user" ? "User: " : "AI: "}</div>
            <div>{message.content}</div>

            <div>
              {message.toolInvocations?.map((toolInvocation) => {
                const { toolName, toolCallId, state } = toolInvocation;

                if (state === "result") {
                  if (toolName === "displayWeather") {
                    const { result } = toolInvocation;
                    return (
                      <div key={toolCallId}>
                        <Weather {...result} />
                      </div>
                    );
                  }
                } else {
                  return (
                    <div key={toolCallId}>
                      {toolName === "displayWeather" ? (
                        <div>Loading weather...</div>
                      ) : null}
                    </div>
                  );
                }
              })}
            </div>
          </div>
        ))}
      </div>

      <form className="flex flex-row space-x-2 p-2" onSubmit={handleSubmit}>
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder="Type a message..."
        />
        <Button
          disabled={status !== "ready" || input.trim() === ""}
          type="submit"
        >
          {status === "ready" ? "Send" : status}
        </Button>
      </form>
    </div>
  );
}

type WeatherProps = {
  temperature: number;
  weather: string;
  location: string;
};

export const Weather = ({ temperature, weather, location }: WeatherProps) => {
  return (
    <div className="rounded-md border border-gray-300 p-2 bg-amber-500">
      <h2 className="text-lg font-bold">Current Weather for {location}</h2>
      <p className="text-sm">Condition: {weather}</p>
      <p className="text-sm">Temperature: {temperature}°C</p>
    </div>
  );
};
