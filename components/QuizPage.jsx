"use client";
import React from "react";
import Loader from "@components/Loader";
import axios from "axios";
import { useState } from "react";
import QuestionForm from "./QuestionForm";
import Link from "next/link";

const QuizPage = ({ initialData, onSave, onClose, handleDelete }) => {
  const [loading, setLoading] = useState(false);

  return loading ? (
    <Loader />
  ) : (
    <>
      <div className="p-4 bg-white block sm:flex items-center justify-between border-b border-gray-200 lg:mt-1.5">
        <div className="w-full mb-1">
          <div className="mb-4">
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
              {initialData.message.split(' ').slice(0, -1).join(' ')}
            </h1>
          </div>
        </div>
        <Link
          href={`${initialData?.id}/new`}
          className="px-4 mr-24 w-fit py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add Question
        </Link>
      </div>
      <div>
        {initialData?.questions?.map((question, index) => (
          <div
            key={index}
            className="p-2 mb-2 bg-white block sm:flex items-center justify-between border rounded-md mr-24 border-gray-800 lg:mt-1.5"
          >
            <div className="w-full mb-1">
              <div className="flex items-center gap-2 justify-between">
                <div>
                  <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl ">
                    {question.content}
                  </h1>
                  <h3>Type: {question.q_type}</h3>
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <Link href={`${initialData?.id}/${question?._id}`}>
                    <button
                      className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Edit
                    </button>
                  </Link>
                  <button
                    onClick={() => { handleDelete(initialData?.id, question?._id) }}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div >
    </>
    // <QuestionForm initialData={null} onSubmit={() => { }} mode="create" />
  );
};

export default QuizPage;
