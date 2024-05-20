"use client"
import React, { useState, useEffect } from 'react';

const QuestionForm = ({ initialData, onSubmit, mode }) => {
    const [qType, setQType] = useState(initialData?.q_type || '');
    const [content, setContent] = useState(initialData?.content || '');
    const [options, setOptions] = useState(initialData?.options || [{ text: '', isCorrect: false }]);
    const [explanation, setExplanation] = useState(initialData?.explanation || '');

    useEffect(() => {
        if (initialData) {
            setQType(initialData?.q_type || '');
            setContent(initialData?.content || '');
            setOptions(initialData?.options || [{ text: '', isCorrect: false }]);
            setExplanation(initialData?.explanation || '');
        }
    }, [initialData]);

    const handleOptionChange = (index, field, value) => {
        const newOptions = [...options];
        newOptions[index][field] = value;
        setOptions(newOptions);
    };

    const handleAddOption = () => {
        setOptions([...options, { text: '', isCorrect: false }]);
    };

    const handleRemoveOption = (index) => {
        const newOptions = options.filter((_, i) => i !== index);
        setOptions(newOptions);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const questionData = { q_type: qType, content, options, explanation };
        onSubmit(questionData);
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-semibold mb-6">{mode === 'edit' ? 'Edit Question' : 'Create Question'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Question Type</label>
                    <select
                        value={qType}
                        onChange={(e) => setQType(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="MCQ">MCQ</option>
                        <option value="MSQ">MSQ</option>
                        <option value="NAT">NAT</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Content</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                        rows="4"
                    ></textarea>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Options</label>
                    {options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2 mb-2">
                            <input
                                type="text"
                                value={option.text}
                                onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <input
                                type="checkbox"
                                checked={option.isCorrect}
                                onChange={(e) => handleOptionChange(index, 'isCorrect', e.target.checked)}
                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                            />
                            <button
                                type="button"
                                onClick={() => handleRemoveOption(index)}
                                className="text-red-500 hover:text-red-700"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleAddOption}
                        className="mt-2 bg-indigo-500 text-white px-3 py-2 rounded-md"
                    >
                        Add Option
                    </button>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Explanation</label>
                    <textarea
                        value={explanation}
                        onChange={(e) => setExplanation(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                        rows="4"
                    ></textarea>
                </div>

                <div>
                    <button
                        type="submit"
                        className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                    >
                        {mode === 'edit' ? 'Update Question' : 'Create Question'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default QuestionForm;
