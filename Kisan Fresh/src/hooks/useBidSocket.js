import { useEffect, useRef } from "react";

export default function useBidSocket(vegId, onMessage) {
  const wsRef = useRef(null);

  useEffect(() => {
    if (!vegId) return;
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const host = window.location.hostname; // should be 127.0.0.1 in your dev
    const port = window.location.port ? `:${window.location.port}` : "";
    // **Important** use backend host for ws — if front served from 127.0.0.1:5173 and backend at 127.0.0.1:8000 use that host:
    const url = `${protocol}://127.0.0.1:8000/ws/bid/${vegId}/`;
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      // console.log("WS connected", url);
    };

    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (onMessage) onMessage(data);
      } catch (err) {
        console.error("WS parse error:", err);
      }
    };

    ws.onclose = () => {
      // console.log("WS closed", url);
    };

    ws.onerror = (err) => {
      console.error("WS error", err);
    };

    return () => {
      try { ws.close(); } catch (e) {}
    };
  }, [vegId, onMessage]);

  return wsRef;
}
