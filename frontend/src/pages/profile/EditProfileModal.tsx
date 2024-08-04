import { Fragment, useEffect } from "react";
import { useForm } from "react-hook-form";
import { editProfileSchema, editProfileSchemaType } from "../../lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const EditProfileModal = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    clearErrors,
    reset,
  } = useForm<editProfileSchemaType>({
    resolver: zodResolver(editProfileSchema),
  });

  const currentPassword = watch("currentPassword");
  const newPassword = watch("newPassword");

  useEffect(() => {
    if (currentPassword && newPassword) clearErrors("password");
  }, [currentPassword, newPassword]);

  const handleEditProfile = async (
    editProfileFormData: editProfileSchemaType
  ) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log(editProfileFormData);
    reset();
    (
      document.getElementById("edit_profile_modal") as HTMLDialogElement
    ).close();
  };

  return (
    <Fragment>
      <button
        className="btn btn-outline rounded-full btn-sm"
        onClick={() =>
          (
            document.getElementById("edit_profile_modal") as HTMLDialogElement
          ).showModal()
        }
      >
        Edit profile
      </button>
      <dialog id="edit_profile_modal" className="modal">
        <div className="modal-box border rounded-md border-gray-700 shadow-md">
          <h3 className="font-bold text-lg my-3">Update Profile</h3>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(handleEditProfile)}
          >
            <div className="w-full flex flex-wrap gap-2">
              <div className="flex-1 flex flex-col items-start gap-2">
                <input
                  {...register("fullName")}
                  type="text"
                  placeholder="Full Name"
                  className={`w-full input border border-gray-700 rounded p-2 input-md 
                  ${
                    errors?.fullName ? "input-error" : "focus:outline-primary"
                  }`}
                  name="fullName"
                  disabled={isSubmitting}
                />
                {errors?.fullName && (
                  <p className="text-sm text-red-500 flex-wrap">
                    {errors?.fullName.message}
                  </p>
                )}
              </div>
              <div className="flex-1 flex flex-col items-start gap-2">
                <input
                  {...register("username")}
                  type="text"
                  placeholder="Username"
                  className={`w-full input border border-gray-700 rounded p-2 input-md 
                  ${
                    errors?.username ? "input-error" : "focus:outline-primary"
                  }`}
                  name="username"
                  disabled={isSubmitting}
                />
                {errors?.username && (
                  <p className="text-sm text-red-500 flex-wrap">
                    {errors?.username.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex-1 flex flex-wrap gap-2">
              <div className="flex-1 flex flex-col items-start gap-2">
                <input
                  {...register("email")}
                  type="email"
                  placeholder="Email"
                  className={`w-full input border border-gray-700 rounded p-2 input-md 
                  ${errors?.email ? "input-error" : "focus:outline-primary"}`}
                  name="email"
                  disabled={isSubmitting}
                />
                {errors?.email && (
                  <p className="text-sm text-red-500 flex-wrap">
                    {errors?.email.message}
                  </p>
                )}
              </div>
              <div className="flex-1 flex flex-col items-start gap-2">
                <textarea
                  {...register("bio")}
                  placeholder="Bio"
                  className={`w-full input border border-gray-700 rounded p-2 input-md 
                  ${errors?.bio ? "input-error" : "focus:outline-primary"}`}
                  name="bio"
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <div className="flex-1 flex flex-wrap gap-2">
              <div className="flex-1 flex flex-col items-start gap-2">
                <input
                  {...register("currentPassword")}
                  type="password"
                  placeholder="Current Password"
                  className={`w-full input border border-gray-700 rounded p-2 input-md 
                  ${
                    errors?.currentPassword
                      ? "input-error"
                      : "focus:outline-primary"
                  }`}
                  name="currentPassword"
                  disabled={isSubmitting}
                />
                {errors?.currentPassword && (
                  <p className="text-sm text-red-500 flex-wrap">
                    {errors?.currentPassword.message}
                  </p>
                )}
              </div>
              <div className="flex-1 flex flex-col items-start gap-2">
                <input
                  {...register("newPassword")}
                  type="password"
                  placeholder="New Password"
                  className={`w-full input border border-gray-700 rounded p-2 input-md 
                  ${
                    errors?.newPassword
                      ? "input-error"
                      : "focus:outline-primary"
                  }`}
                  name="newPassword"
                  disabled={isSubmitting}
                />
                {errors?.newPassword && (
                  <p className="text-sm text-red-500 flex-wrap">
                    {errors?.newPassword.message}
                  </p>
                )}
              </div>
            </div>
            {errors?.password && (
              <p className="text-sm text-red-500 flex-wrap">
                {errors?.password.message}
              </p>
            )}
            <input
              {...register("link")}
              type="text"
              placeholder="Link"
              className={`w-full input border border-gray-700 rounded p-2 input-md 
                  ${errors?.link ? "input-error" : "focus:outline-primary"}`}
              name="link"
              disabled={isSubmitting}
            />
            {errors?.link && (
              <p className="text-sm text-red-500 flex-wrap">
                {errors?.link.message}
              </p>
            )}
            <button className="btn btn-primary rounded-full btn-sm text-white">
              {isSubmitting ? <LoadingSpinner size="sm" /> : "Update"}
            </button>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button className="outline-none" aria-label="close" />
        </form>
      </dialog>
    </Fragment>
  );
};
export default EditProfileModal;
