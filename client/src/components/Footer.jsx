import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

export default function Footer({ colors }) {
  return (
    <footer
      className="w-full border-t"
      style={{
        backgroundColor: colors.card,
        borderColor: colors.border,
      }}
    >
      <div className="max-w-[1400px] mx-auto px-6 py-5">
        {/* ===================== */}
        {/* MOBILE (new layout)   */}
        {/* ===================== */}
        <div className="md:hidden flex flex-col items-center text-center gap-2">
        {/* Text */}
        <div>
            <p
            className="text-sm font-medium"
            style={{ color: colors.foreground }}
            >
            Made by <span className="font-semibold">Ryan Yip Hui</span>
            </p>
        </div>

        {/* Icons BELOW */}
        <div className="flex items-center gap-4 mt-1">
            <a
            href="https://github.com/ryanyipp"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 transition hover:scale-110"
              style={{ color: colors.mutedForeground }}
            >
              <FaGithub size={18} /><span
                    className="text-xs font-medium"
                    style={{ color: colors.foreground }}
                >
                    GitHub
                </span>
            </a>

            <a
            href="https://linkedin.com/in/ryan-yip-776051303"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 transition hover:scale-110"
              style={{ color: colors.mutedForeground }}
            >
              <FaLinkedin size={18} /><span
                    className="text-xs font-medium"
                    style={{ color: colors.foreground }}
                >
                    LinkedIn
                </span>
            </a>

            <a
            href="mailto:ryanyh03@email.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 transition hover:scale-110"
              style={{ color: colors.mutedForeground }}
            >
              <FaEnvelope size={18} /><span
                    className="text-xs font-medium"
                    style={{ color: colors.foreground }}
                >
                    Email
                </span>
            </a>
        </div>
        </div>

        {/* ===================== */}
        {/* DESKTOP (old layout)  */}
        {/* ===================== */}
        <div className="hidden md:flex items-center justify-between">
          {/* left text (old) */}
          <div>
            <p className="text-md font-medium py-2" style={{ color: colors.foreground }}>
              Made by <span className="font-bold">Ryan Yip Hui</span>
            </p>
          </div>

          {/* right icons */}
          <div className="flex items-center gap-4" style={{ color: colors.mutedForeground }}>
            <a
              href="https://github.com/ryanyipp"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 transition hover:scale-110"
              style={{ color: colors.mutedForeground }}
            >
              <FaGithub size={24} /><p className="text-md font-medium py-2" style={{ color: colors.foreground }}>
              GitHub
            </p>
            </a>
            <a
                 href="https://linkedin.com/in/ryan-yip-776051303"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 transition hover:scale-110"
                style={{ color: colors.mutedForeground }}
                >
                <FaLinkedin size={24} />
                <span
                    className="text-md font-medium"
                    style={{ color: colors.foreground }}
                >
                    LinkedIn
                </span>
            </a>
            <a
            href="mailto:ryanyh03@email.com"
              className="flex items-center gap-1.5 transition hover:scale-110"
              style={{ color: colors.mutedForeground }}
            >
              <FaEnvelope size={18} /><span
                    className="text-md font-medium"
                    style={{ color: colors.foreground }}
                >
                    Email
                </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
