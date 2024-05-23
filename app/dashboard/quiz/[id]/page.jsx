"use client"
import React, { useEffect, useState } from 'react';
import QuizPage from '@components/QuizPage';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const Quiz = ({ params }) => {
    const { id } = params;
    const [initialData, setInitialData] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter()
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

    const handleDelete = async (id, qid) => {
        console.log("hello")
        try {
            setLoading(true);
            const { data } = await axios.delete(`/api/quiz/${id}/${qid}`);
            if (data.status)
                window.location.reload();
            else
                alert(data.message);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
        // You can handle the data here (e.g., send it to an API)
    };

    return (
        loading ? <p>Loading...</p> :
            <div>
                {initialData &&
                    <QuizPage
                        initialData={initialData}
                        handleDelete={handleDelete}
                    />}
            </div>
    );
};

export default Quiz;
