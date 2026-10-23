// Plays the hero background clips in sequence, crossfading between them.
export function initHeroVideo(media) {
  const videos = [...media.querySelectorAll("video")];
  const scenes = [...(media.parentElement.querySelector("[data-hero-scenes]")?.children ?? [])];
  if (!videos.length) return;

  // Reduced motion: keep the first poster frame, no playback.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let current = 0;

  function show(index) {
    const prev = videos[current];
    const next = videos[index];
    current = index;

    next.currentTime = 0;
    next.play().catch(() => {});
    next.classList.add("is-active");
    if (prev !== next) {
      prev.classList.remove("is-active");
      setTimeout(() => prev.pause(), 1200);
    }

    scenes.forEach((scene, i) => {
      scene.classList.toggle("is-active", i === index);
      scene.style.setProperty("--scene-duration", `${next.duration || 8}s`);
    });

    // Warm up the following clip so the crossfade doesn't wait on the network.
    const upcoming = videos[(index + 1) % videos.length];
    if (upcoming.preload === "none") {
      upcoming.preload = "auto";
      upcoming.load();
    }
  }

  videos.forEach((video, i) => {
    video.addEventListener("ended", () => {
      if (i === current) show((current + 1) % videos.length);
    });
    video.addEventListener("loadedmetadata", () => {
      if (i === current) scenes[i]?.style.setProperty("--scene-duration", `${video.duration}s`);
    });
  });

  // Pause while the hero is off-screen.
  new IntersectionObserver(([entry]) => {
    const video = videos[current];
    if (entry.isIntersecting) video.play().catch(() => {});
    else video.pause();
  }).observe(media);

  show(0);
}
