function Logo({ className = "" }) {
  return (
    <div className={`fitpulse-logo-wrapper ${className}`}>
      <img
        src="/images/fitpulse-logo.png"
        alt="FITPULSE"
        className="fitpulse-logo"
      />

      <span className="fitpulse-logo-name">FITPULSE</span>
    </div>
  );
}

export default Logo;