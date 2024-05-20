"use client"
import React, { useEffect, useState } from 'react';
import QuestionForm from '@components/QuestionForm';
import axios from 'axios';

const CreateOrEditQuestion = ({ params }) => {
    const { id } = params;
    const [initialData, setInitialData] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleQuestionSubmit = (questionData) => {
        console.log('Question Data:', questionData);
        // You can handle the data here (e.g., send it to an API)
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
