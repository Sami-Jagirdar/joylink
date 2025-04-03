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
    process,
    release,
  } = useRhino();

  const rhinoContext = { publicPath: "/Controller-Commands_en_wasm_v3_0_0.rhn" };
  const rhinoModel = { publicPath: "/rhino_params.pv" };

  // 1) Initialize Rhino on component mount
  useEffect(() => {
    const startRhino = async () => {
      try {
        // Request mic permission (optional, but good practice to prompt early)
        await window.navigator.mediaDevices.getUserMedia({ audio: true });
        console.log("Microphone access granted.");
        socket.emit("general-message", "Microphone access granted.");

        // Initialize Rhino
        await init(
          "KEY GOES HERE",
          rhinoContext,
          rhinoModel
        );

        // Initialize Rhino
        // await init(
        //   "CAYY4Wmj6cxfF7sPV96H881SjDDYHE/aWa7hfk/6eqbGZvMkPB45xg==",
        //   rhinoContext,
        //   rhinoModel
        // );
        
        socket.emit("general-message", `isLoaded changed: ${isLoaded}`);
        socket.emit("general-message", `isListening changed: ${isListening}`);
        socket.emit("general-message", `error changed: ${error}`);
      } catch (err) {
        console.error("Rhino init error:", err);
        socket.emit("general-message", "Rhino error");
      }
    };

    startRhino();

    // Cleanup on unmount
    return () => {
      release();
    };
  }, [init, release]);

  // 2) Once Rhino is loaded, call process() to start listening (isLoaded is a boolean from the hook that becomes true after init completes)
  useEffect(() => {
    console.log("isLoaded: ", isLoaded);
    console.log("isListening: ", isListening);

    if (isLoaded) {
      process()
        .then(() => console.log("Rhino started listening for the first command."))
        .catch((err) => console.error("Rhino process() error:", err));
    }
  }, [isLoaded, process]);

  // 3) Whenever we get a new inference, do something with it,
  //    then call process() again to listen for the next command.
  useEffect(() => {
    if (inference != null) {
      console.log("Rhino inference:", inference);

      if (inference.isUnderstood) {
        socket.emit("voice-inference", inference);
        socket.emit("general-message", "Understood");
      }
      // Rhino has paused after returning an inference; call process() again:
      process().catch((err) => console.error("Rhino process() error:", err));
    }
  }, [inference, socket, process]);

  return (
    <div style={{ margin: "1rem 0" }}>
      {error && (
        <p style={{ color: "red" }}>
          Error: {error.message || String(error)}
        </p>
      )}
      {!isLoaded ? (
        <p>Loading Rhino...</p>
      ) : (
        <p>
          Rhino loaded.&nbsp;
          {isListening ? "Listening on mic..." : "Paused."}
        </p>
      )}
    </div>
  );
};

export default VoiceCapture;
