"use client";
import React from "react";
import Loader from "@components/Loader";
import axios from "axios";
import { useState } from "react";

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

  return loading ? (
    <Loader />
  ) : (
    <div className="fixed inset-0 flex justify-center overflow-x-hidden z-50 bg-white p-10 rounded-lg  overflow-y-auto">
      <div className="relative bg-white  w-full h-full rounded-lg ">
        <div className="flex fixed right-10 justify-end p-2">
          <button
            type="button"
            className="text-gray-900  bg-gray-200 hover:bg-gray-300 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
            data-modal-toggle="delete-user-modal"
            onClick={onClose}
          >
            <svg
              className="w-7 h-7"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
        <form
          onSubmit={async () => {
            if (initialData) await handleSave(initialData._id);
            else await handleSave();
            onSave();
          }}
        >
          <input
            type="text"
            placeholder="Quiz Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full font-bold text-7xl border-0 rounded-lg focus:ring-0 focus:outline-none block"
          />
          {formData.questions.map((question, index) => (
            <div key={index}>
              <div className="flex flex-col mt-8 mb-4 justify-between">
                <textarea
                  type="text"
                  placeholder="Question Content"
                  value={question.content}
                  onChange={(e) =>
                    handleChange(index, "content", e.target.value)
                  }
                  className="w-full font-semibold text-2xl border-0 rounded-lg focus:outline-none block"
                />
              </div>
              {question.q_type !== "NAT" && (
                <div>
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="mb-2">
                      <div className="flex justify-between bg-slate-400 rounded-md p-5">
                        <div className="flex justify-start gap-4 items-center">
                          {question.q_type === "MCQ" ? (
                            <input
                              name={question._id}
                              type="radio"
                              checked={option.isCorrect}
                              onChange={(e) =>
                                handleOptionChange(
                                  index,
                                  optionIndex,
                                  "isCorrect",
                                  e.target.checked
                                )
                              }
                              className="appearance-none w-6 h-6 rounded-full border border-gray-900 checked:bg-green-600 focus:outline-none"
                            />
                          ) : (
                            <input
                              type="checkbox"
                              checked={option.isCorrect}
                              onChange={(e) =>
                                handleOptionChange(
                                  index,
                                  optionIndex,
                                  "isCorrect",
                                  e.target.checked
                                )
                              }
                              className="appearance-none w-6 h-6 rounded-full border border-gray-900 checked:bg-green-600 focus:outline-none"
                            />
                          )}
                          <input
                            type="text"
                            name={question._id}
                            placeholder={`Option ${optionIndex + 1}`}
                            value={option.text}
                            onChange={(e) =>
                              handleOptionChange(
                                index,
                                optionIndex,
                                "text",
                                e.target.value
                              )
                            }
                            className="w-full bg-slate-400 font-semibold text-2xl border-0 rounded-lg focus:ring-0 focus:outline-none block"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveOption(index, optionIndex)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleAddOption(index)}
                    className="w-full font-bold bg-red-300 rounded-md p-2"
                  >
                    + Add Option
                  </button>
                </div>
              )}
              <div className="flex mt-2 w-full font-bold rounded-md p-2 bg-gray-300 justify-evenly gap-4">
                <label
                  onClick={() => handleChangeQType(index, "q_type", "MCQ")}
                  className={`cursor-pointer ${
                    question.q_type === "MCQ" && "underline"
                  }`}
                >
                  <span>Single correct answer</span>
                </label>
                <label
                  onClick={() => handleChangeQType(index, "q_type", "MSQ")}
                  className={`cursor-pointer ${
                    question.q_type === "MSQ" && "underline"
                  }`}
                >
                  <span>Multiple correct answers</span>
                </label>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveQuestion(index)}
                className="w-full mt-2 font-bold text-white bg-red-600 rounded-md p-2"
              >
                Delete Question
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddQuestion}
            className="w-full mt-8 font-bold bg-orange-300 rounded-md p-2"
          >
            + Add Question
          </button>
          <button
            type="submit"
            className="w-full my-4 font-bold bg-green-400 rounded-md p-2"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default QuizPage;
