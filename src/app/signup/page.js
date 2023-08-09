"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    name: "",
    password: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);

  const onSignup = async (e) => {
    e.preventDefault();
    const email = user.email;
    const password = user.password;
    const name = user.name;
    const phone = user.phone;
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/user/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name, phone }),
        }
      );
      const data = await res.json();

      if (data.status === "SUCCESS") {
        localStorage.setItem("user", JSON.stringify(data.data.user));
        localStorage.setItem("token", data.data.token);
        alert(data.status);
        router.push("/home");
      } else {
        alert(data.message);
        console.error("Sign-in Failed:", error);
      }
    } catch (error) {
      alert(error);
      console.error("Error signing in:", error);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="flex flex-col p-8 pl-20 pr-20 rounded-3xl  bg-gray-800">
        <h1 className="self-center p-5 text-2xl">Signup Form</h1>
        <form className="" action="">
          <div className="flex flex-col gap-4">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="text-black rounded-2xl p-2"
            />
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              className="text-black rounded-2xl p-2"
            />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              className="text-black rounded-2xl p-2"
            />
            <label htmlFor="phone">Phone</label>
            <input
              type="text"
              name="phone"
              id="phone"
              value={user.phone}
              onChange={(e) => setUser({ ...user, phone: e.target.value })}
              className="text-black rounded-2xl p-2"
            />
            <button
              type="submit"
              onClick={onSignup}
              className="text-xl bg-slate-900 mt-8 p-4 pl-8 pr-8 self-center rounded-2xl"
            >
              SignUp
            </button>
            {loading && <p>Loading...</p>}
            <Link className=" text-center" href="/login">
              Login instead
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
