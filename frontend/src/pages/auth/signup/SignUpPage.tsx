import { Link } from "react-router-dom";
import XSvg from "../../../components/svgs/X";
import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { useForm } from "react-hook-form";
import { signupSchema, signupSchemaType } from "../../../lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import { useAuth } from "../../../hooks/use-auth";

const SignUpPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<signupSchemaType>({
    resolver: zodResolver(signupSchema),
  });
  const { signup } = useAuth();
  const { mutate: signupMutate, isPending } = signup;

  const handleSignup = async (signupFormData: signupSchemaType) => {
    signupMutate(
      { ...signupFormData },
      {
        onSuccess: () => {
          reset();
        },
      }
    );
  };

  return (
    <div className="max-w-screen-xl mx-auto flex h-screen px-10">
      <div className="flex-1 hidden lg:flex items-center justify-center">
        <XSvg className="lg:w-2/3 fill-white" />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center">
        <form
          className="lg:w-2/3 mx-auto md:mx-20 flex gap-4 flex-col"
          onSubmit={handleSubmit(handleSignup)}
        >
          <XSvg className="w-24 lg:hidden fill-white" />
          <h1 className="text-4xl font-extrabold text-white">Join today</h1>

          <label
            className={`input rounded flex items-center gap-2 ${
              errors?.email ? "input-error" : "input-bordered"
            }`}
          >
            <MdOutlineMail />
            <input
              {...register("email")}
              type="email"
              className="grow"
              placeholder="Email"
              name="email"
              disabled={isPending}
            />
          </label>
          {errors?.email && (
            <p className="text-sm text-red-500 flex-wrap">
              {errors.email.message}
            </p>
          )}

          <div className="flex gap-4 flex-wrap">
            <div className="flex flex-col items-start flex-1 gap-2 flex-wrap">
              <label
                className={`input rounded flex items-center gap-2 w-full ${
                  errors?.username ? "input-error" : "input-bordered"
                }`}
              >
                <FaUser />
                <input
                  {...register("username")}
                  type="text"
                  className="grow"
                  placeholder="Username"
                  name="username"
                  disabled={isPending}
                />
              </label>
              {errors?.username && (
                <p className="text-sm text-red-500 flex-wrap">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div className="flex flex-col items-start grow gap-2">
              <label
                className={`input rounded flex items-center gap-2 w-full ${
                  errors?.fullName ? "input-error" : "input-bordered"
                }`}
              >
                <MdDriveFileRenameOutline />
                <input
                  {...register("fullName")}
                  type="text"
                  className="grow"
                  placeholder="Full Name"
                  name="fullName"
                  disabled={isPending}
                />
              </label>
              {errors?.fullName && (
                <p className="text-sm text-red-500 flex-wrap">
                  {errors.fullName.message}
                </p>
              )}
            </div>
          </div>
          <label
            className={`input rounded flex items-center gap-2 ${
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
              {errors.password.message}
            </p>
          )}
          <button className="btn rounded-full btn-primary text-white">
            {isPending ? <LoadingSpinner size="md" /> : "Sign up"}
          </button>
        </form>
        <div className="flex flex-col lg:w-2/3 gap-2 mt-4">
          <p className="text-white text-lg mx-auto">Already have an account?</p>
          <Link to="/login">
            <button className="btn rounded-full btn-primary text-white btn-outline w-full">
              Sign in
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default SignUpPage;
