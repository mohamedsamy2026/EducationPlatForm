import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faPlay } from "@fortawesome/free-solid-svg-icons";

function getYouTubeVideoId(url) {
  if (!url) {
    return null;
  }

  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.hostname.includes("youtu.be")) {
      return parsedUrl.pathname.replace("/", "").trim() || null;
    }

    if (parsedUrl.hostname.includes("youtube.com")) {
      if (parsedUrl.pathname === "/watch") {
        return parsedUrl.searchParams.get("v");
      }

      if (parsedUrl.pathname.startsWith("/embed/")) {
        return parsedUrl.pathname.split("/embed/")[1]?.split("/")[0] || null;
      }

      if (parsedUrl.pathname.startsWith("/shorts/")) {
        return parsedUrl.pathname.split("/shorts/")[1]?.split("/")[0] || null;
      }
    }
  } catch {
    return null;
  }

  return null;
}

export default function LessonVideo({ videoUrl }) {
  const videoId = getYouTubeVideoId(videoUrl);

  if (!videoId) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-2xl border border-white/10 bg-[#091a2b] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-gold/20 bg-gold/10 text-xl text-gold">
            <FontAwesomeIcon icon={faPlay} />
          </div>

          <h2 className="mt-5 text-lg font-extrabold text-white">
            لم تتم إضافة فيديو لهذا الدرس بعد
          </h2>

          <p className="mt-2 text-sm leading-7 text-white/80">
            سيتم إضافة الفيديو إلى الدرس من لوحة تحكم المدرس.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="select-none overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_25px_70px_rgba(0,0,0,0.30)]"
      onContextMenu={(event) => event.preventDefault()}
      onDragStart={(event) => event.preventDefault()}
      onSelectStart={(event) => event.preventDefault()}
      onCopy={(event) => event.preventDefault()}
      onCut={(event) => event.preventDefault()}
    >
      <div className="aspect-video w-full">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?rel=0&disablekb=1`}
          title="فيديو الدرس"
          className="h-full w-full"
          draggable={false}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    </div>
  );
}
