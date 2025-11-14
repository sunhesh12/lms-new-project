import Checkbox from "@/components/Checkbox";
import PrimaryButton from "@/components/PrimaryButton";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, useForm } from "@inertiajs/react";
import CustomLink from "@/components/Link";
import styles from "@/css/login.module.css";
import TextInput from "@/components/Input/TextInput";
import Button from "@/components/Button";

export default function Login({ status, canResetPassword }) {
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
                    <h1>Sign in</h1>

                    {status && (
                        <div className="mb-4 text-sm font-medium text-green-600">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className={styles.loginForm}>
                        {/* <InputLabel htmlFor="email" value="Email" />

                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            placeholder = "Enter your Email"
                            className="mt-1 block w-full"
                            autocomplete="new-password"
                            isFocused={true}
                            onChange={(e) => setData("email", e.target.value)}
                        />

                        <InputError message={errors.email} className="mt-2" /> */}
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            label="Email"
                            error=""
                            value={data.email}
                            placeholder="Enter your Email"
                            className="mt-1 block w-full"
                            onChange={(e) => setData("email", e.target.value)}
                        />
                        {/* <InputLabel htmlFor="password" value="Password" />

                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                placeholder="Enter your password"
                                className="mt-1 block w-full"
                                autoComplete="new-password"
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                            />

                            <InputError
                                message={errors.password}
                                className="mt-2"
                            /> */}
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            label="Password"
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

                                <CustomLink
                                    href={route("password.request")}
                                >
                                    Forgot your password ?
                                </CustomLink>
                        )}

                        <div>
                        

                            <Button disabled={processing}>Login</Button>
                        </div>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}
