import styles from "@/css/components/text-input.module.css";

export default function TextInput({ className, ...props }) {
  return (
    <input className={className + " " + styles.input} {...props} />
  );
}
