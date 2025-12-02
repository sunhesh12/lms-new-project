import Checkbox from "@/components/Input/Checkbox";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, useForm } from "@inertiajs/react";
import CustomLink from "@/components/Links/Link";
import styles from "@/css/login.module.css";
import TextInput from "@/components/Input/TextInput";
import Button from "@/components/Input/Button";
import { faEnvelope, faKey } from "@fortawesome/free-solid-svg-icons";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("login.submit"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Login" />

            <div className={styles.loginPage}>
                <div className={styles.loginFormContainer}>
                    <h1>Sign in</h1>

                    <form onSubmit={submit} className={styles.loginForm}>
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            label="Email"
                            icon={faEnvelope}
                            error={errors.email}
                            value={data.email}
                            placeholder="Enter your Email"
                            onChange={(e) => setData("email", e.target.value)}
                        />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            label="Password"
                            icon={faKey}
                            error={errors.password}
                            value={data.password}
                            placeholder="Enter your Password"
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                        />

                        <div className="mt-4 block">
                            <label className="flex items-center">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) =>
                                        setData("remember", e.target.checked)
                                    }
                                />
                                <span className="ms-2 text-sm text-gray-600">
                                    Remember me
                                </span>
                            </label>
                        </div>

                        {canResetPassword && (
                            <CustomLink href={route("password.request")}>
                                Forgot your password?
                            </CustomLink>
                        )}

                        <div>
                            <Button disabled={processing}>Login</Button>
                        </div>

                        <span>
                            New to the LMS?{" "}
                            <CustomLink
                                href={route("register")}
                                className={styles.registerLink}
                            >
                                Register
                            </CustomLink>
                        </span>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}
