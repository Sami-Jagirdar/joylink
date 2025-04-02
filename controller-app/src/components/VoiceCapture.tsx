import React, { useEffect } from "react";
import { useRhino } from "@picovoice/rhino-react";

interface VoiceCaptureProps {
  socket: SocketIOClient.Socket;
}

const VoiceCapture: React.FC<VoiceCaptureProps> = ({ socket }) => {
  const {
    inference,
    isLoaded,
    isListening,
    error,
    init,
    release,
  } = useRhino();

  const rhinoContext = { publicPath: "/Controller-Commands_en_wasm_v3_0_0.b64" }
  const rhinoModel = { publicPath: "/rhino_params.b64" }

  useEffect(() => {
    // On component mount, call init(...) with your Picovoice Access Key + context + model
    const startRhino = async () => {
      try {
        await init(
          "JVIBCZOrBgjG4Fujv5nNpA47XKLbQQqhylhQg33Rj324NK4AXG1S9w==", //Access key
          rhinoContext,
          rhinoModel
        );

        socket.emit("general-message", "Hello");
      } catch (err) {
        console.error("Rhino init error:", err);
      }
    };

    startRhino();

    // Cleanup on unmount
    return () => {
      release();
    };
  }, [init, release]);

  // Whenever we get a new inference, emit it to the server
  useEffect(() => {
    if (inference) {
      console.log("Rhino inference:", inference);

      // socket.emit("voice-inference", inference);

      // Only want the recognized intent or "word"
      if (inference.isUnderstood) {
        socket.emit("voice-inference", { slots: inference.slots });
      }
    }
  }, [inference, socket]);

  return (
    <div style={{ margin: "1rem 0" }}>
      {error && <p style={{ color: "red" }}>Error: {error.message || String(error)}</p>}
      {!isLoaded ? (
        <p>Loading Rhino...</p>
      ) : (
        <p>
          Rhino loaded.&nbsp;
          {isListening ? "Listening on mic..." : "Not listening yet."}
        </p>
      )}
    </div>
  );
};

export default VoiceCapture;
