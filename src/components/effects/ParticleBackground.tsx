// src/components/effects/ParticleBackground.tsx
import { useCallback } from "react";
import Particles from "react-tsparticles";
import type { Container } from "tsparticles-engine";
import { loadFull } from "tsparticles";

export function ParticleBackground() {
  // pakai any biar gak ribut sama tipe Engine
  const init = useCallback(async (engine: any) => {
    await loadFull(engine);
  }, []);

  const loaded = useCallback(async (_container?: Container) => {
    // bisa di-log kalau mau debug
  }, []);

  return (
  <Particles
    id="tsparticles-login"
    className="absolute inset-0 z-0"   // ⬅️ BUKAN -z-10 lagi
    init={init}
    loaded={loaded}
    options={{
      fullScreen: { enable: false },
      background: { color: "transparent" },
      fpsLimit: 60,
      particles: {
        number: { value: 80, density: { enable: true, area: 800 } },
        color: { value: ["#E89B7C", "#5BA8A8", "#ffffff"] },
        shape: { type: "circle" },
        opacity: {
          value: 0.6,
          random: { enable: true, minimumValue: 0.2 },
        },
        size: { value: { min: 1, max: 4 } },
        links: {
          enable: true,
          distance: 120,
          color: "#ffffff",
          opacity: 0.2,
          width: 1,
        },
        move: {
          enable: true,
          speed: 1.2,
          direction: "none",
          outModes: { default: "bounce" },
        },
      },
      interactivity: {
        detectsOn: "window",
        events: {
          onHover: { enable: true, mode: ["attract", "bubble"] },
          onClick: { enable: true, mode: "push" },
          resize: true,
        },
        modes: {
          attract: { distance: 150, duration: 0.3, factor: 1.5 },
          bubble: { distance: 130, duration: 0.4, size: 6, opacity: 1 },
          push: { quantity: 4 },
        },
      },
      detectRetina: true,
    }}
  />
);

}
