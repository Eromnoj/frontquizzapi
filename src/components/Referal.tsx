
import unicorn from "../assets/unicorn.png";
import spaces from "../assets/spaces.png";
import styles from "../styles/Home.module.scss";

export default function Referal() {
  return (
    <div className={styles.referalSection}>
      <h2 className={styles.referalTitle}>L&apos;API est utilisée par&nbsp;:</h2>
      <ul>
        <li>
          <a href="https://www.twitch.tv/crazyquirkyunicorn" target="_blank" rel="noreferrer">
            <img src={unicorn} alt="Unicorn" />
            <span>CrazyQuirkyUnicorn sur Twitch</span>
          </a>
        </li>
        <li>
          <a href="https://spaces.tf/" target="_blank" rel="noreferrer">
            <img src={spaces} alt="Spaces" />
            <span>Spaces.tf Les mini-jeux live</span>
          </a>
        </li>
      </ul>
    </div>
  );
}