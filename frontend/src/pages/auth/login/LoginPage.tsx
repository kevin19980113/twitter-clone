import { Link } from "react-router-dom";
import XSvg from "../../../components/svgs/X";
import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";
import { useForm } from "react-hook-form";
import { loginSchema, loginSchemaType } from "../../../lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../../hooks/use-auth";

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<loginSchemaType>({
    resolver: zodResolver(loginSchema),
  });
  const { login } = useAuth();
  const { mutate: loginMutate, isPending } = login;

  const handleLogin = async (loginFormData: loginSchemaType) => {
    loginMutate(loginFormData);
  };

  return (
    <div className="max-w-screen-xl mx-auto flex h-screen">
      <div className="hidden lg:flex items-center justify-center">
        <XSvg className="lg:w-2/3 fill-white" />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center">
        <form
          className="w-[250px] sm:w-[350px] mx-auto md:mx-20 flex gap-4 flex-col"
          onSubmit={handleSubmit(handleLogin)}
        >
          <XSvg className="w-24 lg:hidden fill-white" />
          <h1 className="text-4xl font-extrabold text-white">{"Let's"} go</h1>
          <div className="w-full flex flex-col items-start gap-2">
            <label
              className={`input rounded flex items-center gap-2 w-full ${
                errors?.username ? "input-error" : "input-bordered"
              }`}
            >
              <MdOutlineMail />
              <input
                {...register("username")}
                type="text"
                className="grow"
                placeholder="username"
                name="username"
                disabled={isPending}
              />
            </label>
            {errors?.username && (
              <p className="text-sm text-red-500">{errors?.username.message}</p>
            )}
          </div>
          <div className="w-full flex flex-col items-start gap-2">
            <label
              className={`input rounded flex items-center gap-2 w-full ${
                errors?.password ? "input-error" : "input-bordered"
              }`}
            >
              <MdPassword />
              <input
                {...register("password")}
                type="password"
                className="grow"
                placeholder="Password"
                name="password"
                disabled={isPending}
              />
            </label>
            {errors?.password && (
              <p className="text-sm text-red-500 flex-wrap">
                {errors?.password.message}
              </p>
            )}
          </div>
          <button
            className="btn rounded-full btn-primary text-white"
            disabled={isPending}
          >
            {isPending ? "Loging in..." : "Login"}
          </button>
        </form>
        <div className="flex flex-col gap-2 mt-4">
          <p className="text-white text-lg">{"Don't"} have an account?</p>
          <Link to="/signup">
            <button
              className="btn rounded-full btn-primary text-white btn-outline w-full"
              disabled={isPending}
            >
              Sign up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
