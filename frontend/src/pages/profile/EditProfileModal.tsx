import { Fragment, useEffect } from "react";
import { useForm } from "react-hook-form";
import { editProfileSchema, editProfileSchemaType } from "../../lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "../../hooks/use-user";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/use-auth";

const EditProfileModal = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    clearErrors,
    reset,
  } = useForm<editProfileSchemaType>({
    resolver: zodResolver(editProfileSchema),
  });
  const currentPassword = watch("currentPassword");
  const newPassword = watch("newPassword");

  const { getAuthUser } = useAuth();
  const { data: authUser } = getAuthUser;
  const { updateProfile } = useUser();
  const { mutate: updateProfileMutate, isPending } = updateProfile;

  const navigate = useNavigate();

  useEffect(() => {
    if (currentPassword && newPassword) clearErrors("password");
  }, [currentPassword, newPassword]);

  useEffect(() => {
    if (authUser) {
      setValue("fullName", authUser.fullName);
      setValue("username", authUser.username);
      setValue("email", authUser.email);
      setValue("bio", authUser.bio ? authUser.bio : "");
      setValue("link", authUser.link ? authUser.link : "");
    }
  }, [authUser]);

  const hasChanged = (formData: editProfileSchemaType) => {
    return (
      formData.fullName !== authUser?.fullName ||
      formData.username !== authUser?.username ||
      formData.email !== authUser?.email ||
      formData.bio !== authUser?.bio ||
      formData.link !== authUser?.link
    );
  };

  const handleEditProfile = async (
    editProfileFormData: editProfileSchemaType
  ) => {
    if (!hasChanged(editProfileFormData))
      return (
        document.getElementById("edit_profile_modal") as HTMLDialogElement
      ).close();

    updateProfileMutate(editProfileFormData, {
      onSuccess: () => {
        navigate(`/profile/${editProfileFormData.username}`);
        reset();
        (
          document.getElementById("edit_profile_modal") as HTMLDialogElement
        ).close();
      },
    });
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
                  disabled={isPending}
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
                  disabled={isPending}
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
                  disabled={isPending}
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
                  disabled={isPending}
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
                  disabled={isPending}
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
                  disabled={isPending}
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
              disabled={isPending}
            />
            {errors?.link && (
              <p className="text-sm text-red-500 flex-wrap">
                {errors?.link.message}
              </p>
            )}
            <button
              className="btn btn-primary rounded-full btn-sm text-white"
              disabled={isPending}
            >
              {isPending ? "Updating..." : "Update"}
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
