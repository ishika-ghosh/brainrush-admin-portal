"use client"
import React, { useEffect, useState } from 'react';
import QuestionForm from '@components/QuestionForm';
import axios from 'axios';

const CreateOrEditQuestion = ({ params }) => {
    const { id, qid } = params;
    const [initialData, setInitialData] = useState(null);
    const [loading, setLoading] = useState(false);
    const getData = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`/api/quiz/${id}/${qid}`);
            setInitialData(data.question);
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
                    <QuestionForm
                        initialData={initialData}
                        onSubmit={handleQuestionSubmit}
                        mode="edit"
                    />}
            </div>
    );
};

export default CreateOrEditQuestion;
