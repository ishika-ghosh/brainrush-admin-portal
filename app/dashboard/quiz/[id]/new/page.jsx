"use client"
import React, { useEffect, useState } from 'react';
import QuestionForm from '@components/QuestionForm';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const CreateOrEditQuestion = ({ params }) => {
    const { id } = params;
    const [initialData, setInitialData] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter()

    const handleQuestionSubmit = async (questionData) => {
        try {
            setLoading(true);
            const { data } = await axios.post(`/api/quiz/${id}`, questionData);
            console.log(data)
            if (data.status === 201) {
                alert(data.message);
                router.back()
            } else
                alert(data.message);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
        console.log('Question Data:', questionData);
    };

    return (
        loading ? <p>Loading...</p> :
            <div>
                <QuestionForm
                    initialData={null}
                    onSubmit={handleQuestionSubmit}
                    mode="create"
                />
            </div>
    );
};

export default CreateOrEditQuestion;
