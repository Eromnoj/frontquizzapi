import React, { useState } from "react";
import styles from "../styles/components/InputsComponent.module.scss";
// import { inputsComponentProps } from '../types/Props';

type inputsComponentProps = {
  type:
    | "text"
    | "number"
    | "email"
    | "password"
    | "date"
    | "tel"
    | "search"
    | "select"
    | "textarea"
    | "radio"
    | "checkbox";
  label: string;
  name?: string;
  placeholder?: string;
  value?: string | string[];
  onChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => void;
  radioOptions?: {
    checked?: boolean | undefined; id: string; label: string 
}[]; // For radio inputs
  radioName?: string; // For radio inputs
  tabIndex?: number; // Add tabIndex prop
  options?: { id: string; name: string; }[]; // For select inputs
  error?: string;
};

function InputsComponent({
  type,
  label,
  name,
  placeholder,
  value,
  onChange,
  tabIndex,
  error,
  radioName,
  radioOptions,
  options,
}: inputsComponentProps): React.JSX.Element | null {
  const [showError] = useState(error?.trim() !== "");

  switch (type) {
    case "text":
      return (
        <div className={styles.inputField}>
          <label htmlFor={name}>{label}</label>
          <input
            type="text"
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            aria-label={label}
            tabIndex={tabIndex}
          />
          {showError && <span className={styles.error}>{error}</span>}
        </div>
      );
    case "number":
      return (
        <div className={styles.inputField}>
          <label htmlFor={name}>{label}</label>
          <input
            type="number"
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            aria-label={label}
            tabIndex={tabIndex}
          />
          {showError && <span className={styles.error}>{error}</span>}
        </div>
      );
    case "email":
      return (
        <div className={styles.inputField}>
          <label htmlFor={name}>{label}</label>
          <input
            type="email"
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            aria-label={label}
            tabIndex={tabIndex}
          />
          {showError && <span className={styles.error}>{error}</span>}
        </div>
      );
    case "password":
      return (
        <div className={styles.inputField}>
          <label htmlFor={name}>{label}</label>
          <input
            type="password"
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            aria-label={label}
            tabIndex={tabIndex}
          />
          {showError && <span className={styles.error}>{error}</span>}
        </div>
      );
    case "date":
      return (
        <div className={styles.inputField}>
          <label htmlFor={name}>{label}</label>
          <input
            type="date"
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            aria-label={label}
            tabIndex={tabIndex}
          />
          {showError && <span className={styles.error}>{error}</span>}
        </div>
      );
    case "tel":
      return (
        <div className={styles.inputField}>
          <label htmlFor={name}>{label}</label>
          <input
            type="tel"
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            aria-label={label}
            tabIndex={tabIndex}
          />
          {showError && <span className={styles.error}>{error}</span>}
        </div>
      );
    // case 'search':
    //   return (
    //     <div className={styles.inputField}>
    //       <label htmlFor={name}>{label}</label>
    //       <div className={styles.searchInput}>
    //         <input type='search' name={name} placeholder={placeholder} value={value} onChange={onChange} aria-label={label} tabIndex={tabIndex} />
    //         <img src={search} alt='search' />
    //       </div>
    //       {showError && <span className={styles.error}>{error}</span>}
    //     </div>
    //   );
    case "select":
      return (
        <div className={styles.inputField}>
          <label htmlFor={name}>{label}</label>
          <select
            name={name}
            onChange={onChange}
            aria-label={label}
            tabIndex={tabIndex}
            value={value}
          >
            <option value="">Choisir une catégorie</option>
            {options?.map((el, i) => (
              <option key={i} value={el.id}>
                {el.name}
              </option>
            ))}
          </select>
          {showError && <span className={styles.error}>{error}</span>}
        </div>
      );
    case "textarea":
      return (
        <div className={styles.inputField}>
          <label htmlFor={name}>{label}</label>
          <textarea
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            aria-label={label}
            tabIndex={tabIndex}
          />
          {showError && <span className={styles.error}>{error}</span>}
        </div>
      );
    case "checkbox":
      return (
        <div className={styles.inputField}>
          <label htmlFor={name}>{label}</label>
          <input
            type="checkbox"
            name={name}
            value={value}
            onChange={onChange}
            aria-label={label}
            tabIndex={tabIndex}
          />
          {showError && <span className={styles.error}>{error}</span>}
        </div>
      );
    case "radio":
      return (
        <div className={styles.inputField}>
          <label>{label}</label>
          <div className={styles.radiosList}>
            {radioOptions?.map((option) => (
              <div key={option.id} className={styles.radioOption}>
                <input
                  type="radio"
                  id={option.id}
                  name={radioName}
                  value={option.id}
                  onChange={onChange}
                  aria-label={option.label}
                  tabIndex={tabIndex}
                  checked={option.checked}
                />
                <label htmlFor={option.id}>{option.label}</label>
              </div>
            ))}
          </div>
          {showError && <span className={styles.error}>{error}</span>}
        </div>
      );
    default:
      return null;
  }
}
export default InputsComponent;
