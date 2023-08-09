import { useState } from "react";
import compressImage from "./Compress";

const CreatePostModal = ({ onClose, fetchPosts }) => {
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageSelect = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);

    const reader = new FileReader();
    reader.readAsDataURL(selectedImage);

    reader.onload = (event) => {
      setImagePreview(event.target.result);
    };
  };

  // Function to handle post creation
  const handlePostCreate = async (e) => {
    e.preventDefault();
    try {
      // Get the token from cookies
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      const userID = user._id;
      const creatorName = user.name;
      console.log(description, userID, creatorName);

      // Compress the image before sending
      const compressedImage = image ? await compressImage(image) : null;

      const formData = new FormData();
      formData.append("description", description);
      formData.append("userID", userID);
      formData.append("creatorName", creatorName);
      if (compressImage != null) {
        formData.append("image", compressedImage);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/posts/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      console.log(response);
    } catch (error) {
      console.error("Error posting:", error);
    }

    await fetchPosts();
    // Close the modal
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-4 shadow-lg flex flex-col items-center justify-center">
        <h2 className="text-2xl font-semibold mb-4">Create Post</h2>
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Selected Preview"
            className="rounded-lg mb-4"
            style={{ maxWidth: "100%", maxHeight: "200px" }}
          />
        )}

        <textarea
          placeholder="Enter your post description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border border-gray-400 rounded-lg p-2 mb-4 w-full text-black text"
          rows={4} // You can set the initial number of rows here. The box will expand automatically as needed.
        />

        <div className="mb-4">
          {/* Add image attachment feature */}
          <label
            htmlFor="image"
            className="bg-purple-800 text-white px-4 py-2 rounded-lg cursor-pointer"
          >
            Attach Image
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={handlePostCreate}
            className="bg-purple-800 text-white px-4 py-2 rounded-lg mr-2"
          >
            Post
          </button>
          <button
            onClick={() => {
              setImage(null);
              setImagePreview(null);
              onClose();
            }}
            className="bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
