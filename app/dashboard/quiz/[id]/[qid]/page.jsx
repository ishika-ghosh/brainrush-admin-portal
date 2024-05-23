"use client"
import React, { useEffect, useState } from 'react';
import QuestionForm from '@components/QuestionForm';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const CreateOrEditQuestion = ({ params }) => {
    const { id, qid } = params;
    const [initialData, setInitialData] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
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

    const handleQuestionSubmit = async (questionData) => {
        try {
            setLoading(true);
            const { data } = await axios.put(`/api/quiz/${id}/${qid}`, questionData);
            console.log(data)
            if (data.status === 200) {
                alert(data.message);
                router.back()
            } else
                alert(data.message);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
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
