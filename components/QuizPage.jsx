"use client";
import React from "react";
import Loader from "@components/Loader";
import axios from "axios";
import { useState } from "react";
import QuestionForm from "./QuestionForm";
import Link from "next/link";

const QuizPage = ({ initialData, onSave, onClose }) => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState(
    initialData || { title: "", questions: [] }
  );

  const handleChange = (index, field, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index][field] = value;
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const handleAddOption = (questionIndex) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].options.push({
      text: "",
      isCorrect: false,
    });
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const handleOptionChange = (questionIndex, optionIndex, field, value) => {
    const updatedQuestions = [...formData.questions];
    const question = updatedQuestions[questionIndex];
    question.options[optionIndex][field] = value;
    if (question.q_type === "MCQ" && field === "isCorrect" && value) {
      question.options.forEach((option, idx) => {
        if (idx !== optionIndex) {
          option.isCorrect = false;
        }
      });
    }
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const handleAddQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        { q_type: "MCQ", format: "", content: "", options: [] },
      ],
    });
  };

  const handleRemoveOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].options.splice(optionIndex, 1);
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const handleRemoveQuestion = (questionIndex) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions.splice(questionIndex, 1);
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const handleChangeQType = (index, key, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index][key] = value;
    updatedQuestions[index].options.forEach((option, idx) => {
      option.isCorrect = false;
    });
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const handleSave = async (id = null) => {
    if (id) {
      console.log("edit this!");
      try {
        setLoading(true);
        const { data } = await axios.put(`/api/quiz/${id}`, formData);
        setLoading(false);
        alert(data.message);
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("new one!!");
      try {
        setLoading(true);
        const { data } = await axios.post(`/api/quiz`, formData);
        setLoading(false);
        alert(data.message);
      } catch (error) {
        console.log(error);
      }
    }
  };
  console.log(initialData);
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
        <button
          onClick={() => {
            setSingleQuizData(null);
            setIsModalOpen(true);
          }}
          className="px-4 mr-24 w-fit py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add Question
        </button>
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
                    {question.content.substring(0, 60)}{question.content.length < 60 ? "" : "..."}
                  </h1>
                  <h3>Type: {question.q_type}</h3>
                  <h3>Explanation: {question.explanation.substring(0, 60)}{question.explanation.length < 60 ? "" : "..."}</h3>
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <Link href={`${initialData?.id}/new`}>
                    <button
                      className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Edit
                    </button>
                  </Link>
                  <button
                    // onClick={handleDelete(quiz._id)}
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
