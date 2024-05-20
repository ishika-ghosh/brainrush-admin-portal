"use client"
import React, { useEffect, useState } from 'react';
import QuizPage from '@components/QuizPage';
import axios from 'axios';

const Quiz = ({ params }) => {
    const { id } = params;
    const [initialData, setInitialData] = useState(null);
    const [loading, setLoading] = useState(false);
    const getData = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`/api/quiz/${id}`);
            setInitialData({ ...data, id });
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        getData();
    }, [])

    const handleQuestionSubmit = (questionData) => {
        console.log('Question Data:', questionData);
        // You can handle the data here (e.g., send it to an API)
    };

    return (
        loading ? <p>Loading...</p> :
            <div>
                {initialData &&
                    <QuizPage
                        initialData={initialData}
                    />}
            </div>
    );
};

export default Quiz;
