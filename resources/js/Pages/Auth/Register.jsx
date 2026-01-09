import Checkbox from "@/components/Input/Checkbox";
import PrimaryButton from "@/components/PrimaryButton";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, useForm } from "@inertiajs/react";
import CustomLink from "@/components/Links/Link";
import styles from "@/css/login.module.css";
import TextInput from "@/components/Input/TextInput";
import Button from "@/components/Input/Button";
import { faEnvelope, faKey } from "@fortawesome/free-solid-svg-icons";

export default function Register({ flash }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("register.submit"), {
            onSuccess: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Sign Up" />
            <div className={styles.loginPage}>
                <div className={styles.loginFormContainer}>
                    <h1>Sign Up</h1>

                    {flash?.success && (
                        <div className={styles.successMessage}>
                            {flash.success}
                        </div>
                    )}

                    {flash?.error && (
                        <div className={styles.errorMessage}>
                            {flash.error}
                        </div>
                    )}

                    <form onSubmit={submit} className={styles.loginForm}>
                        <TextInput
                            id="name"
                            type="text"
                            name="name"
                            label="Name"
                            error={errors.name}
                            value={data.name}
                            placeholder="Enter your Name"
                            className={styles.wFull}
                            onChange={(e) => setData("name", e.target.value)}
                        />

                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            label="Email"
                            error={errors.email}
                            value={data.email}
                            placeholder="Enter your Email"
                            className={styles.wFull}
                            onChange={(e) => setData("email", e.target.value)}
                        />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            label="Password"
                            error={errors.password}
                            value={data.password}
                            placeholder="Enter your Password"
                            className={styles.wFull}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                        />

                        <TextInput
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            label="Confirm Password"
                            error={errors.password_confirmation}
                            value={data.password_confirmation}
                            placeholder="Confirm your Password"
                            className={styles.wFull}
                            onChange={(e) =>
                                setData("password_confirmation", e.target.value)
                            }
                        />

                        <div className={styles.rememberMe}>
                            <label className={styles.rememberMeLabel}>
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) =>
                                        setData("remember", e.target.checked)
                                    }
                                />
                                <span className={styles.rememberMeText}>
                                    Remember me
                                </span>
                            </label>
                        </div>

                        <div className={styles.signUpBtnWrapper}>
                            <Button type="submit" disabled={processing}>Sign Up</Button>
                        </div>

                        <span>
                            Already have an account?{" "}
                            <CustomLink
                                href={route("login")}
                                className={styles.registerLink}
                            >
                                Log In
                            </CustomLink>
                        </span>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}
