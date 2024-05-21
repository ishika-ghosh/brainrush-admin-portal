"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import UserForm from "@components/UserForm";
import { signIn } from "next-auth/react";

function page() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async () => {
    // console.log(formData);
    try {
      setLoading(true);

      const res = await signIn("credentials", {
        username: formData.username,
        password: formData.password,
        redirect: true,
        callbackUrl: "/",
      });
      console.log(res);
      setLoading(false);
    } catch (error) {}
  };
  return (
    <UserForm
      formData={formData}
      loading={loading}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      createUser={false}
    />
  );
}

export default page;
