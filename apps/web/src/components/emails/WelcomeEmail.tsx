export const WelcomeEmail = () => (
  <div
    style={{
      backgroundColor: "#000000",
      color: "#ffffff",
      fontFamily: '"Space Grotesk", sans-serif',
      padding: "40px",
      border: "8px solid #ffff00",
      maxWidth: "600px",
      margin: "0 auto",
    }}
  >
    <h1
      style={{
        fontSize: "48px",
        fontWeight: "900",
        textTransform: "uppercase",
        lineHeight: "1",
        letterSpacing: "-2px",
        margin: "0 0 24px 0",
        color: "#ffff00",
      }}
    >
      Welcome to <br />
      the Future.
    </h1>

    <p
      style={{
        fontSize: "20px",
        fontWeight: "500",
        lineHeight: "1.4",
        margin: "0 0 32px 0",
        color: "#ffffff",
      }}
    >
      You&apos;re officially on the list. We&apos;re building the AI senior
      engineer that&apos;s going to change how you ship code forever.
    </p>

    <div
      style={{
        backgroundColor: "#ffff00",
        padding: "24px",
        border: "4px solid #000000",
        marginBottom: "32px",
      }}
    >
      <p
        style={{
          color: "#000000",
          fontWeight: "900",
          fontSize: "18px",
          textTransform: "uppercase",
          margin: "0 0 12px 0",
        }}
      >
        ONE QUICK FAVOR...
      </p>
      <p
        style={{
          color: "#000000",
          fontWeight: "500",
          fontSize: "16px",
          margin: "0 0 20px 0",
        }}
      >
        <span style={{ color: "#000000" }}>
          Show your support and help us grow by starring our GitHub repository.
        </span>
      </p>
      <a
        href="https://github.com/dinocodesx/git-merge-buddy"
        style={{
          display: "inline-block",
          backgroundColor: "#000000",
          color: "#ffff00",
          padding: "12px 24px",
          fontWeight: "900",
          textDecoration: "none",
          textTransform: "uppercase",
          border: "2px solid #000000",
        }}
      >
        Star on GitHub
      </a>
    </div>

    <p
      style={{
        fontSize: "14px",
        opacity: "0.6",
        margin: "40px 0 0 0",
        textTransform: "uppercase",
        fontWeight: "700",
        color: "#ffffff",
      }}
    >
      © 2024 Git Merge Buddy. <br />
      CODE OR DIE.
    </p>
  </div>
);
