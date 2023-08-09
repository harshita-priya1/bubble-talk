"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import CreatePostModal from "./components/CreatePost";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  let token = useRef(null);
  let user = useRef(null);
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isUserPosts, setIsUserPosts] = useState(false);

  useEffect(() => {
    token.current = localStorage.getItem("token");
    user.current = localStorage.getItem("user");
    if (user.current) {
      user.current = JSON.parse(user.current);
    }
    console.log("user:", user.current);
  }, []);

  useEffect(() => {
    fetchPaginatedPosts(1);
  }, [isUserPosts]);

  const fetchPaginatedPosts = async (page) => {
    console.log("for:", isUserPosts ? "user" : "all");
    try {
      let response;
      if (isUserPosts) {
        response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/posts/fetchUserPosts?page=${page}&userID=${user.current._id}`,
          {
            headers: {
              Authorization: `Bearer ${token.current}`,
            },
          }
        );
      } else {
        response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/posts/fetchPosts?page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${token.current}`,
            },
          }
        );
      }
      console.log(response);
      const data = await response.json();
      setPosts((prev) => {
        prev = data.posts;
        return prev;
      });
      setCurrentPage((prev) => {
        prev = data.currentPage;
        return prev;
      });
      setTotalPages((prev) => {
        prev = data.totalPages;
        return prev;
      });
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };
  const handlePageChange = (page) => {
    setCurrentPage((prev) => {
      prev = page;
      return prev;
    });
    fetchPaginatedPosts(page);
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };
  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };
  const handleLogout = () => {
    // Clear out the cookies
    localStorage.clear();
    router.push("/login");
    // Route to the /login page
  };
  const handleRefresh = () => {
    fetchPaginatedPosts(1);
  };
  const deletePost = async (postID) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/posts/delete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.current}`,
          },
          body: JSON.stringify({
            postID: postID,
            userID: user.current._id,
          }),
        }
      );
      const data = await response.json();
      if (data.status === 200) {
        fetchPaginatedPosts(1);
        alert("Post deleted successfully");
      } else {
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const onClose = () => {
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Navbar */}
      <nav className="bg-eled text-white p-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Bubble Talk!💬</h1>
        <div className="space-x-2">
          <button
            className="text-white bg-btn hover:bg-btnh px-3 py-2 rounded"
            onClick={() => {
              router.push("/chats");
            }}
          >
            Chats
          </button>
          <button
            className="text-white bg-btn hover:bg-btnh px-3 py-2 rounded"
            onClick={() => {
              setIsUserPosts((prev) => !prev);
            }}
          >
            {isUserPosts ? "Home" : "My Posts"}
          </button>

          <button
            className="text-white bg-btn hover:bg-btnh px-3 py-2 rounded"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-1 items-center justify-center bg-bgd p-4">
        <div className="max-w-xl w-full space-y-4">
          <div className="flex justify-center mt-4 gap-4 text-center pb-6">
            <button
              className="bg-btn text-white py-2 px-4 rounded shadow hover:bg-btnh w-full sm:w-auto"
              onClick={handleRefresh}
            >
              Refresh
            </button>
            {currentPage > 1 ? (
              <button
                className="bg-btn text-white py-2 px-4 rounded shadow hover:bg-btnh mr-2"
                onClick={handlePrevPage}
              >
                Previous
              </button>
            ) : null}
            <span className="text-btn text-lg font-semibold">
              Page {currentPage} of {totalPages}
            </span>
            {currentPage < totalPages ? (
              <button
                className="bg-btn text-white py-2 px-4 rounded shadow hover:bg-btnh ml-2"
                onClick={handleNextPage}
              >
                Next
              </button>
            ) : null}
          </div>

          {/* Iterate through the posts and display as cards */}
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-elel rounded-lg shadow p-4 transition-transform transform hover:-translate-y-2"
            >
              {isUserPosts ? (
                <button
                  className="bg-btn text-white py-2 px-4 mx-2 my-2 rounded shadow hover:bg-btnh ml-2"
                  onClick={() => {
                    console.log(
                      "delete post:",
                      post._id,
                      " by user:",
                      user.current._id
                    );
                    deletePost(post._id);
                  }}
                >
                  Delete
                </button>
              ) : null}
              {post.image ? (
                <img
                  src={`data:${post.image.contentType};base64,${Buffer.from(
                    post.image.data
                  ).toString("base64")}`}
                  alt={post.description}
                  className="w-full object-cover rounded-lg mb-4"
                />
              ) : null}
              <p className="text-black font-semibold mb-2">
                {post.creatorName}
              </p>
              <p className="text-gray-600 mb-4">{post.description}</p>
              <p className="text-gray-500 text-sm">
                {new Date(post.date).toDateString()}
              </p>
            </div>
          ))}

          {/* + Button for Create Post */}
          <button
            className="h-20 w-20 fixed bottom-10 right-10 bg-btn text-white p-4 rounded-full shadow-lg hover:bg-btnh text-center text-3xl"
            onClick={() => setShowModal(true)}
          >
            +
          </button>

          {/* Create Post Modal */}
          {showModal && (
            <CreatePostModal
              onClose={onClose}
              fetchPosts={fetchPaginatedPosts}
            />
          )}
        </div>
      </div>
    </div>
  );
}
