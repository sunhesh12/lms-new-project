import Checkbox from "@/components/Checkbox";
import InputError from "@/components/InputError";
import InputLabel from "@/components/InputLabel";
import PrimaryButton from "@/components/PrimaryButton";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import style from "@/css/login.module.css";
import TextInput from "@/components/text-input";

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
            <div className={style["Login-Container-wrapper"]}>
            <div className={style["Login-Container"]}>
                <Head title="Log in" />

                {status && (
                    <div className="mb-4 text-sm font-medium text-green-600">
                        {status}
                    </div>
                )}

                <form onSubmit={submit}>
                    <div>
                        <InputLabel htmlFor="email" value="Email" />

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

                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="password" value="Password" />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            placeholder = "Enter your password"
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                        />

                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

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

                    <div className="mt-4 flex items-center justify-end">
                        {canResetPassword && (
                            <Link
                                href={route("password.request")}
                                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Forgot your password?
                            </Link>
                        )}

                        <PrimaryButton className="ms-4" disabled={processing}>
                            Log in
                        </PrimaryButton>
                    </div>
                </form>
            </div>
            </div>
        </GuestLayout>
    );
}
