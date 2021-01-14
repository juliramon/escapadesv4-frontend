import { useRouter } from "next/router";
import React from "react";

const TestStorySlug = () => {
  const slug = "hello-world";
  const router = useRouter();
  console.log(router);
  return (
    <div>
      <h1>hello world</h1>
    </div>
  );
};

export default TestStorySlug;
