"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import Loader from "@components/Loader";
import QuizPage from "@components/QuizPage";

function Teams() {
  //   const router = useRouter();
  const [quizzes, setQuizzes] = useState([]);
  const [singleQuizData, setSingleQuizData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/quiz`);
      setQuizzes(data.quizzes);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  const handleDelete = (id) => async () => {
    try {
      setLoading(true);
      const { data } = await axios.delete(`/api/quiz/${id}`);
      alert(data.message);
      setQuizzes((prevQuizzes) =>
        prevQuizzes.filter((quiz) => quiz._id !== id)
      );
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  const handleSave = () => {
    getData();
    setIsModalOpen(false);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    getData();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      {isModalOpen && (
        <QuizPage
          initialData={singleQuizData}
          onSave={handleSave}
          onClose={handleCloseModal}
        />
      )}
      <div className="p-4 bg-white block sm:flex items-center justify-between border-b border-gray-200 lg:mt-1.5">
        <div className="w-full mb-1">
          <div className="mb-4">
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
              All Quizzes
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
          Create Quiz
        </button>
      </div>
      <div>
        {quizzes.map((quiz, index) => (
          <div
            key={index}
            className="p-2 bg-white block sm:flex items-center justify-between border rounded-md mr-24 border-gray-800 lg:mt-1.5 "
          >
            <div className="w-full mb-1">
              <div className="flex items-center gap-2 justify-between">
                <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl ">
                  {quiz.title}
                </h1>
                <div className="flex items-center gap-2 justify-end">
                  <button
                    onClick={() => {
                      setSingleQuizData(quiz);
                      setIsModalOpen(true);
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete(quiz._id)}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Teams;
