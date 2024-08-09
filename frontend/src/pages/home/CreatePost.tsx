import { CiImageOn } from "react-icons/ci";
//import { BsEmojiSmileFill } from "react-icons/bs";
import { useRef, useState, ChangeEvent } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useAuth } from "../../hooks/use-auth";
import { useForm } from "react-hook-form";
import { createPostSchema, createPostSchemaType } from "../../lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePost } from "../../hooks/use-post";

const CreatePost = () => {
  const [img, setImg] = useState<string | null>(null);
  const imgRef = useRef<HTMLInputElement | null>(null);

  const { getAuthUser } = useAuth();
  const { data: authUser } = getAuthUser;

  const { createPost } = usePost();
  const { mutate: createPostMutate, isPending, isError } = createPost;

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<createPostSchemaType>({
    resolver: zodResolver(createPostSchema),
  });

  const handleCreatePost = (createPostData: createPostSchemaType) => {
    createPostMutate(
      { ...createPostData, img },
      {
        onSuccess: () => {
          reset();
          setImg(null);
        },
      }
    );
  };

  const handleImgChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        if (typeof event.target?.result === "string") {
          setImg(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex p-4 items-start gap-4 border-b border-gray-700">
      <div className="avatar">
        <div className="size-10 rounded-full">
          <img src={authUser?.profileImg || "/avatar-placeholder.png"} />
        </div>
      </div>
      <form
        className="flex flex-col gap-2 w-full"
        onSubmit={handleSubmit(handleCreatePost)}
      >
        <textarea
          {...register("text")}
          className="textarea w-full h-36 p-0 text-base resize-none border-none focus:outline-none"
          placeholder="What is happening?!"
        />
        {errors.text && (
          <p className="text-sm text-red-500">{errors.text.message}</p>
        )}
        {img && (
          <div className="relative w-72 mx-auto mb-4">
            <IoCloseSharp
              className="absolute top-0 right-0 text-white bg-gray-800 rounded-full size-6 p-1 cursor-pointer hover:bg-gray-700"
              onClick={() => {
                setImg(null);
                if (imgRef.current) imgRef.current.value = "";
              }}
            />
            <img
              src={img}
              className="w-full mx-auto h-72 object-contain rounded"
            />
          </div>
        )}

        <div className="flex justify-between border-t py-2 border-t-gray-700">
          <div className="flex gap-1 items-center">
            <CiImageOn
              className="fill-primary size-6 cursor-pointer hover:fill-blue-400"
              onClick={() => imgRef.current?.click()}
            />
            {/* <BsEmojiSmileFill className="fill-primary w-5 h-5 cursor-pointer" /> */}
          </div>
          <input
            type="file"
            accept="image/*"
            hidden
            ref={imgRef}
            onChange={handleImgChange}
          />
          <button
            className="btn btn-primary rounded-full btn-sm text-white px-4"
            disabled={isPending}
          >
            {isPending ? "Posting..." : "Post"}
          </button>
        </div>
        {isError && (
          <div className="text-red-500">
            Something went wrong. Please Try Again.
          </div>
        )}
      </form>
    </div>
  );
};
export default CreatePost;
