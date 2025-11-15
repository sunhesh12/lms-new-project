import Checkbox from "@/components/Checkbox";
import PrimaryButton from "@/components/PrimaryButton";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, useForm } from "@inertiajs/react";
import CustomLink from "@/components/Link";
import styles from "@/css/login.module.css";
import TextInput from "@/components/Input/TextInput";
import Button from "@/components/Button";
import { faEnvelope, faKey } from "@fortawesome/free-solid-svg-icons";

export default function register({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <GuestLayout>
            <div className={styles.loginPage}>
                <div className={styles.loginFormContainer}>
                    <h1>Sign Up</h1>

                    {status && (
                        <div className="mb-4 text-sm font-medium text-green-600">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className={styles.loginForm}>
                        <TextInput
                            id="name"
                            type="text"
                            name="name"
                            label="Name"
                            // icon={faEnvelope}
                            error=""
                            value={data.name}
                            placeholder="Enter your Name"
                            className="mt-1 block w-full"
                            onChange={(e) => setData("name", e.target.value)}
                        />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            label="Email"
                            // icon={faEnvelope}
                            error=""
                            value={data.email}
                            placeholder="Enter your Email"
                            className="mt-1 block w-full"
                            onChange={(e) => setData("email", e.target.value)}
                        />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            label="Password"
                            // icon={faKey}
                            error=""
                            value={data.password}
                            placeholder="Enter your Password"
                            className="mt-1 block w-full"
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
                                Forgot your password ?
                            </CustomLink>
                        )}

                        <div>
                            <Button disabled={processing}>Sign Up</Button>
                        </div>
                        <span>
                            Already have an account ?{" "}
                            <CustomLink
                                href={route("login")}
                                className={styles.registerLink}
                            >
                                Log in
                            </CustomLink>
                        </span>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}
